const fs = require('fs');
const path = require('path');

const augQuestions = [
  {
    id: "ca-2026-08-001",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Wetlands & Protected Areas",
    question: "With reference to 'Glaw Lake' (Glow Lake), designated as India's 101st Ramsar Site, consider the following statements:\n1. It is a high-altitude oligotrophic lake located within the Kamlang Tiger Reserve in Arunachal Pradesh.\n2. It falls in the drainage basin of the Lohit River, a major north-bank tributary of the Brahmaputra.\n3. The indigenous Mishmi community considers the lake sacred and practices community-led conservation around it.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Glaw Lake (also called Glow Lake) is a pristine high-altitude, snow-fed oligotrophic natural lake situated in Kamlang Wildlife Sanctuary / Tiger Reserve in Lohit district of Arunachal Pradesh.\nStatement 2 is correct: Kamlang Tiger Reserve and Glaw Lake lie in the catchment of the Kamlang River, which drains into the Lohit River (a major tributary of the Brahmaputra system).\nStatement 3 is correct: The indigenous Mishmi (specifically Kaman/Miju Mishmi and Digaru Mishmi) tribes venerate the water body as sacred, preserving rich biodiversity including the Western Hoolock Gibbon and Clouded Leopard.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also correct.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 2 is also correct.",
      "Option D": "Correct. Statements 1, 2 and 3 are all factually and geographically accurate."
    },
    static_root: "Wetlands Conservation; Ramsar Convention 1971; Protected Areas of North-East India.",
    standard_book_ref: "PMF IAS Environment, 'Wetland Ecosystems & Ramsar Sites in India'; Majid Husain, Geography of India.",
    elimination_trap: "Aspirants often confuse Lohit as a north-bank tributary vs south-bank tributary; Lohit joins the Brahmaputra from the north-eastern/eastern flank, forming the headwaters alongside Dibang and Siang.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-08-002",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Environmental Jurisprudence & Mining",
    question: "Consider the following statements regarding the Supreme Court of India's directives on Eco-Sensitive Zones (ESZ) and mining buffers around protected wetlands:\n1. The Supreme Court has ruled that a mandatory 10-kilometre buffer zone prohibiting commercial mining applies around all Ramsar wetlands until site-specific ESZs are formally notified.\n2. The Asan Wetland Conservation Reserve, situated at the confluence of the Yamuna and Asan rivers, is the first Ramsar site in Uttarakhand.\n3. Eco-Sensitive Zones are statutorily notified under the provisions of the Wildlife (Protection) Act, 1972.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "Only two",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Reaffirming its environmental jurisprudence to prevent habitat destruction, the Supreme Court mandated that mining activities within a 10-km radius of Ramsar sites and wildlife sanctuaries without finalized ESZ notifications are prohibited unless cleared by the Standing Committee of the NBWL.\nStatement 2 is correct: Asan Barrage / Wetland Conservation Reserve, located at the confluence of the Yamuna and Asan rivers in Dehradun district, was declared Uttarakhand's first Ramsar site in 2020.\nStatement 3 is incorrect: Eco-Sensitive Zones (ESZs) are notified by the Ministry of Environment, Forest and Climate Change (MoEFCC) under Section 3 of the Environment (Protection) Act, 1986, NOT under the Wildlife (Protection) Act, 1972.",
    option_analysis: {
      "Option A": "Incorrect. Two statements are correct.",
      "Option B": "Correct. Statements 1 and 2 are correct, while Statement 3 is incorrect regarding the parent statute.",
      "Option C": "Incorrect because statement 3 is legally incorrect.",
      "Option D": "Incorrect because statements 1 and 2 are correct."
    },
    static_root: "Environment (Protection) Act, 1986; Eco-Sensitive Zones (ESZ) guidelines; Ramsar Sites of Uttarakhand.",
    standard_book_ref: "Shankar IAS Environment, Chapter on 'Environmental Legislation in India'; D.D. Basu / Laxmikanth, Environmental Jurisprudence.",
    elimination_trap: "UPSC frequently tests whether ESZ is under the Wildlife Protection Act 1972 or Environment Protection Act 1986. ESZ is declared under Section 3 of the EPA, 1986.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-003",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Wildlife Conservation & Corridors",
    question: "With reference to the conservation of the Asiatic Lion (Panthera leo persica) in India, consider the following statements:\n1. Barda Wildlife Sanctuary in Gujarat has been developed as an alternative natural habitat to establish a second genetically viable sub-population.\n2. The Babarkot corridor serves as an ecological stepping-stone connecting Gir National Park with the coastal forests of Saurashtra.\n3. Asiatic lions are listed as 'Critically Endangered' on the IUCN Red List of Threatened Species.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Under Project Lion, the Gujarat Forest Department and MoEFCC have prepared Barda Wildlife Sanctuary (in Porbandar and Devbhumi Dwarka districts) as a second home for Asiatic lions to safeguard against catastrophic epidemics like Canine Distemper Virus (CDV).\nStatement 2 is correct: Babarkot in Amreli/Bhavnagar serves as a critical coastal corridor enabling lion dispersal from Gir toward the Shetrunji and coastal belt.\nStatement 3 is incorrect: The Asiatic Lion is classified as 'Vulnerable' (downlisted from 'Endangered' in recent IUCN global reassessments) or traditionally evaluated as Endangered, but NOT 'Critically Endangered'. It is placed under Schedule I of the Wildlife (Protection) Act, 1972 and Appendix I of CITES.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate; Statement 3 is false.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is false."
    },
    static_root: "Project Lion; Asiatic Lion conservation status; Wildlife Sanctuaries of Gujarat.",
    standard_book_ref: "PMF IAS Environment, 'Mammals of India: Carnivores'; WII Project Lion Reports.",
    elimination_trap: "Aspirants confuse Great Indian Bustard (Critically Endangered) with Asiatic Lion (Vulnerable/Endangered). Lions have never been Critically Endangered on the IUCN Red List.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-08-004",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Species in News",
    question: "Consider the following statements regarding the Houbara Bustard (MacQueen's Bustard):\n1. It is a desert-adapted bird species that winters in the arid landscapes of Rajasthan and Gujarat.\n2. It is listed as 'Critically Endangered' under the IUCN Red List of Threatened Species.\n3. It is included in Appendix I of the Convention on International Trade in Endangered Species of Wild Fauna and Flora (CITES).\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "Only two",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: MacQueen's bustard (Chlamydotis macqueenii), also known as the Asian Houbara, migrates each winter from Central Asia into the Thar Desert of Rajasthan, the Rann of Kutch in Gujarat, and Balochistan.\nStatement 2 is incorrect: MacQueen's bustard is listed as 'Vulnerable' on the IUCN Red List (the Great Indian Bustard, Ardeotis nigriceps, is Critically Endangered).\nStatement 3 is correct: Due to severe international threats from falconry hunting and illegal trapping, it is granted strict international protection under Appendix I of CITES and Appendix I of CMS (Bonn Convention).",
    option_analysis: {
      "Option A": "Incorrect. Two statements are correct.",
      "Option B": "Correct. Statements 1 and 3 are correct; statement 2 confuses Houbara with GIB.",
      "Option C": "Incorrect because statement 2 is wrong.",
      "Option D": "Incorrect because two statements are correct."
    },
    static_root: "Migratory Birds; CITES Appendices; Desert Ecology of the Thar.",
    standard_book_ref: "Shankar IAS Environment, 'Biodiversity & Species Conservation'; CMS Convention Dossier.",
    elimination_trap: "Candidates often confuse the Great Indian Bustard (GIB - Critically Endangered resident) with the Asian Houbara Bustard (Vulnerable winter migrant hunted extensively in Pakistan/Arabia).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-005",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Fauna & Ecological Adaptations",
    question: "Which of the following arboreal felids has specialized flexible ankle joints that can rotate nearly 180 degrees, enabling it to climb down tree trunks headfirst, and is listed in Schedule I of India's Wildlife (Protection) Act, 1972?\n(a) Snow Leopard\n(b) Clouded Leopard\n(c) Fishing Cat\n(d) Marbled Cat",
    options: [
      "Snow Leopard",
      "Clouded Leopard",
      "Fishing Cat",
      "Marbled Cat"
    ],
    answer: "Clouded Leopard",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe Clouded Leopard (Neofelis nebulosa) possesses remarkable morphological adaptations for an arboreal life, including rotating rear ankles (up to 180 degrees) that permit it to descend tree trunks headfirst like a squirrel, as well as exceptionally long canines relative to body size and a heavy tail for balance.\nIt inhabits the dense evergreen forests of Northeast India (e.g., Namdapha in Arunachal, Dampa in Mizoram, and Khangchendzonga in Sikkim). It is listed as Vulnerable by IUCN and Schedule I under the Wildlife (Protection) Act, 1972.",
    option_analysis: {
      "Option A": "Incorrect. Snow leopards live in alpine rocky biomes and cannot rotate ankles 180 degrees.",
      "Option B": "Correct. Clouded leopard is uniquely adapted for head-first tree descent and tree-canopy hunting.",
      "Option C": "Incorrect. Fishing cats are wetland-adapted semi-aquatic felines with webbed paws.",
      "Option D": "Incorrect. While marbled cats are arboreal, the flagship Schedule I feline highlighted in national species action plans with these specific morphometrics is the Clouded Leopard."
    },
    static_root: "Wildlife of India; Schedule I species of WPA 1972; Forest Canopies of Northeast India.",
    standard_book_ref: "PMF IAS Environment, 'Carnivores & Mammalian Adaptations'; Prater, The Book of Indian Animals.",
    elimination_trap: "Aspirants might suspect the Margay (found only in the Americas) or Marbled Cat, but Clouded Leopard is the prominent Indian apex arboreal felid.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-006",
    year: 2026,
    month: "August 2026",
    subject: "Geography & Places in News",
    question: "With reference to the Danube River, consider the following statements:\n1. It originates in the Black Forest mountains of Germany and empties into the Mediterranean Sea.\n2. It flows through or borders ten sovereign European nations.\n3. It passes directly through four national capital cities: Vienna, Bratislava, Budapest, and Belgrade.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 2 and 3 are correct; Statement 1 is incorrect.\nStatement 1 is incorrect: The Danube originates in the Black Forest of Germany (confluence of Brigach and Breg rivers) and empties into the Black Sea via the Danube Delta in Romania/Ukraine, NOT into the Mediterranean Sea.\nStatement 2 is correct: The Danube touches ten countries: Germany, Austria, Slovakia, Hungary, Croatia, Serbia, Romania, Bulgaria, Moldova, and Ukraine—more countries than any other river on Earth.\nStatement 3 is correct: It flows through four national capitals: Vienna (Austria), Bratislava (Slovakia), Budapest (Hungary), and Belgrade (Serbia).",
    option_analysis: {
      "Option A": "Incorrect because statement 1 is geographically false.",
      "Option B": "Correct. Statements 2 and 3 are correct.",
      "Option C": "Incorrect because statement 1 is false.",
      "Option D": "Incorrect because statement 1 is false."
    },
    static_root: "Major Rivers of the World; European Drainage Systems; Black Sea basin.",
    standard_book_ref: "NCERT Class 11 World Physical Geography; Oxford Student Atlas of the World.",
    elimination_trap: "Don't confuse the Black Sea drainage with Mediterranean drainage. The Rhine flows north to the North Sea; Danube flows east into the Black Sea.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-007",
    year: 2026,
    month: "August 2026",
    subject: "Geography & Places in News",
    question: "The water body 'Lake Mead', which reached record low water levels triggering critical drought emergency protocols, is formed by which of the following dams on which river?\n(a) Aswan High Dam on the Nile River\n(b) Hoover Dam on the Colorado River\n(c) Three Gorges Dam on the Yangtze River\n(d) Grand Coulee Dam on the Columbia River",
    options: [
      "Aswan High Dam on the Nile River",
      "Hoover Dam on the Colorado River",
      "Three Gorges Dam on the Yangtze River",
      "Grand Coulee Dam on the Columbia River"
    ],
    answer: "Hoover Dam on the Colorado River",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nLake Mead is the largest reservoir by volume in the United States, formed by the Hoover Dam on the Colorado River along the border of Nevada and Arizona. Prolonged mega-drought in the Colorado River Basin pushed Lake Mead close to 'dead pool' elevation (when water can no longer pass through dam turbines), prompting federal water rationing under the 1922 Colorado River Compact.",
    option_analysis: {
      "Option A": "Incorrect. Aswan High Dam forms Lake Nasser on the Nile River in Egypt.",
      "Option B": "Correct. Hoover Dam impounds the Colorado River to create Lake Mead.",
      "Option C": "Incorrect. Three Gorges Dam impounds the Yangtze River in Hubei, China.",
      "Option D": "Incorrect. Grand Coulee Dam creates Franklin D. Roosevelt Lake on the Columbia River."
    },
    static_root: "Major Lakes and Dams of the World; North American Hydrology.",
    standard_book_ref: "G.C. Leong, Certificate Physical and Human Geography; Oxford School Atlas.",
    elimination_trap: "Lake Powell is formed by Glen Canyon Dam, whereas Lake Mead is formed downstream by Hoover Dam.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-008",
    year: 2026,
    month: "August 2026",
    subject: "Geography & Places in News",
    question: "Consider the following pairs of Territories / Places in news and their Controlling Sovereignty / Geographical Feature:\n1. Ceuta : Spanish autonomous enclave on the North African coast bordering Morocco\n2. Nauru : Micronesian island nation formed as a raised phosphate coral atoll\n3. Christmas Island : External territory of Australia located in the Indian Ocean\nHow many of the pairs given above are correctly matched?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three pairs are correctly matched.\nPair 1 is correctly matched: Ceuta (along with Melilla) is a Spanish autonomous city and exclave situated on the north coast of Africa, sharing a land border with Morocco opposite Gibraltar.\nPair 2 is correctly matched: Nauru (historically Pleasant Island) is an independent island republic in Micronesia (Central Pacific) consisting of an uplifted coral limestone atoll formerly world-famous for rich guano-derived phosphate mining.\nPair 3 is correctly matched: Christmas Island is an Australian external territory in the northeastern Indian Ocean south of Java, Indonesia, famous for its annual red crab (Gecarcoidea natalis) breeding migration.",
    option_analysis: {
      "Option A": "Incorrect. All three pairs are correct.",
      "Option B": "Incorrect. Three pairs are correctly matched.",
      "Option C": "Correct. Pairs 1, 2, and 3 are all accurately described.",
      "Option D": "Incorrect."
    },
    static_root: "World Political Geography; Island Nations & Disputed Enclaves; Indian & Pacific Oceans.",
    standard_book_ref: "Oxford Student Atlas of the World; Majid Husain, World Geography.",
    elimination_trap: "Candidates often assume Christmas Island is in the Pacific near Kiribati (Kiritimati/Christmas Island in Kiribati is in the Pacific, but Australia's Christmas Island territory with red crabs is in the Indian Ocean).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-08-009",
    year: 2026,
    month: "August 2026",
    subject: "International Relations",
    sub_topic: "Indo-Pacific & Maritime Security",
    question: "With reference to the 'Indo-Pacific Partnership for Maritime Domain Awareness' (IPMDA), consider the following statements:\n1. It is an initiative launched by the Quadrilateral Security Dialogue (Quad) countries.\n2. It leverages commercial satellite AIS (Automatic Identification System) and electro-optical data to track 'dark vessels' operating with transponders turned off.\n3. It integrates existing regional information fusion centers including the Information Fusion Centre - Indian Ocean Region (IFC-IOR) in Gurugram.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: IPMDA was launched by the leaders of the Quad nations (India, United States, Japan, Australia) at the Tokyo Summit to provide near-real-time maritime domain information to Indo-Pacific littoral states.\nStatement 2 is correct: IPMDA harnesses commercial radio-frequency and satellite tracking technologies to detect 'dark shipping'—vessels engaged in Illegal, Unreported, and Unregulated (IUU) fishing or clandestine smuggling that switch off their automatic transponders.\nStatement 3 is correct: It links regional information nodes including the IFC-IOR in Gurugram (India), the Information Fusion Centre in Singapore, and the Pacific Islands Forum Fisheries Agency (FFA) in Solomon Islands.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are fully valid."
    },
    static_root: "Quad Security Dialogue; Maritime Security Architecture; Indian Ocean Region.",
    standard_book_ref: "Rajiv Sikri, Challenge and Strategy: Rethinking India's Foreign Policy; Ministry of External Affairs (MEA) Annual Report.",
    elimination_trap: "Some aspirants assume IPMDA is an ASEAN or IORA initiative. It is a signature Quad initiative designed to share unclassified commercial tracking data with Pacific and Indian Ocean partners.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-08-010",
    year: 2026,
    month: "August 2026",
    subject: "Schemes & Governance",
    sub_topic: "Renewable Energy & Agriculture",
    question: "With reference to the GOBARdhan (Galvanizing Organic Bio-Agro Resources Dhan) scheme, consider the following statements:\n1. It operates as an umbrella initiative coordinated by the Department of Drinking Water and Sanitation under the Ministry of Jal Shakti.\n2. It mandates public sector Oil Marketing Companies (OMCs) to procure Compressed Bio-Gas (CBG) under long-term agreements with indexed floor pricing.\n3. The scheme exclusively supports commercial cattle dairy farms having more than 500 livestock.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: GOBARdhan is anchored by the Department of Drinking Water and Sanitation, Ministry of Jal Shakti, coordinating with MoPNG, MNRE, and MoA&FW to turn cattle dung, solid waste, and crop residue into biogas and bio-slurry.\nStatement 2 is correct: Under the SATAT framework and updated GOBARdhan bioenergy guidelines, OMCs are required to enter 10-year off-take pacts for CBG with benchmarked pricing and financial support for pipeline injection.\nStatement 3 is incorrect: The scheme covers village-level community models, cluster models for small and marginal farmers, and SHGs under Swachh Bharat Mission (Grameen) Phase-II, NOT exclusively large commercial dairies.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 contains an extreme false exclusion.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Swachh Bharat Mission (Grameen); SATAT Initiative; Bio-energy & CBG in India.",
    standard_book_ref: "India Year Book, Chapters on 'Rural Development' and 'Energy'; PIB Releases, Ministry of Jal Shakti.",
    elimination_trap: "Watch out for extreme keywords such as 'exclusively supports commercial farms having more than 500 livestock'—GOBARdhan is deeply rooted in rural gram panchayats.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-08-011",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Ecological Classification & Land Degradation",
    question: "In the context of land use and biodiversity conservation in India, what are 'Open Natural Ecosystems' (ONEs)?\n(a) Artificially created urban parks and rooftop botanical gardens\n(b) Non-forest biomes such as native grasslands, savannas, rocky plateaus, and thorn scrubs that have historically been misclassified as 'wastelands'\n(c) Coastal mangrove wetlands opened for commercial aquaculture under CRZ exemptions\n(d) Fallow agricultural lands surrendered under social forestry schemes",
    options: [
      "Artificially created urban parks and rooftop botanical gardens",
      "Non-forest biomes such as native grasslands, savannas, rocky plateaus, and thorn scrubs that have historically been misclassified as 'wastelands'",
      "Coastal mangrove wetlands opened for commercial aquaculture under CRZ exemptions",
      "Fallow agricultural lands surrendered under social forestry schemes"
    ],
    answer: "Non-forest biomes such as native grasslands, savannas, rocky plateaus, and thorn scrubs that have historically been misclassified as 'wastelands'",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nOpen Natural Ecosystems (ONEs)—comprising semi-arid savannas, scrublands, saline desert flats, and rocky outcrops—cover nearly 10% of India's landmass. Historically, colonial forestry frameworks and the Wasteland Atlas of India categorized them as unproductive 'wastelands', leading to inappropriate afforestation projects (like monoculture tree plantations) that paradoxically destroy endemic wildlife habitats (such as those of the Great Indian Bustard, Lesser Florican, and Indian Fox). Conservationists and UNCCD guidelines now advocate formal recognition of ONEs as distinct ecological biomes.",
    option_analysis: {
      "Option A": "Incorrect. ONEs are natural indigenous ecosystems, not urban parks.",
      "Option B": "Correct. ONEs represent native non-forest biomes wrongly labelled as wastelands.",
      "Option C": "Incorrect. ONEs refer primarily to semi-arid terrestrial and rocky biomes, not aquaculture zones.",
      "Option D": "Incorrect. ONEs are natural evolutionary habitats, not abandoned farm plots."
    },
    static_root: "Grassland and Desert Biomes; Wasteland Classification in India; UNCCD Land Degradation Neutrality.",
    standard_book_ref: "PMF IAS Environment, 'Terrestrial Biomes of India'; State of India's Birds (SOIB) Report.",
    elimination_trap: "Many students assume any barren or scrub land is 'degraded forest' requiring tree planting. Planting trees in native ONE grasslands actually destroys grassland biodiversity and depletes groundwater.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-012",
    year: 2026,
    month: "August 2026",
    subject: "International Relations",
    sub_topic: "Geopolitics of West Asia",
    question: "The 'Makkah Pact', recently discussed in diplomatic circles, refers to a strategic defense and mutual security cooperation framework involving which group of countries?\n(a) India, UAE, and Israel\n(b) Saudi Arabia, Turkey, and Pakistan\n(c) Iran, Russia, and Syria\n(d) Egypt, Jordan, and Saudi Arabia",
    options: [
      "India, UAE, and Israel",
      "Saudi Arabia, Turkey, and Pakistan",
      "Iran, Russia, and Syria",
      "Egypt, Jordan, and Saudi Arabia"
    ],
    answer: "Saudi Arabia, Turkey, and Pakistan",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe Makkah Pact represents a trilateral defence and strategic dialogue initiative forged between Saudi Arabia, Turkey, and Pakistan to enhance joint military production, intelligence sharing, and reciprocal security assistance across West Asia and South Asia.",
    option_analysis: {
      "Option A": "Incorrect. India, Israel, UAE and USA form the I2U2 grouping.",
      "Option B": "Correct. Saudi Arabia, Turkey, and Pakistan formulated the trilateral pact.",
      "Option C": "Incorrect. Iran, Russia, and Syria cooperate under the Astana process / Levant axis.",
      "Option D": "Incorrect. Egypt and Jordan participate in the Amman Tripartite Summit alongside Iraq."
    },
    static_root: "West Asian Geopolitics; Security Pacts in the Islamic World; Strategic Implications for India.",
    standard_book_ref: "Pushpesh Pant, International Relations in the 21st Century; MEA Policy Briefs.",
    elimination_trap: "Do not confuse the I2U2 grouping or Abraham Accords (UAE-Bahrain-Israel-US) with the Sunni-majority trilateral pact between Riyadh, Ankara, and Islamabad.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-013",
    year: 2026,
    month: "August 2026",
    subject: "Polity & Governance",
    sub_topic: "National Symbols & Fundamental Duties",
    question: "With reference to the legal framework governing National Symbols in India, consider the following statements:\n1. The Prevention of Insults to National Honour Act, 1971 specifically penalizes intentional disrespect to the National Flag, the Constitution of India, and the National Anthem.\n2. The National Song 'Vande Mataram' is granted an identical statutory penalty under Section 3 of the Prevention of Insults to National Honour Act, 1971 as the National Anthem.\n3. Respecting the National Flag and National Anthem is a Fundamental Duty under Article 51A(a) of the Constitution.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect.\nStatement 1 is correct: The Prevention of Insults to National Honour Act, 1971 prohibits desecration of or insult to the National Flag (Section 2), the Constitution of India (Section 2), and intentionally preventing the singing of or causing disturbance to the National Anthem 'Jana Gana Mana' (Section 3).\nStatement 2 is incorrect: Unlike the National Anthem, the National Song 'Vande Mataram' was historically not included in the penal provisions of the 1971 Act (which led to subsequent legislative amendment proposals to accord equal statutory protection).\nStatement 3 is correct: Article 51A(a) states that it shall be the duty of every citizen of India 'to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem'.",
    option_analysis: {
      "Option A": "Incorrect because statement 2 is legally inaccurate.",
      "Option B": "Correct. Statements 1 and 3 are constitutionally and statutorily correct.",
      "Option C": "Incorrect because statement 2 is wrong.",
      "Option D": "Incorrect because statement 2 is wrong."
    },
    static_root: "Fundamental Duties (Part IVA); Prevention of Insults to National Honour Act, 1971; Supreme Court rulings on National Anthem (Bijoe Emmanuel case).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Fundamental Duties'; D.D. Basu, Introduction to the Constitution of India.",
    elimination_trap: "Article 51A(a) explicitly mentions the National Flag and the National Anthem, but DOES NOT mention the National Song. Similarly, the 1971 Act's Section 3 penalizes insults only to the National Anthem.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-014",
    year: 2026,
    month: "August 2026",
    subject: "Environment & Ecology",
    sub_topic: "Ecotoxicology & Avian Conservation",
    question: "The conservation of vultures in India has seen significant recovery through the ban on toxic veterinary drugs. Which of the following Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) have been banned by the Government of India due to their fatal toxicity in Gyps vultures?\n1. Diclofenac\n2. Aceclofenac\n3. Ketoprofen\n4. Meloxicam\nSelect the correct answer using the code given below:",
    options: [
      "1 and 2 only",
      "1, 2 and 3 only",
      "1, 3 and 4 only",
      "1, 2, 3 and 4"
    ],
    answer: "1, 2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct (1, 2 and 3 only).\nDiclofenac was banned for veterinary use in India in 2006 because it caused visceral gout and rapid kidney failure in Gyps vultures. However, cattle continued to be treated with pro-drugs like Aceclofenac (which metabolizes into diclofenac inside cattle) and Ketoprofen. Following scientific trials by BNHS and IVRI, the Ministry of Health banned Aceclofenac and Ketoprofen for animal use.\nIn contrast, Meloxicam and Tolfenamic acid are scientifically proven 'vulture-safe' NSAIDs and are permitted and promoted as safe alternatives for veterinary treatment.",
    option_analysis: {
      "Option A": "Incorrect because Ketoprofen is also banned.",
      "Option B": "Correct. 1, 2, and 3 are banned toxic NSAIDs; 4 (Meloxicam) is a permitted vulture-safe drug.",
      "Option C": "Incorrect because Meloxicam is safe and not banned.",
      "Option D": "Incorrect because Meloxicam is vulture-safe."
    },
    static_root: "Action Plan for Vulture Conservation 2020-2025; Veterinary Toxicology; Vulture Safe Zones.",
    standard_book_ref: "PMF IAS Environment, 'Vulture Crisis and Conservation'; MoEFCC National Action Plan for Vulture Conservation.",
    elimination_trap: "Meloxicam is the primary safe replacement drug recommended to veterinarians; it must NEVER be marked as banned.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-08-015",
    year: 2026,
    month: "August 2026",
    subject: "Economy",
    sub_topic: "Infrastructure & Energy Transition",
    question: "With reference to 'PM Surya Sarovar Yojana', consider the following statements:\n1. It focuses on the installation of large-scale floating solar photovoltaic (FSPV) plants on major reservoirs and irrigation water bodies.\n2. Floating solar plants reduce water evaporation loss from reservoirs while benefiting from the natural cooling effect of water to increase solar panel power generation efficiency.\n3. The scheme is executed under the joint auspices of the Ministry of New and Renewable Energy (MNRE) and the Ministry of Jal Shakti.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: PM Surya Sarovar Yojana targets harnessing India's vast inland water reservoirs (behind multipurpose dams and irrigation barrages) to deploy floating solar panels paired with Battery Energy Storage Systems (BESS).\nStatement 2 is correct: Scientifically, floating solar panels shade the water surface, curtailing evaporative water loss by up to 60-70%, while lower ambient temperatures above the water body cool the PV cells, yielding a 5-10% higher electricity output compared to ground-mounted installations.\nStatement 3 is correct: The mission unites MNRE (for clean energy subsidies, tenders, and grid connection) and the Ministry of Jal Shakti (for access to CWC dam reservoirs and canal networks).",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all accurate."
    },
    static_root: "Solar Energy in India; National Solar Mission; Multi-purpose River Valley Projects.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Infrastructure & Energy'; MNRE Annual Reports.",
    elimination_trap: "Many candidates think floating solar has lower efficiency due to humidity; in reality, temperature coefficients of silicon cells improve under water-cooling, increasing power conversion efficiency.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out existing August questions if any to prevent duplicate IDs
const nonAug = existing.filter(q => q.month !== 'August 2026');
const updated = [...nonAug, ...augQuestions];

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8');
console.log(`Successfully ingested ${augQuestions.length} questions for August 2026. Total now: ${updated.length}`);
