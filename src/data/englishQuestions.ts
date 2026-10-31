import { QuizQuestion } from '../types/quiz';

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // RECOUNT TEXT - EASY
  // =========================================================================
  {
    id: 'rec-01',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Generic Structure',
    difficulty: 'Easy',
    question: 'Which stage of a Recount Text introduces the background information such as Who, Where, When, and What happened?',
    contextText: '"Last Sunday morning, the villagers of Sukamaju gathered at the town hall to hold a mutual cooperation (Gotong Royong) day to clean the irrigation canal."',
    options: [
      { id: 'A', text: 'Orientation', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Complication', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Series of Events', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Resolution', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Complication dan Resolution adalah struktur Narrative Text (cerita fiksi/konflik), bukan Recount. Series of Events adalah kronologi peristiwa, bukan pembuka latar.',
      whyCorrect: 'Tahap ini adalah "Orientation", berfungsi memperkenalkan tokoh (the villagers), waktu (Last Sunday morning), tempat (at the town hall), dan kegiatan (clean the canal).',
      grammarRule: 'Generic Structure of Recount Text: (1) Orientation -> (2) Events / Series of Events -> (3) Reorientation.',
      keyClue: 'Paragraf pembuka berisi keterangan waktu dan pengenalan tokoh 5W+1H.',
      exampleSentences: [
        'Orientation: Two months ago, Mayor Ridwan and his team inspected the newly built community health clinic.',
        'Events: First, they toured the facility. Then, they met the local doctors.'
      ],
      vocabularyTips: ['Orientation = Bagian pengenalan latar', 'Mutual cooperation = Gotong royong']
    }
  },
  {
    id: 'rec-02',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Simple Past Tense',
    difficulty: 'Easy',
    question: 'Choose the correct past verb to complete this recount sentence:',
    contextText: 'Yesterday, the community members _____ together to rebuild the broken wooden bridge across the river.',
    options: [
      { id: 'A', text: 'work', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'worked', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'are working', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'will work', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: '"Work" (Present Simple), "are working" (Present Continuous), dan "will work" (Future) salah karena keterangan waktu "Yesterday" adalah masa lalu.',
      whyCorrect: 'Recount text wajib menggunakan Simple Past Tense (V2) untuk peristiwa yang selesai di masa lampau. Bentuk V2 dari kata kerja beraturan "work" adalah "worked".',
      grammarRule: 'Simple Past: Subject + Verb 2 (Past Form). Regular verbs add "-ed".',
      keyClue: 'Adverb of time "Yesterday" menuntut penggunaan Verb 2.',
      exampleSentences: [
        'Benar: We worked diligently until the bridge was safe for pedestrians.',
        'Salah: We work yesterday. (❌ salah tenses)'
      ],
      vocabularyTips: ['Worked = Bekerja (V2)', 'Pedestrians = Pejalan kaki']
    }
  },
  {
    id: 'rec-03',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Basic Connectives',
    difficulty: 'Easy',
    question: 'Fill in the blank with the appropriate time connective of sequence:',
    contextText: '"First, the village chief gave an inspiring speech. _____, the residents enjoyed a shared potluck lunch."',
    options: [
      { id: 'A', text: 'Then', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Because', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Although', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Unless', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: '"Because" menyatakan alasan sebab-akibat, "Although" menyatakan kontradiksi, dan "Unless" menyatakan pengandaian negatif.',
      whyCorrect: 'Setelah kata "First" (Pertama-tama), urutan kronologis yang paling alami dan baku dalam Recount Text adalah "Then" (Kemudian) atau "Next".',
      grammarRule: 'Chronological Sequence: First -> Then / Next -> After that -> Finally.',
      keyClue: 'Urutan berjenjang setelah kata "First".',
      exampleSentences: [
        'Urutan: First, we prepared the gardening tools. Then, we planted the mango trees.'
      ],
      vocabularyTips: ['Then = Kemudian / Lalu', 'Potluck lunch = Makan siang bersama']
    }
  },

  // =========================================================================
  // RECOUNT TEXT - NORMAL
  // =========================================================================
  {
    id: 'rec-04',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Irregular Past Verbs',
    difficulty: 'Normal',
    question: 'Select the correct irregular past verb combination to complete this recount excerpt:',
    contextText: 'The village chief _____ an urgent announcement after the floodwaters _____ into the residential area.',
    options: [
      { id: 'A', text: 'broadcasted / enters', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'broadcast / entered', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'is broadcasting / entered', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'broadcast / was entered', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Bentuk lampau dari "broadcast" adalah tetap "broadcast", bukan "broadcasted". "Enters" salah tenses karena present tense.',
      whyCorrect: '"broadcast" adalah irregular verb yang bentuk V1, V2, dan V3-nya sama. "enter" adalah regular verb dengan V2 "entered".',
      grammarRule: 'Irregular verbs with identical past form: broadcast - broadcast - broadcast; cut - cut - cut.',
      keyClue: 'Peristiwa banjir masa lalu menuntut Simple Past (V2).',
      exampleSentences: [
        'Benar: The mayor broadcast a live public briefing yesterday.'
      ],
      vocabularyTips: ['Broadcast = Menyiarkan / mengumumkan', 'Floodwaters = Air banjir']
    }
  },
  {
    id: 'rec-05',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Time Connectives in Sequence',
    difficulty: 'Normal',
    question: 'Choose the most appropriate time connective to indicate chronological progression:',
    contextText: '"First, the youth leader explained the rules of the cleanup. _____, the volunteers were divided into four teams to cover different sectors."',
    options: [
      { id: 'A', text: 'Although', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Because of', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'After that', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Unless', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'C',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Konjungsi yang menghubungkan alur peristiwa harus menunjukkan urutan waktu, bukan alasan atau pertentangan.',
      whyCorrect: '"After that" (setelah itu) adalah temporal connective yang mengalirkan urutan kedua setelah "First".',
      grammarRule: 'Connectives of sequence: After that, Afterwards, Subsequently.',
      keyClue: 'Langkah pertama selesai, disusul langkah kedua pembagian tim.',
      exampleSentences: [
        'Urutan: First we registered our names; after that, we received our participation badges.'
      ],
      vocabularyTips: ['After that = Setelah itu', 'Sectors = Sektor / wilayah pembagian']
    }
  },
  {
    id: 'rec-06',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Listening to Historic Recount',
    difficulty: 'Normal',
    question: 'Listen to the audio recount of the mayor’s visit. What key pledge did the mayor make during the ceremony?',
    contextText: '[AUDIO RECOUNT - Dengarkan rekaman suara laporan kunjungan]',
    audioTranscript: 'On October 15th, Mayor Rahman paid an official visit to Harapan Village. After inspecting the river embankment, the Mayor announced a special fund of five hundred million rupiahs to build a modern solar-powered water purification plant for all families.',
    options: [
      { id: 'A', text: 'To build a highway crossing the rural forest.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'To establish a luxury shopping mall for tourism.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'To fund a solar-powered water purification plant for local families.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'To relocate the entire village to a neighboring island.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'C',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Tidak ada penyebutan jalan tol (A), mall perbelanjaan (B), atau pemindahan desa (D).',
      whyCorrect: 'Audio transkrip secara jelas menyatakan: "the Mayor announced a special fund ... to build a modern solar-powered water purification plant for all families."',
      grammarRule: 'Listening for Key Information: Focus on key nouns and target verb phrases (announced a special fund).',
      keyClue: 'Frasa audio: "solar-powered water purification plant".',
      exampleSentences: [
        'Transkrip: "The Mayor announced a special fund ... for all families."'
      ],
      vocabularyTips: ['Solar-powered = Bertenaga surya', 'Purification plant = Instalasi pemurnian air']
    }
  },

  // =========================================================================
  // RECOUNT TEXT - HARD
  // =========================================================================
  {
    id: 'rec-07',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Past Continuous Interruption',
    difficulty: 'Hard',
    question: 'Combine the past events correctly using Past Continuous and Simple Past:',
    contextText: 'While the community leader _____ an inspiring presentation on flood prevention, the electrical generator suddenly _____ out.',
    options: [
      { id: 'A', text: 'was delivering / went', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'delivered / was going', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'is delivering / goes', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'had delivered / go', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Aksi yang sedang berlangsung menggunakan Past Continuous (was delivering), sedangkan aksi interupsi tiba-tiba menggunakan Simple Past (went).',
      whyCorrect: 'Klausa "While" menandai aksi berdurasi di masa lampau: was/were + V-ing. Subjek tunggal "the community leader" membutuhkan to be "was". Kejadian mati listrik mendadak diungkapkan dengan Simple Past ("went out").',
      grammarRule: 'Past Interruption: While + Past Continuous (was/were + V-ing), Simple Past (V2).',
      keyClue: 'Kata "While" (sedang berlangsung) dan "suddenly" (interupsi mendadak).',
      exampleSentences: [
        'Benar: While the mayor was greeting the elderly citizens, a heavy downpour started.'
      ],
      vocabularyTips: ['Went out = Padam / mati (lampu/mesin)', 'Delivering = Menyampaikan pidato']
    }
  },
  {
    id: 'rec-08',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Social Function & Reorientation',
    difficulty: 'Hard',
    question: 'What is the primary social function of a Recount Text, and how is it concluded in the Reorientation section?',
    options: [
      { id: 'A', text: 'To persuade readers to vote for a political candidate with strong logical arguments.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'To retell past experiences or events chronologically and conclude with a personal evaluation.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'To describe the physical characteristics of a public building in vivid sensory detail.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'To instruct the audience on how to operate electronic voting machines step by step.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'A adalah Exposition, C adalah Descriptive, dan D adalah Procedure Text.',
      whyCorrect: 'Tujuan sosial Recount Text adalah "to retell past experiences or historical events chronologically", yang ditutup dengan Reorientation (rangkuman kesan atau evaluasi personal penulis).',
      grammarRule: 'Social function of Recount: Retelling past events for informing or entertaining.',
      keyClue: '"To retell past experiences chronologically" dan "personal evaluation".',
      exampleSentences: [
        'Reorientation: "Overall, the volunteer project was exhausting but extremely fulfilling."'
      ],
      vocabularyTips: ['Retell = Menceritakan kembali', 'Reorientation = Kesan penutup']
    }
  },
  {
    id: 'rec-09',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Complex Connectives (Meanwhile / Subsequently)',
    difficulty: 'Hard',
    question: 'Select the connective indicating simultaneous action happening at the same time in another place:',
    contextText: '"The medical volunteers treated injured residents at the town clinic. _____, the search and rescue squad searched for stranded families along the riverbank."',
    options: [
      { id: 'A', text: 'Meanwhile', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Because of', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'In spite of', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Therefore', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: '"Because of" menyatakan sebab, "In spite of" menyatakan pertentangan, dan "Therefore" menyatakan kesimpulan/akibat.',
      whyCorrect: '"Meanwhile" (sementara itu) adalah konektor yang menyatakan dua aktivitas lampau yang berlangsung bersamaan di dua tempat berbeda.',
      grammarRule: 'Simultaneous Connective: Meanwhile / At the same time / Simultaneously.',
      keyClue: 'Dua aksi terjadi bersamaan: tim medis merawat warga, tim SAR menyisir tepi sungai.',
      exampleSentences: [
        'Benar: The women prepared food in the kitchen; meanwhile, the men cleared the road.'
      ],
      vocabularyTips: ['Meanwhile = Sementara itu', 'Stranded = Terdampar / terjebak']
    }
  },

  // =========================================================================
  // RECOUNT TEXT - EXPERT
  // =========================================================================
  {
    id: 'rec-10',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Past Perfect vs Simple Past Chronology',
    difficulty: 'Expert',
    question: 'Analyze the precise chronological sequence using Past Perfect and Simple Past:',
    contextText: 'By the time the emergency response convoy _____ at the flooded neighborhood, the local youth volunteers _____ already _____ all the elderly residents to higher ground.',
    options: [
      { id: 'A', text: 'arrived / had / evacuated', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'had arrived / were / evacuating', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'arrives / have / evacuated', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'arrived / has / evacuated', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Tindakan yang terjadi lebih awal di masa lalu (evakuasi lansia oleh pemuda) harus memakai Past Perfect (had + V3), sedangkan tindakan yang terjadi belakangan (kedatangan konvoi) memakai Simple Past (arrived).',
      whyCorrect: 'Struktur "By the time + Simple Past, Subject + Past Perfect" digunakan untuk menegaskan bahwa evakuasi telah tuntas SEBELUM konvoi tiba di lokasi.',
      grammarRule: 'Past Perfect Chronology: Earlier past action = had + Verb 3; Later past action = Simple Past (V2).',
      keyClue: 'Frasa "By the time" dan kata penegas "already".',
      exampleSentences: [
        'Benar: By the time the ambulance arrived, the first-aid team had already stabilized the patient.'
      ],
      vocabularyTips: ['Convoy = Iring-iringan kendaraan bantuan', 'Evacuated = Mengevakuasi']
    }
  },
  {
    id: 'rec-11',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Factual Recount Language Analysis',
    difficulty: 'Expert',
    question: 'In historical or biographical factual recounts, which passive voice construction is grammatically flawless?',
    options: [
      { id: 'A', text: 'The community cooperative was established by Ibu Kartika in 1985 to empower female farmers.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'The community cooperative were established by Ibu Kartika in 1985.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'The community cooperative is established by Ibu Kartika in 1985.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'The community cooperative was establishing by Ibu Kartika in 1985.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Pilihan B salah to be ("were" untuk jamak, padahal "cooperative" tunggal). Pilihan C salah tenses ("is" untuk masa kini, padahal 1985). Pilihan D adalah bentuk continuous aktif yang rancu.',
      whyCorrect: 'Subjek tunggal "The community cooperative" membutuhkan to be lampau "was" + Verb 3 "established" + by-agent + tahun di masa lalu (1985).',
      grammarRule: 'Passive Simple Past: Singular Subject + was + Verb 3 (Past Participle).',
      keyClue: 'Tahun "in 1985" (masa lalu) dan subjek tunggal "cooperative".',
      exampleSentences: [
        'Benar: The youth center was inaugurated by Mayor Ridwan in 2012.'
      ],
      vocabularyTips: ['Cooperative = Koperasi warga', 'Empower = Memberdayakan']
    }
  },
  {
    id: 'rec-12',
    category: 'recount',
    categoryLabel: 'Recount Text',
    subtopic: 'Speaking & Shadowing Recount Narration',
    difficulty: 'Expert',
    question: 'Speaking Practice: Pronounce this inspiring recount milestone sentence clearly into your microphone!',
    contextText: 'Latih intonasi narasi sejarah pencapaian pemimpin warga.',
    targetSpeechPhrase: 'Through tireless dedication, our neighborhood leader transformed the abandoned lot into a thriving organic garden.',
    audioTranscript: 'Through tireless dedication, our neighborhood leader transformed the abandoned lot into a thriving organic garden.',
    options: [
      { id: 'A', text: 'Through tireless dedication, our neighborhood leader transformed the abandoned lot into a thriving organic garden.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Our leader sold the abandoned garden to private developers last month.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'We plan to visit the organic garden next year during the vacation.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'The garden was destroyed because of water scarcity and neglect.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Pilihan B, C, dan D mengubah makna kalimat target dan bukan kalimat latihan yang ditentukan.',
      whyCorrect: 'Kalimat A melatih intonasi naratif: Frasa preposisi pengantar ("Through TIRE-less de-di-CA-tion, ↗"), kata kerja aksi ("trans-FORMED"), dan intonasi turun di akhir kalimat ("...thriving or-GAN-ic GAR-den ↘").',
      grammarRule: 'Narrative Cadence: Slight pitch rise on introductory adverbial phrases followed by resolute falling intonation.',
      keyClue: 'Ucapkan dengan ritme tegas: Through TIRE-less de-di-CA-tion... trans-FORMED...',
      exampleSentences: [
        'Target: "Through tireless dedication, our neighborhood leader transformed the abandoned lot into a thriving organic garden."'
      ],
      vocabularyTips: ['Tireless = Tanpa lelah', 'Thriving = Berkembang subur', 'Abandoned lot = Lahan terbengkalai']
    }
  },

  // =========================================================================
  // COMMUNITY LEADERS - EASY
  // =========================================================================
  {
    id: 'lead-01',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Self Introduction as a Leader',
    difficulty: 'Easy',
    question: 'Which is the most appropriate formal expression when introducing oneself as a new neighborhood chairperson (Ketua RT)?',
    options: [
      { id: 'A', text: 'Hey guys, call me Boss Budi and do whatever I say from now on.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Good evening, ladies and gentlemen. Allow me to introduce myself. My name is Budi Pratama, your newly elected neighborhood chairperson.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Who am I? Guess my name if you want to live peacefully in this block.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'I am here because nobody else wanted this tiring job.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Pilihan A, C, dan D bernada informal atau tidak sopan untuk pertemuan warga resmi.',
      whyCorrect: 'Pilihan B adalah formula standar perkenalan diri resmi: Salam formal + "Allow me to introduce myself" + Nama lengkap dan posisi jabatan.',
      grammarRule: 'Formal Self-Introduction: Greeting + "Allow me to introduce myself" + Name + Role.',
      keyClue: 'Frasa resmi dan santun: "Allow me to introduce myself ... newly elected chairperson".',
      exampleSentences: [
        'Formal: "Good morning everyone. Allow me to introduce myself. I am Dr. Susan, the newly appointed school principal."'
      ],
      vocabularyTips: ['Allow me to introduce myself = Izinkan saya memperkenalkan diri', 'Elected = Terpilih']
    }
  },
  {
    id: 'lead-02',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Greeting Respected Elders',
    difficulty: 'Easy',
    question: 'How should a young community volunteer politely greet a respected senior community leader in the morning?',
    options: [
      { id: 'A', text: 'Good morning, Mr. Suryo. It is an honor to meet you.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'What’s up dude, give me five!', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Hey old man, why are you here so early?', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Move away, I am in a hurry.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 18,
    explanation: {
      whyWrong: 'Pilihan B terlalu santai (slang), sedangkan C dan D tidak menunjukkan rasa hormat kepada sesepuh masyarakat.',
      whyCorrect: 'Pilihan A menunjukkan kesantunan baku dalam budaya bahasa Inggris: salam formal ("Good morning"), sapaan kehormatan ("Mr. Suryo"), dan ungkapan apresiasi ("It is an honor to meet you").',
      grammarRule: 'Polite Greeting to Elders: Formal Greeting + Title/Honorific (Mr./Mrs./Dr.) + Polite expression of pleasure.',
      keyClue: 'Sapaan santun dan penuh rasa hormat kepada tokoh senior.',
      exampleSentences: [
        'Benar: "Good afternoon, Ibu Hartini. It is truly a pleasure to assist you today."'
      ],
      vocabularyTips: ['Honor = Kehormatan', 'Respected = Dihormati']
    }
  },
  {
    id: 'lead-03',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Asking for Leader Identity',
    difficulty: 'Easy',
    question: 'Choose the most polite question to ask someone their position in the neighborhood committee:',
    options: [
      { id: 'A', text: 'What are you doing here?', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Could you please tell me your role in this community organization?', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Do you have any power here?', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Who gave you permission to enter?', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Pilihan A, C, dan D bernada interogatif kasar dan mencurigai lawan bicara.',
      whyCorrect: '"Could you please tell me..." adalah indirect question yang paling santun untuk menanyakan peran atau posisi seseorang dalam organisasi warga.',
      grammarRule: 'Polite Inquiry: Modal auxiliary "Could you please..." + base verb.',
      keyClue: 'Frasa kesopanan "Could you please tell me your role...".',
      exampleSentences: [
        'Benar: "Could you please tell me who is in charge of the village health program?"'
      ],
      vocabularyTips: ['Role = Peran / tugas', 'Community organization = Organisasi kemasyarakatan']
    }
  },

  // =========================================================================
  // COMMUNITY LEADERS - NORMAL
  // =========================================================================
  {
    id: 'lead-04',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Introducing Others in Public Forum',
    difficulty: 'Normal',
    question: 'How should an MC formally introduce the village chief as a distinguished guest speaker?',
    options: [
      { id: 'A', text: 'That guy over there is the village chief, let him talk now.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Ladies and gentlemen, it is our distinct honor to introduce our distinguished village chief, Mr. Hartono.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Listen up! Hartono is coming to tell you what to do.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'I don’t know his full background, but please welcome our guest.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: 'Pilihan A dan C kasar, sedangkan D menunjukkan MC tidak siap dan tidak menghormati tamu.',
      whyCorrect: 'Pilihan B menggunakan etika protokoler: gelar penghormatan ("distinct honor"), atribut tokoh terhormat ("distinguished village chief"), serta sapaan santun ("Mr. Hartono").',
      grammarRule: 'Introducing Others: "It is an honor to introduce [Title + Name]".',
      keyClue: 'Frasa protokoler: "distinct honor to introduce our distinguished village chief".',
      exampleSentences: [
        'Contoh: "It is my privilege to introduce Mrs. Kartika, director of the foundation."'
      ],
      vocabularyTips: ['Distinct honor = Kehormatan istimewa', 'Distinguished = Terkemuka']
    }
  },
  {
    id: 'lead-05',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Honorific Titles (The Honorable)',
    difficulty: 'Normal',
    question: 'Fill in the blank with the correct respectful title when addressing a city mayor in official correspondence:',
    contextText: '"To: The _____ Mayor of Bandung City, West Java. Subject: Proposal for Green Community Park in Ward 4."',
    options: [
      { id: 'A', text: 'Friendly', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Honorable', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Ordinary', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Casual', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 20,
    explanation: {
      whyWrong: '"Friendly", "Ordinary", dan "Casual" bukan gelar kehormatan kenegaraan.',
      whyCorrect: 'Dalam persuratan bahasa Inggris resmi, pejabat publik seperti Wali Kota (Mayor) disapa dengan gelar "The Honorable" (Yang Terhormat).',
      grammarRule: 'Official Honorific: The Honorable + [Public Official Title].',
      keyClue: 'Gelar protokoler resmi: "The Honorable Mayor".',
      exampleSentences: [
        'Benar: We sent our proposal to The Honorable Governor.'
      ],
      vocabularyTips: ['The Honorable (Hon.) = Yang Terhormat', 'Mayor = Wali kota']
    }
  },
  {
    id: 'lead-06',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Youth Leader Inaugural Speech (Listening)',
    difficulty: 'Normal',
    question: 'Listen to the youth community leader’s speech. What is the central mission she invites teenagers to join?',
    contextText: '[AUDIO SPEECH - Dengarkan pidato perkenalan ketua Karang Taruna]',
    audioTranscript: 'Good afternoon, fellow youth of Mentari District! Allow me to introduce myself. My name is Naila Safira, your newly elected youth council leader. Our primary mission this semester is launching the Digital Literacy for Seniors program, where each teenager volunteers two hours every weekend to help elderly residents use digital health services safely.',
    options: [
      { id: 'A', text: 'Collecting funds for a rock concert in the capital.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Teaching digital literacy to senior citizens so they can access digital health services safely.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Closing all traditional libraries and replacing them with internet cafes.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Organizing an e-sports tournament for high school seniors only.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Naila tidak mengajak mengadakan konser rock (A), menutup perpustakaan (C), atau turnamen e-sports (D).',
      whyCorrect: 'Audio menyatakan secara spesifik: "Our primary mission this semester is launching the Digital Literacy for Seniors program... to help elderly residents use digital health services safely."',
      grammarRule: 'Listening for Key Objectives: Target words: "primary mission", "digital literacy for seniors".',
      keyClue: 'Frasa audio: "Digital Literacy for Seniors program ... help elderly residents".',
      exampleSentences: [
        'Speech: "Our primary mission is launching the Digital Literacy for Seniors program."'
      ],
      vocabularyTips: ['Digital literacy = Literasi digital', 'Seniors = Kaum lansia']
    }
  },

  // =========================================================================
  // COMMUNITY LEADERS - HARD
  // =========================================================================
  {
    id: 'lead-07',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Diplomatic Disagreement in Town Hall',
    difficulty: 'Hard',
    question: 'Which is the most diplomatic and constructivist English statement to express partial disagreement during a community council debate?',
    contextText: 'Speaker A: "We must spend the entire village budget solely on widening the asphalt road."',
    options: [
      { id: 'A', text: 'That proposal is completely foolish and nobody will support it.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'While I acknowledge the importance of road safety, I believe we must allocate a portion of the funds to flood drainage to prevent future destruction.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'I don’t care about roads, do whatever you like.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Be quiet, you are not the leader here.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'B',
    timeLimitSeconds: 22,
    explanation: {
      whyWrong: 'Pilihan A dan D menyerang secara personal, sedangkan C adalah sikap apatis.',
      whyCorrect: 'Pilihan B menerapkan teknik "Diplomatic Counter-Proposal": mengapresiasi pentingnya ide lawan bicara ("While I acknowledge...") sebelum memberikan solusi alternatif berimbang ("I believe we must allocate...").',
      grammarRule: 'Diplomatic Disagreement Formula: Concession clause ("While I agree / acknowledge...") + Counter-perspective.',
      keyClue: 'Frasa santun bernegosiasi: "While I acknowledge the importance... I believe we must allocate...".',
      exampleSentences: [
        'Benar: "While I understand the cost constraints, investing in youth education remains our highest priority."'
      ],
      vocabularyTips: ['Diplomatic = Penuh diplomasi dan santun', 'Allocate = Mengalokasikan dana']
    }
  },
  {
    id: 'lead-08',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Introducing a Keynote Speaker with Credentials',
    difficulty: 'Hard',
    question: 'Complete the sentence with the correct relative pronoun and past participle to introduce an esteemed community doctor:',
    contextText: '"Next, please welcome Dr. Ratna, _____ dedication to maternal healthcare has been _____ by the Ministry of Health."',
    options: [
      { id: 'A', text: 'whose / recognized', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'who / recognizing', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'whom / recognize', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'which / recognized', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 22,
    explanation: {
      whyWrong: '"who" digunakan untuk subjek orang (bukan kepemilikan dedikasi). "whom" untuk objek. "which" untuk benda/hewan.',
      whyCorrect: '"whose" adalah relative pronoun kepemilikan ("whose dedication" = dedikasinya). Bentuk pasif setelah "has been" membutuhkan past participle (Verb 3) yaitu "recognized".',
      grammarRule: 'Relative Pronoun of Possession: Noun (person) + whose + Noun (possession). Passive Present Perfect: has been + Verb 3.',
      keyClue: 'Kata benda kepemilikan "dedication" menuntut "whose", dan "has been" menuntut V3 "recognized".',
      exampleSentences: [
        'Benar: "This is Pak Hendra, whose leadership has transformed our village economy."'
      ],
      vocabularyTips: ['Whose = Yang ...-nya (kepemilikan)', 'Maternal healthcare = Kesehatan ibu dan anak']
    }
  },
  {
    id: 'lead-09',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Speaking Practice: Introducing a Dignitary',
    difficulty: 'Hard',
    question: 'Speaking Practice: Pronounce this formal introduction sentence clearly into your microphone!',
    contextText: 'Latih intonasi pengenalan tokoh masyarakat secara percaya diri.',
    targetSpeechPhrase: 'It is my greatest privilege to introduce our respected village chief, Mr. Budi Hartono.',
    audioTranscript: 'It is my greatest privilege to introduce our respected village chief, Mr. Budi Hartono.',
    options: [
      { id: 'A', text: 'It is my greatest privilege to introduce our respected village chief, Mr. Budi Hartono.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'I want to ask the village chief why the road is broken.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Mr. Budi Hartono is not the village chief anymore.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'The village chief will arrive tomorrow morning by train.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Pilihan B, C, dan D bukan kalimat target pengenalan pemimpin masyarakat.',
      whyCorrect: 'Kalimat A adalah formula pengenalan resmi pemimpin masyarakat: "It is my greatest privilege to introduce our respected village chief, Mr. Budi Hartono." Perhatikan pengucapan kata "privilege" (/ˈprɪv.əl.ɪdʒ/).',
      grammarRule: 'Public Address Cadence: Dignified steady intonation with slight dramatic pause before the leader\'s full name.',
      keyClue: 'Artikulasi jelas: "greatest privilege to introduce our respected village chief".',
      exampleSentences: [
        'Target: "It is my greatest privilege to introduce our respected village chief, Mr. Budi Hartono."'
      ],
      vocabularyTips: ['Privilege = Hak istimewa / kehormatan', 'Respected = Dihormati']
    }
  },

  // =========================================================================
  // COMMUNITY LEADERS - EXPERT
  // =========================================================================
  {
    id: 'lead-10',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Inaugural Address Rhetorical Devices',
    difficulty: 'Expert',
    question: 'Analyze the subjunctive mood and conditional construction used in this civic leader’s manifesto:',
    contextText: '"Were our community to unite behind this renewable energy initiative, not only _____ we reduce electricity costs, but we would also create dozens of local green jobs."',
    options: [
      { id: 'A', text: 'would', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'will', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'did', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'have', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: '"Will" tidak cocok dengan kalimat pengandaian tipe 2 terbalik (inverted conditional). "Did" salah auxiliari untuk future result. "Have" salah struktur modal.',
      whyCorrect: 'Kalimat ini menggunakan Inverted Conditional Type 2 ("Were our community to unite..." = "If our community united..."). Pasangan klausa hasilnya adalah modal "would" + Verb 1 ("would we reduce"). Pola "not only" menuntut inversi subjek-kata kerja ("would we reduce").',
      grammarRule: 'Inversion in Conditional Type 2: Were + Subject + to Verb, not only + would + Subject + Verb.',
      keyClue: 'Inversi "Were our community to unite..." berpasangan dengan modal "would" pada klausa kedua ("would also create").',
      exampleSentences: [
        'Benar: Were the government to support our project, not only would we clean the river, but we would inspire neighboring districts.'
      ],
      vocabularyTips: ['Subjunctive mood = Bentuk pengandaian formal tingkat tinggi', 'Inversion = Pembalikan susunan kata']
    }
  },
  {
    id: 'lead-11',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Formal Protocol Address (Ambassador / Dignitary)',
    difficulty: 'Expert',
    question: 'Which formal introductory sentence correctly pairs the title "Your Excellency" with third-person honorific agreement?',
    options: [
      { id: 'A', text: 'Your Excellency, it is with profound gratitude that we welcome you and your delegation to our municipal assembly.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'Your Excellency, you should sit down immediately because we are starting.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Hey Excellency, what do you think about our small village?', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'Your Excellency is telling us to hurry up.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 22,
    explanation: {
      whyWrong: 'Pilihan B dan C melanggar etika protokoler diplomatik. Pilihan D merendahkan martabat sapaan resmi.',
      whyCorrect: 'Pilihan A menggunakan sapaan diplomatik tertinggi: "Your Excellency" (Yang Mulia) dipadukan dengan ekspresi penghormatan resmi: "it is with profound gratitude that we welcome you and your delegation to our municipal assembly."',
      grammarRule: 'Diplomatic Protocol: "Your Excellency" + formal collective welcome formula.',
      keyClue: 'Sapaan protokoler diplomatik: "Your Excellency ... profound gratitude".',
      exampleSentences: [
        'Benar: "Your Excellency, we are honored by your presence at our annual summit."'
      ],
      vocabularyTips: ['Your Excellency = Yang Mulia', 'Profound gratitude = Rasa terima kasih mendalam']
    }
  },
  {
    id: 'lead-12',
    category: 'community_leaders',
    categoryLabel: 'Community Leaders',
    subtopic: 'Speaking & Shadowing Civic Leadership Oath',
    difficulty: 'Expert',
    question: 'Shadowing Practice: Pronounce this solemn community leadership pledge clearly into your microphone!',
    contextText: 'Latih artikulasi sumpah janji kepemimpinan warga dengan wibawa.',
    targetSpeechPhrase: 'I solemnly pledge to serve all citizens with integrity, transparency, and unwavering compassion.',
    audioTranscript: 'I solemnly pledge to serve all citizens with integrity, transparency, and unwavering compassion.',
    options: [
      { id: 'A', text: 'I solemnly pledge to serve all citizens with integrity, transparency, and unwavering compassion.', shape: 'triangle', color: '#e21b3c' },
      { id: 'B', text: 'I promise to give money to anyone who supports my private business.', shape: 'diamond', color: '#1368ce' },
      { id: 'C', text: 'Serving citizens is difficult so I will only work two days a week.', shape: 'circle', color: '#ffa602' },
      { id: 'D', text: 'I pledge to resign if the weather gets too hot in summer.', shape: 'square', color: '#26890c' },
    ],
    correctOptionId: 'A',
    timeLimitSeconds: 25,
    explanation: {
      whyWrong: 'Pilihan B, C, dan D bukan janji kepemimpinan yang etis dan bukan teks target.',
      whyCorrect: 'Kalimat A melatih artikulasi kosakata kepemimpinan tingkat lanjut: "SO-lemn-ly PLEDGE" (/ˈsɒl.əm.li pledʒ/), "in-TEG-ri-ty", "trans-PAR-en-cy", dan "un-WA-ver-ing com-PAS-sion".',
      grammarRule: 'Civic Oath Cadence: Firm, deliberate syllable enunciation with dignified descending final cadence.',
      keyClue: 'Ucapkan dengan mantap: I SO-lemn-ly PLEDGE... in-TEG-ri-ty, trans-PAR-en-cy...',
      exampleSentences: [
        'Target: "I solemnly pledge to serve all citizens with integrity, transparency, and unwavering compassion."'
      ],
      vocabularyTips: ['Solemnly pledge = Berjanji dengan khidmat', 'Unwavering compassion = Kepedulian yang tak tergoyahkan']
    }
  }
];

export const BOT_NAMES = [
  { name: 'Sarah M. (Ketua OSIS)', avatar: '👩‍🎓', speedFactor: 0.88, accuracy: 0.90 },
  { name: 'Budi Pratama (Ketua RT 02)', avatar: '🧑‍💻', speedFactor: 0.76, accuracy: 0.80 },
  { name: 'Alya Putri (Relawan Karang Taruna)', avatar: '👧', speedFactor: 0.92, accuracy: 0.94 },
  { name: 'Dimas Wijaya (Sekretaris Desa)', avatar: '👦', speedFactor: 0.68, accuracy: 0.72 },
  { name: 'Clarissa E. (Duta Literasi)', avatar: '👩‍🏫', speedFactor: 0.82, accuracy: 0.85 },
];
