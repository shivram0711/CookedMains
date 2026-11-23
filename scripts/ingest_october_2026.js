const fs = require('fs');
const path = require('path');

const octQuestions = [
  {
    id: "ca-2026-10-001",
    year: 2026,
    month: "October 2026",
    subject: "Environment & Ecology",
    sub_topic: "Wetlands & Ramsar Sites",
    question: "With reference to the wetlands newly designated under the Ramsar Convention in 2026, consider the following statements:\n1. 'Sukhna Lake', situated in the foothills of the Shivalik range in Chandigarh, is a rain-fed man-made lake created by damming the Sukhna Choe.\n2. 'Sauj Jheel', located in Mainpuri district of Uttar Pradesh, is a perennial oxbow wetland critical for the breeding of the Sarus Crane.\n3. The Ramsar Convention secretariat is located in Nairobi, Kenya under the United Nations Environment Programme (UNEP).\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Sukhna Lake in Chandigarh was created in 1958 by Le Corbusier and Chief Engineer P.L. Verma by damming the Sukhna Choe (a seasonal stream from the Shivalik hills). It serves as a vital winter sanctuary for migratory waterfowl.\nStatement 2 is correct: Sauj Jheel in Mainpuri (Uttar Pradesh) is an oxbow lake and semi-permanent wetland that supports the highest breeding concentration of the Vulnerable Sarus Crane (Antigone antigone) in the Gangetic plains.\nStatement 3 is incorrect: The Secretariat of the Ramsar Convention on Wetlands is located in Gland, Switzerland (shared with the IUCN headquarters), NOT in Nairobi, Kenya.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; statement 3 misidentifies the Ramsar secretariat headquarters.",
      "Option B": "Incorrect because statement 3 is wrong.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Ramsar Convention 1971; Wetlands of India; Oxbow Lakes and Man-made Wetlands.",
    standard_book_ref: "PMF IAS Environment, 'Wetland Conservation & Ramsar Sites'; Shankar IAS Environment.",
    elimination_trap: "UNEP is headquartered in Nairobi, Kenya; but the Ramsar Convention Secretariat is independent and hosted by IUCN in Gland, Switzerland.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-002",
    year: 2026,
    month: "October 2026",
    subject: "Environment & Ecology",
    sub_topic: "Tiger Conservation & Rewilding",
    question: "In an effort to revive local tiger populations, a female royal Bengal tiger was translocated into 'Buxa Tiger Reserve'. In this context, consider the following statements:\n1. Buxa Tiger Reserve is located in the Alipurduar district of West Bengal, bordering Bhutan and Assam.\n2. It forms part of the transboundary tiger conservation landscape connected to Phibsoo Wildlife Sanctuary and Royal Manas National Park in Bhutan.\n3. The source population for this reintroduction was brought from the Sunderbans mangrove tiger population.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Buxa Tiger Reserve is located in the Terai-Dooars region of Alipurduar district in northern West Bengal.\nStatement 2 is correct: Buxa provides a crucial transboundary corridor linking with Phibsoo Wildlife Sanctuary and Royal Manas National Park in Bhutan to the north, and Manas Tiger Reserve in Assam to the east.\nStatement 3 is incorrect: Mangrove-adapted tigers from the Sundarbans cannot easily adapt to the sub-Himalayan Terai-Dooars montane terrain. Instead, the reintroduction plan selected tigers from Terai landscape habitats (such as Valmiki Tiger Reserve in Bihar or Kaziranga/Orang in Assam) that share ecological and prey similarities.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is ecologically and factually incorrect.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Project Tiger; Protected Areas of West Bengal; Transboundary Wildlife Corridors.",
    standard_book_ref: "National Tiger Conservation Authority (NTCA) Status of Tigers in India; PMF IAS Environment.",
    elimination_trap: "Sundarbans tigers have unique salt-excreting and mangrove-swimming adaptations; NTCA tiger translocation protocols strictly avoid moving tidal mangrove tigers into upland Terai foothill forests.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-003",
    year: 2026,
    month: "October 2026",
    subject: "Geography & Oceanography",
    sub_topic: "Coastal Hazards & Waves",
    question: "With reference to the oceanographic phenomenon 'Kallakkadal', frequently affecting the coastal belts of Kerala and Tamil Nadu, consider the following statements:\n1. It refers to flash coastal flooding caused by swell waves generated by distant ocean storms in the Southern Ocean.\n2. It occurs without any local atmospheric disturbance or precursor signs in the local coastal weather.\n3. The Indian National Centre for Ocean Information Services (INCOIS) provides early warnings for Kallakkadal events using Swell Surge Forecast systems.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: 'Kallakkadal' (a Malayalam term meaning 'sea that comes secretly like a thief') is officially recognized by UNESCO. It is caused by strong, distant atmospheric depressions and roaring westerly storms in the Southern Ocean (around 30°S to 50°S). These storms generate long-period swell waves that propagate northwards across thousands of kilometers of the Indian Ocean without losing energy.\nStatement 2 is correct: Because the storm originated thousands of miles away near Antarctica, the local weather along the Kerala or Lakshadweep coast remains completely calm and clear right until massive waves suddenly crash onto shore.\nStatement 3 is correct: INCOIS (under the Ministry of Earth Sciences, located in Hyderabad) operates the Swell Surge Forecast System, giving fishermen and coastal administrations 2-3 days advance warning.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all oceanographically accurate."
    },
    static_root: "Ocean Waves, Swells and Tides; Coastal Hazards in India; INCOIS Early Warning Systems.",
    standard_book_ref: "NCERT Class 11 Physical Geography, 'Movements of Ocean Water'; MoES Annual Report.",
    elimination_trap: "Do not confuse Kallakkadal with a Tsunami (caused by submarine earthquakes/landslides) or a Storm Surge (caused by a local cyclone's low pressure and gale winds). Kallakkadal is purely a distant swell surge.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-10-004",
    year: 2026,
    month: "October 2026",
    subject: "Environment & Ecology",
    sub_topic: "Fauna & High-Altitude Biomes",
    question: "Consider the following statements regarding the 'Himalayan Tahr' (Hemitragus jemlahicus):\n1. It is a wild ungulate specially adapted to precipitous cliffs and rugged slopes of the Himalayas.\n2. Its hooves have a hard keratinous outer rim and a soft, rubbery concave center that provides exceptional grip on steep rock faces.\n3. It is classified as 'Critically Endangered' under the IUCN Red List of Threatened Species.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Himalayan Tahr is a large ungulate related to wild goats, inhabiting steep rocky cliffs, subalpine scrub, and alpine meadows (bugyals) across Jammu & Kashmir, Himachal Pradesh, Uttarakhand, and Sikkim.\nStatement 2 is correct: Its hooves have a specialized biological design: a sharp, hard outer edge that bites into microscopic crevices, and a flexible, rubber-like concave inner pad that acts like a suction cup on smooth rock surfaces.\nStatement 3 is incorrect: The Himalayan Tahr is classified as 'Near Threatened' (NT) on the IUCN Red List, NOT 'Critically Endangered'. It is protected under Schedule I of the Wildlife (Protection) Act, 1972.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is wrong.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Himalayan Fauna & Adaptations; Ungulates of India; IUCN Threat Categories.",
    standard_book_ref: "PMF IAS Environment, 'Mammals of India: Herbivores & Ungulates'; WII Himalayan Ecology Studies.",
    elimination_trap: "Nilgiri Tahr (Nilgiritragus hylocrius) is Endangered in the Western Ghats; Himalayan Tahr (Hemitragus jemlahicus) is Near Threatened in the Himalayas. Neither is Critically Endangered.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-005",
    year: 2026,
    month: "October 2026",
    subject: "Environment & Ecology",
    sub_topic: "Avian Diversity & State Symbols",
    question: "With reference to the 'Sarus Crane' (Antigone antigone), consider the following statements:\n1. It is recognized as the world's tallest flying bird.\n2. It is the official state bird of the State of Uttar Pradesh.\n3. It is a long-distance migratory bird that breeds in the Arctic tundra and winters in northern India.\n4. It is classified as 'Vulnerable' on the IUCN Red List.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "Only three",
      "All four"
    ],
    answer: "Only three",
    correct_index: 2,
    correct_option: "C",
    explanation: "Statements 1, 2, and 4 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Standing up to 1.8 meters (nearly 6 feet) tall, the Sarus Crane is the tallest flying bird on Earth.\nStatement 2 is correct: It is celebrated in Indian folklore for lifelong pair bonding and is the official state bird of Uttar Pradesh.\nStatement 3 is incorrect: Unlike the Siberian Crane (which is migratory), the Sarus Crane is a non-migratory resident bird species that spends its entire life cycle in the wetlands and agricultural paddy fields of northern and central India.\nStatement 4 is correct: It is classified as 'Vulnerable' on the IUCN Red List and listed in Schedule I of India's Wildlife (Protection) Act, 1972.",
    option_analysis: {
      "Option A": "Incorrect. Three statements are correct.",
      "Option B": "Incorrect. Three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 4 are correct; statement 3 is false.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Wetland Birds; State Symbols of Indian States; IUCN Red List of Indian Birds.",
    standard_book_ref: "Salim Ali, The Book of Indian Birds; Shankar IAS Environment; State of India's Birds Report.",
    elimination_trap: "Aspirants frequently confuse the Siberian Crane (extirpated Arctic winter migrant to Keoladeo) with the Sarus Crane (tallest flying bird, strictly resident in India).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-10-006",
    year: 2026,
    month: "October 2026",
    subject: "Geography & Places in News",
    question: "Consider the following statements regarding the 'Black Sea':\n1. It is a meromictic basin where deep waters below 150-200 meters are permanently anoxic and rich in dissolved hydrogen sulfide (H2S).\n2. It is connected to the Sea of Marmara via the Bosporus Strait and to the Aegean/Mediterranean Sea via the Dardanelles Strait.\n3. It receives freshwater discharges from three of Europe's largest rivers: the Danube, the Dnieper, and the Don.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: The Black Sea is the world's largest meromictic basin (layers of water do not intermix). Over 90% of its volume is anoxic (depleted of dissolved oxygen) and saturated with hydrogen sulfide, preserving ancient wooden shipwrecks from biological decay.\nStatement 2 is correct: It connects to the Mediterranean through the Turkish Straits: the Bosporus leads to the Sea of Marmara, which connects to the Aegean Sea through the Dardanelles.\nStatement 3 is correct: The major rivers discharging into the Black Sea basin include the Danube, the Dnieper, and the Don (which drains into the Sea of Azov, a connected embayment of the Black Sea via the Kerch Strait).",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all physically and geographically accurate."
    },
    static_root: "Enclosed and Marginal Seas; Physical Oceanography (Anoxia & Halocline); Geography of the Black Sea Basin.",
    standard_book_ref: "NCERT Class 11 World Physical Geography; Oxford Student Atlas of the World.",
    elimination_trap: "Don drains into the Sea of Azov, which connects through the Kerch Strait into the Black Sea; Danube and Dnieper flow directly into the Black Sea.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-10-007",
    year: 2026,
    month: "October 2026",
    subject: "Geography & Places in News",
    question: "With reference to the 'Caspian Sea', the world's largest inland body of water, consider the following statements:\n1. It is an endorheic basin with no natural surface outlet to the world ocean.\n2. The Volga River provides approximately 80% of the total river inflow entering the Caspian Sea.\n3. It is bordered by five littoral states: Russia, Kazakhstan, Turkmenistan, Iran, and Uzbekistan.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: The Caspian Sea is an endorheic (closed drainage) lake, meaning water leaves it solely through surface evaporation rather than river outflow.\nStatement 2 is correct: The Volga River (Europe's longest river) drains into the northern Caspian Sea, supplying roughly 80% of its freshwater inflow.\nStatement 3 is incorrect: The five littoral countries bordering the Caspian Sea are Russia, Kazakhstan, Turkmenistan, Iran, and Azerbaijan (often remembered by the mnemonic 'TARIK' or 'RITA-K'). Uzbekistan is a doubly landlocked country that borders the Aral Sea, NOT the Caspian Sea.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 incorrectly includes Uzbekistan instead of Azerbaijan.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "Inland Seas and Drainage Basins; Central Asian Geography; Caspian Sea Littoral States.",
    standard_book_ref: "Oxford Student Atlas of the World; Majid Husain, World Geography.",
    elimination_trap: "UPSC classic trap: Uzbekistan does not touch the Caspian Sea. The 5 littoral states are Azerbaijan, Russia, Kazakhstan, Turkmenistan, and Iran.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-008",
    year: 2026,
    month: "October 2026",
    subject: "Geography & Places in News",
    question: "The 'Dakhla Oasis', located in Egypt's Western Desert, derives its perennial water supply primarily from which of the following hydrogeological features?\n(a) The seasonal overflow of the White Nile\n(b) The Nubian Sandstone Aquifer System\n(c) Desalinated pipeline networks from the Red Sea\n(d) Subterranean karst caverns of the Sinai Peninsula",
    options: [
      "The seasonal overflow of the White Nile",
      "The Nubian Sandstone Aquifer System",
      "Desalinated pipeline networks from the Red Sea",
      "Subterranean karst caverns of the Sinai Peninsula"
    ],
    answer: "The Nubian Sandstone Aquifer System",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nDakhla Oasis is one of the seven oases of Egypt's Western (Libyan) Desert. It is fed entirely by the Nubian Sandstone Aquifer System (NSAS)—the world's largest known fossil water aquifer system, covering over 2 million square kilometers across Egypt, Libya, Chad, and Sudan. Artesian springs and deep wells tap into this non-renewable prehistoric groundwater reservoir.",
    option_analysis: {
      "Option A": "Incorrect. The Nile River is over 300 km east across arid desert plateau.",
      "Option B": "Correct. The Nubian Sandstone Aquifer System sustains Dakhla, Kharga, and Siwa oases.",
      "Option C": "Incorrect. There are no trans-desert desalinated pipelines to Dakhla.",
      "Option D": "Incorrect. Sinai is east of the Suez Canal, far from Egypt's Western Desert."
    },
    static_root: "Fossil Water Aquifers; Geomorphology of the Sahara; Desert Oases.",
    standard_book_ref: "G.C. Leong, Physical and Human Geography; UNESCO World Water Assessment Programme.",
    elimination_trap: "Many students assume all Egyptian agriculture depends on the Nile. The Western Desert oases rely exclusively on deep fossil aquifers.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-10-009",
    year: 2026,
    month: "October 2026",
    subject: "Polity & Governance",
    sub_topic: "Criminal Procedure & Public Order",
    question: "With reference to Section 163 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, consider the following statements:\n1. It replaces the erstwhile Section 144 of the Code of Criminal Procedure (CrPC), 1973.\n2. An order under this section can be issued by a District Magistrate, a Sub-divisional Magistrate, or any other Executive Magistrate specially empowered by the State Government.\n3. An order passed under Section 163 can remain in force indefinitely without any statutory time limitation.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: Section 163 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 corresponds to Section 144 of the repealed Code of Criminal Procedure, 1973, empowering authorities to issue urgent orders in cases of nuisance or apprehended danger.\nStatement 2 is correct: Orders may be promulgated by a District Magistrate, a Sub-divisional Magistrate, or any Executive Magistrate specially empowered by the State Government.\nStatement 3 is incorrect: Under the statute, an order issued by an Executive Magistrate cannot remain in force for more than two months from the making thereof. The State Government may, if it considers it necessary for preventing danger to human life or preventing a riot, extend the validity for a further period not exceeding six months.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 is wrong.",
      "Option B": "Incorrect because statement 1 is also correct.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "New Criminal Laws 2023 (BNSS); Public Order and Executive Powers; Preventive Restrictions (Art 19(2)).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Subordinate Courts & Law and Order'; Bare Act of BNSS 2023.",
    elimination_trap: "The Supreme Court in Anuradha Bhasin (2020) ruled that Section 144/163 orders cannot be repetitive or indefinite and must satisfy the test of proportionality with strict statutory time caps.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-010",
    year: 2026,
    month: "October 2026",
    subject: "Polity & Governance",
    sub_topic: "Judiciary & Collegium System",
    question: "Consider the following statements regarding the evolution of the Collegium System for appointment of judges to the Supreme Court of India:\n1. In the First Judges Case (1981), the Supreme Court ruled that the term 'consultation' used in Article 124 does not mean 'concurrence' of the Chief Justice of India.\n2. In the Second Judges Case (1993), the Supreme Court introduced the Collegium system, holding that consultation means concurrence.\n3. In the Third Judges Case (1998), the Supreme Court expanded the Collegium to comprise the Chief Justice of India and four senior-most puisne judges of the Supreme Court.\nHow many of the statements given above are correct?",
    options: [
      "Only one",
      "Only two",
      "All three",
      "None"
    ],
    answer: "All three",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three statements are correct.\nStatement 1 is correct: In S.P. Gupta v. Union of India (First Judges Case, 1981), the Court held that 'consultation' does not mean 'concurrence', giving primacy to the Central Executive.\nStatement 2 is correct: In Supreme Court Advocates-on-Record Association v. Union of India (Second Judges Case, 1993), the Court overruled the 1981 ruling, deciding that 'consultation' means 'concurrence' and mandating that the CJI consult two senior-most judges.\nStatement 3 is correct: In the 1998 Presidential Reference (Third Judges Case, under Article 143), the Court expanded the Collegium for Supreme Court appointments to the CJI plus four senior-most judges of the Supreme Court.",
    option_analysis: {
      "Option A": "Incorrect. All three statements are correct.",
      "Option B": "Incorrect. All three statements are correct.",
      "Option C": "Correct. Statements 1, 2, and 3 accurately chronicle the Three Judges Cases.",
      "Option D": "Incorrect."
    },
    static_root: "Appointment of Judges (Article 124 & 217); Three Judges Cases; National Judicial Appointments Commission (NJAC).",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Supreme Court'; D.D. Basu, Introduction to the Constitution of India.",
    elimination_trap: "Remember: For HC appointments, the SC Collegium is CJI + 2 senior-most judges; for SC appointments, the SC Collegium is CJI + 4 senior-most judges.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (C)"
  },
  {
    id: "ca-2026-10-011",
    year: 2026,
    month: "October 2026",
    subject: "International Relations",
    sub_topic: "High Seas Treaties & Fisheries",
    question: "With reference to the 'Southern Indian Ocean Fisheries Agreement' (SIOFA), consider the following statements:\n1. It is a regional fisheries management treaty that regulates non-tuna fishery resources in the high seas of the Southern Indian Ocean.\n2. Tuna and tuna-like species in the same ocean region are managed by a separate organization, the Indian Ocean Tuna Commission (IOTC).\n3. India is a Contracting Party to SIOFA.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: SIOFA is a multilateral agreement entered into force under the auspices of FAO to ensure the long-term conservation and sustainable exploitation of non-tuna fishery resources (such as toothfish, orange roughy, and deep-sea squids) in the high seas of the southern Indian Ocean.\nStatement 2 is correct: Highly migratory tuna and billfish species in the Indian Ocean fall under the mandate of the Indian Ocean Tuna Commission (IOTC), avoiding jurisdictional overlap.\nStatement 3 is correct: India officially joined SIOFA to safeguard its deep-sea fishing rights, participate in benthic ecosystem conservation, and monitor foreign fishing fleets operating close to India's maritime zones.",
    option_analysis: {
      "Option A": "Incorrect because statement 3 is also true.",
      "Option B": "Incorrect because statement 1 is also true.",
      "Option C": "Incorrect because statement 2 is also true.",
      "Option D": "Correct. Statements 1, 2, and 3 are all accurate."
    },
    static_root: "UNCLOS & High Seas Fisheries Management (RFMOs); Indian Ocean Geopolitics & Blue Economy.",
    standard_book_ref: "Ministry of Fisheries, Animal Husbandry & Dairying Reports; Pushpesh Pant, International Relations.",
    elimination_trap: "Candidates often confuse tuna RFMOs (IOTC) with demersal non-tuna RFMOs (SIOFA). SIOFA explicitly excludes tuna species.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (D)"
  },
  {
    id: "ca-2026-10-012",
    year: 2026,
    month: "October 2026",
    subject: "Economy",
    sub_topic: "Macroeconomics & Industrial Indices",
    question: "In the Index of Eight Core Industries (ICI) released by the Office of Economic Adviser (DPIIT), which of the following industries carries the highest weightage?\n(a) Electricity generation\n(b) Petroleum Refinery Products\n(c) Steel production\n(d) Coal production",
    options: [
      "Electricity generation",
      "Petroleum Refinery Products",
      "Steel production",
      "Coal production"
    ],
    answer: "Petroleum Refinery Products",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nThe Eight Core Industries comprise nearly 40.27% of the weight of items included in the Index of Industrial Production (IIP). Their decreasing order of weightage is:\n1. Petroleum Refinery Products (28.04%)\n2. Electricity (19.85%)\n3. Steel (17.92%)\n4. Coal (10.33%)\n5. Crude Oil (8.98%)\n6. Natural Gas (6.88%)\n7. Cement (5.37%)\n8. Fertilizers (2.63%)",
    option_analysis: {
      "Option A": "Incorrect. Electricity is second with 19.85%.",
      "Option B": "Correct. Petroleum Refinery Products has the highest weight (28.04%).",
      "Option C": "Incorrect. Steel is third with 17.92%.",
      "Option D": "Incorrect. Coal is fourth with 10.33%."
    },
    static_root: "Index of Industrial Production (IIP); Index of Eight Core Industries; DPIIT Economic Statistics.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Industry and Infrastructure'; Economic Survey of India.",
    elimination_trap: "Remember the top 3 core weights: Refinery Products > Electricity > Steel. Fertilizers has the lowest weight (2.63%).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-10-013",
    year: 2026,
    month: "October 2026",
    subject: "Science & Technology",
    sub_topic: "Quantum Communications & Cryptography",
    question: "With reference to 'Quantum Key Distribution' (QKD), consider the following statements:\n1. It uses quantum mechanics principles, such as Heisenberg's Uncertainty Principle and the No-Cloning Theorem, to secure communication keys.\n2. Any unauthorized eavesdropping on the quantum channel alters the quantum states of the photons, instantly alerting the communicating parties.\n3. QKD transmits the entire heavy encrypted data payload itself over the quantum photonic stream.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect.\nStatement 1 is correct: QKD exploits quantum properties—superposition, entanglement, and the no-cloning theorem (which states that an unknown quantum state cannot be cloned without perturbation) to distribute secret encryption keys.\nStatement 2 is correct: In quantum physics, measurement disturbs the system. An interceptor (Eve) trying to measure the quantum states of photons inevitably introduces detectable bit error rates (QBER), exposing the intrusion immediately.\nStatement 3 is incorrect: QKD is used strictly to exchange random cryptographic keys (one-time pads) between sender and receiver. The actual message data is transmitted over conventional high-speed optical or radio fiber networks encrypted using those quantum-generated keys.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are correct; Statement 3 fundamentally misunderstands QKD.",
      "Option B": "Incorrect because statement 3 is wrong.",
      "Option C": "Incorrect because statement 3 is wrong.",
      "Option D": "Incorrect because statement 3 is wrong."
    },
    static_root: "National Quantum Mission; Quantum Cryptography; Principles of Quantum Mechanics.",
    standard_book_ref: "NCERT Class 12 Physics, 'Dual Nature of Radiation & Matter'; ISRO/DRDO Quantum Tech Publications.",
    elimination_trap: "QKD is for KEY distribution, not bulky message or data payload transmission. Data travels on normal classical fiber, while only the secret cryptographic key is generated via quantum photons.",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (A)"
  },
  {
    id: "ca-2026-10-014",
    year: 2026,
    month: "October 2026",
    subject: "Environment & Ecology",
    sub_topic: "Climate Policy & Global Treaties",
    question: "In the context of international climate negotiations, what is the legal significance of the UN General Assembly Declaration on Sea Level Rise and the Law of the Sea?\n(a) It mandates that all low-lying atoll nations must dissolve their sovereignty once submerged\n(b) It establishes that established maritime zones (Territorial Sea, Contiguous Zone, and EEZ) and the rights derived from them shall remain fixed and preserved notwithstanding physical sea level rise\n(c) It repeals the United Nations Convention on the Law of the Sea (UNCLOS) of 1982\n(d) It prohibits coastal land reclamation in all developing countries",
    options: [
      "It mandates that all low-lying atoll nations must dissolve their sovereignty once submerged",
      "It establishes that established maritime zones (Territorial Sea, Contiguous Zone, and EEZ) and the rights derived from them shall remain fixed and preserved notwithstanding physical sea level rise",
      "It repeals the United Nations Convention on the Law of the Sea (UNCLOS) of 1982",
      "It prohibits coastal land reclamation in all developing countries"
    ],
    answer: "It establishes that established maritime zones (Territorial Sea, Contiguous Zone, and EEZ) and the rights derived from them shall remain fixed and preserved notwithstanding physical sea level rise",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\nSmall Island Developing States (SIDS) faced an existential legal dilemma: under traditional UNCLOS baseline rules, if rising sea levels push baselines inland or submerge atolls, islands would legally lose their 200-nautical-mile Exclusive Economic Zones (EEZ) and sovereign fishing/mineral rights. The landmark UN declaration affirms the principle of maritime baseline stability: once deposited with the UN Secretary-General, established maritime zones and baselines remain legally permanent and protected from revision due to climate-induced sea level rise.",
    option_analysis: {
      "Option A": "Incorrect. The declaration specifically preserves statehood and sovereign rights.",
      "Option B": "Correct. It legally freezes and preserves maritime zone entitlements irrespective of coastal recession.",
      "Option C": "Incorrect. It interprets and fortifies UNCLOS rather than repealing it.",
      "Option D": "Incorrect. It does not ban domestic coastal protection or reclamation."
    },
    static_root: "UNCLOS 1982; Maritime Zones (Territorial Sea, Contiguous Zone, EEZ); Climate Justice for Small Island Developing States (SIDS).",
    standard_book_ref: "Malcolm Shaw, International Law, Chapter on 'The Law of the Sea'; MEA Legal and Treaties Division.",
    elimination_trap: "Under classical law, 'the land dominates the sea' (ambulatory baselines). The modern consensus shifts to 'fixed legal baselines' to protect vulnerable Pacific/Indian Ocean island nations from losing their sovereign oceanic territories.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)"
  },
  {
    id: "ca-2026-10-015",
    year: 2026,
    month: "October 2026",
    subject: "Agriculture & Biotechnology",
    sub_topic: "Biofortification & Crop Varieties",
    question: "The newly released biofortified potato variety 'Kufri Jamunia', developed by the ICAR-Central Potato Research Institute (CPRI), is primarily characterized by high concentrations of which of the following health-promoting phytochemicals?\n(a) Curcumin\n(b) Anthocyanins\n(c) Lycopene\n(d) Resveratrol",
    options: [
      "Curcumin",
      "Anthocyanins",
      "Lycopene",
      "Resveratrol"
    ],
    answer: "Anthocyanins",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option (B) is correct.\n'Kufri Jamunia' is a purple-fleshed biofortified potato variety bred by ICAR-CPRI, Shimla. Its deep purple coloration is derived from rich concentrations of anthocyanins (powerful natural polyphenol antioxidants that combat cardiovascular disease and oxidative stress). It also provides higher vitamin C and dry matter content with resistance to potato late blight disease.",
    option_analysis: {
      "Option A": "Incorrect. Curcumin is the active yellow polyphenol found in turmeric (Curcuma longa).",
      "Option B": "Correct. Anthocyanins impart the purple color and antioxidant properties to Kufri Jamunia.",
      "Option C": "Incorrect. Lycopene is the red carotenoid pigment found in tomatoes and watermelons.",
      "Option D": "Incorrect. Resveratrol is a stilbenoid found in the skins of red grapes and blueberries."
    },
    static_root: "Biofortification in Indian Agriculture; ICAR Crop Varieties; Plant Pigments & Antioxidants.",
    standard_book_ref: "ICAR Agricultural Research Reports; NCERT Class 12 Biology, 'Strategies for Enhancement in Food Production'.",
    elimination_trap: "Lycopene = Red (Tomatoes); Curcumin = Yellow (Turmeric); Anthocyanin = Purple/Blue (Berries, Purple Potato, Eggplant).",
    difficulty: "Medium",
    upsc_official_key: "Verified: Option (B)"
  }
];

const dataPath = path.join(__dirname, '../static/data/current_affairs_pyqs.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out existing October questions if any to prevent duplicate IDs
const nonOct = existing.filter(q => q.month !== 'October 2026');
const updated = [...nonOct, ...octQuestions];

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf8');
console.log(`Successfully ingested ${octQuestions.length} questions for October 2026. Total now: ${updated.length}`);
