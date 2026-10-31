import { GoogleSheetsConfig, PlayerScore, QuizQuestion } from '../types/quiz';

const SHEETS_CONFIG_KEY = 'kahoot_english_sheets_config';
const LOCAL_SUBMISSIONS_KEY = 'kahoot_english_submissions';

export interface QuizSubmissionRecord {
  id: string;
  timestamp: string;
  studentName: string;
  totalScore: number;
  highestStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercent: number;
  category: string;
  detailedAnswers: {
    questionId: string;
    questionText: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
    points: number;
    timeSeconds: number;
  }[];
}

export const APPS_SCRIPT_TEMPLATE = `/**
 * Google Apps Script Backend for KahootEnglish 3D Quiz
 * Paste this script into your Google Sheets (Extensions -> Apps Script),
 * then click Deploy -> New deployment -> Select type: Web app ->
 * Execute as: Me -> Who has access: Anyone -> Deploy.
 * Copy the Web app URL and paste it into the KahootEnglish app settings!
 */

function setupSheetHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Student Name",
      "Total Score",
      "Correct / Total",
      "Accuracy (%)",
      "Max Streak",
      "Quiz Category",
      "Details (JSON)"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetHeaders(sheet);
    
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    var timestamp = data.timestamp || new Date().toISOString();
    var studentName = data.studentName || "Anonymous";
    var totalScore = data.totalScore || 0;
    var correctRatio = (data.correctAnswers || 0) + " / " + (data.totalQuestions || 0);
    var accuracy = (data.accuracyPercent || 0) + "%";
    var streak = data.highestStreak || 0;
    var category = data.category || "All";
    var details = JSON.stringify(data.detailedAnswers || []);
    
    sheet.appendRow([
      timestamp,
      studentName,
      totalScore,
      correctRatio,
      accuracy,
      streak,
      category,
      details
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Score successfully recorded for " + studentName,
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    rowCount: data.length,
    message: "Google Apps Script Backend Active for KahootEnglish 3D"
  })).setMimeType(ContentService.MimeType.JSON);
}
`;

export class SheetsService {
  public getConfig(): GoogleSheetsConfig {
    if (typeof window === 'undefined') {
      return { scriptUrl: '', sheetName: 'Sheet1', autoSync: false, connected: false };
    }
    const saved = localStorage.getItem(SHEETS_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      scriptUrl: '',
      sheetName: 'Sheet1',
      autoSync: false,
      connected: false,
    };
  }

  public saveConfig(config: GoogleSheetsConfig) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(config));
    }
  }

  public getLocalSubmissions(): QuizSubmissionRecord[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }

  public saveLocalSubmission(record: QuizSubmissionRecord) {
    if (typeof window === 'undefined') return;
    const existing = this.getLocalSubmissions();
    const updated = [record, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updated));
  }

  public createSubmissionPayload(
    player: PlayerScore,
    questions: QuizQuestion[],
    category: string
  ): QuizSubmissionRecord {
    const detailedAnswers = player.answers.map(ans => {
      const q = questions.find(item => item.id === ans.questionId);
      return {
        questionId: ans.questionId,
        questionText: q?.question || '',
        selectedOption: ans.selectedOption,
        correctOption: q?.correctOptionId || '',
        isCorrect: ans.isCorrect,
        points: ans.pointsEarned,
        timeSeconds: ans.timeTakenSeconds,
      };
    });

    const accuracyPercent =
      questions.length > 0
        ? Math.round((player.correctCount / questions.length) * 100)
        : 0;

    return {
      id: 'sub-' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      studentName: player.name,
      totalScore: player.score,
      highestStreak: player.highestStreak || player.streak,
      totalQuestions: questions.length,
      correctAnswers: player.correctCount,
      accuracyPercent,
      category,
      detailedAnswers,
    };
  }

  public async syncToSheets(
    record: QuizSubmissionRecord,
    config: GoogleSheetsConfig
  ): Promise<{ success: boolean; message: string }> {
    // Always persist to local storage first
    this.saveLocalSubmission(record);

    if (!config.scriptUrl || !config.scriptUrl.startsWith('https://script.google.com/')) {
      return {
        success: false,
        message: 'Google Apps Script Web App URL belum diatur atau tidak valid.',
      };
    }

    try {
      // Send data to Google Apps Script Web App
      // Apps Script allows POST requests. Since CORS in Apps Script redirects,
      // using mode: 'no-cors' allows submission without preflight block.
      await fetch(config.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      // Update config with last sync
      const updatedConfig = {
        ...config,
        connected: true,
        lastSyncTimestamp: new Date().toLocaleTimeString('id-ID'),
      };
      this.saveConfig(updatedConfig);

      return {
        success: true,
        message: 'Data kuis berhasil dikirim dan dicatat ke Google Sheets!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal mengirim ke Google Sheets: ${err?.message || 'Koneksi terputus'}`,
      };
    }
  }

  public exportLocalToCsv(): void {
    const submissions = this.getLocalSubmissions();
    if (submissions.length === 0) return;

    const headers = ['Timestamp', 'Nama Siswa', 'Skor Total', 'Benar/Total', 'Akurasi (%)', 'Max Streak', 'Kategori'];
    const rows = submissions.map(s => [
      `"${s.timestamp}"`,
      `"${s.studentName}"`,
      s.totalScore,
      `"${s.correctAnswers}/${s.totalQuestions}"`,
      s.accuracyPercent,
      s.highestStreak,
      `"${s.category}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KahootEnglish_Rekap_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const sheetsService = new SheetsService();
