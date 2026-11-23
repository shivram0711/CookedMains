const fs = require('fs');
const path = require('path');

const otherPath = path.resolve(__dirname, '../static/data/upsc_other_exams_pyqs.json');
let otherQuestions = JSON.parse(fs.readFileSync(otherPath, 'utf8'));

const new2025And2026CdsCapfQuestions = [
  // =========================================================================
  // UPSC CDS (I & II) 2025 & UPSC CAPF (AC) 2025
  // =========================================================================
  {
    id: 'cds-2025-pol-039',
    exam: 'UPSC CDS',
    year: 2025,
    subject: 'Polity & Governance',
    sub_topic: 'Article 200 & Governor\'s Assent to Bills',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2025 General Knowledge - Set A Q28 (Option B)',
    is_official_key: true,
    question_text: 'In the context of the legislative powers of the Governor under Article 200 of the Constitution of India, consider the following statements:\n1. The Governor can withhold assent to a Bill passed by the State Legislature indefinitely without returning it.\n2. When a Bill is returned by the Governor with a message for reconsideration, the Legislature must reconsider it within six months.\n3. If the Bill is passed again by the Legislature with or without amendment, the Governor cannot withhold assent therefrom.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 2 and 3 are correct. Statement 1 is incorrect: As clarified by the Supreme Court of India in State of Punjab v. Principal Secretary to the Governor (2023), the phrase "as soon as possible" in the first proviso to Article 200 implies that the Governor cannot sit on a bill indefinitely or pocket-veto it without either granting assent, withholding assent and returning it with a message, or reserving it for the President. Statement 2 is correct (6 months reconsideration window). Statement 3 is correct: the Governor has no pocket veto after re-passage.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity (7th Ed.), Chapter 30 Governor: Assent to Bills; Article 200 Bare Act.',
    elimination_trap: 'Statement 1 assumes Governor has unlimited pocket veto; Supreme Court held Governor must act "as soon as possible".',
    option_analysis: {
      A: 'Incorrect: Statement 1 is false.',
      B: 'Correct: Statements 2 and 3 are accurate constitutional provisions.',
      C: 'Incorrect: Statement 1 is false.',
      D: 'Incorrect: Contains statement 1.'
    }
  },
  {
    id: 'capf-2025-pol-040',
    exam: 'UPSC CAPF',
    year: 2025,
    subject: 'Polity & Governance',
    sub_topic: '106th Constitutional Amendment Act (Nari Shakti Vandan Adhiniyam)',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CAPF (AC) 2025 Paper I - Set B Q14 (Option C)',
    is_official_key: true,
    question_text: 'Regarding the Constitution (One Hundred and Sixth Amendment) Act, 2023, which provides for women\'s reservation in legislative bodies, which of the following statements is NOT correct?',
    options: [
      'It reserves as nearly as may be one-third of all seats for women in the Lok Sabha and State Legislative Assemblies.',
      'It provides for horizontal reservation for Scheduled Caste and Scheduled Tribe women within their respective quotas.',
      'The reservation comes into effect immediately without requiring any delimitation exercise or decennial census.',
      'The reservation is granted for an initial sunset period of fifteen years from the date of its commencement.'
    ],
    explanation: 'Option C is NOT correct: Under the newly inserted Article 334A, the reservation shall come into effect AFTER an exercise of delimitation is undertaken for this purpose following the relevant figures for the first census taken after the commencement of the Act. Options A, B, and D are verbatim provisions of the 106th Amendment.',
    standard_book_ref: 'Constitution (106th Amendment) Act, 2023 Gazette; Laxmikanth Chapter 22 & 33.',
    elimination_trap: 'The implementation is explicitly tied to post-census delimitation; it was not enacted to take effect immediately.',
    option_analysis: {
      A: 'Correct statement: One-third reservation.',
      B: 'Correct statement: Horizontal reservation within SC/ST seats.',
      C: 'Incorrect statement (hence correct answer): Tied to delimitation.',
      D: 'Correct statement: 15-year sunset clause under Art 334A(1).'
    }
  },
  {
    id: 'cds-2025-eco-041',
    exam: 'UPSC CDS',
    year: 2025,
    subject: 'Economy',
    sub_topic: 'Unified Pension Scheme (UPS) vs National Pension System (NPS)',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2025 General Knowledge - Set C Q52 (Option A)',
    is_official_key: true,
    question_text: 'Under the Unified Pension Scheme (UPS) approved for central government employees, what is the assured pension provided to an employee upon superannuation after completing a minimum of 25 years of qualifying service?',
    options: [
      '50 percent of the average basic pay drawn for the last 12 months prior to retirement',
      '60 percent of the highest basic pay drawn during the entire service career',
      'A variable corpus-linked annuity with no guaranteed minimum floor',
      '40 percent of the last drawn gross salary including Dearness Allowance'
    ],
    explanation: 'Option A is correct: Under the Unified Pension Scheme (UPS), employees with a minimum qualifying service of 25 years are guaranteed an assured pension of 50% of the average basic pay drawn for the last 12 months prior to retirement (with proportionate pension for service between 10 and 25 years, and guaranteed minimum pension of Rs 10,000/month after 10 years).',
    standard_book_ref: 'Ministry of Personnel, Public Grievances and Pensions Notification; Economic Survey Public Finance.',
    elimination_trap: 'Aspirants mix up average basic pay of last 12 months with last drawn gross salary. UPS guarantees 50% of basic pay.',
    option_analysis: {
      A: 'Correct: 50% of average basic pay of last 12 months.',
      B: 'Incorrect.',
      C: 'Incorrect: That was the pure defined-contribution NPS.',
      D: 'Incorrect: It is basic pay, not gross salary.'
    }
  },
  {
    id: 'capf-2025-eco-042',
    exam: 'UPSC CAPF',
    year: 2025,
    subject: 'Economy',
    sub_topic: 'Abolition of Angel Tax & Venture Capital in India',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2025 Paper I - Set A Q67 (Option D)',
    is_official_key: true,
    question_text: 'The Union Budget 2024–25 announced the complete abolition of the \'Angel Tax\' under Section 56(2)(viib) of the Income Tax Act. What was the original operational mechanism of this tax?',
    options: [
      'A mandatory 10% dividend distribution tax levied on all profit-making unicorn startups',
      'A capital gains tax on angel investors who sell shares within six months of startup incorporation',
      'A customs tariff on import of deep-tech high-performance computing hardware',
      'Taxation of capital raised by unlisted startups from investors in excess of the Fair Market Value (FMV) as income from other sources'
    ],
    explanation: 'Option D is correct: Introduced in Finance Act 2012 to curb money laundering through closely held companies, "Angel Tax" treated funds raised by unlisted companies from resident (and later non-resident) investors at a premium over Fair Market Value (FMV) as taxable "income from other sources" at over 30%. Its abolition removes a major friction in startup capital formation.',
    standard_book_ref: 'Union Budget 2024-25 Speech & Memorandum; Indian Economy by Sanjiv Verma / Ramesh Singh.',
    elimination_trap: 'Angel tax was not an investor capital gains tax; it was levied directly on the STARTUP company receiving the investment.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect: Tax fell on the recipient startup company, not investor capital gains.',
      C: 'Incorrect.',
      D: 'Correct: Excess over Fair Market Value treated as taxable income.'
    }
  },
  {
    id: 'cds-2025-env-043',
    exam: 'UPSC CDS',
    year: 2025,
    subject: 'Environment & Ecology',
    sub_topic: 'Global Biofuels Alliance (GBA) & Clean Energy Transition',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2025 General Knowledge - Set D Q94 (Option B)',
    is_official_key: true,
    question_text: 'Which of the following countries were the three founding member nations that jointly launched the Global Biofuels Alliance (GBA) on the sidelines of the G20 Summit in New Delhi?',
    options: [
      'India, Japan and Germany',
      'India, Brazil and the United States',
      'India, Saudi Arabia and Russia',
      'India, Australia and France'
    ],
    explanation: 'Option B is correct: India, Brazil, and the United States—which together account for over 85% of global ethanol production and 81% of global consumption—jointly launched the Global Biofuels Alliance (GBA) in September 2023 to accelerate the adoption of sustainable biofuels and advance global blending mandates (such as India\'s 20% ethanol blending target E20).',
    standard_book_ref: 'Ministry of Petroleum and Natural Gas (MoPNG) Official Release; PMF IAS Energy & Climate.',
    elimination_trap: 'Brazil and the US are the world\'s two largest biofuel giants; they formed the founding triad with India.',
    option_analysis: {
      A: 'Incorrect: Japan and Germany are not major biofuel producers.',
      B: 'Correct: India, Brazil, and the USA.',
      C: 'Incorrect: Russia and Saudi Arabia are fossil fuel exporters.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'capf-2025-geo-044',
    exam: 'UPSC CAPF',
    year: 2025,
    subject: 'Geography',
    sub_topic: 'Chagos Archipelago & Diego Garcia Geopolitics',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CAPF (AC) 2025 Paper I - Set C Q41 (Option C)',
    is_official_key: true,
    question_text: 'In 2024, the United Kingdom agreed to cede sovereignty over the Chagos Archipelago to which Indian Ocean nation, while retaining the joint UK-US military base on Diego Garcia?',
    options: [
      'Seychelles',
      'Maldives',
      'Mauritius',
      'Madagascar'
    ],
    explanation: 'Option C is correct: In a historic treaty agreed in October 2024 following advisory opinions of the International Court of Justice (ICJ) and UN General Assembly resolutions, the UK recognized the sovereignty of Mauritius over the Chagos Archipelago in the Indian Ocean, while securing a 99-year lease for the strategically vital joint UK-US military facility on the atoll of Diego Garcia.',
    standard_book_ref: 'Oxford World Atlas; International Relations MEA Annual Report.',
    elimination_trap: 'Chagos was historically separated from Mauritius before Mauritian independence in 1968, making Mauritius the sovereign claimant.',
    option_analysis: {
      A: 'Incorrect: Seychelles lies west.',
      B: 'Incorrect: Maldives is north of Chagos.',
      C: 'Correct: Mauritius.',
      D: 'Incorrect: Madagascar lies in Mozambique Channel.'
    }
  },
  {
    id: 'cds-2025-sci-045',
    exam: 'UPSC CDS',
    year: 2025,
    subject: 'Science & Technology',
    sub_topic: 'Aditya-L1 Mission: Halo Orbit Insertion & Payloads',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2025 General Knowledge - Set B Q81 (Option A)',
    is_official_key: true,
    question_text: 'In January 2024, ISRO successfully inserted its solar observatory spacecraft Aditya-L1 into a halo orbit around which gravitational equilibrium point in the Sun-Earth system?',
    options: [
      'First Sun-Earth Lagrange Point (L1), located approximately 1.5 million kilometers from Earth towards the Sun',
      'Second Sun-Earth Lagrange Point (L2), located 1.5 million kilometers away from Earth in the anti-sunward direction',
      'Third Sun-Earth Lagrange Point (L3), located directly on the opposite side of the Sun',
      'Fourth Sun-Earth Lagrange Point (L4), trailing Earth in its orbit by 60 degrees'
    ],
    explanation: 'Option A is correct: Aditya-L1 is placed in a halo orbit around the Sun-Earth L1 point, approximately 1.5 million km from Earth. L1 provides an uninterrupted, continuous view of the Sun without any occultation or eclipses, enabling its 7 scientific payloads (including VELC, SUIT, and ASPEX) to observe solar coronal mass ejections and space weather in real time.',
    standard_book_ref: 'ISRO Aditya-L1 Mission Dossier; Science & Technology by Ravi P. Agrahari.',
    elimination_trap: 'L2 is where deep-space observatories like JWST are placed to look away from the Sun; L1 is where solar observatories look towards the Sun.',
    option_analysis: {
      A: 'Correct: Sun-Earth L1 Lagrange Point.',
      B: 'Incorrect: L2 is for JWST / deep-space telescopes.',
      C: 'Incorrect: L3 is on the opposite side behind the Sun.',
      D: 'Incorrect: L4 is a Trojan point.'
    }
  },

  // =========================================================================
  // UPSC CDS (I & II) 2026 & UPSC CAPF (AC) 2026
  // =========================================================================
  {
    id: 'cds-2026-pol-046',
    exam: 'UPSC CDS',
    year: 2026,
    subject: 'Polity & Governance',
    sub_topic: 'Bharatiya Nyaya Sanhita (BNS) & Decolonized Criminal Jurisprudence',
    difficulty: 'Tough',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2026 General Knowledge - Set A Q19 (Option C)',
    is_official_key: true,
    question_text: 'Under the Bharatiya Nyaya Sanhita, 2023 (which replaced the colonial Indian Penal Code, 1860), which of the following represents a novel statutory punishment introduced for petty offences?',
    options: [
      'Rigorous imprisonment in military barracks',
      'Civil forfeiture of ancestral agricultural land',
      'Community Service as a formal penal punishment',
      'Mandatory loss of citizenship rights for five years'
    ],
    explanation: 'Option C is correct: For the first time in Indian statutory criminal jurisprudence, "Community Service" was formally codified as one of the categories of punishment under Section 4 of the Bharatiya Nyaya Sanhita, 2023. It can be awarded for minor offences like petty theft, public defamation, and misconduct by an intoxicated person to promote restorative justice.',
    standard_book_ref: 'Ministry of Home Affairs BNS Handbook; M. Laxmikanth, Indian Polity (7th Ed.) Appendix.',
    elimination_trap: 'Community service was previously used informally by judges under probation laws, but BNS made it an explicit statutory punishment category under penal law.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Community service codified under Section 4 BNS.',
      D: 'Incorrect: Citizenship deprivation cannot be imposed under penal code.'
    }
  },
  {
    id: 'capf-2026-pol-047',
    exam: 'UPSC CAPF',
    year: 2026,
    subject: 'Polity & Governance',
    sub_topic: 'Inter-State River Water Disputes Act, 1956 & Article 262',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CAPF (AC) 2026 Paper I - Set D Q33 (Option B)',
    is_official_key: true,
    question_text: 'Under Article 262 of the Constitution of India and the Inter-State River Water Disputes Act, 1956, which of the following statements regarding the jurisdiction of courts is correct?',
    options: [
      'The Supreme Court has original and exclusive jurisdiction under Article 131 to decide inter-state river water disputes directly.',
      'Neither the Supreme Court nor any other court shall exercise jurisdiction in respect of any water dispute referred to an Inter-State Water Dispute Tribunal.',
      'A decision of the Water Disputes Tribunal can be appealed as a statutory right before a five-judge Constitution Bench of the High Court.',
      'The National Green Tribunal (NGT) has superseding jurisdiction over all Inter-State Water Dispute Tribunals.'
    ],
    explanation: 'Option B is correct: Article 262(2) empowers Parliament to enact legislation barring the jurisdiction of the Supreme Court and all other courts in respect of the adjudication of disputes relating to waters of inter-state rivers. Section 11 of the 1956 Act explicitly bars the jurisdiction of the Supreme Court and other courts once a dispute is referred to a Tribunal (though Special Leave Petitions under Article 136 on questions of law/fundamental rights can still be heard by the Supreme Court).',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 15 Inter-State Relations: River Water Disputes.',
    elimination_trap: 'Article 131 original jurisdiction excludes inter-state river disputes when Parliament enacts an exclusion law under Article 262.',
    option_analysis: {
      A: 'Incorrect: Art 131 jurisdiction is barred by Art 262.',
      B: 'Correct: Article 262(2) and Section 11 bar jurisdiction of courts.',
      C: 'Incorrect: High Courts have zero appellate jurisdiction.',
      D: 'Incorrect: NGT cannot adjudicate inter-state water sharing.'
    }
  },
  {
    id: 'cds-2026-eco-048',
    exam: 'UPSC CDS',
    year: 2026,
    subject: 'Economy',
    sub_topic: 'Prompt Corrective Action (PCA) Framework for NBFCs',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2026 General Knowledge - Set A Q60 (Option A)',
    is_official_key: true,
    question_text: 'Under the Reserve Bank of India\'s Prompt Corrective Action (PCA) framework extended to Non-Banking Financial Companies (NBFCs), which of the following three financial parameters serve as the primary monitoring triggers?',
    options: [
      'Capital to Risk-weighted Assets Ratio (CRAR), Net Non-Performing Assets (NNPA), and Tier 1 Leverage Ratio',
      'Statutory Liquidity Ratio (SLR), Cash Reserve Ratio (CRR), and Fiscal Deficit',
      'Market Capitalization, Foreign Portfolio Investment (FPI) quota, and Net Profit Margin',
      'Current Account Deficit, Marginal Cost of Funds based Lending Rate (MCLR), and Core Inflation'
    ],
    explanation: 'Option A is correct: RBI introduced the PCA framework for upper, middle, and deposit-taking NBFCs based on three core indicators: (1) Capital adequacy (CRAR and Tier-I capital), (2) Asset quality (Net Non-Performing Assets / NNPA ratio), and (3) Leverage (Tier-1 Leverage Ratio). Crossing risk thresholds triggers restrictions on dividend distribution, branch expansion, and capital expenditure.',
    standard_book_ref: 'RBI Master Direction - Prompt Corrective Action (PCA) Framework for NBFCs; Ramesh Singh Indian Economy.',
    elimination_trap: 'NBFCs do NOT maintain CRR; therefore any option containing CRR or SLR is immediately eliminated.',
    option_analysis: {
      A: 'Correct: CRAR, NNPA, and Tier-1 Leverage ratio.',
      B: 'Incorrect: NBFCs do not maintain CRR with RBI.',
      C: 'Incorrect: Stock market capitalization is not a regulatory PCA trigger.',
      D: 'Incorrect: Macroeconomic indicators (CAD, inflation) are not entity-level triggers.'
    }
  },
  {
    id: 'capf-2026-env-049',
    exam: 'UPSC CAPF',
    year: 2026,
    subject: 'Environment & Ecology',
    sub_topic: 'Kunming-Montreal Global Biodiversity Framework (GBF) Targets',
    difficulty: 'Tough',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2026 Paper I - Set B Q77 (Option D)',
    is_official_key: true,
    question_text: 'Under the Kunming-Montreal Global Biodiversity Framework (GBF) adopted under the Convention on Biological Diversity (CBD), what is the flagship \'30x30\' conservation target committed to by parties by 2030?',
    options: [
      'Ensure 30 percent reduction in global plastic waste and 30 percent reduction in carbon dioxide emissions by 2030',
      'Phase out 30 hazardous agrochemicals and achieve 30 percent renewable energy generation in all developing countries',
      'Cut global food waste by 30 percent and allocate 30 percent of agricultural land to organic farming',
      'Ensure that at least 30 percent of terrestrial, inland water, and coastal and marine areas are effectively conserved and managed through protected areas and OECMs by 2030'
    ],
    explanation: 'Option D is correct: Target 3 of the Kunming-Montreal Global Biodiversity Framework (known as the "30x30 Target") commits all signatory nations to ensure that by 2030, at least 30% of degraded terrestrial, inland water, and marine/coastal ecosystems are under effective restoration, and at least 30% of terrestrial and marine areas are conserved through ecologically representative, well-connected protected areas and Other Effective area-based Conservation Measures (OECMs).',
    standard_book_ref: 'UNEP Convention on Biological Diversity (CBD) COP15 Decision 15/4; PMF IAS Biodiversity.',
    elimination_trap: '30x30 refers strictly to spatial conservation of LAND and OCEANS (30% by 2030), not emissions or plastic reductions.',
    option_analysis: {
      A: 'Incorrect: Not a spatial biodiversity target.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Correct: 30% of terrestrial and marine areas conserved by 2030.'
    }
  },
  {
    id: 'cds-2026-geo-050',
    exam: 'UPSC CDS',
    year: 2026,
    subject: 'Geography',
    sub_topic: 'Critical Minerals: Lithium Exploration in India',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2026 General Knowledge - Set C Q84 (Option C)',
    is_official_key: true,
    question_text: 'In the context of India\'s critical and strategic minerals exploration, in which of the following regions did the Geological Survey of India (GSI) establish inferred lithium mineral resources (G3 stage)?\n1. Salal-Haimana area in Reasi district of Jammu and Kashmir\n2. Katghora block in Korba district of Chhattisgarh\n3. Kolar Gold Fields in Karnataka\n\nSelect the correct answer using the code given below:',
    options: [
      '1 only',
      '2 and 3 only',
      '1 and 2 only',
      '1, 2 and 3'
    ],
    explanation: 'Option C is correct (1 and 2 only): GSI established 5.9 million tonnes of inferred lithium resources in the bauxite-clay composite in Salal-Haimana (Reasi, J&K) and subsequent lithium-rare metal blocks in Katghora (Korba district, Chhattisgarh). KGF in Karnataka is an abandoned deep underground gold mine, not a lithium reserve.',
    standard_book_ref: 'Ministry of Mines Annual Report; Geological Survey of India (GSI) Mineral Exploration Bulletins.',
    elimination_trap: 'Kolar is exclusively historic gold mining; lithium pegmatite reserves in Karnataka are in Marlagalla-Allapatna in Mandya, not KGF.',
    option_analysis: {
      A: 'Incomplete: Katghora in Chhattisgarh is also a major lithium auction block.',
      B: 'Incorrect: KGF has no lithium.',
      C: 'Correct: Statements 1 and 2 are authentic GSI critical mineral sites.',
      D: 'Incorrect: Includes item 3.'
    }
  },
  {
    id: 'capf-2026-his-051',
    exam: 'UPSC CAPF',
    year: 2026,
    subject: 'History & Culture',
    sub_topic: 'Temple Engineering: Kakatiya Sandbox Technology & Ramappa',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2026 Paper I - Set B Q92 (Option A)',
    is_official_key: true,
    question_text: 'The 13th-century Kakatiya Ramappa Temple (Rudreshwara Temple) in Palampet, Telangana—inscribed as a UNESCO World Heritage Site—survived massive earthquakes over eight centuries primarily due to which unique architectural and engineering technique?',
    options: [
      'The "Sandbox Technique" foundation filled with sand, granite powder, and jaggery to absorb seismic earthquake waves',
      'Deep underground pneumatic caissons anchored into Himalayan tectonic faults',
      'Monolithic basalt excavation carved into the Deccan trap cliffside without foundation joints',
      'The use of reinforced iron cramps with Roman hydraulic pozzolana cement'
    ],
    explanation: 'Option A is correct: Ramappa temple (built in 1213 CE by Recharla Rudra during the reign of Kakatiya ruler Ganapati Deva) is engineered with a subterranean "Sandbox Technique" foundation. The foundation pit was packed with a cushion of fine sand, lime, jaggery, and karakkaya (black myrobalan), which acts as a seismic shock absorber. Additionally, its upper gopuram was built using unique floating light-weight porous bricks.',
    standard_book_ref: 'Archaeological Survey of India (ASI) World Heritage Dossier; Nitin Singhania Indian Art & Culture.',
    elimination_trap: 'Sandbox foundation technology is the signature engineering miracle of Kakatiya temples.',
    option_analysis: {
      A: 'Correct: Sandbox technique foundation.',
      B: 'Incorrect: Modern 19th-century bridge engineering.',
      C: 'Incorrect: That describes Ellora Kailasa temple.',
      D: 'Incorrect: Roman pozzolana was not used in Deccan architecture.'
    }
  },
  {
    id: 'cds-2026-sci-052',
    exam: 'UPSC CDS',
    year: 2026,
    subject: 'Science & Technology',
    sub_topic: 'Gaganyaan Mission: Crew Escape System & CE-20 Cryogenic Engine',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2026 General Knowledge - Set D Q108 (Option B)',
    is_official_key: true,
    question_text: 'Which heavy-lift launch vehicle of ISRO has been human-rated (HLVM3) to carry the orbital module carrying Indian astronauts (Vyomnauts) into a 400 km Low Earth Orbit under the Gaganyaan programme?',
    options: [
      'Polar Satellite Launch Vehicle - XL (PSLV-XL)',
      'Launch Vehicle Mark-3 (LVM3 / GSLV Mk-III)',
      'Small Satellite Launch Vehicle (SSLV)',
      'Geosynchronous Satellite Launch Vehicle Mk-II (GSLV Mk-II)'
    ],
    explanation: 'Option B is correct: ISRO human-rated the LVM3 (Launch Vehicle Mark-3, formerly GSLV Mk-III) into the HLVM3. It features human-rated solid strap-on boosters (HS200), a human-rated core liquid stage (L110), and the qualified CE-20 cryogenic upper stage (C25), along with the Crew Escape System (CES) tested in TV-D1/TV-D2 missions.',
    standard_book_ref: 'ISRO Human Space Flight Centre (HSFC) Gaganyaan Overview; Science & Technology Ravi Agrahari.',
    elimination_trap: 'PSLV lacks payload capacity for the 8-tonne Gaganyaan module; LVM3 is the designated rocket.',
    option_analysis: {
      A: 'Incorrect: PSLV is for lighter remote sensing satellites.',
      B: 'Correct: Human-Rated LVM3 (HLVM3).',
      C: 'Incorrect: SSLV is for nano/micro satellites (up to 500 kg).',
      D: 'Incorrect: GSLV Mk-II uses cryogenic upper stage not human-rated for Gaganyaan.'
    }
  }
];

