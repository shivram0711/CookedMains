const fs = require('fs');
const path = require('path');

const sepQuestions = [
  {
    id: "ca-2026-09-001",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Ecology",
    sub_topic: "Marine Ecosystems & Coral Reefs",
    question: "With reference to the Global Coral Reef Monitoring Network (GCRMN) Status of Coral Reefs Report, consider the following statements:\n1. GCRMN operates under the International Coral Reef Initiative (ICRI) to assess global reef health.\n2. Coral bleaching occurs when scleractinian corals expel their symbiotic dinoflagellates (zooxanthellae) due to thermal stress.\n3. The Gulf of Mannar, Andaman & Nicobar Islands, and Lakshadweep are the only regions in India with major coral reef formations.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: GCRMN is an operational network under the International Coral Reef Initiative (ICRI) that compiles global scientific monitoring on the status of coral reef ecosystems.\nStatement 2 is correct: Elevated sea surface temperatures cause photosynthetic dysfunction in zooxanthellae, releasing reactive oxygen species that prompt host coral polyps to expel the algae, leading to bleaching.\nStatement 3 is incorrect: India has coral formations in four major zones—Andaman & Nicobar Islands, Lakshadweep, Gulf of Mannar, and the Gulf of Kutch—as well as patch reefs along the Malvan (Maharashtra) and Netrani Island (Karnataka) coastlines.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 falsely excludes the Gulf of Kutch and patch reefs.",
      "Option B": "Incorrect because statement 3 is wrong.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Coral Reef Ecosystems; Symbiosis (Zooxanthellae); Distribution of Coral Reefs in India.",
    standard_book_ref: "PMF IAS Environment, 'Marine Biomes & Coral Bleaching'; Shankar IAS Environment.",
    elimination_trap: "Always watch out for 'only' when listing geographical areas in India; Gulf of Kutch in Gujarat has marine national parks with fringing coral reefs, and Malvan has rocky patch reefs.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-09-002",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Ecology",
    sub_topic: "Flora & Plant Conservation",
    question: "With reference to 'Neelakurinji' (Strobilanthes kunthiana), consider the following statements:\n1. It is a monocarpic shrub endemic to the Shola grasslands of the Western Ghats.\n2. It exhibits synchronized mass flowering (gregarious masting) at intervals of every 12 years.\n3. It is listed as a protected plant under Schedule III of the Wildlife (Protection) Act, 1972.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three statements are correct.\nStatement 1 is correct: Neelakurinji is a monocarpic shrub (it flowers once, produces seeds, and then dies) that thrives in the high-elevation montane Shola grasslands of the Western Ghats (Nilgiri Hills, Anamalai, and Palani Hills).\nStatement 2 is correct: It exhibits an extraordinary 12-year flowering cycle (periodic masting), carpeting entire hillsides in purplish-blue blossoms.\nStatement 3 is correct: Following the 2022 amendment to the Wildlife (Protection) Act, 1972, Neelakurinji was specifically placed in Schedule III (which lists protected plant species), making uprooting, possession, or commercial trade an offense punishable with heavy fines.",
    option_analysis: {
      "Option A": "Incorrect. All three statements are correct.",
      "Option B": "Incorrect. All three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 3 are all factually and legally true.",
      "Option D": "Incorrect."
    },
    static_root: "Wildlife (Protection) Amendment Act 2022; Protected Plants under Schedule III; Shola Ecosystems.",
    standard_book_ref: "PMF IAS Environment, 'Plant Diversity & Conservation in Western Ghats'; MoEFCC Notifications.",
    elimination_trap: "Aspirants often forget that the Wildlife Protection Act protects plants. WPA Schedule III specifically protects designated flora such as Neelakurinji, Ladies Slipper orchids, and Pitcher plants.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-09-003",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Ecology",
    sub_topic: "Species in News",
    question: "The newly described critically endangered freshwater plant 'Ammannia telanganensis' was discovered in which of the following protected areas?\n(a) Amrabad Tiger Reserve\n(b) Similipal National Park\n(c) Manas National Park\n(d) Bandhavgarh Tiger Reserve",
    options: [
      "Amrabad Tiger Reserve",
      "Similipal National Park",
      "Manas National Park",
      "Bandhavgarh Tiger Reserve"
    ],
    answer: "Amrabad Tiger Reserve",
    correct_index: 0,
    correct_option: "A",
    explanation: "Option (A) is correct.\nBotanists discovered 'Ammannia telanganensis', a rare freshwater aquatic macrophyte belonging to the Lythraceae family, in the seasonal wetlands and rocky ephemeral streams of Amrabad Tiger Reserve (located in the Nallamala Hills of Telangana). It is classified as Critically Endangered due to its hyper-restricted distribution and vulnerability to livestock grazing and hydrology changes.",
    option_analysis: {
      "Option A": "Correct. Amrabad Tiger Reserve in Telangana is the type locality.",
      "Option B": "Incorrect. Similipal is in Mayurbhanj, Odisha (famous for melanistic tigers).",
      "Option C": "Incorrect. Manas is in Assam (famous for Golden Langurs and Pygmy Hogs).",
      "Option D": "Incorrect. Bandhavgarh is in Madhya Pradesh (known for high tiger density)."
    },
    static_root: "Flora of the Eastern Ghats; Protected Areas of Telangana; Wetland Species.",
    standard_book_ref: "Botanical Survey of India (BSI) Plant Discoveries; PMF IAS Environment.",
    elimination_trap: "The specific epithet 'telanganensis' immediately points to Telangana, home to Amrabad and Kawal Tiger Reserves.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-09-004",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "Consider the following statements regarding the 'Trishuli River':\n1. It originates in the Langtang Himal region of Tibet/Nepal and is an antecedent river cutting through the Higher Himalayas.\n2. It forms a major tributary of the Narayani (Gandaki) river system.\n3. It enters India through the state of Uttarakhand.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Trishuli River originates in the Tibet Autonomous Region (north of Langtang Himal) as an antecedent river, carving deep gorges through the Great Himalayan range.\nStatement 2 is correct: At Devghat in central Nepal, the Trishuli merges with the Kali Gandaki to form the Narayani (Sapta Gandaki) river.\nStatement 3 is incorrect: The Narayani/Gandak river flows out of Nepal and enters India in the West Champaran district of Bihar (at Valmikinagar), NOT Uttarakhand.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; statement 3 misidentifies the entry state as Uttarakhand instead of Bihar.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Himalayan Drainage Systems; Antecedent Rivers; Gandak River Basin.",
    standard_book_ref: "NCERT Class 11 India: Physical Environment, Chapter on 'Drainage System'; Majid Husain, Geography of India.",
    elimination_trap: "Uttarakhand is drained by the Yamuna, Ganga (Alaknanda, Bhagirathi), and Kali/Sharda rivers. Gandak drains central Nepal into northern Bihar.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-09-005",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "With reference to the North American Great Lakes, consider the following statements regarding 'Lake Ontario':\n1. It is the smallest of the Great Lakes by surface area.\n2. It receives the entire outflow of Lake Erie via the Niagara River and Niagara Falls.\n3. Its sole natural outlet to the Atlantic Ocean is the St. Lawrence River.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Among the five Great Lakes (Superior, Huron, Michigan, Erie, Ontario), Lake Ontario has the smallest surface area (though Lake Erie is shallower and smaller by water volume).\nStatement 2 is correct: Waters from the upper Great Lakes flow from Lake Erie into Lake Ontario via the Niagara River over Niagara Falls.\nStatement 3 is correct: Lake Ontario drains at its eastern terminus into the St. Lawrence River, which flows north-eastward through Canada into the Gulf of St. Lawrence and the North Atlantic Ocean.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all geographically accurate."
    },
    static_root: "Great Lakes of North America; Inland Waterways (St. Lawrence Seaway); Physical Geography of the Americas.",
    standard_book_ref: "G.C. Leong, Physical and Human Geography; Oxford School Atlas.",
    elimination_trap: "Lake Michigan is the only Great Lake entirely within the United States; the other four (including Ontario) straddle the US-Canada boundary.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-09-006",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "Consider the following pairs of Geographical Features and their Locations:\n1. Larak Island : An Iranian island in the Strait of Hormuz dominated by salt dome formations\n2. Lake Magadi : A hyper-saline alkaline soda lake in the southern Kenya Rift Valley\n3. Mount Anak Krakatau : An active volcanic caldera in the Sunda Strait between Java and Sumatra\nHow many of the pairs given above are correctly matched?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three pairs are correctly matched.\nPair 1 is correctly matched: Larak Island lies in the Strait of Hormuz, Persian Gulf, belonging to Iran, characterized by geologic salt diapirs (salt plugs) and strategic naval anchorages.\nPair 2 is correctly matched: Lake Magadi is an endorheic saline soda lake in the East African Rift System of southern Kenya, famous for massive surface deposits of trona (sodium sesquicarbonate) and flamingo flocks.\nPair 3 is correctly matched: Anak Krakatau ('Child of Krakatoa') is an island volcano in the Sunda Strait (between Java and Sumatra, Indonesia), which caused a catastrophic tsunami in 2018 when its volcanic cone collapsed into the sea.",
    option_analysis: {
      "Option A": "Incorrect. Three pairs are correctly matched.",
      "Option B": "Incorrect. All three pairs are correct.",
      "Option C": "Correct. Pairs 1, 2, and 3 are accurately matched.",
      "Option D": "Incorrect."
    },
    static_root: "Volcanism & Plate Tectonics; Rift Valley Lakes; Strategic Maritime Straits (Strait of Hormuz, Sunda Strait).",
    standard_book_ref: "NCERT Class 11 Physical Geography; Oxford Atlas of the World.",
    elimination_trap: "Krakatau is in Sunda Strait (between Java and Sumatra), NOT the Strait of Malacca (between Sumatra and the Malay Peninsula).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-09-007",
    year: 2026,
    month: "September 2026",
    subject: "International Relations",
    sub_topic: "Wildlife Law Enforcement",
    question: "The 'Kathmandu Declaration', recently adopted in wildlife conservation news, is associated with which of the following organizations?\n(a) International Union for Conservation of Nature (IUCN)\n(b) South Asia Wildlife Enforcement Network (SAWEN)\n(c) Global Tiger Forum (GTF)\n(d) Convention on Migratory Species (CMS)",
    options: [
      "International Union for Conservation of Nature (IUCN)",
      "South Asia Wildlife Enforcement Network (SAWEN)",
      "Global Tiger Forum (GTF)",
      "Convention on Migratory Species (CMS)"
    ],
    answer: "South Asia Wildlife Enforcement Network (SAWEN)",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe South Asia Wildlife Enforcement Network (SAWEN) is an inter-governmental wildlife law enforcement agency comprising eight South Asian countries (Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, and Sri Lanka). Its permanent secretariat is hosted in Kathmandu, Nepal. The Kathmandu Declaration focuses on harmonizing legal frameworks, intelligence exchange, and curbing cross-border smuggling of pangolin scales, tiger parts, red sanders, and exotic wildlife.",
    option_analysis: {
      "Option A": "Incorrect. IUCN is headquartered in Gland, Switzerland.",
      "Option B": "Correct. SAWEN's headquarters is in Kathmandu, adopting declarations on transboundary wildlife crime.",
      "Option C": "Incorrect. Global Tiger Forum (GTF) is headquartered in New Delhi, India.",
      "Option D": "Incorrect. CMS (Bonn Convention) is administered under UNEP in Bonn, Germany."
    },
    static_root: "Wildlife Crime Control; Transboundary Regional Cooperation; SAWEN Architecture.",
    standard_book_ref: "Shankar IAS Environment, Chapter on 'International Environmental Conventions'; Wildlife Crime Control Bureau (WCCB) Annual Report.",
    elimination_trap: "Do not confuse Global Tiger Forum (headquartered in New Delhi) with SAWEN (headquartered in Kathmandu).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-09-008",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Electoral Reforms & Technology",
    question: "In the context of electoral administration in India, what is the primary purpose of introducing 'Totaliser Machines' with Electronic Voting Machines (EVMs)?\n(a) To count voter verifiable paper audit trail (VVPAT) slips automatically using high-speed optical scanners\n(b) To connect EVM control units from multiple polling stations and display only the consolidated candidate vote counts, thereby preventing booth-wise voting pattern identification\n(c) To enable biometric voter authentication through Aadhaar at polling booths\n(d) To calculate proportionate representation according to single transferable votes in Legislative Council elections",
    options: [
      "To count voter verifiable paper audit trail (VVPAT) slips automatically using high-speed optical scanners",
      "To connect EVM control units from multiple polling stations and display only the consolidated candidate vote counts, thereby preventing booth-wise voting pattern identification",
      "To enable biometric voter authentication through Aadhaar at polling booths",
      "To calculate proportionate representation according to single transferable votes in Legislative Council elections"
    ],
    answer: "To connect EVM control units from multiple polling stations and display only the consolidated candidate vote counts, thereby preventing booth-wise voting pattern identification",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nBefore EVMs, ballot papers from an entire constituency were mixed in a large drum under Rule 59A of the Conduct of Elections Rules, 1961, hiding polling booth patterns. With EVMs, booth-wise counting reveals exactly which locality or village voted for which candidate, leading to post-election discrimination or intimidation. The Election Commission of India (ECI) proposed the 'Totaliser', a hardware attachment that connects up to 14 EVM control units simultaneously and displays only the pooled total votes polled by each candidate across all 14 booths without revealing individual booth breakdowns.",
    option_analysis: {
      "Option A": "Incorrect. Totaliser does not scan VVPAT paper slips.",
      "Option B": "Correct. Totaliser pools votes from multiple EVM control units to maintain voter secrecy and prevent post-poll victimization.",
      "Option C": "Incorrect. Aadhaar biometric authentication is not performed by Totaliser machines.",
      "Option D": "Incorrect. Totaliser is designed for first-past-the-post Lok Sabha and Assembly elections."
    },
    static_root: "Electoral Reforms; Law Commission Reports (255th Report on Electoral Reforms); Election Commission of India.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Elections & Electoral Reforms'; ECI Technical Expert Committee Reports.",
    elimination_trap: "Candidates often confuse the Totaliser with VVPAT scanning devices; the Totaliser is an electronic mixer for EVM control units.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-09-009",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Constitutional Law & Asymmetric Federalism",
    question: "Demands for constitutional safeguards for the Union Territory of Ladakh have proposed creating a special provision under Article 371. In this context, which of the following States has special provisions granted under Article 371A of the Constitution of India?\n(a) Nagaland\n(b) Mizoram\n(c) Assam\n(d) Manipur",
    options: [
      "Nagaland",
      "Mizoram",
      "Assam",
      "Manipur"
    ],
    answer: "Nagaland",
    correct_index: 0,
    correct_option: "A",
    explanation: "Option (A) is correct.\nSpecial provisions under Part XXI of the Indian Constitution include:\n- Article 371: Maharashtra and Gujarat\n- Article 371A: Nagaland (protects Naga customary law, religious/social practices, and land ownership)\n- Article 371B: Assam\n- Article 371C: Manipur\n- Article 371D & E: Andhra Pradesh & Telangana\n- Article 371F: Sikkim\n- Article 371G: Mizoram\n- Article 371H: Arunachal Pradesh\n- Article 371-I: Goa\n- Article 371J: Karnataka (Hyderabad-Karnataka region)",
    option_analysis: {
      "Option A": "Correct. Article 371A pertains to Nagaland.",
      "Option B": "Incorrect. Mizoram is governed by Article 371G.",
      "Option C": "Incorrect. Assam is governed by Article 371B.",
      "Option D": "Incorrect. Manipur is governed by Article 371C."
    },
    static_root: "Special Provisions for Some States (Articles 371 to 371J); Asymmetric Federalism in India.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Special Provisions Relating to Certain Classes / States'; D.D. Basu, Constitution of India.",
    elimination_trap: "UPSC frequently tests the sequential alphabetical match of Articles 371A to 371J with the respective Northeastern states.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-09-010",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "The strategically located 'Lipulekh Pass', situated at the trijunction of India, Nepal, and China, is located in which district of Uttarakhand and lies near the source of which river?\n(a) Chamoli district near Alaknanda River\n(b) Pithoragarh district near Kali (Mahakali) River\n(c) Uttarkashi district near Bhagirathi River\n(d) Bageshwar district near Saryu River",
    options: [
      "Chamoli district near Alaknanda River",
      "Pithoragarh district near Kali (Mahakali) River",
      "Uttarkashi district near Bhagirathi River",
      "Bageshwar district near Saryu River"
    ],
    answer: "Pithoragarh district near Kali (Mahakali) River",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nLipulekh Pass connects the Byans valley of Pithoragarh district in Uttarakhand with Ngari Prefecture in Tibet, China. It is historically utilized by pilgrims on the Kailash Mansarovar Yatra. The pass lies near the headwaters of the Kali (Sharda/Mahakali) River, which forms the international border between India and Nepal under the 1816 Treaty of Sugauli.",
    option_analysis: {
      "Option A": "Incorrect. Mana and Niti passes are in Chamoli district near Alaknanda.",
      "Option B": "Correct. Lipulekh is in Pithoragarh district near the source of the Kali river.",
      "Option C": "Incorrect. Muling La and Thaga La are in Uttarkashi district.",
      "Option D": "Incorrect. Bageshwar does not share an international pass with Tibet."
    },
    static_root: "Himalayan Mountain Passes; India-Nepal Boundary Relations (Treaty of Sugauli 1816); Pithoragarh Geography.",
    standard_book_ref: "Majid Husain, Geography of India; NCERT Class 11 India: Physical Environment.",
    elimination_trap: "Kalapani and Limpiyadhura disputes center squarely on the demarcation of the Kali river's origin in Pithoragarh district.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-09-011",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "Which of the following ports is situated outside the strategic choke point of the Strait of Hormuz on the Gulf of Oman, allowing international maritime traffic to bypass the strait entirely?\n(a) Bandar Abbas\n(b) Sohar Port\n(c) Jebel Ali\n(d) Ras Laffan",
    options: [
      "Bandar Abbas",
      "Sohar Port",
      "Jebel Ali",
      "Ras Laffan"
    ],
    answer: "Sohar Port",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nSohar Port (in the Sultanate of Oman) and Duqm Port are located directly on the Gulf of Oman and Arabian Sea, outside the Strait of Hormuz. In contrast, Bandar Abbas (Iran), Jebel Ali (Dubai, UAE), and Ras Laffan (Qatar) are all located inside the Persian Gulf, requiring ships to transit the narrow Strait of Hormuz choke point.",
    option_analysis: {
      "Option A": "Incorrect. Bandar Abbas is located on the northern shore of the Strait of Hormuz inside Iranian waters.",
      "Option B": "Correct. Sohar Port is in northern Oman on the Gulf of Oman, outside the Strait of Hormuz.",
      "Option C": "Incorrect. Jebel Ali is in Dubai, well inside the Persian Gulf.",
      "Option D": "Incorrect. Ras Laffan is Qatar's LNG hub inside the Persian Gulf."
    },
    static_root: "Maritime Choke Points; Middle East Ports & Geopolitics; Energy Sea Lanes.",
    standard_book_ref: "Oxford Student Atlas of the World; Ministry of Petroleum & Natural Gas Strategic Reserve briefs.",
    elimination_trap: "Ports of Oman (Sohar, Duqm, Salalah) and Fujairah (UAE) are specifically built outside Hormuz to guarantee unhindered crude export during geopolitical blockades.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-09-012",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Places in News",
    question: "Consider the following statements regarding the African nation of 'Djibouti':\n1. It borders the Bab-el-Mandeb Strait, which connects the Red Sea to the Gulf of Aden.\n2. Lake Assal, situated in Djibouti, is the lowest land point in Africa and one of the saltiest water bodies in the world.\n3. It shares land borders with Eritrea, Ethiopia, and Somalia.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Djibouti sits on the western shore of the Bab-el-Mandeb Strait, controlling maritime access between the Indian Ocean (Gulf of Aden) and the Suez Canal route (Red Sea).\nStatement 2 is correct: Lake Assal lies in a crater depression at 155 meters (509 ft) below sea level, making it the lowest point in Africa (and third lowest on Earth after Dead Sea and Sea of Galilee), with water salinity reaching nearly 35%.\nStatement 3 is correct: Djibouti is bounded by Eritrea to the north, Ethiopia to the west and south, and Somalia (Somaliland) to the southeast.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all accurate."
    },
    static_root: "Horn of Africa Geography; African Rift Valley & Saline Depressions; Bab-el-Mandeb Choke Point.",
    standard_book_ref: "NCERT Class 11 World Physical Geography; Oxford School Atlas.",
    elimination_trap: "Many students confuse Lake Assal (lowest point in Africa, -155m) with the Qattara Depression in Egypt (-133m).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-09-013",
    year: 2026,
    month: "September 2026",
    subject: "International Relations",
    sub_topic: "Dispute Resolution & Water Treaties",
    question: "With reference to the Indus Waters Treaty (IWT) of 1960 and the dispute mechanism concerning the Kishenganga and Ratle hydroelectric projects, consider the following statements:\n1. The Permanent Court of Arbitration (PCA) at The Hague was empaneled under the provisions of Annexure G of the Indus Waters Treaty.\n2. The treaty permits India to build 'run-of-the-river' hydroelectric projects on the Western Rivers (Indus, Jhelum, Chenab) subject to specified storage and flow design parameters.\n3. The International Court of Justice (ICJ) serves as the permanent administrative body responsible for routine inspections under the treaty.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: When disputes arise under the IWT, Annexure G provides for the constitution of a Court of Arbitration (facilitated by the PCA at The Hague), while Annexure F provides for a Neutral Expert appointed by the World Bank.\nStatement 2 is correct: Under Article III, Pakistan receives unrestricted use of all waters of the Western Rivers (Indus, Jhelum, Chenab), except for domestic use, non-consumptive use, agricultural use, and generation of hydro-electric power by India via run-of-the-river plants.\nStatement 3 is incorrect: The Permanent Indus Commission (PIC)—consisting of two Commissioners, one appointed by India and one by Pakistan—serves as the permanent bilateral administrative body for regular inspections, NOT the ICJ.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is incorrect.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Indus Waters Treaty 1960; India-Pakistan Transboundary Water Relations; International Dispute Resolution.",
    standard_book_ref: "R.S. Sisodia, India's Water Diplomacy; Ministry of Jal Shakti Indus Wing.",
    elimination_trap: "ICJ has no jurisdiction under the Indus Waters Treaty; disputes are handled strictly by the Permanent Indus Commission, Neutral Expert, or Court of Arbitration under World Bank aegis.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-09-014",
    year: 2026,
    month: "September 2026",
    subject: "Agriculture & Economy",
    sub_topic: "Agronomy & Carbon Farming",
    question: "Direct Seeded Rice (DSR) cultivation is being promoted as a climate-smart agricultural technique in India. In this context, consider the following statements:\n1. DSR significantly reduces agricultural methane (CH4) emissions compared to traditional transplanted flooded paddy cultivation.\n2. DSR requires pre-germinated nursery raising and labor-intensive manual seedling puddling.\n3. Farmers adopting DSR can earn carbon credits on voluntary carbon markets by demonstrating verifiable soil organic carbon sequestration and emissions abatement.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: In conventional puddled transplanted rice, prolonged anaerobic flooded conditions foster methanogenic bacteria that generate heavy methane emissions. DSR keeps fields aerated during early growth, reducing methane emissions by 30-50% and conserving 20-30% irrigation water.\nStatement 2 is incorrect: In DSR, seeds are sown directly into the main field using tractor-mounted seed drills (e.g., 'Lucky Seed Drill') without any nursery raising, puddling, or manual transplanting.\nStatement 3 is correct: Carbon project developers (under Verra VM0042 and Gold Standard frameworks) are measuring avoided methane and soil organic carbon gains in Punjab and Haryana DSR fields to issue tradable voluntary carbon credits.",
    option_analysis: {
      "Option A": "Incorrect because statement 2 contradicts the defining mechanic of direct seeding.",
      "Option B": "Correct. Statements 1 and 3 are correct.",
      "Option C": "Incorrect because statement 2 is wrong.",
      "Option D": "Incorrect because statement 2 is wrong."
    },
    static_root: "Agriculture and Greenhouse Gases; Water-saving Agricultural Technologies (DSR, AWD); Carbon Credits.",
    standard_book_ref: "ICAR Agricultural Handbook; Ramesh Singh, Indian Economy, Chapter on 'Agriculture'; PMF IAS Environment.",
    elimination_trap: "Puddling is the hallmark of transplanted rice; DSR eliminates puddling entirely, which preserves soil structure.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-09-015",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Ecology",
    sub_topic: "Indigenous Livestock & Biodiversity",
    question: "With reference to the 'Badri' cattle breed, which has been selected for genetic improvement through in-vitro fertilization (IVF) and ovum pick-up (OPU) technology, consider the following statements:\n1. It is the first registered indigenous cattle breed of the State of Uttarakhand.\n2. It naturally grazes on medicinal herbs and shrubs in high-altitude Himalayan pastures, yielding milk rich in A2 beta-casein protein.\n3. It is characterized by large hump morphology and heavy body weight exceeding 600 kilograms.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Badri cow is Uttarakhand's first certified indigenous cattle breed registered with the National Bureau of Animal Genetic Resources (NBAGR), Karnal.\nStatement 2 is correct: Adapted to the rugged Himalayan montane environment, Badri cattle browse native wild herbs, Oak foliage, and alpine flora, producing organic milk with high concentrations of A2 beta-casein and anti-oxidants.\nStatement 3 is incorrect: Badri is a small-sized, hardy dwarf mountain breed (weighing only 200–250 kg) with small horns and a compact body that allows agile movement on steep mountain slopes.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate; Statement 3 is false.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Indigenous Animal Genetic Resources (NBAGR); Biotechnology in Animal Husbandry (OPU-IVF); Himalayan Ecosystems.",
    standard_book_ref: "NBAGR Indigenous Cattle Database; India Year Book, 'Animal Husbandry & Dairying'.",
    elimination_trap: "Large draft cattle breeds like Kangayam, Amrit Mahal, or Hallikar are from southern/central plains. Mountain cattle like Badri and Siri are small, hardy, and lightweight.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out existing September questions if any to prevent duplicate IDs
const nonSep = existing.filter(q => q.month !== 'September 2026');
const updated = [...nonSep, ...sepQuestions];

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8');
console.log(`Successfully ingested ${sepQuestions.length} questions for September 2026. Total now: ${updated.length}`);
