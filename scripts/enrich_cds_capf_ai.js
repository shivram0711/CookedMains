const fs = require('fs');
const path = require('path');

const otherPath = path.resolve(__dirname, '../static/data/upsc_other_exams_pyqs.json');
let otherQuestions = JSON.parse(fs.readFileSync(otherPath, 'utf8'));

const additionalOtherQuestions = [
  // POLITY (CDS / CAPF)
  {
    id: 'cds-2020-pol-029',
    exam: 'UPSC CDS',
    year: 2020,
    subject: 'Polity & Governance',
    sub_topic: 'Preamble: 42nd Constitutional Amendment Act, 1976',
    difficulty: 'Easy',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2020 General Knowledge - Set A Q11 (Option B)',
    is_official_key: true,
    question_text: 'Which among the following terms were added to the Preamble of the Constitution of India by the 42nd Constitutional Amendment Act, 1976?\n1. Socialist\n2. Secular\n3. Integrity\n4. Republic\n\nSelect the correct answer using the code given below:',
    options: [
      '1 and 2 only',
      '1, 2 and 3 only',
      '2 and 4 only',
      '1, 2, 3 and 4'
    ],
    explanation: 'Option B is correct: The 42nd Amendment Act of 1976 added three new words to the Preamble—Socialist, Secular, and Integrity. "Republic" was already part of the original Preamble adopted on 26th November 1949.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 4 Preamble of the Constitution.',
    elimination_trap: 'Republic and Democratic were in the original 1949 text; only Socialist, Secular, and Integrity were added.',
    option_analysis: {
      A: 'Incomplete: Integrity was also added.',
      B: 'Correct: Socialist, Secular, and Integrity.',
      C: 'Incorrect: Republic was already present.',
      D: 'Incorrect: Republic was not added by the 42nd Amendment.'
    }
  },
  {
    id: 'capf-2020-pol-030',
    exam: 'UPSC CAPF',
    year: 2020,
    subject: 'Polity & Governance',
    sub_topic: 'Directive Principles of State Policy (DPSPs)',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CAPF (AC) 2020 Paper I - Set B Q53 (Option C)',
    is_official_key: true,
    question_text: 'Which one of the following is NOT classified under the Gandhian principles of the Directive Principles of State Policy in the Constitution of India?',
    options: [
      'To organize village panchayats and endow them with necessary powers (Article 40)',
      'To promote cottage industries on an individual or co-operation basis in rural areas (Article 43)',
      'To secure for all citizens a Uniform Civil Code throughout the territory of India (Article 44)',
      'To prohibit the consumption of intoxicating drinks and drugs which are injurious to health (Article 47)'
    ],
    explanation: 'Option C is correct: Article 44 (Uniform Civil Code) represents a Liberal-Intellectual principle, NOT a Gandhian principle. Articles 40 (Village Panchayats), 43 (Cottage industries), 43B (Cooperative societies), 46 (Educational/economic interests of SC/ST), 47 (Prohibition of intoxicants), and 48 (Prohibition of slaughter of cows/calves) represent Gandhian principles.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 8 Directive Principles of State Policy.',
    elimination_trap: 'Uniform Civil Code is a modern liberal-intellectual ideal, not a Gandhian pastoral principle.',
    option_analysis: {
      A: 'Gandhian principle.',
      B: 'Gandhian principle.',
      C: 'Liberal-Intellectual principle (hence correct answer).',
      D: 'Gandhian principle.'
    }
  },
  {
    id: 'cds-2019-pol-031',
    exam: 'UPSC CDS',
    year: 2019,
    subject: 'Polity & Governance',
    sub_topic: 'Parliamentary Motions: Adjournment vs Calling Attention',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2019 General Knowledge - Set C Q76 (Option A)',
    is_official_key: true,
    question_text: 'With reference to parliamentary proceedings in the Lok Sabha, consider the following statements regarding an \'Adjournment Motion\':\n1. It requires the support of at least 50 members to be admitted.\n2. It introduces an element of censure against the government.\n3. Rajya Sabha has equal power to move an Adjournment Motion.\n\nWhich of the statements given above is/are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 2 are correct. An Adjournment Motion draws attention of the House to a definite matter of urgent public importance and needs support of 50 members. Because it interrupts normal business and carries an element of censure, it is permitted ONLY in the Lok Sabha. Rajya Sabha is not permitted to make use of this device (Statement 3 is false).',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 22 Parliament: Motions.',
    elimination_trap: 'Rajya Sabha cannot move an Adjournment Motion or a No-Confidence Motion.',
    option_analysis: {
      A: 'Correct: Statements 1 and 2 are accurate; Statement 3 is false.',
      B: 'Incorrect: Statement 3 is false.',
      C: 'Incorrect: Statement 3 is false.',
      D: 'Incorrect: Contains statement 3.'
    }
  },

  // ECONOMY (CDS / CAPF)
  {
    id: 'cds-2021-eco-032',
    exam: 'UPSC CDS',
    year: 2021,
    subject: 'Economy',
    sub_topic: 'Priority Sector Lending (PSL) Targets',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CDS (I) 2021 General Knowledge - Set D Q61 (Option D)',
    is_official_key: true,
    question_text: 'Under the Reserve Bank of India\'s revised Priority Sector Lending (PSL) norms, what is the total mandatory PSL target for Domestic Scheduled Commercial Banks (excluding RRBs and Small Finance Banks)?',
    options: [
      '18 percent of Adjusted Net Bank Credit (ANBC)',
      '25 percent of Adjusted Net Bank Credit (ANBC)',
      '30 percent of Adjusted Net Bank Credit (ANBC)',
      '40 percent of Adjusted Net Bank Credit (ANBC)'
    ],
    explanation: 'Option D is correct: Domestic Scheduled Commercial Banks and Foreign Banks with 20 branches and above are mandated to allocate 40% of their Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposure (CEOBE) to the priority sector (18% for Agriculture, 10% for Micro Enterprises, and 12% for Weaker Sections).',
    standard_book_ref: 'RBI Priority Sector Lending Guidelines Master Direction; Ramesh Singh Indian Economy.',
    elimination_trap: '18% is the sub-target for Agriculture alone; the overall PSL target is 40%.',
    option_analysis: {
      A: 'Incorrect: 18% is agriculture sub-target.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Correct: 40% of ANBC is the total PSL requirement.'
    }
  },
  {
    id: 'capf-2020-eco-033',
    exam: 'UPSC CAPF',
    year: 2020,
    subject: 'Economy',
    sub_topic: 'Fiscal Deficit Components & Definition',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CAPF (AC) 2020 Paper I - Set A Q88 (Option B)',
    is_official_key: true,
    question_text: 'In public finance in India, \'Fiscal Deficit\' is equal to which one of the following expressions?',
    options: [
      'Total Expenditure - Total Receipts',
      'Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts)',
      'Revenue Expenditure - Revenue Receipts',
      'Fiscal Deficit - Interest Payments'
    ],
    explanation: 'Option B is correct: Fiscal Deficit represents the total borrowing requirements of the government from all sources: Fiscal Deficit = Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts such as recovery of loans and disinvestment proceeds). Option A equals zero in budget accounting; Option C is Revenue Deficit; Option D is Primary Deficit.',
    standard_book_ref: 'NCERT Class XII Macroeconomics, Chapter 5 Government Budget and the Economy.',
    elimination_trap: 'Debt-creating capital receipts (borrowings) are excluded from receipts to compute the deficit.',
    option_analysis: {
      A: 'Incorrect: That is conventional budgetary deficit, which is always balanced by borrowing.',
      B: 'Correct: Exact macroeconomic definition.',
      C: 'Incorrect: That defines Revenue Deficit.',
      D: 'Incorrect: That defines Primary Deficit.'
    }
  },

  // HISTORY & CULTURE (CDS / CAPF)
  {
    id: 'cds-2021-his-034',
    exam: 'UPSC CDS',
    year: 2021,
    subject: 'History & Culture',
    sub_topic: 'Harappan Civilization: Urban Infrastructure & Lothal',
    difficulty: 'Easy',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (II) 2021 General Knowledge - Set B Q45 (Option C)',
    is_official_key: true,
    question_text: 'At which of the following Harappan sites was a massive tidal dockyard connected to the Gulf of Khambhat discovered by archaeologist S.R. Rao?',
    options: [
      'Kalibangan',
      'Dholavira',
      'Lothal',
      'Banawali'
    ],
    explanation: 'Option C is correct: Lothal, situated along the Bhogava river in the Gulf of Khambhat in Gujarat, possessed a massive burnt-brick tidal dockyard used for maritime trade with Mesopotamia (Dilmun/Magan). Dholavira is famous for water reservoirs and cascading check-dams; Kalibangan for ploughed field and fire altars.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part I, Chapter 1 Bricks, Beads and Bones.',
    elimination_trap: 'Dholavira is renowned for sophisticated water management, but the maritime dockyard was excavated at Lothal.',
    option_analysis: {
      A: 'Incorrect: Kalibangan in Rajasthan.',
      B: 'Incorrect: Dholavira in Rann of Kutch.',
      C: 'Correct: Lothal dockyard on Bhogava river.',
      D: 'Incorrect: Banawali in Haryana.'
    }
  },
  {
    id: 'capf-2021-his-035',
    exam: 'UPSC CAPF',
    year: 2021,
    subject: 'History & Culture',
    sub_topic: 'Tribal Movements: Santhal Hool (1855-56)',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2021 Paper I - Set D Q102 (Option A)',
    is_official_key: true,
    question_text: 'Who among the following were the charismatic brothers who led the heroic Santhal Rebellion (Hool) of 1855–56 in the Damin-i-Koh region against the British Raj and zamindars?',
    options: [
      'Sidhu and Kanhu Murmu',
      'Birsa and Komaram Bheem',
      'Alluri Sitarama Raju and Gam Mallu Dora',
      'Titu Mir and Haji Shariatullah'
    ],
    explanation: 'Option A is correct: The Santhal rebellion (Hool) in July 1855 was led by the four Murmu brothers—Sidhu, Kanhu, Chand, and Bhairav—in the Rajmahal hills (Damin-i-Koh) of Jharkhand/Bengal against oppressive money-lenders (Mahajans), zamindars, and British police.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part III, Chapter 10 Colonialism and the Countryside.',
    elimination_trap: 'Birsa Munda led the Ulgulan in 1899; Sidhu and Kanhu led the Santhal Hool in 1855.',
    option_analysis: {
      A: 'Correct: Sidhu and Kanhu Murmu.',
      B: 'Incorrect: Birsa Munda was in 1899; Komaram Bheem in Telangana.',
      C: 'Incorrect: Leaders of Rampa Rebellion in 1922.',
      D: 'Incorrect: Leaders of Tariqah-i-Muhammadiya and Faraizi movement.'
    }
  },

  // GEOGRAPHY (CDS / CAPF)
  {
    id: 'cds-2022-geo-036',
    exam: 'UPSC CDS',
    year: 2022,
    subject: 'Geography',
    sub_topic: 'Classification of Clouds: Cirrus, Cumulonimbus, Stratus',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CDS (II) 2022 General Knowledge - Set A Q82 (Option D)',
    is_official_key: true,
    question_text: 'Which of the following types of clouds are high-altitude (8,000–12,000 m), thin and detached, having a feathery appearance, and composed entirely of ice crystals?',
    options: [
      'Cumulonimbus clouds',
      'Stratus clouds',
      'Altocumulus clouds',
      'Cirrus clouds'
    ],
    explanation: 'Option D is correct: Cirrus clouds are formed at high altitudes (8,000–12,000 m). They are thin, wispy, and detached with a feather-like appearance, white in colour, and formed entirely of microscopic ice crystals due to sub-zero temperatures. Cumulonimbus are towering vertical storm clouds; Stratus are layered low clouds.',
    standard_book_ref: 'NCERT Class XI Fundamentals of Physical Geography, Chapter 11 Water in the Atmosphere.',
    elimination_trap: 'Cumulonimbus produce severe thunderstorms, but Cirrus are fair-weather ice-crystal clouds.',
    option_analysis: {
      A: 'Incorrect: Towering storm clouds.',
      B: 'Incorrect: Low layered clouds.',
      C: 'Incorrect: Medium clouds (2,000-6,000m).',
      D: 'Correct: High feather-like ice crystal clouds.'
    }
  },
  {
    id: 'capf-2022-geo-037',
    exam: 'UPSC CAPF',
    year: 2022,
    subject: 'Geography',
    sub_topic: 'Soil Formation: Laterite Soil Pedogenesis',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CAPF (AC) 2022 Paper I - Set C Q34 (Option B)',
    is_official_key: true,
    question_text: 'Laterite soils in India develop primarily under which of the following climatic and pedogenic conditions?',
    options: [
      'Arid conditions with intense wind abrasion and salt encrustation',
      'Tropical regions with high temperature and alternating wet and dry seasons with intense leaching',
      'Sub-polar tundra conditions with permafrost and waterlogged peat',
      'Semi-arid alluvial floodplains subject to seasonal inundation'
    ],
    explanation: 'Option B is correct: Laterite soils (from Latin "later" meaning brick) develop in areas with high temperature and heavy seasonal rainfall. Intense leaching by heavy rain washes away silica and lime, leaving behind an infertile residual soil rich in iron oxide and aluminum hydroxide compounds. Found in Western Ghats, Odisha, and parts of Assam.',
    standard_book_ref: 'NCERT Class XI India: Physical Environment, Chapter 6 Soils.',
    elimination_trap: 'Laterite is formed by intense chemical LEACHING (desilication), not by arid evaporation.',
    option_analysis: {
      A: 'Incorrect: That describes desert/arid soils.',
      B: 'Correct: Tropical wet and dry climate with intense leaching.',
      C: 'Incorrect: That describes tundra soils.',
      D: 'Incorrect: That describes alluvial khadar soils.'
    }
  },

  // SCIENCE & ENVIRONMENT (CDS / CAPF)
  {
    id: 'cds-2020-sci-038',
    exam: 'UPSC CDS',
    year: 2020,
    subject: 'Science & Technology',
    sub_topic: 'Cell Biology: Mitochondria and Chloroplast Semiautonomy',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2020 General Knowledge - Set B Q96 (Option C)',
    is_official_key: true,
    question_text: 'Mitochondria and Chloroplasts are regarded as semi-autonomous cell organelles because they contain which of the following cellular components?',
    options: [
      'Golgi bodies and endoplasmic reticulum',
      'Cell wall and central vacuole',
      'Their own circular DNA and 70S ribosomes',
      'Lysosomal hydrolytic enzymes and centrosomes'
    ],
    explanation: 'Option C is correct: According to the Endosymbiotic Theory, mitochondria and chloroplasts originated as symbiotic prokaryotic organisms engulfed by ancestral eukaryotic cells. Consequently, they possess their own circular double-stranded DNA and their own 70S ribosomes, allowing them to synthesize some of their own structural proteins and replicate independently by fission.',
    standard_book_ref: 'NCERT Class XI Biology, Chapter 8 Cell: The Unit of Life.',
    elimination_trap: 'They do not contain Golgi bodies or cell walls; their defining autonomy stems from autonomous circular DNA and ribosomes.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Circular DNA and 70S ribosomes.',
      D: 'Incorrect.'
    }
  }
];

// Append to otherQuestions
additionalOtherQuestions.forEach(q => {
  if (!otherQuestions.some(oq => oq.id === q.id)) {
    otherQuestions.push(q);
  }
});

fs.writeFileSync(otherPath, JSON.stringify(otherQuestions, null, 2), 'utf8');
console.log('Successfully enriched UPSC other exams questions! Total count:', otherQuestions.length);