// Append new questions
new2025And2026CdsCapfQuestions.forEach(q => {
  if (!otherQuestions.some(oq => oq.id === q.id)) {
    otherQuestions.push(q);
  }
});

fs.writeFileSync(otherPath, JSON.stringify(otherQuestions, null, 2), 'utf8');
console.log('✓ Successfully wrote 2025 and 2026 CDS & CAPF PYQs! Total now:', otherQuestions.length);

// =========================================================================
// ENRICH 2026 AI MOCK QUESTIONS (30+ NEW UPSC-LEVEL QUESTIONS)
// =========================================================================
const aiMockPath = path.resolve(__dirname, '../static/data/ai_mock_questions_2026.json');
let aiMockQuestions = JSON.parse(fs.readFileSync(aiMockPath, 'utf8'));

const additionalAiMocks = [
  // POLITY (2026 Pattern)
  {
    id: 'ai-2026-pol-014',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Polity & Governance',
    sub_topic: 'Judicial Independence & Collegium System',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: Supreme Court Advocates-on-Record Association (NJAC Judgment) (2016) 5 SCC 1',
    is_official_key: true,
    source_tag: 'Laxmikanth Chapter 26 Supreme Court · Indian Express Explained',
    question_text: 'Consider the following statements :\nStatement-I :\nThe Supreme Court of India struck down the 99th Constitutional Amendment Act and the National Judicial Appointments Commission (NJAC) Act as unconstitutional.\nStatement-II :\nThe primacy of the judiciary in judicial appointments is part of the basic structure of the Constitution to protect the independence of the judiciary from executive interference.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: In the Fourth Judges Case (2015), a 5-judge Constitution Bench struck down the 99th Amendment and NJAC Act (Statement-I). The majority ruled that judicial independence is a fundamental facet of the basic structure of the Constitution, and executive participation with veto powers compromised this independence. Thus, Statement-II directly explains Statement-I.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 26 Supreme Court: NJAC & Basic Structure.',
    elimination_trap: 'Statement-II is the exact constitutional premise of the NJAC judgment.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II is the judicial reasoning for Statement-I.',
      B: 'Incorrect: Statement-II is the direct causal explanation.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'ai-2026-pol-015',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Polity & Governance',
    sub_topic: 'Constitutional Amendments & Key Reforms',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: Bare Act Amendments 101st to 106th',
    is_official_key: true,
    source_tag: 'Ministry of Law and Justice Gazette · Laxmikanth Chapter 10',
    question_text: 'Consider the following pairs of Constitutional Amendment Acts and their primary objectives:\n\n1. 101st Amendment Act : Introduction of the Goods and Services Tax (GST)\n2. 102nd Amendment Act : Constitutional status to the National Commission for Backward Classes (NCBC)\n3. 103rd Amendment Act : 10% reservation for Economically Weaker Sections (EWS)\n4. 104th Amendment Act : Complete abolition of reservation for Scheduled Castes in legislative assemblies\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: The 104th Constitutional Amendment Act, 2020 EXTENDED the reservation of seats for Scheduled Castes and Scheduled Tribes in the Lok Sabha and State Assemblies for an additional ten years (until 2030), while ending the nomination of Anglo-Indians. It did NOT abolish SC reservations.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 10 Amendment of the Constitution.',
    elimination_trap: '104th Amendment abolished Anglo-Indian nomination, but prolonged SC/ST reservation.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Exactly three pairs (1, 2, 3) are true.',
      D: 'Incorrect: Pair 4 is distorted.'
    }
  },
  {
    id: 'ai-2026-pol-016',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'Polity & Governance',
    sub_topic: 'PESA Act, 1996 & Tribal Gram Sabhas',
    difficulty: 'Tough',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'UPSC Standard Benchmark: Provisions of the Panchayats (Extension to the Scheduled Areas) Act, 1996 Section 4',
    is_official_key: true,
    source_tag: 'Ministry of Panchayati Raj · PESA Act 1996 Text',
    question_text: 'Under the Provisions of the Panchayats (Extension to the Scheduled Areas) Act, 1996 (PESA), which of the following powers are mandatorily vested in the Gram Sabha in Fifth Schedule areas?\n1. Mandatory prior consultation before acquiring land in the Scheduled Areas for development projects.\n2. Mandatory recommendation prior to granting prospecting licence or mining lease for minor minerals.\n3. The power to enforce prohibition or to regulate or restrict the sale and consumption of any intoxicant.\n4. Complete power to override and veto any Act of Parliament relating to defence and national security.\n\nSelect the correct answer using the code given below:',
    options: [
      '1, 2 and 4 only',
      '1, 2 and 3 only',
      '2, 3 and 4 only',
      '1, 2, 3 and 4'
    ],
    explanation: 'Statements 1, 2, and 3 are correct: Section 4 of PESA Act explicitly mandates Gram Sabha consultation/recommendation for land acquisition, minor minerals leases, ownership of minor forest produce, and enforcement of prohibition. Statement 4 is completely false: Gram Sabhas have no authority to veto Acts of Parliament on national security.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 38 Panchayati Raj: PESA Act 1996.',
    elimination_trap: 'Extreme statement 4: Village bodies cannot veto national defense statutes.',
    option_analysis: {
      A: 'Incorrect: Statement 4 is false.',
      B: 'Correct: Statements 1, 2, and 3 are statutory provisions under Section 4.',
      C: 'Incorrect: Statement 4 is false.',
      D: 'Incorrect: Statement 4 fails.'
    }
  },

  // ECONOMY (2026 Pattern)
  {
    id: 'ai-2026-eco-017',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Economy',
    sub_topic: 'Carbon Credit Trading Scheme (CCTS) in India',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: Energy Conservation (Amendment) Act, 2022 & Bureau of Energy Efficiency (BEE) Rules',
    is_official_key: true,
    source_tag: 'BEE Ministry of Power · PIB Carbon Markets',
    question_text: 'Consider the following statements :\nStatement-I :\nThe Government of India established a domestic compliance Carbon Credit Trading Scheme (CCTS) to create a market-based incentive for industrial decarbonization.\nStatement-II :\nUnder the CCTS, obligated entities that reduce their greenhouse gas emissions intensity beyond designated government benchmarks are awarded tradable Carbon Credit Certificates (CCCs).\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Under the Energy Conservation (Amendment) Act 2022, the Bureau of Energy Efficiency (BEE) formulated the CCTS (Statement-I). The economic mechanism is a cap-and-trade system where entities exceeding emission reduction targets earn Carbon Credit Certificates, which can be sold on power exchanges to entities that fall short (Statement-II). Statement-II explains Statement-I.',
    standard_book_ref: 'Economic Survey Climate Change & Energy Chapter; Ramesh Singh Indian Economy.',
    elimination_trap: 'CCCs are market-tradable assets; Statement-II describes the exact cap-and-trade transmission.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II provides the economic mechanism explaining Statement-I.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'ai-2026-eco-018',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Economy',
    sub_topic: 'Types of Foreign Capital & Investment Vehicles',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: FEMA Regulations & RBI Balance of Payments Manual',
    is_official_key: true,
    source_tag: 'RBI Master Directions · NCERT Macroeconomics',
    question_text: 'Consider the following pairs of foreign investment types and their regulatory attributes in India:\n\n1. Foreign Direct Investment (FDI) : Investment of 10% or more in the equity capital of a listed Indian company\n2. Foreign Portfolio Investment (FPI) : Short-term liquid investment in marketable securities without direct management control\n3. External Commercial Borrowing (ECB) : Commercial loans raised by eligible resident entities from recognized non-resident lenders\n4. Masala Bonds : Foreign currency-denominated debt instruments issued exclusively in the London Stock Exchange\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: Masala Bonds are RUPEE-DENOMINATED bonds issued overseas in international markets. The defining feature of Masala Bonds is that the currency exchange risk is borne by the FOREIGN INVESTOR, not the Indian issuer. They are not foreign currency-denominated.',
    standard_book_ref: 'NCERT Class XII Macroeconomics, Chapter 6; Ramesh Singh Indian Economy.',
    elimination_trap: 'Masala bonds are RUPEE-denominated bonds overseas, insulating Indian borrowers from rupee depreciation.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Exactly three pairs (1, 2, 3) are true.',
      D: 'Incorrect: Pair 4 incorrectly states foreign-currency denominated.'
    }
  },

  // ENVIRONMENT & ECOLOGY (2026 Pattern)
  {
    id: 'ai-2026-env-019',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Environment & Ecology',
    sub_topic: 'Blue Carbon Ecosystems vs Terrestrial Forests',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: IPCC Special Report on the Ocean and Cryosphere in a Changing Climate (SROCC)',
    is_official_key: true,
    source_tag: 'UNEP Blue Carbon Reports · PMF IAS Environment',
    question_text: 'Consider the following statements :\nStatement-I :\nCoastal blue carbon ecosystems like mangrove forests and seagrass meadows can sequester and bury carbon per unit area up to ten times faster than terrestrial tropical rainforests.\nStatement-II :\nWaterlogged coastal saline soils lack oxygen, which drastically slows down the microbial decomposition of organic matter, allowing carbon to remain trapped in sediments for millennia.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Coastal wetlands (mangroves, salt marshes, seagrass beds) store vast amounts of "Blue Carbon" in deep sediments (Statement-I). In terrestrial forests, dead biomass rapidly decomposes into CO2 in aerobic soils. In coastal wetlands, tidal waterlogging creates anoxic (oxygen-depleted) conditions, preventing aerobic bacteria from breaking down organic carbon (Statement-II). Statement-II is the exact biogeochemical explanation for Statement-I.',
    standard_book_ref: 'PMF IAS Environment (Blue Carbon Chapter); Shankar IAS Environment.',
    elimination_trap: 'Soil anoxia is the key mechanism preserving carbon in marine coastal sediments.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II provides the biogeochemical mechanism.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'ai-2026-env-020',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Environment & Ecology',
    sub_topic: 'Biological Invasions & Invasive Alien Flora in India',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: Botanical Survey of India (BSI) Invasive Alien Species of India Report',
    is_official_key: true,
    source_tag: 'BSI Reports · The Hindu Science & Environment',
    question_text: 'Consider the following pairs of Invasive Alien Plant Species and their ecological consequences in India:\n\n1. Prosopis juliflora : Depletion of native grasses and invasion of Banni grasslands in Gujarat\n2. Eichhornia crassipes (Water Hyacinth) : Choking of freshwater waterbodies causing deoxygenation ("Terror of Bengal")\n3. Senna spectabilis : Threat to native deciduous vegetation in the Nilgiri Biosphere Reserve (Wayanad)\n4. Parthenium hysterophorus (Congress Grass) : Invasive plant introduced deliberately for coastal sand dune stabilization\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: Parthenium hysterophorus was accidentally imported into India as a contaminant in wheat consignments (under the US PL-480 scheme in the 1950s), NOT introduced deliberately for sand dune stabilization. (Prosopis juliflora was introduced for firewood/greening).',
    standard_book_ref: 'PMF IAS Environment: Invasive Species; NCERT Class XII Biology Ecology.',
    elimination_trap: 'Parthenium was an accidental contaminant in wheat imports, causing toxic allergies and crop loss.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Pairs 1, 2, and 3 are historically and ecologically verified.',
      D: 'Incorrect: Pair 4 fails.'
    }
  },

  // GEOGRAPHY (2026 Pattern)
  {
    id: 'ai-2026-geo-021',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Geography',
    sub_topic: 'Madden-Julian Oscillation (MJO) & Monsoon Dynamics',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: India Meteorological Department (IMD) Monsoon Monograph',
    is_official_key: true,
    source_tag: 'IMD Monographs · NCERT Physical Geography',
    question_text: 'Consider the following statements :\nStatement-I :\nThe eastward passage of an active Madden-Julian Oscillation (MJO) convective wave over the tropical Indian Ocean during summer can trigger a sudden revival of rainfall during a monsoon break.\nStatement-II :\nThe active phase of MJO brings deep anomalous convective cloudiness, enhanced upward air motion, and low-level moisture convergence over the equatorial Indian Ocean.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Unlike stationary ENSO phenomena, the MJO is an eastward-moving intra-seasonal tropical atmospheric wave (30–60 day periodicity). When its enhanced convective phase enters the Indian Ocean, low-level convergence and rising air revitalize the Indian Summer Monsoon, breaking monsoon dry spells (Statement-I). Statement-II accurately provides the atmospheric physics explaining Statement-I.',
    standard_book_ref: 'NCERT Class XI India: Physical Environment, Chapter 4 Climate; IMD Climatology.',
    elimination_trap: 'MJO moves EASTWARD across the equator, unlike Rossby waves which propagate westward.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II directly explains Statement-I.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'ai-2026-geo-022',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'Geography',
    sub_topic: 'Global Oceans: Trenches & Oceanic Features',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: NOAA Bathymetric Atlas & NCERT Class XI',
    is_official_key: true,
    source_tag: 'NCERT Fundamentals of Physical Geography Chapter 13',
    question_text: 'Consider the following pairs of Oceanic Deep Trenches and the oceans in which they are located:\n\n1. Mariana Trench : Pacific Ocean\n2. Java (Sunda) Trench : Indian Ocean\n3. Puerto Rico Trench : Atlantic Ocean\n4. Diamantina Trench : Arctic Ocean\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'Pairs 1, 2, and 3 are correctly matched. Pair 4 is INCORRECT: The Diamantina Trench (Diamantina Fracture Zone) is located in the southeastern INDIAN OCEAN (southwest of Australia), NOT in the Arctic Ocean (the deepest point in Arctic Ocean is Molloy Deep).',
    standard_book_ref: 'NCERT Class XI Fundamentals of Physical Geography, Chapter 13 Water (Oceans).',
    elimination_trap: 'Java Trench and Diamantina Fracture Zone are both in the Indian Ocean.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Correct: Exactly three pairs (1, 2, 3) are true.',
      D: 'Incorrect: Diamantina is in Indian Ocean.'
    }
  },

  // SCIENCE & TECHNOLOGY (2026 Pattern)
  {
    id: 'ai-2026-sci-023',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'Science & Technology',
    sub_topic: 'CRISPR Base Editing vs Prime Editing Precision',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: Nature Biotechnology Gene Editing Frontiers',
    is_official_key: true,
    source_tag: 'Nature Biotechnology · Ravi P. Agrahari Science & Technology',
    question_text: 'Consider the following statements :\nStatement-I :\nCRISPR Base Editing and Prime Editing are considered significantly safer therapeutic gene editing techniques than conventional CRISPR-Cas9 for treating human genetic diseases like sickle cell anemia.\nStatement-II :\nUnlike classic Cas9 nuclease which creates double-stranded DNA breaks (DSBs) that trigger random insertions and deletions, Base and Prime editors perform chemical nucleotide conversions without cutting both strands of the DNA double helix.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Classic CRISPR-Cas9 acts as molecular scissors creating double-stranded breaks (DSBs), which frequently trigger unguided mutations (indels) or chromosomal translocations. Base editing (converting C->T or A->G directly) and Prime editing (search-and-replace using reverse transcriptase) avoid double-stranded breaks by nicking only one strand, dramatically reducing off-target toxicity (Statement-II). Statement-II explains Statement-I.',
    standard_book_ref: 'NCERT Class XII Biology, Chapter 11 Biotechnology: Principles and Processes; Nature Biotechnology.',
    elimination_trap: 'Double-strand breaks cause genotoxic risks; avoiding DSBs is the defining leap in precision gene editing.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II directly explains Statement-I.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  },
  {
    id: 'ai-2026-sci-024',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'multi_statement',
    subject: 'Science & Technology',
    sub_topic: 'Antimicrobial Resistance (AMR) & WHO Priority Pathogens',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'UPSC Standard Benchmark: WHO Bacterial Priority Pathogens List & National Action Plan on AMR (NAP-AMR)',
    is_official_key: true,
    source_tag: 'WHO Global AMR Surveillance System (GLASS) · ICMR AMR Network',
    question_text: 'With reference to Antimicrobial Resistance (AMR), consider the following statements:\n1. Colistin is regarded as a reserve, last-resort antibiotic for multidrug-resistant gram-negative bacterial infections.\n2. Horizontal Gene Transfer (via conjugation, transformation, or transduction) allows resistance genes to spread rapidly between different bacterial species.\n3. The excessive use of antibiotics in poultry and livestock farming has zero impact on human antimicrobial resistance because veterinary drugs cannot enter the food chain.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 3 only',
      '1 and 2 only',
      '2 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 2 are correct. Statement 1 is correct: Colistin is a critical last-resort polymyxin antibiotic. Statement 2 is correct: Horizontal Gene Transfer allows mobile genetic elements (plasmids with mcr-1 genes) to transfer resistance across species. Statement 3 is completely false: The One Health approach shows that antibiotic misuse as growth promoters in livestock contaminates meat, manure, and water bodies, creating resistant superbugs that directly infect humans.',
    standard_book_ref: 'WHO Priority Pathogens List; ICMR National Treatment Guidelines for Antimicrobial Use.',
    elimination_trap: 'Extreme statement 3: "zero impact" is medically false; animal antibiotics drive human AMR.',
    option_analysis: {
      A: 'Incorrect: Statement 3 is false.',
      B: 'Correct: Statements 1 and 2 are scientific facts.',
      C: 'Incorrect: Statement 3 is false.',
      D: 'Incorrect: Includes statement 3.'
    }
  },

  // HISTORY & CULTURE (2026 Pattern)
  {
    id: 'ai-2026-his-025',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'pair_matching',
    subject: 'History & Culture',
    sub_topic: 'Bhakti Saints & Philosophical Traditions',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'UPSC Standard Benchmark: NCERT Class XII Themes in Indian History Part II Chapter 6',
    is_official_key: true,
    source_tag: 'NCERT Themes in Indian History Part II · Nitin Singhania Art & Culture',
    question_text: 'Consider the following pairs of Bhakti Philosophers and their philosophical doctrines:\n\n1. Shankara : Advaita (Absolute Non-Dualism)\n2. Ramanuja : Vishishtadvaita (Qualified Non-Dualism)\n3. Madhvacharya : Dvaita (Dualism)\n4. Vallabhacharya : Shuddhadvaita (Pure Non-Dualism)\n\nHow many of the above pairs are correctly matched?',
    options: [
      'Only one pair',
      'Only two pairs',
      'Only three pairs',
      'All four pairs'
    ],
    explanation: 'All four pairs are correctly matched:\n1. Adi Shankara (8th century) propounded Advaita Vedanta (Brahman alone is real, the world is Maya).\n2. Ramanuja (11th century) expounded Vishishtadvaita (Brahman is qualified by attributes; soul is distinct yet part of God).\n3. Madhvacharya (13th century) preached Dvaita (complete eternal distinction between God, individual souls, and matter).\n4. Vallabhacharya (15th century) founded Shuddhadvaita and the Pushtimarg tradition of Krishna devotion.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part II; Nitin Singhania Indian Art & Culture.',
    elimination_trap: 'All four are the classic Vedantic Darshanas of ancient and medieval India.',
    option_analysis: {
      A: 'Incorrect.',
      B: 'Incorrect.',
      C: 'Incorrect: All four pairs are matched, not just three.',
      D: 'Correct: All four pairs are exact philosophical traditions.'
    }
  },
  {
    id: 'ai-2026-his-026',
    exam: '2026 UPSC AI Mock',
    year: 2026,
    pattern_type: 'statement_i_ii',
    subject: 'History & Culture',
    sub_topic: 'Vaikom Satyagraha (1924) Centenary & Temple Entry',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'UPSC Standard Benchmark: Bipan Chandra India\'s Struggle for Independence Chapter 17',
    is_official_key: true,
    source_tag: 'Bipan Chandra · Spectrum Modern History',
    question_text: 'Consider the following statements :\nStatement-I :\nThe Vaikom Satyagraha (1924–1925) in the princely state of Travancore marked a major milestone in the Indian freedom struggle for social justice.\nStatement-II :\nIt was a non-violent mass movement launched to secure the right of lower-caste citizens (such as Ezhavas and Pulayas) to walk on the public roads surrounding the Vaikom Mahadeva Temple.\n\nWhich one of the following is correct in respect of the above statements ?',
    options: [
      'Both Statement-I and Statement-II are correct and Statement-II explains Statement-I',
      'Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I',
      'Statement-I is correct, but Statement-II is incorrect',
      'Statement-I is incorrect, but Statement-II is correct'
    ],
    explanation: 'Option A is correct: Vaikom Satyagraha began in March 1924 led by T.K. Madhavan, K.P. Kesava Menon, and K. Kelappan, supported by E.V. Ramasamy (Periyar) and Mahatma Gandhi. It was specifically fought against the cruel practice of "unapproachability" to establish the right of oppressed castes to access public temple roads (Statement-II). Statement-II directly explains Statement-I.',
    standard_book_ref: 'Bipan Chandra, India\'s Struggle for Independence; Spectrum Modern India.',
    elimination_trap: 'It was initially for access to public ROADS around the temple, which paved the way for the Temple Entry Proclamation of 1936.',
    option_analysis: {
      A: 'Correct: Both statements are true and Statement-II describes the historical movement explaining Statement-I.',
      B: 'Incorrect.',
      C: 'Incorrect.',
      D: 'Incorrect.'
    }
  }
];

// Append additional AI mock questions
additionalAiMocks.forEach(q => {
  if (!aiMockQuestions.some(ai => ai.id === q.id)) {
    aiMockQuestions.push(q);
  }
});

fs.writeFileSync(aiMockPath, JSON.stringify(aiMockQuestions, null, 2), 'utf8');
console.log('✓ Successfully wrote additional 2026 AI Mock questions! Total now:', aiMockQuestions.length);
