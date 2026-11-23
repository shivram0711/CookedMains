const fs = require('fs');
const path = require('path');

const decodeQuestions = [
  {
    id: "ca-2026-dc-001",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Climate Policy & Paris Agreement",
    question: "With reference to India's updated Nationally Determined Contributions (NDCs) for 2035 submitted under the Paris Agreement, consider the following statements:\n1. India has committed to achieve 60% of its cumulative electric power installed capacity from non-fossil fuel-based energy resources by 2035.\n2. India has committed to reduce the emissions intensity of its GDP by 47% by 2035 from the 2005 level.\n3. India has committed to an absolute reduction in its total annual greenhouse gas emissions by 2035.\n4. Progress on these revised NDCs is to be reported periodically through the Biennial Transparency Report (BTR) under the UNFCCC.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "Only three",
      "All four"
    ],
    answer: "Only three",
    correct_index: 2,
    correct_option: "C",
    explanation: "Statements 1, 2, and 4 are correct; Statement 3 is incorrect.\nStatement 1 is correct: In its updated 2035 NDCs (ratified ahead of COP30), India raised its non-fossil installed electricity target to 60% by 2035 (up from 50% by 2030).\nStatement 2 is correct: India committed to reducing emissions intensity of GDP by 47% below 2005 levels by 2035 (up from 45% by 2030 in the 2022 NDC).\nStatement 3 is incorrect: India's climate pledge is based strictly on 'emissions intensity of GDP' rather than absolute emissions reduction, allowing absolute emissions to grow as the developing economy expands towards Net Zero in 2070.\nStatement 4 is correct: Reporting on NDC implementation is channeled through the Biennial Transparency Report (BTR) established under Article 13 of the Paris Agreement.",
    option_analysis: {
      "Option A": "Incorrect. Three statements are correct.",
      "Option B": "Incorrect. Three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 4 are correct; Statement 3 contradicts India's official stance on absolute emissions.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "UNFCCC & Paris Agreement (Article 4 & 13); India's Nationally Determined Contributions (NDCs); Net Zero 2070 Pathway.",
    standard_book_ref: "PMF IAS Environment, 'India and Climate Change: NDCs and Net Zero'; Ministry of Environment, Forest and Climate Change (MoEFCC) Official Submissions to UNFCCC.",
    elimination_trap: "India has never agreed to absolute caps on annual carbon emissions; India's targets are framed around 'emissions intensity' per unit of GDP to safeguard developmental space.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-dc-002",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Glaciology & Himalayan Hazards",
    question: "A recent glaciological assessment flagged the overlooked disaster risk posed by 'hanging glaciers' in the Central Himalayas. In this context, consider the following statements:\n1. Hanging glaciers originate on steep mountain slopes and terminate abruptly at a cliff or break in slope rather than reaching the valley floor.\n2. Accelerated glacial retreat causes the detachment of tributary glaciers from trunk valley glaciers, transforming them into unstable hanging glaciers.\n3. The Alaknanda river basin in Uttarakhand contains over 200 hanging glaciers that pose direct avalanche and glacial outburst flood threats to downstream pilgrimage centers like Badrinath.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: A hanging glacier originates high on a steep mountainside and ends abruptly at a cliff edge or break in slope, shedding ice and snow in avalanches into the valley below.\nStatement 2 is correct: As global warming accelerates trunk glacier thinning and recession, tributary glaciers lose their supporting ice base and become detached, perched hanging glaciers prone to structural collapse (as witnessed in the 2021 Chamoli disaster).\nStatement 3 is correct: Studies in the Alaknanda basin (headstream of Ganga) documented 219 hanging glaciers covering ~72 sq. km, where break-offs can dam river gorges and unleash catastrophic flash floods threatening Badrinath, Hanuman Chatti, and Kedarnath.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. Statements 1, 2, and 3 are all scientifically and geographically valid."
    },
    static_root: "Glacial Geomorphology; Disasters in the Himalayas (GLOFs, Ice Avalanches); Drainage Basin of the Alaknanda River.",
    standard_book_ref: "NCERT Class 11 Physical Geography, 'Landforms and their Evolution'; Wadia Institute of Himalayan Geology Studies.",
    elimination_trap: "Candidates often confuse valley glaciers (which flow continuously down valley floors) with hanging glaciers (which cling to high-angle cliffs and lack ground support).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-003",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Pollution & Waste Management",
    question: "With reference to the Solid Waste Management Rules, 2026, notified in supersession of the Solid Waste Management Rules, 2016, consider the following statements:\n1. The Rules were framed by the Central Government exercising powers principally under Article 253 of the Constitution to implement international environmental declarations.\n2. Solid waste management and sanitation fall within the legislative competence of State Legislatures under the Seventh Schedule.\n3. The 2026 Rules introduce a uniform, identical Material Recovery Facility (MRF) model applicable without distinction across rural Gram Panchayats and coastal megacities.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Environment (Protection) Act, 1986—the umbrella legislation under which waste management rules are issued—was enacted under Article 253 to implement India's commitments under the 1972 Stockholm Declaration.\nStatement 2 is correct: 'Public health and sanitation' and 'Local government' are listed under Entries 5 and 6 of List II (State List) in the Seventh Schedule of the Constitution.\nStatement 3 is incorrect: Environmental jurisprudence and administrative reality criticize mechanical one-size-fits-all mandates; the 2026 framework recognizes differentiated models, prioritizing Metropolitan Waste Management Authorities for megacities and cluster-level composting for rural Gram Panchayats.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are constitutionally accurate; Statement 3 represents an administrative fallacy rejected by decentralised waste models.",
      "Option B": "Incorrect because Statement 3 is false.",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Seventh Schedule Legislative Lists (State List vs Union List); Article 253 & Environment Protection Act 1986; Municipal Solid Waste Management.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Centre-State Legislative Relations'; Shankar IAS Environment, 'Solid Waste Management'.",
    elimination_trap: "Watch out for extreme centralization assertions—local government is constitutionally a State subject, requiring the application of the principle of subsidiarity.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-004",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Extended Producer Responsibility (EPR)",
    question: "Under the amended Plastic Waste Management Rules regarding Extended Producer Responsibility (EPR), consider the following statements:\n1. Companies are permitted to carry forward unfulfilled plastic recycling targets for the year 2025–26 for up to three subsequent financial years.\n2. The rules introduce tradable recycling certificates, enabling producers to purchase recycling credits from registered recyclers.\n3. Rigid plastic packaging (Category I) is mandated to contain at least 30% recycled content by 2025–26, increasing to 60% by 2028–29.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three statements are correct.\nStatement 1 is correct: The Ministry of Environment, Forest and Climate Change (MoEFCC) allowed producers, importers, and brand owners (PIBOs) to carry forward unmet recycling shortfalls from 2025-26 over the next 3 years, provided at least one-third of the carried-forward target is fulfilled each year.\nStatement 2 is correct: A market-based credit system was established where PIBOs can buy formal tradable recycling certificates generated by accredited recyclers to meet EPR compliance.\nStatement 3 is correct: Under Category I (rigid plastic containers like PET and HDPE bottles), the minimum recycled plastic content target was fixed at 30% for 2025-26, escalating progressively to 60% by 2028-29.",
    option_analysis: {
      "Option A": "Incorrect. All three statements are correct.",
      "Option B": "Incorrect. All three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 3 accurately capture the amended EPR plastic waste regulations.",
      "Option D": "Incorrect."
    },
    static_root: "Plastic Waste Management Rules; Extended Producer Responsibility (EPR); Circular Economy in Plastics.",
    standard_book_ref: "PMF IAS Environment, 'Pollution: Plastics and Solid Waste'; CPCB Guidelines on EPR for Plastic Packaging.",
    elimination_trap: "Do not confuse Category I (Rigid - 30% recycled content) with Category II (Flexible - 10% recycled content) or Category III (Multi-layered - 5% recycled content).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-dc-005",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Marine Conservation & Microplastics",
    question: "A pioneering study on microplastic pollution in the Sundarbans mangrove delta revealed that microplastics act as a novel carbon reservoir. In this context, what is a 'Plastisphere'?\n(a) An artificial dome used in botanical gardens to protect endangered halophytes\n(b) A synthetic microbial ecosystem and biofilm that forms on the surface of discarded plastic debris in aquatic environments\n(c) The layer of the stratosphere where microplastic particles concentrate due to jet streams\n(d) A biodegradable bioplastic substitute derived from mangrove pneumatophores",
    options: [
      "An artificial dome used in botanical gardens to protect endangered halophytes",
      "A synthetic microbial ecosystem and biofilm that forms on the surface of discarded plastic debris in aquatic environments",
      "The layer of the stratosphere where microplastic particles concentrate due to jet streams",
      "A biodegradable bioplastic substitute derived from mangrove pneumatophores"
    ],
    answer: "A synthetic microbial ecosystem and biofilm that forms on the surface of discarded plastic debris in aquatic environments",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe term 'Plastisphere' refers to the distinct, novel ecological community and complex biofilm of microorganisms (bacteria, fungi, microalgae, and pathogens) that colonize and inhabit the surfaces of human-made plastic debris floating in marine and estuarine environments. In the Sundarbans, plastispheres break down plastics into nanoplastics, release dissolved organic carbon (DOC), and generate biogenic carbon that alters natural blue-carbon sequestration in mangrove sediments.",
    option_analysis: {
      "Option A": "Incorrect. Plastisphere is an ecological microbiological concept, not a glasshouse structure.",
      "Option B": "Correct. It defines the microbial ecosystem thriving on aquatic plastic waste.",
      "Option C": "Incorrect. Microplastics do not form an atmospheric layer termed plastisphere.",
      "Option D": "Incorrect. It is not an alternative biopolymer product."
    },
    static_root: "Marine Pollution; Microplastics and Nanoplastics; Mangrove Blue Carbon Ecosystems.",
    standard_book_ref: "PMF IAS Environment, 'Marine Pollution & Blue Carbon'; Down to Earth Ecological Features.",
    elimination_trap: "The suffix '-sphere' often misleads aspirants into thinking of an atmospheric or terrestrial layer (like troposphere/lithosphere); here it denotes the living microbial habitat on plastic surfaces.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-006",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "Riverine Protected Areas & Mining",
    question: "The National Chambal Gharial Sanctuary, which recently saw heightened judicial intervention against illegal sand mining, spans which of the following States of India?\n(a) Rajasthan, Madhya Pradesh, and Gujarat\n(b) Rajasthan, Madhya Pradesh, and Uttar Pradesh\n(c) Madhya Pradesh, Uttar Pradesh, and Bihar\n(d) Rajasthan, Haryana, and Uttar Pradesh",
    options: [
      "Rajasthan, Madhya Pradesh, and Gujarat",
      "Rajasthan, Madhya Pradesh, and Uttar Pradesh",
      "Madhya Pradesh, Uttar Pradesh, and Bihar",
      "Rajasthan, Haryana, and Uttar Pradesh"
    ],
    answer: "Rajasthan, Madhya Pradesh, and Uttar Pradesh",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe National Chambal Sanctuary (also called the National Chambal Gharial Wildlife Sanctuary) is a 5,400 sq. km tri-state protected area co-administered by Rajasthan, Madhya Pradesh, and Uttar Pradesh along a 425-km stretch of the Chambal River. It protects the critically endangered Gharial (Gavialis gangeticus), the red-crowned roofed turtle (Batagur kachuga), and the endangered Ganges river dolphin (Platanista gangetica), all of which depend critically on pristine river sandbanks that are devastated by illegal sand extraction.",
    option_analysis: {
      "Option A": "Incorrect. Gujarat does not share the Chambal River basin.",
      "Option B": "Correct. National Chambal Sanctuary is situated across the tri-junction of Rajasthan, Madhya Pradesh, and Uttar Pradesh.",
      "Option C": "Incorrect. Bihar is not part of the National Chambal Sanctuary.",
      "Option D": "Incorrect. Haryana is not a Chambal riparian state."
    },
    static_root: "Protected Areas of India; Aquatic Wildlife (Gharial, Gangetic Dolphin); Inter-state River Sanctuaries.",
    standard_book_ref: "PMF IAS Environment, 'Reptiles & Aquatic Animals of India'; WII Wildlife Sanctuaries Directory.",
    elimination_trap: "Chambal joins the Yamuna in Etawah district, Uttar Pradesh; it flows from MP through Rajasthan and into UP, never touching Bihar or Gujarat.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-007",
    year: 2026,
    month: "May 2026",
    subject: "Geography & Places in News",
    question: "With reference to the mega-infrastructure development project on the 'Great Nicobar Island' (GNI), consider the following statements:\n1. The project includes an International Container Transhipment Port (ICTP) located at Galathea Bay.\n2. Galathea Bay is a globally significant nesting site for the giant leatherback sea turtle (Dermochelys coriacea).\n3. The project area overlaps with the ancestral foraging and living territories of the Shompen, a Particularly Vulnerable Tribal Group (PVTG).\n4. Great Nicobar Island is situated at the eastern exit of the Strait of Malacca.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "Only three",
      "All four"
    ],
    answer: "Only three",
    correct_index: 2,
    correct_option: "C",
    explanation: "Statements 1, 2, and 3 are correct; Statement 4 is incorrect.\nStatement 1 is correct: The ₹92,000-crore holistic development plan anchors a transshipment port at Galathea Bay, a greenfield international airport, and a power plant.\nStatement 2 is correct: Galathea Bay on Great Nicobar is one of the world's most critical nesting grounds for the Giant Leatherback Turtle (the world's largest living turtle, Vulnerable IUCN).\nStatement 3 is correct: Great Nicobar is home to two indigenous tribes: the nomadic forest-dwelling Shompen (a PVTG) and the coastal Nicobarese.\nStatement 4 is incorrect: Great Nicobar is situated at the WESTERN entrance/approach of the Malacca Strait (controlling the Six Degree Channel), NOT the eastern exit (which opens into the South China Sea near Singapore).",
    option_analysis: {
      "Option A": "Incorrect. Three statements are correct.",
      "Option B": "Incorrect. Three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 3 are correct; statement 4 confuses the western entry with eastern exit.",
      "Option D": "Incorrect because statement 4 is geographically false."
    },
    static_root: "Island Territories of India (Andaman & Nicobar); Maritime Chokepoints (Six Degree Channel, Malacca Strait); Particularly Vulnerable Tribal Groups (PVTGs).",
    standard_book_ref: "NCERT Class 11 India: Physical Environment; Majid Husain, Geography of India.",
    elimination_trap: "Six Degree Channel separates Indira Point (Great Nicobar) from Aceh (Sumatra, Indonesia), guarding the western entryway into Malacca.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-dc-008",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Tribal Rights & Forest Governance",
    question: "In a landmark judgment concerning the Tharu tribal community under the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 (FRA), the High Court ruled on the legal effect of conflicting prior judicial orders. In this context, consider the following statements:\n1. Section 4(1) of the FRA vests forest rights in forest dwellers 'notwithstanding anything contained in any other law for the time being in force'.\n2. The District Level Committee (DLC) under the FRA is statutorily empowered to summarily reject forest rights claims without recording reasons or notifying the Gram Sabha.\n3. The FRA recognizes grazing rights of pastoral communities across all forest categories, including National Parks and Tiger Reserves.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: The FRA contains an express non-obstante clause in Section 4(1), giving its statutory recognition of forest rights overriding legal primacy over earlier state forest acts and restrictive prior executive or judicial orders.\nStatement 2 is incorrect: The Gram Sabha is the primary statutory recommending authority. Under Rule 12A of the FRA Rules, the DLC cannot arbitrarily reject claims; it must give reasonable opportunity, record reasons in writing, and refer cases back with grounds.\nStatement 3 is correct: Section 3(1)(d) of the FRA explicitly includes community rights of uses such as grazing (both settled and transhumant) and traditional seasonal resource access in all forests, including wildlife sanctuaries and national parks.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is legally false.",
      "Option B": "Correct. Statements 1 and 3 are correct.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Forest Rights Act, 2006 (FRA); Gram Sabha Powers; Non-obstante Clauses in Indian Statutes.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Scheduled and Tribal Areas'; Bare Act of FRA 2006.",
    elimination_trap: "A common misconception is that National Parks completely exclude traditional grazing rights; under the FRA 2006, traditional grazing rights of pastoralist tribes are legally recognized until Critical Wildlife Habitats are scientifically settled.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-009",
    year: 2026,
    month: "May 2026",
    subject: "International Relations",
    sub_topic: "Transboundary Rivers & Neighborhood",
    question: "With reference to the 'Ganga Water Treaty' of 1996 between India and Bangladesh, which approaches its 30-year renewal deadline in 2026, consider the following statements:\n1. The treaty establishes a formula for sharing the lean-season surface flows of the Ganga at Farakka Barrage between January 1 and May 31 each year.\n2. Under the treaty, if the water flow at Farakka falls below 50,000 cusecs, the entire flow is mandatorily allocated to Bangladesh.\n3. The treaty directly supports the freshwater requirements of the Ganges-Kobadak (G-K) irrigation project in southwestern Bangladesh.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: Signed on December 12, 1996 for a 30-year duration (expiring December 2026), the treaty governs the sharing of dry-season waters (January 1 to May 31) measured at Farakka Barrage.\nStatement 2 is incorrect: Under the formula, if water flow is between 70,000 and 75,000 cusecs, each side receives a fixed allocation. If flow drops below 50,000 cusecs, the treaty mandates that the two governments enter into immediate consultations on a basis of equity and mutual friendship, rather than automatically diverting 100% to Bangladesh.\nStatement 3 is correct: Bangladesh relies on water released from Farakka entering the Padma to feed the Ganges-Kobadak (G-K) project, the largest irrigation scheme in southwestern Bangladesh.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is factually and legally wrong.",
      "Option B": "Correct. Statements 1 and 3 are correct.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "India-Bangladesh Bilateral Relations; Farakka Barrage & Ganga Drainage Basin; Transboundary Water Diplomacy.",
    standard_book_ref: "Rajiv Sikri, Challenge and Strategy: Rethinking India's Foreign Policy; Ministry of Jal Shakti Joint Rivers Commission.",
    elimination_trap: "The 1996 treaty guarantees 50-50 sharing in certain flow bands and 35,000 cusecs in 10-day alternating cycles, but below 50,000 cusecs it calls for emergency bilateral consultations, not unilateral diversion.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-010",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Trade Agreements & Gulf Economics",
    question: "The India–Oman Comprehensive Economic Partnership Agreement (CEPA), which came into force on June 1, 2026, holds strategic economic significance for India. In this context, consider the following statements:\n1. Oman has offered immediate duty-free market access on over 98% of its tariff lines covering nearly 99% of India's export value.\n2. Sensitive domestic sectors like dairy, cereals, and edible oils are completely excluded from Indian tariff concessions.\n3. The agreement facilitates Indian logistics access to Omani deep-water ports like Sohar, Duqm, and Salalah, which bypass the maritime chokepoint of the Strait of Hormuz.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Under the Oman CEPA, Oman provided zero-duty entry on 98.08% of tariff lines (covering 99.38% of Indian exports by value), benefiting textiles, engineering goods, and chemicals.\nStatement 2 is correct: India's negative list strictly shielded sensitive domestic agricultural sectors, keeping fluid milk, cheese, edible oils, and food grains outside tariff cuts.\nStatement 3 is correct: Oman's ports at Sohar, Duqm, and Salalah open into the Gulf of Oman and Arabian Sea, providing crucial alternative trade corridors that remain operable even when the Strait of Hormuz is blockaded.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all accurate."
    },
    static_root: "India's Free Trade Agreements (FTAs/CEPAs); Strategic Geography of the Persian Gulf & Gulf of Oman; Agricultural Safeguards in Trade.",
    standard_book_ref: "Ministry of Commerce and Industry Official CEPA Briefings; Ramesh Singh, Indian Economy.",
    elimination_trap: "Duqm Port gives India strategic naval and commercial berths directly on the Indian Ocean, bypassing both Hormuz and Bab-el-Mandeb.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-011",
    year: 2026,
    month: "June 2026",
    subject: "History, Art & Culture",
    sub_topic: "Ancient & Medieval Inscriptions",
    question: "The repatriation of the 11th-century 'Anaimangalam Copper Plates' (popularly known as the Leiden Plates) from the Netherlands to India is a landmark cultural event. With reference to these copper plates, consider the following statements:\n1. They record the grant of village revenues to the Buddhist Chudamanivarma Vihara in Nagapattinam by the Chola king Raja Raja Chola I.\n2. The vihara was constructed by the Sailendra dynasty ruler Sri Mara Vijayotunga Varman of Srivijaya (Sumatra/Java).\n3. The royal insignia binding the plates features the Chola Tiger alongside the Pandya Fish and the Chera Bow, symbolizing Chola paramountcy over the other two Tamil dynasties.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: The larger Leiden plates record that Raja Raja Chola I (985–1014 CE) issued an order granting the village of Anaimangalam to maintain the Buddha vihara (Raja Raja Cholan Perumpalli) at Nagapattinam, which was committed to writing on copper plates by his son Rajendra Chola I in Sanskrit and Tamil.\nStatement 2 is correct: The vihara was built by King Sri Mara Vijayotungavarman of the Sailendra dynasty of Srivijaya (modern Indonesia), named in honour of his father Chudamanivarman.\nStatement 3 is correct: The copper plates are strung on a massive bronze ring stamped with the royal seal of the Cholas depicting a seated tiger (Chola emblem) flanked by two fish (Pandya emblem) and a bow (Chera emblem), topped with a parasol and fly-whisks, proclaiming Chola victory over its rivals.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all historically authentic."
    },
    static_root: "Imperial Cholas (Raja Raja I & Rajendra I); Maritime Ties between India and Southeast Asia (Srivijaya); Epigraphy and Numismatics.",
    standard_book_ref: "K.A. Nilakanta Sastri, The Colas; R.C. Majumdar, Ancient India; Nitin Singhania, Indian Art and Culture.",
    elimination_trap: "Raja Raja Chola I was a devout Saivite (builder of Brihadisvara Temple, Thanjavur), yet he extended royal state patronage to a Buddhist monastery built by a Southeast Asian monarch, illustrating religious harmony.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-012",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Polar Affairs & Arctic Geopolitics",
    question: "With reference to India's scientific and strategic engagements in the Arctic region, consider the following statements:\n1. India established its permanent research station 'Himadri' at Ny-Ålesund, Spitsbergen, Svalbard (Norway) in 2008.\n2. 'IndARC' is India's first multi-sensor moored underwater observatory deployed in the Kongsfjorden fjord of the Arctic.\n3. India is a permanent voting member of the Arctic Council with decision-making veto rights under the Ottawa Declaration.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: India's Arctic research station 'Himadri' was inaugurated in July 2008 at the international research base in Ny-Ålesund, Svalbard, Norway.\nStatement 2 is correct: In 2014, India deployed IndARC, an underwater moored observatory in Kongsfjorden (halfway between Norway and the North Pole), to collect oceanographic and climate data.\nStatement 3 is incorrect: Under the 1996 Ottawa Declaration, only the eight circumpolar Arctic littoral states (Canada, Denmark, Finland, Iceland, Norway, Russia, Sweden, and the US) are permanent voting members. India was granted 'Observer' status in 2013 and has no voting or veto rights in the Council.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate; Statement 3 falsely claims permanent member status.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "India's Arctic Policy; Arctic Council Structure (Ottawa Declaration 1996); Polar Research Stations (Himadri, Bharati, Maitri).",
    standard_book_ref: "Ministry of Earth Sciences (MoES) Polar Programmes; PMF IAS Environment.",
    elimination_trap: "India is an Observer in the Arctic Council (like China, Japan, and South Korea). Only Arctic rim nations hold permanent council membership.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-013",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "Energy Cartels & Geopolitics",
    question: "The decision of the United Arab Emirates (UAE) to withdraw from OPEC and OPEC+ marks a historic realignment in global energy geopolitics. In this context, consider the following statements:\n1. The UAE was a founding member of OPEC when the organization was established in Baghdad in 1960.\n2. The UAE's Habshan–Fujairah oil pipeline enables crude oil exports directly into the Gulf of Oman, bypassing the Strait of Hormuz.\n3. OPEC+ was established in 2016 to coordinate production decisions between OPEC members and ten non-OPEC oil-producing countries, including Russia.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 2 and 3 are correct; Statement 1 is incorrect.\nStatement 1 is incorrect: OPEC was founded in September 1960 by five founding nations: Iran, Iraq, Kuwait, Saudi Arabia, and Venezuela. The UAE joined OPEC later in 1967.\nStatement 2 is correct: The Abu Dhabi Crude Oil Pipeline (ADCOP), running from Habshan to Fujairah Port, has a capacity of 1.5 million barrels per day, allowing Emirati crude to be pumped across the Hajar mountains directly to the Indian Ocean without traversing the Strait of Hormuz.\nStatement 3 is correct: OPEC+ was formed in late 2016 (Vienna Agreement) comprising the 13 OPEC members and 10 non-OPEC nations (led by Russia, Kazakhstan, and Mexico) to stabilize prices against U.S. shale competition.",
    option_analysis: {
      "Option A": "Incorrect because Statement 1 is historically wrong.",
      "Option B": "Correct. Statements 2 and 3 are correct.",
      "Option C": "Incorrect because Statement 1 is false.",
      "Option D": "Incorrect because Statement 1 is false."
    },
    static_root: "OPEC and OPEC+ Architecture; Global Crude Oil Pipelines & Chokepoint Bypasses; West Asian Geopolitics.",
    standard_book_ref: "Daniel Yergin, The Prize: The Epic Quest for Oil, Money, and Power; Oxford Student Atlas.",
    elimination_trap: "Remember the 5 founding members of OPEC in 1960: Iran, Iraq, Kuwait, Saudi Arabia, Venezuela (mnemonic: SKI-IV or VISAK). UAE joined 7 years later in 1967.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-014",
    year: 2026,
    month: "June 2026",
    subject: "International Relations",
    sub_topic: "United Nations Architecture",
    question: "With reference to the election and constitutional powers of the Secretary-General of the United Nations under the UN Charter, consider the following statements:\n1. The Secretary-General is designated by the UN Charter as the Chief Administrative Officer of the Organization.\n2. Under Article 99 of the UN Charter, the Secretary-General may bring to the attention of the Security Council any matter which in his opinion may threaten international peace and security.\n3. The Secretary-General is elected directly by a two-thirds majority vote of the UN General Assembly without any prior recommendation from the Security Council.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Article 97 of the UN Charter specifies that the Secretariat shall comprise a Secretary-General and such staff as the Organization may require, with the Secretary-General acting as Chief Administrative Officer.\nStatement 2 is correct: Article 99 grants the Secretary-General unique political initiative, empowering him to independently refer any crisis threatening global peace to the Security Council.\nStatement 3 is incorrect: Under Article 97, the Secretary-General is appointed by the General Assembly upon the formal recommendation of the Security Council. In practice, any of the five Permanent Members (P5) can veto a candidate in the Security Council before the name reaches the General Assembly.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 ignores the mandatory Security Council recommendation and P5 veto.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "United Nations Charter (Articles 97, 98, 99); Structure of the UN Secretariat; Security Council Voting Procedures.",
    standard_book_ref: "Pushpesh Pant, International Relations in the 21st Century; Malcolm Shaw, International Law.",
    elimination_trap: "The General Assembly cannot appoint a UN Secretary-General unilaterally; it can only vote on a candidate formally recommended by the Security Council.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-015",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Anti-Defection Law & Parliamentary Law",
    question: "In Registrar Cane Cooperative Societies vs Gurdeep Singh Narval (2026), the Supreme Court reiterated the constitutional principle that a 'legal fiction' must be strictly confined to its enacted purpose. In the context of the Tenth Schedule (Anti-Defection Law), how does the 'deeming fiction' under Paragraph 4(2) operate?\n(a) It deems an independent legislator to have joined a political party upon appointment as a Union Minister\n(b) It deems a merger of the original political party to have taken place only if not less than two-thirds of the members of the legislature party agree to such merger\n(c) It deems any expelled party member to remain bound by the party whip during floor votes\n(d) It deems the Speaker's decision on disqualification to be immune from judicial review",
    options: [
      "It deems an independent legislator to have joined a political party upon appointment as a Union Minister",
      "It deems a merger of the original political party to have taken place only if not less than two-thirds of the members of the legislature party agree to such merger",
      "It deems any expelled party member to remain bound by the party whip during floor votes",
      "It deems the Speaker's decision on disqualification to be immune from judicial review"
    ],
    answer: "It deems a merger of the original political party to have taken place only if not less than two-thirds of the members of the legislature party agree to such merger",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nParagraph 4(1) of the Tenth Schedule provides that disqualification does not apply where a member's 'original political party' merges with another party. Paragraph 4(2) creates a statutory legal fiction (deeming fiction): it states that for the purposes of Paragraph 4(1), the merger of the original political party shall be 'deemed' to have taken place if, and only if, not less than two-thirds of the members of the legislature party concerned have agreed to such merger. The Supreme Court has repeatedly examined whether legislators can engineer a merger solely by themselves without any actual merger of the overarching political party organization.",
    option_analysis: {
      "Option A": "Incorrect. Independent members are governed by Paragraph 6/Article 102/Paragraph 2(2).",
      "Option B": "Correct. Paragraph 4(2) explicitly deems a party merger to have occurred when two-thirds of the elected legislators consent.",
      "Option C": "Incorrect. Whip application to expelled members arose in G. Viswanathan (1996), not under deeming fiction of para 4(2).",
      "Option D": "Incorrect. Paragraph 7 barred judicial review, but was struck down in Kihoto Hollohan (1992)."
    },
    static_root: "Tenth Schedule (52nd Constitutional Amendment Act 1985 & 91st Amendment Act 2003); Legal Fictions in Constitutional Law; Kihoto Hollohan Judgment.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Anti-Defection Law'; D.D. Basu, Introduction to the Constitution of India.",
    elimination_trap: "Candidates often confuse the 'legislature party' (the elected MLAs/MPs in the House) with the 'original political party' (the registered political party outside the House).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-dc-016",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Constitutional Law & Citizenship",
    question: "With reference to the legal status of an Indian Passport and proof of Indian citizenship, consider the following statements:\n1. An Indian passport is an official travel document, but under Indian jurisprudence it is not conclusive, irrebuttable proof of citizenship.\n2. Under Section 20 of the Passports Act, 1967, the Central Government has the statutory power to issue a passport or travel document to a person who is not a citizen of India.\n3. The Constitution of India provides for a single citizenship for the whole of India, with no separate state citizenship.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: As clarified by the Ministry of External Affairs and affirmed by the Supreme Court in State of AP v. Abdul Khader (1962), a passport is prima facie evidence of nationality for travel purposes, but does not conclusively determine citizenship where nationality is disputed under the Citizenship Act, 1955.\nStatement 2 is correct: Section 20 of the Passports Act, 1967 explicitly empowers the Union Government to issue passports or emergency certificates to non-citizens (such as Tibetan refugees or stateless persons) if considered necessary in the public interest.\nStatement 3 is correct: Unlike federal systems like the US, Article 9 and Article 5 of the Indian Constitution establish uniform single citizenship for all citizens irrespective of the State of their domicile.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also true.",
      "Option B": "Incorrect because Statement 1 is also true.",
      "Option C": "Incorrect because Statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all legally and constitutionally sound."
    },
    static_root: "Citizenship (Articles 5 to 11); Passports Act, 1967; Single Citizenship vs Dual Citizenship.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Citizenship'; D.D. Basu, Shorter Constitution of India.",
    elimination_trap: "Many aspirants assume a passport can only ever be issued to a citizen of India; Section 20 of the Passports Act 1967 explicitly allows issuance to non-citizens.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-dc-017",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Fundamental Rights & Public Commons",
    question: "In Maniyar Iliyaz v. P. Ayyappan (2026), the Supreme Court ruled on the constitutional status of pedestrian infrastructure in Indian cities. In this context, consider the following statements:\n1. The right to walk on safe, continuous, and unobstructed footpaths is an integral facet of the Right to Life under Article 21.\n2. Article 39(b) of the Directive Principles of State Policy mandates that urban road space, being a material resource of the community, must not be monopolized solely by the motorized vehicular class.\n3. The Motor Vehicles Act, 1988 contains a comprehensive, standalone statutory code guaranteeing pedestrian right-of-way over motorized transport.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Supreme Court elevated pedestrian rights, holding that safe footpaths are essential to dignity, safe mobility, and the right to life under Article 21.\nStatement 2 is correct: The Court invoked Article 39(b) (distribution of material resources of the community to subserve the common good), observing that public road corridors cannot be usurped exclusively by private cars while pedestrians are pushed into hazardous traffic.\nStatement 3 is incorrect: The Supreme Court highlighted that India currently lacks a dedicated national pedestrian law, as the Motor Vehicles Act, 1988 is overwhelmingly vehicle-centric, recommending that Parliament enact a dedicated statutory framework with an independent pedestrian regulator.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 incorrectly claims the Motor Vehicles Act already protects pedestrians.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Right to Life & Personal Liberty (Article 21 expanded horizons); Directive Principles of State Policy (Article 39(b)); Urban Public Commons.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapters on 'Fundamental Rights' and 'Directive Principles of State Policy'.",
    elimination_trap: "The lack of pedestrian rights in the Motor Vehicles Act 1988 was the exact reason the Supreme Court called for new legislation.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-018",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Fiscal Federalism & Finance Commission",
    question: "With reference to the recommendations of the 16th Finance Commission regarding horizontal tax devolution among States, consider the following statements:\n1. 'Income distance' continues to command the highest individual weightage in the horizontal devolution formula.\n2. The Commission introduced a new criterion evaluating 'States' contribution to national GDP' with a weight of 10%, replacing the erstwhile 'tax effort' criterion.\n3. Cesses and surcharges levied by the Union Government have been formally brought into the divisible tax pool.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: In the horizontal sharing matrix of the 16th FC, 'Income distance' retains the highest weight at 42.5% to ensure fiscal equalization for poorer states.\nStatement 2 is correct: Responding to representations from economically dynamic southern and western States, the Commission incorporated a 10% weight for 'Contribution to National GDP' to reward economic growth and productivity, replacing the earlier 2.5% tax effort metric.\nStatement 3 is incorrect: Under Article 270 and Article 271 of the Constitution, cesses and surcharges are levied for specific purposes and remain outside the divisible tax pool; the 16th FC did not include them in the divisible pool despite requests from several States.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is constitutionally false.",
      "Option B": "Incorrect because Statement 3 is wrong.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Finance Commission (Article 280); Divisible Pool of Taxes (Article 270); Horizontal vs Vertical Devolution Formulae.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Finance Commission'; Ramesh Singh, Indian Economy.",
    elimination_trap: "Cesses and surcharges can only be shared if the Constitution (Articles 270 and 271) is amended by Parliament; a Finance Commission cannot unilaterally include them in the divisible pool.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-dc-019",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Election Commission of India",
    question: "Under the Chief Election Commissioner and Other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2023, consider the following statements:\n1. The Selection Committee consists of the Prime Minister as Chairperson, the Leader of the Opposition in the Lok Sabha, and the Chief Justice of India.\n2. A Search Committee headed by the Union Minister of Law and Justice prepares a panel of five persons for consideration by the Selection Committee.\n3. The Selection Committee is empowered to consider persons other than those included in the panel prepared by the Search Committee.\n4. An appointment of the CEC or an EC cannot be called into question merely on the ground of any vacancy in, or defect in the constitution of, the Selection Committee.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "Only three",
      "All four"
    ],
    answer: "Only three",
    correct_index: 2,
    correct_option: "C",
    explanation: "Statements 2, 3, and 4 are correct; Statement 1 is incorrect.\nStatement 1 is incorrect: Under Section 7 of the 2023 Act, the Selection Committee comprises the Prime Minister (Chairperson), the Leader of the Opposition (or leader of largest opposition party) in Lok Sabha, and a Union Cabinet Minister nominated by the Prime Minister. The Chief Justice of India (who was included in the interim committee under the Anoop Baranwal judgment) was excluded from the statutory committee.\nStatement 2 is correct: Section 6 mandates that the Search Committee, headed by the Minister of Law and Justice and comprising two senior secretaries, prepares a panel of five candidates.\nStatement 3 is correct: Section 8(2) explicitly provides that the Selection Committee may also consider any other person who was not shortlisted by the Search Committee.\nStatement 4 is correct: Section 7(2) shields appointments from challenge on grounds of any vacancy or procedural defect in the Selection Committee.",
    option_analysis: {
      "Option A": "Incorrect. Three statements are correct.",
      "Option B": "Incorrect. Three statements are correct.",
      "Option C": "Correct. Statements 2, 3, and 4 are correct; Statement 1 reflects the Anoop Baranwal interim formula, not the 2023 statute.",
      "Option D": "Incorrect because Statement 1 is false."
    },
    static_root: "Election Commission of India (Article 324); CEC and ECs Appointment Act 2023; Anoop Baranwal v. Union of India (2023).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Election Commission'; Bare Act of CEC and ECs Act 2023.",
    elimination_trap: "UPSC classic trap: the 2023 Act specifically replaced the Chief Justice of India with a Union Cabinet Minister nominated by the Prime Minister.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-dc-020",
    year: 2026,
    month: "June 2026",
    subject: "Science & Technology",
    sub_topic: "Criminalistics & Biometrics",
    question: "With reference to the Criminal Procedure (Identification) Act, 2022 (CrPI Act) and the National Automated Fingerprint Identification System (NAFIS), consider the following statements:\n1. The Act authorizes the collection of biological samples, including blood, saliva, and DNA profiles, from persons arrested for offenses punishable under any law.\n2. The record of measurements taken under the Act can be retained in digital database form for a period of up to 75 years from the date of collection.\n3. The Central Bureau of Investigation (CBI) is the sole statutory nodal agency mandated to store, preserve, and share measurement records across all States.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Section 2(1)(b) and Section 3 of the CrPI Act permit police and prison officers to collect 'measurements', defined expansively to include finger impressions, palm prints, iris/retina scans, physical and biological samples (blood, semen, hair, saliva) and behavioral attributes.\nStatement 2 is correct: Under Section 4(2) of the Act, measurements shall be retained in digital or electronic form for a period of seventy-five years from the date of collection.\nStatement 3 is incorrect: The National Crime Records Bureau (NCRB)—NOT the CBI—is the designated nodal agency responsible for storing, processing, preserving, and sharing measurement records and integrating them with NAFIS.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 misidentifies the agency as CBI instead of NCRB.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is wrong.",
      "Option D": "Incorrect because Statement 3 is wrong."
    },
    static_root: "Criminal Procedure (Identification) Act, 2022; Right to Privacy (K.S. Puttaswamy); Role of National Crime Records Bureau (NCRB).",
    standard_book_ref: "M. Laxmikanth, Indian Polity; Ministry of Home Affairs Annual Report; CrPI Rules 2022.",
    elimination_trap: "NAFIS and the national crime identification repository are anchored directly under NCRB (Ministry of Home Affairs), not CBI or NIA.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out any existing decode questions if already present
const cleanExisting = existing.filter(q => !q.id.startsWith('ca-2026-dc-'));
const combined = [...cleanExisting, ...decodeQuestions];

// Normalize all fields
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
console.log(`Successfully ingested ${decodeQuestions.length} Decode Civils questions!`);
console.log(`Total questions in repository now: ${normalized.length}`);
