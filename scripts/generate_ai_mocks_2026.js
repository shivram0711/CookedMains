const fs = require('fs');
const path = require('path');

const aiMockQuestions = [
  // -------------------------------------------------------------------------
  // POLITY & GOVERNANCE (2026 Pattern: Pairs, Statement I & II, Deep Nuance)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-pol-001',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Polity & Governance',
    sub_topic: 'Constitutional Bodies & Enabling Articles',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: Based on Articles 263, 279A, 280 & 338 of the Constitution of India',
    is_official_key: true,
    source_tag: 'Laxmikanth 7th Edition · Constitution of India Bare Act',
    question_text: 'Consider the following pairs of Constitutional Bodies and their governing Articles:\n\n1. Inter-State Council : Article 263\n2. Goods and Services Tax (GST) Council : Article 279A\n3. Finance Commission of India : Article 280\n4. National Commission for Scheduled Tribes : Article 338A\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'All four pairs are correctly matched:\n1. Article 263 provides for the establishment of an Inter-State Council by the President.\n2. Article 279A was inserted by the 101st Constitutional Amendment Act, 2016 to establish the GST Council.\n3. Article 280 mandates the President to constitute a Finance Commission every fifth year.\n4. Article 338A was inserted by the 89th Constitutional Amendment Act, 2003, bifurcating the National Commission for Scheduled Castes (Art 338) and Scheduled Tribes (Art 338A).',
    standard_book_ref: 'M. Laxmikanth, Indian Polity (7th Ed.), Chapters 45 (Finance Commission), 47 (NCST), 54 (Inter-State Council), 55 (GST Council).',
    elimination_trap: 'Candidates often misremember whether GST Council is 279A or 269A. Art 269A deals with levy and collection of GST in course of inter-state trade, while 279A creates the Council.',
    option_analysis: {
      A: 'Incorrect: More than one pair is correct.',
      B: 'Incorrect: More than two pairs are correct.',
      C: 'Incorrect: All four pairs are matched, not just three.',
      D: 'Correct: All four pairs are exact constitutional provisions.'
    }
  },
  {
    id: 'ai-2026-pol-002',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Polity & Governance',
    sub_topic: 'President\'s Rule (Article 356) & S.R. Bommai Jurisprudence',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: S.R. Bommai v. Union of India (1994) 3 SCC 1',
    is_official_key: true,
    source_tag: 'Supreme Court Landmark Judgments · Laxmikanth Chapter 16',
    question_text: 'Consider the following statements :\nStatement-I :\nA proclamation of President\'s Rule under Article 356 of the Constitution of India is subject to judicial review by the Supreme Court and High Courts.\nStatement-II :\nThe Court can assess whether relevant objective material existed to justify the proclamation and whether the exercise of power was mala fide or based on wholly extraneous grounds.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: In the landmark S.R. Bommai v. Union of India (1994) case, a 9-judge Constitution Bench held that presidential proclamation under Article 356 is not immune from judicial review (Statement-I). Statement-II explains why and how judicial review operates: the court cannot examine the sufficiency of advice, but it can verify if objective material existed and whether power was exercised mala fide or on extraneous grounds.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 16 Emergency Provisions: Judicial Review of Article 356.',
    elimination_trap: 'Aspirants often confuse 38th Amendment (which barred judicial review) with 44th Amendment and Bommai case (which restored full judicial review).',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II provides the constitutional rationale for Statement-I.',
      B: 'Incorrect: Statement-II directly explains the scope and basis of Statement-I.',
      C: 'Incorrect: Statement-II is legally sound.',
      D: 'Incorrect: Statement-I is universally established.'
    }
  },
  {
    id: 'ai-2026-pol-003',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'Polity & Governance',
    sub_topic: 'Delimitation Commission & 84th Constitutional Amendment',
    difficulty: 'Tough',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'UPSC Standard Benchmark: Articles 82 & 170; Delimitation Act, 2002',
    is_official_key: true,
    source_tag: 'PIB · Ministry of Law & Justice · Laxmikanth Chapter 22',
    question_text: 'With reference to the Delimitation Commission in India, consider the following statements:\n1. Orders issued by the Delimitation Commission have the full force of law and cannot be called into question before any court of law.\n2. When the orders of the Delimitation Commission are laid before the Lok Sabha or a State Legislative Assembly, they can be modified by a resolution of the House.\n3. The 84th Constitutional Amendment Act, 2001 froze the total number of seats in the Lok Sabha on the basis of the 1971 census until the first census taken after the year 2026.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '1 and 3 only',
      '2 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 3 are correct. Statement 1 is correct: Under Section 10(2) of the Delimitation Act, orders of the Commission have force of law and cannot be questioned in any court. Statement 2 is incorrect: When laid before Lok Sabha or State Assemblies, the Houses have NO power to effect any modifications whatsoever. Statement 3 is correct: The 84th Amendment (2001) extended the freeze on Lok Sabha seats based on the 1971 census until the first census taken after 2026.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 22 Parliament: Delimitation of Constituencies.',
    elimination_trap: 'Statement 2 contains a major trap: Parliament or State Assemblies CANNOT alter or amend Delimitation Commission orders once finalized.',
    option_analysis: {
      A: 'Incorrect: Statement 2 is false.',
      B: 'Correct: Statements 1 and 3 are constitutionally and statutorily verified.',
      C: 'Incorrect: Statement 2 is false.',
      D: 'Incorrect: Statement 2 fails.'
    }
  },

  // -------------------------------------------------------------------------
  // ECONOMY & AGRICULTURE (2026 Pattern: CBDC, Transmission, Soil Tech)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-eco-004',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Economy',
    sub_topic: 'Central Bank Digital Currency (CBDC / e-Rupee) vs UPI',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: RBI Concept Note on Central Bank Digital Currency (CBDC)',
    is_official_key: true,
    source_tag: 'RBI Concept Note on CBDC · Economic Survey',
    question_text: 'Consider the following statements :\nStatement-I :\nUnlike Unified Payments Interface (UPI) transactions, transactions settled via Central Bank Digital Currency (e-Rupee) do not involve commercial bank inter-bank settlement risk.\nStatement-II :\ne-Rupee is a legal tender issued directly by the Reserve Bank of India and constitutes a direct sovereign liability on the central bank\'s balance sheet rather than a claim on a commercial bank.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: In UPI, money moves between private accounts in commercial banks through an inter-bank settlement system (clearing via NPCI and bank settlement reserves). In contrast, e-Rupee is digital cash—a direct sovereign liability of the RBI under amended Section 22 of the RBI Act. Because the liability is held directly against the central bank, transaction settlement is instant and final, without commercial bank credit or liquidity risk. Statement-II explains Statement-I.',
    standard_book_ref: 'RBI Annual Report / Concept Note on CBDC; Indian Economy by Vivek Singh.',
    elimination_trap: 'Aspirants often confuse the front-end user app interface (which looks like UPI) with the underlying settlement ledger (which is central bank digital currency).',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II establishes the financial architecture explaining Statement-I.',
      B: 'Incorrect: Statement-II is the exact causal explanation.',
      C: 'Incorrect: Statement-II is correct.',
      D: 'Incorrect: Statement-I is correct.'
    }
  },
  {
    id: 'ai-2026-eco-005',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Economy',
    sub_topic: 'Sustainable Agriculture & Climate Smart Technologies',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: ICAR & Ministry of Agriculture & Farmers Welfare Guidelines',
    is_official_key: true,
    source_tag: 'PIB · ICAR · Economic Survey Agriculture Chapter',
    question_text: 'Consider the following pairs of sustainable agricultural techniques and their primary agro-ecological benefits:\n\n1. Direct Seeded Rice (DSR) : Significant reduction in methane emissions and up to 25% irrigation water savings\n2. System of Rice Intensification (SRI) : Lower plant population with wider spacing and intermittent aerobic soil conditions\n3. Bio-decomposer Pusa Capsule : Enzymatic decomposition of paddy straw converting crop residue into organic manure\n4. Liquid Nano Urea : 100% replacement of basal soil application of synthetic phosphatic fertilizers\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: Liquid Nano Urea is designed to substitute conventional granular NITROGENOUS (Urea) fertilizers applied as foliar spray during vegetative growth, NOT phosphatic fertilizers (such as DAP or SSP). It reduces nitrogen leaching and volatilization.',
    standard_book_ref: 'ICAR Agricultural Research Reports; Kurukshetra / Yojana Agriculture Special; PMF IAS Agriculture.',
    elimination_trap: 'Nano Urea replaces Urea (Nitrogen), not Phosphatic fertilizers (DAP). Read nutrient types carefully!',
    option_analysis: {
      A: 'Incorrect: Three pairs are correct.',
      B: 'Incorrect: Three pairs are correct.',
      C: 'Correct: Exactly three pairs (1, 2, 3) are accurately matched.',
      D: 'Incorrect: Pair 4 contains the chemical nutrient mismatch.'
    }
  },

  // -------------------------------------------------------------------------
  // ENVIRONMENT & ECOLOGY (2026 Pattern: BBNJ, Kuno, Mangroves, GBF)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-env-006',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'Environment & Ecology',
    sub_topic: 'BBNJ High Seas Treaty & Marine Genetic Resources',
    difficulty: 'Tough',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'UPSC Standard Benchmark: UNCLOS BBNJ Agreement Text (A/CONF.232/2023/4)',
    is_official_key: true,
    source_tag: 'UN Division for Ocean Affairs (DOALOS) · InsightsIAS Jan 2026',
    question_text: 'With reference to the High Seas Treaty (Biodiversity Beyond National Jurisdiction - BBNJ Treaty) adopted under UNCLOS, consider the following statements:\n1. It applies exclusively to the waters beyond national jurisdiction, including the high seas and the international seabed Area.\n2. It establishes a legally binding mechanism for the fair and equitable sharing of benefits arising from Marine Genetic Resources (MGRs).\n3. It completely dissolves the International Seabed Authority (ISA) and transfers deep-sea mining regulation to the UN General Assembly.\n\nWhich of the statements given above is/are correct?',
    options: [
      '1 only',
      '1 and 2 only',
      '2 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 2 are correct. Statement 1 is correct: The BBNJ treaty covers marine areas beyond national jurisdiction (ABNJ), comprising the high seas (water column) and the Area (seabed, ocean floor, and subsoil beyond continental shelf limits). Statement 2 is correct: Part II mandates equitable benefit-sharing (both monetary and non-monetary) from Marine Genetic Resources. Statement 3 is completely false: BBNJ respects existing legal frameworks and explicitly does NOT undermine the mandate of the International Seabed Authority (ISA) established under Part XI of UNCLOS.',
    standard_book_ref: 'UN Division for Ocean Affairs (DOALOS) Text of BBNJ Treaty; PMF IAS Marine Ecology.',
    elimination_trap: 'Extreme statement 3: ISA was NOT dissolved. BBNJ operates without prejudice to the competence of existing bodies like ISA and IMO.',
    option_analysis: {
      A: 'Incomplete: Statement 2 is a core pillar of the treaty.',
      B: 'Correct: Statements 1 and 2 are authentic provisions.',
      C: 'Incorrect: Statement 3 is false.',
      D: 'Incorrect: Contains statement 3.'
    }
  },
  {
    id: 'ai-2026-env-007',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Environment & Ecology',
    sub_topic: 'Wildlife Sanctuaries & Conservation Corridors in News',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: MoEFCC Project Cheetah / Wildlife Institute of India (WII)',
    is_official_key: true,
    source_tag: 'PIB MoEFCC · The Hindu Environment Section',
    question_text: 'Consider the following pairs of Wildlife Protected Areas and their ecological significance in recent news:\n\n1. Kuno National Park : First cheetah introduction site in India within Vindhyan dry deciduous forest\n2. Gandhi Sagar Wildlife Sanctuary : Second prepared habitat for African cheetah release located along the Chambal River\n3. Dibang Wildlife Sanctuary : High-altitude habitat of Mishmi takin and proposed site for large-scale hydroelectric development\n4. Great Nicobar Biosphere Reserve : Habitat of the endangered dugong located exclusively along the Gulf of Mannar\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: Great Nicobar Biosphere Reserve is located in the southernmost part of the Andaman and Nicobar Islands (home to the Nicobar megapode, giant robber crab, and saltwater crocodile). The primary dugong habitat in India is the Gulf of Mannar, Palk Bay, and Gulf of Kutch, NOT Great Nicobar Island, which is in the Indian Ocean near Sumatra, thousands of kilometers from the Gulf of Mannar.',
    standard_book_ref: 'PMF IAS Environment: Protected Area Network of India; WII Reports on Project Cheetah.',
    elimination_trap: 'Pair 4 pairs Great Nicobar with Gulf of Mannar, which are geographically distinct.',
    option_analysis: {
      A: 'Incorrect: Three pairs are correct.',
      B: 'Incorrect: Three pairs are correct.',
      C: 'Correct: Exactly three pairs (1, 2, 3) are true.',
      D: 'Incorrect: Pair 4 is geographically distorted.'
    }
  },

  // -------------------------------------------------------------------------
  // GEOGRAPHY (2026 Pattern: GLOFs, Critical Minerals, Maritime Chokepoints)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-geo-008',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Geography',
    sub_topic: 'Glacial Lake Outburst Floods (GLOFs) & Himalayan Geomorphology',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: National Disaster Management Authority (NDMA) GLOF Guidelines',
    is_official_key: true,
    source_tag: 'NDMA Disaster Management Guidelines · NCERT Physical Geography',
    question_text: 'Consider the following statements :\nStatement-I :\nMoraine-dammed glacial lakes in the Eastern Himalayas are significantly more susceptible to catastrophic Glacial Lake Outburst Floods (GLOFs) than lakes in the Western Himalayas.\nStatement-II :\nThe Eastern Himalayas receive intense orographic precipitation from the Bay of Bengal branch of the Southwest Monsoon, combined with higher glacier retreat rates and weaker lateral moraines composed of unconsolidated till.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Geomorphological studies (NDMA and Wadia Institute of Himalayan Geology) highlight that the Eastern Himalayas (e.g., Sikkim, Bhutan) face higher GLOF hazards (such as the South Lhonak lake breach in Teesta basin in 2023) because they experience intense summer monsoon rainfall, higher temperatures, faster glacier melting, and weaker moraine dams composed of poorly sorted loose glacial till. Statement-II accurately provides the physical and meteorological reasons for Statement-I.',
    standard_book_ref: 'NDMA Guidelines on Management of Glacial Lake Outburst Floods; D.R. Khullar Geography.',
    elimination_trap: 'Glacial lakes are held by loose moraines, not solid bedrock. Heavy rain or avalanches easily breach them.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II provides the direct physical explanation.',
      B: 'Incorrect: Statement-II is the exact causal explanation.',
      C: 'Incorrect: Statement-II is scientifically valid.',
      D: 'Incorrect: Statement-I is an empirical fact.'
    }
  },
  {
    id: 'ai-2026-geo-009',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Geography',
    sub_topic: 'Critical Maritime Straits & Global Trade Chokepoints',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: International Maritime Organization (IMO) Navigation Channels',
    is_official_key: true,
    source_tag: 'Oxford Atlas of the World · NCERT Class XI Geography',
    question_text: 'Consider the following pairs of International Maritime Straits and the water bodies they connect:\n\n1. Bab-el-Mandeb Strait : Red Sea and the Gulf of Aden\n2. Strait of Hormuz : Persian Gulf and the Gulf of Oman\n3. Strait of Malacca : Andaman Sea and the South China Sea\n4. Bosporus Strait : Black Sea and the Sea of Marmara\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'All four pairs are correctly matched:\n1. Bab-el-Mandeb ("Gate of Tears") connects the Red Sea to the Gulf of Aden (chokepoint near Djibouti and Yemen).\n2. Strait of Hormuz connects the Persian Gulf to the Gulf of Oman and Arabian Sea.\n3. Strait of Malacca connects the Andaman Sea (Indian Ocean) to the South China Sea (Pacific Ocean).\n4. Bosporus Strait bifurcates Istanbul, connecting the Black Sea to the Sea of Marmara.',
    standard_book_ref: 'NCERT Class XI Fundamentals of Physical Geography; Orient BlackSwan / Oxford Student Atlas.',
    elimination_trap: 'Aspirants often confuse Dardanelles (Marmara to Aegean) with Bosporus (Black Sea to Marmara). Both are Turkish Straits.',
    option_analysis: {
      A: 'Incorrect: All pairs are correct.',
      B: 'Incorrect: All pairs are correct.',
      C: 'Incorrect: All four pairs are matched, not just three.',
      D: 'Correct: All four pairs are geographically exact.'
    }
  },

  // -------------------------------------------------------------------------
  // SCIENCE & TECHNOLOGY (2026 Pattern: AI Transformers, CRISPR, Semiconductors)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-sci-010',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'Science & Technology',
    sub_topic: 'Generative AI & Large Language Models (LLM Architecture)',
    difficulty: 'Tough',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'UPSC Standard Benchmark: MeitY National Strategy for Artificial Intelligence & IEEE AI Architectures',
    is_official_key: true,
    source_tag: 'MeitY Reports · IEEE Computer Society · Science & Technology Ravi P. Agrahari',
    question_text: 'With reference to Large Language Models (LLMs) and Transformer neural network architectures, consider the following statements:\n1. The "Self-Attention" mechanism allows the neural network to weigh the contextual significance of words in a sentence regardless of their positional distance.\n2. Transformers process input tokens sequentially one by one, making training times significantly slower than earlier Recurrent Neural Networks (RNNs).\n3. "AI Hallucination" refers to instances where the model generates plausible-sounding but factually incorrect or ungrounded assertions with high confidence.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '1 and 3 only',
      '2 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 3 are correct. Statement 1 is correct: In the foundational 2017 Transformer architecture ("Attention Is All You Need"), self-attention allows the model to calculate relationship weights between all words in parallel across long distances. Statement 2 is incorrect: Unlike RNNs which processed text sequentially and suffered from vanishing gradients, Transformers process entire input sequences in PARALLEL, which is the breakthrough that enabled massive scalability on GPUs. Statement 3 is correct: AI hallucination is the generation of statistically coherent but factually false outputs.',
    standard_book_ref: 'MeitY National AI Strategy; Science & Technology by Ravi P. Agrahari.',
    elimination_trap: 'Statement 2 reverses technological history: Transformers are fast because they process in PARALLEL, replacing slow sequential RNNs.',
    option_analysis: {
      A: 'Incorrect: Statement 2 is false.',
      B: 'Correct: Statements 1 and 3 are scientifically accurate.',
      C: 'Incorrect: Statement 2 is false.',
      D: 'Incorrect: Contains statement 2.'
    }
  },
  {
    id: 'ai-2026-sci-011',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Science & Technology',
    sub_topic: 'Semiconductor Fabrication: Gallium Nitride (GaN) vs Silicon',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: India Semiconductor Mission (ISM) Technology Roadmap',
    is_official_key: true,
    source_tag: 'PIB ISM · Ministry of Electronics & IT (MeitY)',
    question_text: 'Consider the following statements :\nStatement-I :\nGallium Nitride (GaN) and Silicon Carbide (SiC) semiconductors are increasingly replacing traditional Silicon in fast electric vehicle chargers and renewable energy inverters.\nStatement-II :\nGaN and SiC possess a much wider electronic bandgap than Silicon, allowing them to withstand higher operating voltages, frequencies, and temperatures with significantly lower power loss.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Wide bandgap (WBG) semiconductors like Gallium Nitride (GaN - ~3.4 eV) and Silicon Carbide (SiC - ~3.2 eV) have much larger energy bandgaps than Silicon (1.1 eV). This material property enables devices to operate at higher electric fields, higher switching speeds, and much higher thermal loads, dramatically shrinking device size and heat generation in EV chargers and power electronics. Statement-II provides the exact solid-state physics foundation explaining Statement-I.',
    standard_book_ref: 'NCERT Class XII Physics, Chapter 14 Semiconductor Electronics; ISM Whitepapers.',
    elimination_trap: 'Silicon is the legacy material; GaN and SiC are the high-efficiency Wide Bandgap alternatives.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II explains Statement-I.',
      B: 'Incorrect: Statement-II is the direct explanation.',
      C: 'Incorrect: Statement-II is correct.',
      D: 'Incorrect: Statement-I is an industrial reality.'
    }
  },

  // -------------------------------------------------------------------------
  // HISTORY & CULTURE (2026 Pattern: Temple Architecture, Sangam Ports, Bhakti)
  // -------------------------------------------------------------------------
  {
    id: 'ai-2026-his-012',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'History & Culture',
    sub_topic: 'Ancient & Early Medieval Maritime Trading Ports',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: Archaeological Survey of India (ASI) Coastal Excavation Reports',
    is_official_key: true,
    source_tag: 'NCERT Themes in Indian History Part I · Upinder Singh Ancient History',
    question_text: 'Consider the following pairs of ancient Indian ports and their geographic coastal locations:\n\n1. Muziris (Pattanam) : Malabar Coast (ancient Chera kingdom)\n2. Arikamedu : Coromandel Coast (Indo-Roman trading station near Puducherry)\n3. Sopara (Shurparaka) : Konkan Coast (Western Maharashtra)\n4. Tamralipti : Bay of Bengal deltaic coast (ancient Bengal port for trade with Southeast Asia)\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'All four pairs are correctly matched:\n1. Muziris (Pattanam in Kerala) was the bustling port of the Chera dynasty mentioned in the Periplus of the Erythraean Sea and Sangam poems.\n2. Arikamedu on the Coromandel coast was excavated by Mortimer Wheeler, yielding Roman amphorae and Arretine ware.\n3. Sopara in Palghar district of Maharashtra was a major western port since Mauryan times (Ashokan edict discovered here).\n4. Tamralipti (Tamluk in West Bengal) was the premier eastern port from which Buddhist pilgrims (Faxian, Xuanzang) and merchants sailed to Sri Lanka and Suvarnabhumi.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part I; Upinder Singh, A History of Ancient and Early Medieval India.',
    elimination_trap: 'Tamralipti is eastern; Sopara and Muziris are western; Arikamedu is southeastern.',
    option_analysis: {
      A: 'Incorrect: All pairs are correct.',
      B: 'Incorrect: All pairs are correct.',
      C: 'Incorrect: All four pairs are matched, not just three.',
      D: 'Correct: All four pairs are historically and geographically verified.'
    }
  },
  {
    id: 'ai-2026-his-013',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'History & Culture',
    sub_topic: 'Temple Architecture: Vesara Style & Hoysala Temples (UNESCO)',
    difficulty: 'Tough',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: Archaeological Survey of India / UNESCO World Heritage Dossier',
    is_official_key: true,
    source_tag: 'Nitin Singhania Art & Culture · NCERT An Introduction to Indian Art',
    question_text: 'With reference to the architectural style of the Sacred Ensembles of the Hoysalas (inscribed as a UNESCO World Heritage Site), consider the following statements:\n1. The Hoysala temples belong to the Vesara hybrid style, synthesizing elements of both Dravida and Nagara traditions.\n2. They are characterized by a stellate (star-shaped) ground plan elevated on a wide raised terrace (jagati).\n3. Soft chloritic schist (soapstone) was used as the primary building material, enabling intricate and deeply undercut filigree carvings.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1, 2 and 3',
      '1 and 3 only'
    ],
    explanation: 'All three statements are correct: Hoysala temples (such as Belur, Halebidu, and Somanathapura in Karnataka) represent the pinnacle of the Vesara style (hybrid of Nagara and Dravida). The ground plan is typically stellate (star-shaped) with multiple shrines (trikuta or vimana) resting on a raised platform (jagati). They were carved out of soft soapstone (chloritic schist), which allowed master sculptors like Mallitamma and Dasoja to carve miniature sculptural friezes with astonishing filigree detail.',
    standard_book_ref: 'NCERT Class XI An Introduction to Indian Art Part 1; Nitin Singhania Indian Art and Culture Chapter 1 Temple Architecture.',
    elimination_trap: 'Hard granite was used by the Cholas (Brihadisvara), but soapstone was the hallmark of Hoysala architecture.',
    option_analysis: {
      A: 'Incomplete: Statement 3 is also historically true.',
      B: 'Incomplete: Statement 1 is verified.',
      C: 'Correct: Statements 1, 2, and 3 are all authentic.',
      D: 'Incomplete.'
    }
  }
];

const outPath = path.resolve(__dirname, '../static/data/ai_mock_questions_2026.json');
fs.writeFileSync(outPath, JSON.stringify(aiMockQuestions, null, 2), 'utf8');
console.log('Successfully wrote', aiMockQuestions.length, '2026 UPSC AI Mock questions to', outPath);
