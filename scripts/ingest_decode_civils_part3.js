const fs = require('fs');
const path = require('path');

const part3Questions = [
  {
    id: "ca-2026-dc-031",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Judicial Precedents & Evidence Law",
    question: "In CP v. AP (2026), the Supreme Court clarified the principles governing court-ordered DNA tests in matrimonial and paternity disputes. In this context, consider the following statements:\n1. Under Section 112 of the Indian Evidence Act, 1872 (and Section 116 of the Bharatiya Sakshya Adhiniyam, 2023), the birth of a child during a valid marriage is conclusive proof of legitimacy unless non-access between the spouses can be proved.\n2. The Supreme Court held that DNA tests cannot be directed routinely to satisfy mere forensic curiosity and must only be ordered as a measure of last resort.\n3. A court can compel an individual to undergo a DNA test even when paternity is not directly in issue between the parties.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Section 112 of the Indian Evidence Act (and Section 116 of BSA 2023) provides that birth during marriage constitutes conclusive proof of legitimacy, rebuttable only by proving non-access.\nStatement 2 is correct: Reaffirming Goutam Kundu (1993) and Aparna Ajinkya Firodia (2023), the Supreme Court ruled that DNA tests impinge on bodily autonomy and the child's right against bastardization under Article 21, and can only be ordered when paternity is the central dispute and no other evidence is available.\nStatement 3 is incorrect: The Court held that DNA testing cannot be ordered where paternity is collateral or incidental; it must be strictly necessary and directly in issue.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is wrong.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Indian Evidence Act (Section 112); Right to Privacy (Article 21); Presumption of Legitimacy in Matrimonial Law.",
    standard_book_ref: "M. Laxmikanth, Indian Polity; Law Commission Reports on DNA Profiling and Paternity.",
    elimination_trap: "The law strongly protects the child's legitimacy; courts will never order a DNA test as a fishing expedition or matter of course.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-032",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Supreme Court & Ordinance Power",
    question: "With reference to the sanctioned strength of the Supreme Court of India and the Ordinance-making power of the President, consider the following statements:\n1. Under Article 124(1) of the Constitution, Parliament has the sole authority to increase the number of judges of the Supreme Court.\n2. An Ordinance promulgated under Article 123 ceases to operate at the expiration of six weeks from the reassembly of Parliament unless approved by both Houses earlier.\n3. The Supreme Court in D.C. Wadhwa v. State of Bihar held that the mechanical repromulgation of ordinances without placing them before the legislature is a fraud on the Constitution.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Article 124(1) states that the Supreme Court shall consist of a Chief Justice of India and, until Parliament by law prescribes a larger number, of not more than seven other judges; hence Parliament alone can alter the sanctioned judicial strength.\nStatement 2 is correct: Under Article 123(2)(a), an Ordinance has the same force and effect as an Act of Parliament, but must be laid before Parliament upon reassembly and automatically lapses six weeks from the date of reassembly if not approved.\nStatement 3 is correct: In D.C. Wadhwa (1987) and reaffirmed in Krishna Kumar Singh (2017), the Supreme Court ruled that repeatedly promulgating ordinances without legislative scrutiny constitutes subversion of the democratic legislative process.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all constitutionally authentic."
    },
    static_root: "Ordinance-making Power of President (Article 123); Composition of the Supreme Court (Article 124); Landmark Judgments on Ordinances (D.C. Wadhwa & Krishna Kumar Singh).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapters on 'President' and 'Supreme Court'; D.D. Basu, Introduction to the Constitution of India.",
    elimination_trap: "Do not confuse 6 months (maximum gap between parliamentary sessions) with 6 weeks (maximum life of an ordinance after Parliament reconvenes).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-033",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Atmospheric Science & Solar Energy",
    question: "A global assessment published in Nature Sustainability revealed that atmospheric aerosols reduced solar power generation in India by nearly 10% in 2023. In this context, consider the following statements:\n1. Aerosols, composed of black carbon and sulphates, decrease solar photovoltaic efficiency primarily through aerosol optical depth (AOD) attenuation of incident solar irradiance.\n2. In solar thermal and concentrated solar power (CSP) systems, diffuse radiation is more efficiently concentrated by mirrors than direct beam radiation.\n3. Flue-gas desulphurisation (FGD) equipment installed in thermal power plants helps mitigate atmospheric sulphate aerosol precursors.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: Fine aerosol particles scatter and absorb incoming solar radiation (atmospheric dimming), while also depositing on solar panels (soiling), reducing solar PV electricity output by ~9.6% across northern India.\nStatement 2 is incorrect: Concentrated Solar Power (CSP) systems and parabolic mirrors rely strictly on Direct Normal Irradiance (DNI); they cannot focus diffuse, scattered radiation. Aerosol scattering converts direct beam radiation into diffuse light, crippling CSP generation.\nStatement 3 is correct: Flue-gas desulphurisation (FGD) captures sulphur dioxide (SO2) from exhaust flue gases, preventing it from oxidizing into secondary sulphate aerosols in the atmosphere.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is false.",
      "Option B": "Correct. Statements 1 and 3 are correct.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Solar Radiation & Atmospheric Scattering; Air Pollution Constituents (PM2.5, Sulphates, Black Carbon); Thermal Power Plant Emissions & FGD.",
    standard_book_ref: "PMF IAS Environment, 'Air Pollution & Renewable Energy'; NCERT Class 11 Physical Geography, 'Solar Radiation'.",
    elimination_trap: "Mirrors and optical lenses can only focus parallel direct light rays (DNI); diffuse scattered light cannot be focused onto a focal receiver in CSP towers.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-034",
    year: 2026,
    month: "April 2026",
    subject: "Geography & Places in News",
    question: "The 'Hainan Free Trade Port' (FTP) initiative, launched by China to create a zero-tariff economic hub, is situated in which of the following maritime regions?\n(a) Northern entrance of the South China Sea, separated from the Leizhou Peninsula by the Qiongzhou Strait\n(b) Yellow Sea, bordering the Korean Peninsula\n(c) East China Sea, adjacent to the Ryukyu archipelago\n(d) Gulf of Tonkin, bordering the coast of Cambodia",
    options: [
      "Northern entrance of the South China Sea, separated from the Leizhou Peninsula by the Qiongzhou Strait",
      "Yellow Sea, bordering the Korean Peninsula",
      "East China Sea, adjacent to the Ryukyu archipelago",
      "Gulf of Tonkin, bordering the coast of Cambodia"
    ],
    answer: "Northern entrance of the South China Sea, separated from the Leizhou Peninsula by the Qiongzhou Strait",
    correct_index: 0,
    correct_option: "A",
    explanation: "Option (A) is correct.\nHainan is China's southernmost island province, situated in the northern part of the South China Sea. It is separated from the Leizhou Peninsula of Guangdong province on the Chinese mainland by the narrow Qiongzhou Strait (Hainan Strait). The Hainan FTP initiative establishes an offshore duty-free and low-tax special economic zone aimed at competing with Singapore and Hong Kong.",
    option_analysis: {
      "Option A": "Correct. Hainan lies in the northern South China Sea across the Qiongzhou Strait.",
      "Option B": "Incorrect. The Yellow Sea lies much further north between northern China and Korea.",
      "Option C": "Incorrect. The East China Sea lies northeast of Taiwan.",
      "Option D": "Incorrect. The Gulf of Tonkin borders northern Vietnam, not Cambodia."
    },
    static_root: "Geography of the South China Sea; Major Straits of East Asia (Qiongzhou Strait, Taiwan Strait); Special Economic Zones.",
    standard_book_ref: "Oxford Student Atlas of the World; Majid Husain, World Geography.",
    elimination_trap: "Qiongzhou Strait separates Hainan from mainland China, acting as a crucial shipping corridor into the Gulf of Tonkin.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-035",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "European Geopolitics & Alliances",
    question: "With reference to the North Atlantic Treaty Organization (NATO), consider the following statements:\n1. Article 5 of the North Atlantic Treaty embodies the principle of collective defense, stating that an armed attack against one member shall be considered an attack against all.\n2. Article 13 of the Treaty provides that any member state may withdraw from the alliance after giving a one-year notice of denunciation.\n3. Finland and Sweden became the 31st and 32nd member states of NATO respectively.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Article 5 is the cornerstone of NATO, committing all allies to collective self-defense if any member state is attacked in Europe or North America.\nStatement 2 is correct: Article 13 of the Washington Treaty explicitly stipulates that after the treaty has been in force for twenty years, any Party may cease to be a Party one year after its notice of denunciation has been given to the Government of the United States.\nStatement 3 is correct: Following the 2022 Russian invasion of Ukraine, previously neutral Nordic nations joined the alliance: Finland joined in April 2023 as the 31st member, and Sweden joined in March 2024 as the 32nd member.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all accurate."
    },
    static_root: "NATO and European Security Architecture; Collective Self-Defense (UN Charter Article 51 & NATO Article 5); Post-Cold War Expansion.",
    standard_book_ref: "Pushpesh Pant, International Relations; Ministry of External Affairs Global Briefs.",
    elimination_trap: "Article 5 has been invoked only once in NATO's history—following the September 11, 2001 terrorist attacks on the United States.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out any existing part 3 questions if present
const cleanExisting = existing.filter(q => !part3Questions.some(p => p.id === q.id));
const combined = [...cleanExisting, ...part3Questions];

// Normalize
const normalized = combined.map(q => {
  const norm = { ...q };
  if (!norm.question && norm.question_text) norm.question = norm.question_text;
  if (!norm.question_text && norm.question) norm.question_text = norm.question;
  if (norm.correct_index === undefined && norm.correct_option) {
    norm.correct_index = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[norm.correct_option];
  }
  if (!norm.correct_option && norm.correct_index !== undefined) {
    norm.correct_option = ['A', 'B', 'C', 'D'][norm.correct_index];
  }
  if (!norm.answer && norm.options && norm.correct_index !== undefined) {
    norm.answer = norm.options[norm.correct_index];
  }
  return norm;
});

fs.writeFileSync(dataPath, JSON.stringify(normalized, null, 2), 'utf8');
console.log(`Successfully ingested ${part3Questions.length} additional Decode Civils questions!`);
console.log(`Total questions in repository now: ${normalized.length}`);
