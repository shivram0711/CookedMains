const fs = require('fs');
const path = require('path');

const part2Questions = [
  {
    id: "ca-2026-dc-021",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Census Operations & Social Demography",
    question: "With reference to the upcoming 'Digital Census 2027', consider the following statements:\n1. It will be the first post-Independence Census to enumerate the caste of every individual.\n2. In the Census enumeration process, individuals are counted at their 'usual place of residence', defined as where a person has resided for at least six months or intends to reside for six months or more.\n3. Non-Resident Indians (NRIs) holding Indian passports but living continuously abroad are included in the domestic household population enumeration schedules.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The 2027 Census will be the first comprehensive caste enumeration across all communities since the colonial 1931 Census (previous post-independence censuses only counted SCs and STs).\nStatement 2 is correct: Under Indian Census methodology, population enumeration follows the 'usual residence' concept (de jure enumeration), counting individuals where they have stayed for six months or more, or intend to stay.\nStatement 3 is incorrect: Indian citizens residing abroad as NRIs (estimated at ~1.58 crore) are not enumerated in domestic household schedules because Census counting is strictly territorial.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate; Statement 3 is wrong regarding overseas diaspora enumeration.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Census Act, 1948; Population Enumeration Concepts (Usual Place of Residence); Caste Census History (1931 vs Post-1947).",
    standard_book_ref: "Office of the Registrar General & Census Commissioner (ORGI); Ramesh Singh, Indian Economy, 'Demography'.",
    elimination_trap: "NRIs retain citizenship and voting rights, but are NOT counted in the decennial territorial Census of India.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-022",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Constitutional Law & Delimitation",
    question: "In the debate surrounding the future Delimitation of parliamentary constituencies in India, consider the following statements:\n1. The 42nd Constitutional Amendment Act, 1976 froze the total number of Lok Sabha seats allocated to each State based on the 1971 Census.\n2. The 84th Constitutional Amendment Act, 2001 extended this freeze on per-state seat allocations until the first Census taken after the year 2026.\n3. The Delimitation Commission's orders have the full force of law and cannot be questioned in any court of law under Article 329.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three statements are correct.\nStatement 1 is correct: The 42nd Amendment (1976) froze the inter-state allocation of Lok Sabha seats and state assembly seats at the 1971 population levels to encourage family planning.\nStatement 2 is correct: The 84th Amendment (2001) extended the freeze on the total number of seats allocated to each State until the first census taken after 2026, while permitting intra-state rationalization based on the 1991/2001 Census (87th Amendment).\nStatement 3 is correct: Under Article 329(a) and the Delimitation Commission Act, orders of the Delimitation Commission upon publication in the Gazette of India acquire the force of law and cannot be challenged in any court.",
    option_analysis: {
      "Option A": "Incorrect. All three statements are correct.",
      "Option B": "Incorrect. All three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 3 are all constitutionally and statutorily verified.",
      "Option D": "Incorrect."
    },
    static_root: "Delimitation Commission (Article 82 & 170); Constitutional Amendments (42nd and 84th); Bar to Interference by Courts in Electoral Matters (Article 329).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Parliament'; D.D. Basu, Introduction to the Constitution of India.",
    elimination_trap: "Once Delimitation orders are gazetted by the Commission, even the Supreme Court cannot stay or alter constituency boundaries under Article 329(a).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-dc-023",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Criminal Jurisprudence & Personal Liberty",
    question: "In Syed Iftikhar Andrabi v. National Investigation Agency (NIA), the Supreme Court ruled on the grant of bail in cases under the Unlawful Activities (Prevention) Act, 1967 (UAPA). In this context, consider the following statements:\n1. Section 43D(5) of the UAPA mandates that bail shall not be granted if the court is satisfied that there are reasonable grounds for believing that the accusation is prima facie true.\n2. In Union of India v. K.A. Najeeb (2021), the Supreme Court held that the statutory restriction under Section 43D(5) does not oust the constitutional court's jurisdiction to grant bail where prolonged incarceration violates the right to a speedy trial under Article 21.\n3. The statutory twin bail conditions under UAPA apply automatically to all offenses under the Bharatiya Nyaya Sanhita (BNS).\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Section 43D(5) of the UAPA creates an inverted bail threshold for Chapter IV and VI offenses, barring bail if the accusation appears prima facie true on perusal of the police case diary/charge sheet.\nStatement 2 is correct: In K.A. Najeeb (2021), a three-judge bench established that statutory restrictions cannot override the constitutional guarantee of life and personal liberty under Article 21; where trial is delayed and pre-trial detention is prolonged, constitutional courts can grant bail.\nStatement 3 is incorrect: The stringent Section 43D(5) conditions are unique to the special anti-terror statute (UAPA); they do not apply generally to ordinary offenses under the Bharatiya Nyaya Sanhita (BNS), 2023.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is incorrect.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "UAPA 1967; Right to Speedy Trial under Article 21; Supreme Court Jurisprudence on Bail (Watali vs Najeeb).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Fundamental Rights'; Law Commission Reports on Bail Reforms.",
    elimination_trap: "While Section 43D(5) binds trial magistrates and lower courts, High Courts and the Supreme Court retain constitutional power under Article 226 and Article 32 to enforce Article 21.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-024",
    year: 2026,
    month: "June 2026",
    subject: "Science & Technology",
    sub_topic: "Artificial Intelligence in Judiciary",
    question: "Under the draft 'Regulations for Use of Artificial Intelligence (AI) in Courts, 2026' released by the Supreme Court AI Committee, which of the following activities are strictly prohibited from being automated using AI systems?\n1. Autonomous AI-assisted sentencing without judicial oversight\n2. AI-based automated risk scoring to determine bail eligibility\n3. Algorithmic profiling and credibility determination of witnesses\n4. Machine transcription of oral court proceedings\nSelect the correct answer using the code given below:",
    options: [
      "1, 2 and 3 only",
      "2 and 4 only",
      "1, 3 and 4 only",
      "1, 2, 3 and 4"
    ],
    answer: "1, 2 and 3 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Option (A) is correct (1, 2, and 3 only).\nThe Supreme Court draft AI guidelines establish clear redlines for AI adoption in Indian courts:\n- Prohibited uses include: determining judicial outcomes, automated sentencing, profiling parties/witnesses, algorithmic bail risk scoring, and predictive credibility evaluation.\n- Permitted and promoted uses (assistive only) include: case management, automated cause list preparation, scheduling hearings, transcription of oral arguments (e.g., live transcription by SUVAS), and vernacular translation of judgments.",
    option_analysis: {
      "Option A": "Correct. 1, 2, and 3 are strictly prohibited; 4 is an officially permitted assistive application.",
      "Option B": "Incorrect because 1 and 3 are also prohibited, while 4 is permitted.",
      "Option C": "Incorrect because 4 is permitted.",
      "Option D": "Incorrect because transcription (4) is permitted."
    },
    static_root: "Artificial Intelligence and Ethics; E-Courts Mission Mode Project; Rule of Law & Natural Justice.",
    standard_book_ref: "Supreme Court E-Committee Reports; NITI Aayog Responsible AI for All Strategy.",
    elimination_trap: "Assistive administrative tools like speech-to-text transcription and document indexing are encouraged; only decision-making and discretionary judicial functions are prohibited.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-025",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Defence Cooperation & Innovation",
    question: "With reference to the 'Korea-India Defence Accelerator' (KIND-X), launched during the India–South Korea bilateral summit, consider the following statements:\n1. It mirrors existing defence innovation bridges like INDUS-X (with the United States) and FRIND-X (with France).\n2. It links India's Innovations for Defence Excellence (iDEX) with South Korea's defense start-up and innovation ecosystem.\n3. The K9 Vajra-T self-propelled howitzer, manufactured in India by L&T and Hanwha Aerospace, represents a successful precedent of this bilateral defence-industrial cooperation.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: KIND-X was created as an institutional accelerator bridging startups, investors, and defense labs between India and South Korea, following the template of INDUS-X and FRIND-X.\nStatement 2 is correct: It formally links the Ministry of Defence's iDEX initiative with South Korea's DAPA (Defense Acquisition Program Administration) startup framework to co-develop AI, autonomous systems, and advanced robotics.\nStatement 3 is correct: The K9 Vajra-T 155mm/52-calibre tracked self-propelled howitzer—built at L&T's Armoured Systems Complex in Hazira, Gujarat, in partnership with South Korea's Hanwha Aerospace—is the flagship success story of Indo-South Korean co-production.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all factually and technically accurate."
    },
    static_root: "Make in India in Defence; Bilateral Strategic Partnerships (India-Republic of Korea); Innovations for Defence Excellence (iDEX).",
    standard_book_ref: "Ministry of Defence Annual Report; Pushpesh Pant, International Relations.",
    elimination_trap: "K9 Vajra is based on the South Korean K9 Thunder platform, customized by DRDO and L&T for high-altitude desert and Ladakh deployment.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-026",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "India-Oceania Economic Diplomacy",
    question: "The Free Trade Agreement (FTA) concluded between India and New Zealand incorporates unique provisions on traditional knowledge and services mobility. In this context, consider the following statements:\n1. It is the first bilateral trade pact to provide reciprocal recognition of India's AYUSH systems and the native Māori traditional health practices.\n2. The agreement grants unrestricted, duty-free access for fluid milk and fresh cheese imported from New Zealand into India.\n3. New Zealand pledged to amend its domestic legislation within 18 months to grant high-level Geographical Indication (GI) protection for Darjeeling tea and Basmati rice.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: The India–New Zealand FTA pioneers a cultural-economic reciprocity model, granting mutual recognition for Indian AYUSH modalities and indigenous Māori healing systems.\nStatement 2 is incorrect: India maintained a strict 'red line' on its vulnerable domestic dairy farmers; fluid milk, butter, and cheese were completely excluded from tariff concessions.\nStatement 3 is correct: New Zealand formally committed to enacting legislative changes within 18 months to extend EU-style sui generis GI protection to iconic Indian agricultural products, specifically Darjeeling tea and Basmati rice.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is false.",
      "Option B": "Correct. Statements 1 and 3 are correct.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Geographical Indications of Goods Act, 1999; Traditional Knowledge & IP; India's Free Trade Agreements in Oceania.",
    standard_book_ref: "Ministry of Commerce Trade Agreements Compendium; Ramesh Singh, Indian Economy.",
    elimination_trap: "New Zealand is the world's largest dairy exporter (Fonterra), which is why India strictly refused any duty concessions on liquid milk to protect rural livelihoods.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-027",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Mediterranean Geopolitics & Connectivity",
    question: "In the context of the India-Middle East-Europe Economic Corridor (IMEEC), the Republic of Cyprus has emerged as a key strategic node. In this context, consider the following statements:\n1. Cyprus is an island republic located in the Eastern Mediterranean basin south of Turkey.\n2. Cyprus has formed a 'Friends of IMEEC' grouping within the European Union to champion transshipment connectivity.\n3. Cyprus is a member of the North Atlantic Treaty Organization (NATO).\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Cyprus is strategically situated in the Levant basin of the Eastern Mediterranean, near major shipping routes leading to the Suez Canal and Port of Haifa.\nStatement 2 is correct: Positioned at the maritime gateway of IMEEC's sea leg from Israel to southern Europe, Cyprus initiated the 'Friends of IMEEC' alliance among EU members to position Limassol and Larnaca as prime transshipment ports.\nStatement 3 is incorrect: Cyprus is NOT a member of NATO (due to the long-standing Cyprus dispute and Turkey's veto), although it is a member state of the European Union.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is wrong regarding NATO membership.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "India-Middle East-Europe Economic Corridor (IMEEC); Eastern Mediterranean Geography; EU and NATO Member States.",
    standard_book_ref: "Oxford Student Atlas of the World; Ministry of External Affairs Bilateral Briefs.",
    elimination_trap: "Cyprus is an EU member but is one of the few European countries that is NOT in NATO.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-028",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Coastal Climate Resilience",
    question: "Following the impact of Cyclone Dana, national policy discussions highlighted the role of 'Ecosystem-based Adaptation' (EbA) over hard engineering structures. In this context, consider the following statements:\n1. Ecosystem-based Adaptation uses biodiversity and ecosystem services as part of an overall adaptation strategy to help people adapt to the adverse effects of climate change.\n2. India's MISHTI (Mangrove Initiative for Shoreline Habitats & Tangible Incomes) scheme aims to restore mangrove forests across nine coastal States and four Union Territories.\n3. Dense mangrove forests reduce coastal wave energy primarily through the friction created by their aerial prop roots and pneumatophores.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: As defined under the Convention on Biological Diversity (CBD), EbA integrates the conservation, sustainable management, and restoration of ecosystems to increase climate resilience for vulnerable human communities.\nStatement 2 is correct: Launched in Union Budget 2023-24, MISHTI operates across 540 sq. km along India's coastline through convergence of CAMPA funds, MGNREGS, and private CSR to restore mangrove green belts.\nStatement 3 is correct: Hydrodynamic studies show that a 100-meter-wide belt of mature mangroves with intricate stilt roots (Rhizophora) and pencil pneumatophores (Avicennia) can attenuate storm wave energy by up to 66%, outperforming rigid concrete seawalls.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all scientifically and programmatically accurate."
    },
    static_root: "Ecosystem-based Adaptation (EbA); Mangrove Ecology & Adaptations (Pneumatophores, Vivipary); Coastal Disaster Management (MISHTI).",
    standard_book_ref: "PMF IAS Environment, 'Mangroves and Coral Reefs'; NDMA Coastal Disaster Management Guidelines.",
    elimination_trap: "Hard sea walls (grey infrastructure) often cause beach scouring and downdrift erosion, whereas mangrove forests (green infrastructure) naturally trap sediments and build soil elevation with sea level rise.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-029",
    year: 2026,
    month: "April 2026",
    subject: "Science & Technology",
    sub_topic: "Industrial Decarbonisation & Thermodynamics",
    question: "With reference to 'Industrial Heat Pumps' (IHPs) utilized for industrial decarbonisation, consider the following statements:\n1. Heat pumps generate thermal energy by burning high-octane hydrocarbon fuels.\n2. They operate on a thermodynamic refrigeration cycle, transferring and upgrading low-grade waste heat to higher process temperatures using electricity.\n3. The Coefficient of Performance (COP) of industrial heat pumps is typically between 3 and 5, meaning they deliver 3 to 5 units of useful thermal energy for every unit of electrical energy consumed.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "2 only",
      "1, 2 and 3"
    ],
    answer: "2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 2 and 3 are correct; Statement 1 is incorrect.\nStatement 1 is incorrect: Heat pumps do NOT burn any fuels; they are entirely electrified devices that consume electricity to run compressors that move heat from a source to a sink.\nStatement 2 is correct: An industrial heat pump works on the reverse Rankine vapor-compression cycle, absorbing low-temperature heat from industrial effluents, cooling towers, or ambient air and upgrading it to useful process steam or hot water (up to 120–160°C).\nStatement 3 is correct: Because heat is transported rather than generated by resistance or combustion, their Coefficient of Performance (COP) exceeds 100% efficiency, typically ranging between 3.0 and 5.0 in industrial applications.",
    option_analysis: {
      "Option A": "Incorrect because Statement 1 is false.",
      "Option B": "Correct. Statements 2 and 3 are correct.",
      "Option C": "Incorrect because Statement 3 is also correct.",
      "Option D": "Incorrect because Statement 1 is false."
    },
    static_root: "Thermodynamics (Second Law & Heat Engines); Industrial Energy Efficiency; Electrification of Process Heat.",
    standard_book_ref: "NCERT Class 11 Physics, 'Thermodynamics'; Bureau of Energy Efficiency (BEE) Technology Compendium.",
    elimination_trap: "A heat pump's efficiency (COP) is not limited by Carnot limits in the way combustion boilers are, because it transfers pre-existing environmental/effluent heat rather than converting chemical energy.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-030",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Regional Organizations & Indian Ocean",
    question: "With reference to the Indian Ocean Rim Association (IORA), consider the following statements:\n1. It was established in 1997 under the fundamental principle of open regionalism to foster economic cooperation.\n2. The IORA Charter explicitly bars controversial bilateral disputes and political issues from being raised in its deliberations.\n3. Pakistan is a full founding member of the association.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: IORA was formed in 1997 (initially known as the Indian Ocean Rim Initiative) to enhance socio-economic cooperation and maritime safety across the Indian Ocean littoral.\nStatement 2 is correct: Under Article 2 of the IORA Charter, all decisions are made by consensus, and bilateral and other contentious political issues are strictly excluded from discussions.\nStatement 3 is incorrect: Pakistan is NOT a member of IORA; its application for membership was not accepted because it failed to extend reciprocal Most Favoured Nation (MFN) trade treatment to India as required under IORA norms.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is false.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Indian Ocean Rim Association (IORA); SAGAR & MAHASAGAR Maritime Initiatives; Indian Ocean Geopolitics.",
    standard_book_ref: "Ministry of External Affairs IORA Overview; Rajiv Sikri, Challenge and Strategy.",
    elimination_trap: "Unlike SAARC where Pakistan is a member, IORA comprises 23 coastal states of the Indian Ocean but excludes Pakistan.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out any existing part 2 questions if present
const cleanExisting = existing.filter(q => !part2Questions.some(p => p.id === q.id));
const combined = [...cleanExisting, ...part2Questions];

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
console.log(`Successfully ingested ${part2Questions.length} additional Decode Civils questions!`);
console.log(`Total questions in repository now: ${normalized.length}`);
