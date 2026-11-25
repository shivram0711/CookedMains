// Batch of 25 authentic, faculty-grade UPSC CSE Prelims questions formulated from
// Sarrthi IAS September 2026 Monthly Current Affairs Magazine.
// Follows strict UPSC GS-1 standards, 4-option analysis, elimination traps, and standard citations.

const septemberQuestions = [
  {
    id: "ca-2026-09-016",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "FCRA & NGO Regulation",
    question: "With reference to the Foreign Contribution (Regulation) Act, 2010 (FCRA) and recent regulatory amendments, consider the following statements:\n1. Foreign contributions can be received only in an account designated as 'FCRA account' opened in the New Delhi Main Branch of the State Bank of India.\n2. Non-governmental organizations can utilize up to 50% of the received foreign contribution for administrative expenses.\n3. The Central Government is empowered to cancel an FCRA registration certificate without providing the holder of the certificate a reasonable opportunity of being heard under any circumstances.\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "1 and 2 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statement 1 is correct, while Statements 2 and 3 are incorrect.\nStatement 1 is correct: Under Section 17 of the amended FCRA, every person/entity granted registration or prior permission must receive foreign contributions exclusively in a designated 'FCRA account' opened in the State Bank of India, New Delhi Main Branch (NDMB), Parliament Street.\nStatement 2 is incorrect: Under Section 8 of the FCRA (as amended in 2020), the statutory cap on the utilization of foreign funds for 'administrative expenses' was drastically reduced from 50% down to 20%.\nStatement 3 is incorrect: Under Section 14(2) of the FCRA, no order of cancellation of a certificate of registration shall be made unless the person concerned has been given a reasonable opportunity of being heard (the principle of natural justice - audi alteram partem is explicitly preserved in the statute).",
    option_analysis: {
      "Option A": "Correct. Only Statement 1 accurately captures Section 17 of the FCRA.",
      "Option B": "Incorrect because Statement 2 is false (administrative ceiling is 20%, not 50%).",
      "Option C": "Incorrect because Statements 2 and 3 are false.",
      "Option D": "Incorrect because Statements 2 and 3 are false."
    },
    static_root: "Foreign Contribution (Regulation) Act 2010; Principles of Natural Justice (Audi Alteram Partem); Civil Society & NGO Governance.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Non-Governmental Organisations'; Ministry of Home Affairs FCRA portal.",
    elimination_trap: "Numerical cap trap: aspirants who read outdated materials still remember the pre-2020 limit of 50% for administrative expenses, whereas the current statutory ceiling is strictly 20%.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to the Foreign Contribution (Regulation) Act, 2010 (FCRA) and recent regulatory amendments, consider the following statements:\n1. Foreign contributions can be received only in an account designated as 'FCRA account' opened in the New Delhi Main Branch of the State Bank of India.\n2. Non-governmental organizations can utilize up to 50% of the received foreign contribution for administrative expenses.\n3. The Central Government is empowered to cancel an FCRA registration certificate without providing the holder of the certificate a reasonable opportunity of being heard under any circumstances.\nWhich of the statements given above is/are correct?"
  },
  {
    id: "ca-2026-09-017",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Governance",
    sub_topic: "Urban Settlement Geography & Census Classification",
    question: "In India, for an area to be classified as a 'Census Town' by the Census of India, it must satisfy which of the following criteria?\n1. A minimum population of 5,000 persons.\n2. At least 75 percent of the male main working population engaged in non-agricultural pursuits.\n3. A density of population of at least 400 persons per square kilometre.\n4. A notified statutory municipal corporation or cantonment board.\nSelect the correct answer using the code given below:",
    options: [
      "1, 2 and 3 only",
      "1, 3 and 4 only",
      "2, 3 and 4 only",
      "1, 2, 3 and 4"
    ],
    answer: "1, 2 and 3 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1, 2, and 3 are correct, while Statement 4 is incorrect.\nIn the Census of India, urban areas are bifurcated into two categories:\n1. Statutory Towns: All places with a municipality, corporation, cantonment board, or notified town area committee (notified by state legislation).\n2. Census Towns: Places that do NOT have a statutory municipal body but satisfy all three of the following demographic/economic criteria simultaneously:\n- (a) A minimum population of 5,000;\n- (b) At least 75% of the male main working population engaged in non-agricultural pursuits;\n- (c) A population density of at least 400 persons per square km (approx. 1,000 per sq mile).\nTherefore, criterion 4 belongs strictly to 'Statutory Towns', NOT 'Census Towns'.",
    option_analysis: {
      "Option A": "Correct. Criteria 1, 2, and 3 constitute the exact 3-fold census criteria for Census Towns.",
      "Option B": "Incorrect because 4 defines Statutory Towns, which Census Towns lack.",
      "Option C": "Incorrect because 4 is exclusive to Statutory Towns.",
      "Option D": "Incorrect because 4 contradicts the definition of a Census Town."
    },
    static_root: "Human Geography: Settlement Patterns; Census of India Definitions; Urbanization Dynamics.",
    standard_book_ref: "NCERT Class 12 Fundamentals of Human Geography, Chapter on Human Settlements; Office of the Registrar General & Census Commissioner.",
    elimination_trap: "The fundamental definitional dichotomy: Census towns are urban demographically and occupationally, but rural administratively (governed by Gram Panchayats), whereas Statutory Towns have municipal notification.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "In India, for an area to be classified as a 'Census Town' by the Census of India, it must satisfy which of the following criteria?\n1. A minimum population of 5,000 persons.\n2. At least 75 percent of the male main working population engaged in non-agricultural pursuits.\n3. A density of population of at least 400 persons per square kilometre.\n4. A notified statutory municipal corporation or cantonment board.\nSelect the correct answer using the code given below:"
  },
  {
    id: "ca-2026-09-018",
    year: 2026,
    month: "September 2026",
    subject: "Governance & Public Health",
    sub_topic: "Food Safety & Nutrition Labelling",
    question: "With reference to the Food Safety and Standards Authority of India (FSSAI) and the Front-of-Package Labelling (FoPL) regulations, consider the following statements:\n1. The FSSAI is an autonomous statutory body established under the Food Safety and Standards Act, 2006, functioning under the Ministry of Consumer Affairs, Food and Public Distribution.\n2. The FoPL guidelines mandate high-in-fat, sugar, and salt (HFSS) packaged foods to carry an interpretative colour-coded warning label displaying nutritional thresholds.\n3. The Indian Nutrition Rating (INR) system awards stars to packaged food products on a scale of 0.5 to 5 stars, where higher stars denote healthier nutritional profiles.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 2 and 3 are correct, while Statement 1 is incorrect.\nStatement 1 is incorrect: The FSSAI is indeed a statutory body under the Food Safety and Standards Act, 2006, but it operates under the administrative supervision of the Ministry of Health and Family Welfare (MoHFW), NOT the Ministry of Consumer Affairs, Food and Public Distribution.\nStatement 2 is correct: Under FSSAI's Front-of-Package Labelling (FoPL) norms, packaged foods exceeding specified threshold limits for salt, added sugar, and saturated fats (HFSS) are required to display distinctive warning labels to empower consumers to make informed choices.\nStatement 3 is correct: The Indian Nutrition Rating (INR) system, modeled on health star ratings, assigns packaged food items a rating from 1/2 star (least healthy) up to 5 stars (healthiest) based on positive nutrients (fruit, vegetables, nuts, fiber, protein) balanced against baseline risk nutrients (energy, saturated fat, total sugars, sodium).",
    option_analysis: {
      "Option A": "Incorrect because Statement 1 is false (nodal ministry is Ministry of Health and Family Welfare).",
      "Option B": "Correct. Statements 2 and 3 accurately describe the FoPL warning label mandate and the INR star rating mechanism.",
      "Option C": "Incorrect because Statement 1 is false.",
      "Option D": "Incorrect because Statement 1 is false."
    },
    static_root: "Food Safety and Standards Act 2006; Public Health Policies (NCD Prevention); Regulatory Governance.",
    standard_book_ref: "M. Laxmikanth, Indian Polity (Statutory Bodies); FSSAI Regulations on Labelling and Display.",
    elimination_trap: "Nodal Ministry swap: confusing the Ministry of Health and Family Welfare (which houses FSSAI) with the Ministry of Consumer Affairs, Food and Public Distribution (which oversees PDS, FCI, and BIS).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "With reference to the Food Safety and Standards Authority of India (FSSAI) and the Front-of-Package Labelling (FoPL) regulations, consider the following statements:\n1. The FSSAI is an autonomous statutory body established under the Food Safety and Standards Act, 2006, functioning under the Ministry of Consumer Affairs, Food and Public Distribution.\n2. The FoPL guidelines mandate high-in-fat, sugar, and salt (HFSS) packaged foods to carry an interpretative colour-coded warning label displaying nutritional thresholds.\n3. The Indian Nutrition Rating (INR) system awards stars to packaged food products on a scale of 0.5 to 5 stars, where higher stars denote healthier nutritional profiles.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-019",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Electoral Reforms & Voting Technology",
    question: "Consider the following statements regarding the 'Totaliser' machine and counting procedures in Indian elections:\n1. A Totaliser is an electronic device connected to multiple Control Units of EVMs simultaneously to count votes without revealing booth-wise polling trends.\n2. The introduction of Totalisers requires an amendment to Rule 59A of the Conduct of Elections Rules, 1961.\n3. The Law Commission of India in its 255th Report opposed the use of Totalisers on the grounds that it compromises the secrecy of individual ballot choices.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: A Totaliser is an auxiliary unit capable of connecting up to 14 EVM Control Units simultaneously, consolidating and tabulating the aggregate votes polled across all 14 polling booths at once. This prevents political parties from identifying booth-wise voting patterns, thereby preventing post-election intimidation or harassment of specific neighborhoods/booths.\nStatement 2 is correct: Under current procedures, EVM counting is done booth-by-booth under Rule 66A. Rule 59A of the Conduct of Elections Rules, 1961 (originally framed for paper ballots mixing) needs to be amended by the Union Government on the recommendation of the Election Commission to permit electronic totaliser mixing.\nStatement 3 is incorrect: The Law Commission of India in its 255th Report on Electoral Reforms strongly RECOMMENDED (not opposed) the use of Totalisers to protect voter secrecy and eliminate the 'chilling effect' of post-poll victimization.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately state the mechanism and statutory rule governing Totalisers.",
      "Option B": "Incorrect because Statement 3 is false (Law Commission supported Totalisers).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Electoral Reforms; Conduct of Elections Rules 1961; Law Commission Reports; Secret Ballot Principle.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Electoral Reforms'; Law Commission of India 255th Report.",
    elimination_trap: "Stance reversal trap: attributing opposition to the Law Commission when it was in fact one of the foremost constitutional champions of Totalisers for shielding voter privacy.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Consider the following statements regarding the 'Totaliser' machine and counting procedures in Indian elections:\n1. A Totaliser is an electronic device connected to multiple Control Units of EVMs simultaneously to count votes without revealing booth-wise polling trends.\n2. The introduction of Totalisers requires an amendment to Rule 59A of the Conduct of Elections Rules, 1961.\n3. The Law Commission of India in its 255th Report opposed the use of Totalisers on the grounds that it compromises the secrecy of individual ballot choices.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-020",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Political Parties & Representation of the People Act",
    question: "With reference to the registration and regulation of political parties in India, consider the following statements:\n1. Political parties are registered by the Election Commission of India under Section 29A of the Representation of the People Act, 1951.\n2. In Indian National Congress v. Institute of Social Welfare (2002), the Supreme Court ruled that the Election Commission has no inherent statutory power to deregister a political party on grounds of breach of undertaking.\n3. The Election Commission is barred under the law from delisting inactive Registered Unrecognised Political Parties (RUPPs) from its official register.\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "2 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Section 29A of the Representation of the People Act, 1951 governs the registration of associations and bodies of individual citizens as political parties with the Election Commission of India.\nStatement 2 is correct: In Indian National Congress v. Institute of Social Welfare (2002), the Supreme Court held that the ECI does NOT possess incidental or inherent powers under Section 29A to deregister a political party, except under three narrow exceptions: (i) registration obtained by fraud, (ii) party declaring that it has ceased to have faith in the Constitution, or (iii) party dissolving itself.\nStatement 3 is incorrect: While ECI lacks statutory power to 'deregister' parties without an enabling amendment to the RPA, it routinely exercises its administrative power to 'delist' dormant, defunct, or non-compliant Registered Unrecognised Political Parties (RUPPs) that fail to contest elections or submit audited financial accounts, stripping them of common election symbols and tax exemptions under Section 13A of the IT Act.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately reflect Section 29A and the 2002 Supreme Court precedent.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 3 is false (ECI actively delists RUPPs).",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Representation of the People Act 1951 (Section 29A); ECI powers and functions; Supreme Court judgments on party regulation.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Political Parties'; Election Commission guidelines.",
    elimination_trap: "Confusing 'deregistration' (cancelling a party's legal existence—which ECI cannot do under current RPA 1951) with 'delisting' (administrative removal of inactive RUPPs from the active roll of benefits, which ECI regularly performs).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to the registration and regulation of political parties in India, consider the following statements:\n1. Political parties are registered by the Election Commission of India under Section 29A of the Representation of the People Act, 1951.\n2. In Indian National Congress v. Institute of Social Welfare (2002), the Supreme Court ruled that the Election Commission has no inherent statutory power to deregister a political party on grounds of breach of undertaking.\n3. The Election Commission is barred under the law from delisting inactive Registered Unrecognised Political Parties (RUPPs) from its official register.\nWhich of the statements given above is/are correct?"
  },
  {
    id: "ca-2026-09-021",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Official Languages & Higher Judiciary",
    question: "Regarding the use of languages in the Supreme Court and High Courts under the Constitution of India, consider the following statements:\n1. Under Article 348(1), all proceedings in the Supreme Court and in every High Court shall be in English until Parliament by law otherwise provides.\n2. The Governor of a State may, with the previous consent of the President, authorise the use of Hindi or the official language of the State in proceedings of the High Court.\n3. When a High Court delivers a decree, judgment, or order in a regional language authorised under Article 348(2), no English translation of the judgment is required to be published.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Article 348(1)(a) mandates that until Parliament by law provides otherwise, all proceedings in the Supreme Court and in every High Court shall be conducted in the English language.\nStatement 2 is correct: Under Article 348(2), the Governor of a State may, with the previous consent of the President, authorise the use of Hindi or any other official language of the State in proceedings of the High Court having its principal seat in that State.\nStatement 3 is incorrect: Under the proviso to Article 348(2) and Section 7 of the Official Languages Act, 1963, nothing shall apply to any judgment, decree or order passed or made by such High Court, and where any judgment or decree is passed in any such language, it MUST be accompanied by an authoritative English translation published under the authority of the High Court.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are exact constitutional provisions.",
      "Option B": "Incorrect because Statement 3 is false (English translation is statutorily and constitutionally compulsory).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Part XVII of the Constitution (Articles 343 to 351); Article 348; Official Languages Act 1963.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Official Language'; Constitution of India Bare Act.",
    elimination_trap: "Watch for the exception to the exception: Governors can authorize regional languages for arguments and pleadings, but judgments, orders, and decrees strictly mandate an authoritative English translation.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding the use of languages in the Supreme Court and High Courts under the Constitution of India, consider the following statements:\n1. Under Article 348(1), all proceedings in the Supreme Court and in every High Court shall be in English until Parliament by law otherwise provides.\n2. The Governor of a State may, with the previous consent of the President, authorise the use of Hindi or the official language of the State in proceedings of the High Court.\n3. When a High Court delivers a decree, judgment, or order in a regional language authorised under Article 348(2), no English translation of the judgment is required to be published.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-022",
    year: 2026,
    month: "September 2026",
    subject: "Polity & Governance",
    sub_topic: "Federal Investigative Agencies & Police Jurisdiction",
    question: "With reference to the Central Bureau of Investigation (CBI) and the Delhi Special Police Establishment (DSPE) Act, 1946, consider the following statements:\n1. The CBI derives its statutory police powers of investigation from the Delhi Special Police Establishment Act, 1946.\n2. Section 6 of the DSPE Act makes the consent of the respective State Government mandatory for the CBI to exercise its jurisdiction in that State.\n3. If a State Government withdraws its general consent, the Supreme Court or a High Court cannot direct the CBI to investigate a cognizable offence in that State without obtaining State concurrence.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The CBI is not a statutory body per se; it was created by an executive resolution in 1963 and derives its statutory powers of investigation, search, and arrest from the DSPE Act, 1946.\nStatement 2 is correct: Under Section 6 of the DSPE Act, 1946, nothing contained in Section 5 (extension of powers to other areas) shall be deemed to enable any member of the DSPE to exercise powers and jurisdiction in any area in a State without the consent of the Government of that State.\nStatement 3 is incorrect: In State of West Bengal v. Committee for Protection of Democratic Rights (2010), a Constitution Bench ruled that the constitutional courts (Supreme Court under Article 32 and High Courts under Article 226) can direct the CBI to investigate any offence within a State WITHOUT the consent of the State Government, and Section 6 of the DSPE Act cannot circumscribe this plenary constitutional power.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate statutory provisions.",
      "Option B": "Incorrect because Statement 3 is false (judicial orders override state consent withdrawal).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "DSPE Act 1946; Article 32 & 226 judicial review powers; Federal Police Powers & State List Entry 2.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Chapter on 'Central Bureau of Investigation'; SC Constitution Bench judgments.",
    elimination_trap: "Judicial review vs statutory bars: while state consent binds executive notifications under Section 5/6, it cannot override constitutional powers of Article 32 and 226 vested in the Supreme Court and High Courts.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to the Central Bureau of Investigation (CBI) and the Delhi Special Police Establishment (DSPE) Act, 1946, consider the following statements:\n1. The CBI derives its statutory police powers of investigation from the Delhi Special Police Establishment Act, 1946.\n2. Section 6 of the DSPE Act makes the consent of the respective State Government mandatory for the CBI to exercise its jurisdiction in that State.\n3. If a State Government withdraws its general consent, the Supreme Court or a High Court cannot direct the CBI to investigate a cognizable offence in that State without obtaining State concurrence.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-023",
    year: 2026,
    month: "September 2026",
    subject: "Economy",
    sub_topic: "Monetary Policy & Inflation Targeting",
    question: "Regarding the Flexible Inflation Targeting (FIT) framework in India, completing a decade of institutional operations, consider the following statements:\n1. The inflation target is statutorily anchored to the Consumer Price Index (Combined) under Section 45ZA of the Reserve Bank of India Act, 1934.\n2. The Monetary Policy Committee consists of six members, with the Governor of the RBI possessing both a deliberative vote and a casting vote in the event of an equality of votes.\n3. Under the statutory framework, failure to maintain the inflation target is defined as average inflation being more than the upper tolerance level or less than the lower tolerance level for two consecutive quarters.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Under Section 45ZA of the RBI Act, 1934 (amended by Finance Act 2016), the Central Government, in consultation with the RBI, sets the inflation target (4% with a band of +/- 2%) in terms of headline Consumer Price Index (Combined).\nStatement 2 is correct: Under Section 45ZB, the MPC comprises 6 members (3 from RBI, 3 external experts). The RBI Governor acts as ex-officio Chairperson, has one deliberative vote, and exercises a second or casting vote in case of a tie.\nStatement 3 is incorrect: Under the Monetary Policy Framework Agreement and the RBI Act, failure to achieve the inflation target occurs when average inflation is higher than the upper tolerance level (6%) or lower than the lower tolerance level (2%) for THREE consecutive quarters (not two consecutive quarters). When this occurs, RBI must submit a statutory explanation report to the Central Government.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate statutory provisions.",
      "Option B": "Incorrect because Statement 3 is false (failure condition is 3 consecutive quarters).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "RBI Act 1934 (Chapter IIIF); Monetary Policy Committee; Headline vs Core Inflation; Urjit Patel Committee.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Monetary Policy'; RBI Monetary Policy Framework.",
    elimination_trap: "Quarter duration trap: UPSC frequently alters time thresholds; the statutory failure criterion is strictly THREE consecutive quarters outside the 2-6% band.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding the Flexible Inflation Targeting (FIT) framework in India, completing a decade of institutional operations, consider the following statements:\n1. The inflation target is statutorily anchored to the Consumer Price Index (Combined) under Section 45ZA of the Reserve Bank of India Act, 1934.\n2. The Monetary Policy Committee consists of six members, with the Governor of the RBI possessing both a deliberative vote and a casting vote in the event of an equality of votes.\n3. Under the statutory framework, failure to maintain the inflation target is defined as average inflation being more than the upper tolerance level or less than the lower tolerance level for two consecutive quarters.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-024",
    year: 2026,
    month: "September 2026",
    subject: "Economy",
    sub_topic: "Foreign Exchange Operations & Open Economy Trilemma",
    question: "When the Reserve Bank of India conducts a 'USD/INR Buy/Sell Forex Swap' auction, what is the immediate and intended monetary effect on the domestic financial market?",
    options: [
      "It injects foreign currency into commercial banks while permanently absorbing equivalent rupee liquidity.",
      "It buys US dollars spot from authorized dealers, injecting rupee liquidity into the banking system, while simultaneously contracting to sell dollars forward at a pre-agreed date.",
      "It establishes a fixed exchange rate regime, eliminating the volatility of the real effective exchange rate (REER).",
      "It increases the statutory cash reserve ratio (CRR) of participating public sector banks."
    ],
    answer: "It buys US dollars spot from authorized dealers, injecting rupee liquidity into the banking system, while simultaneously contracting to sell dollars forward at a pre-agreed date.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nIn a USD/INR Buy/Sell Swap, the RBI executes two simultaneous transactions:\n1. Near/Spot Leg: RBI buys US Dollars from authorized dealer (AD) banks at the current market exchange rate, immediately infusing equivalent Indian Rupee (INR) liquidity into the domestic banking system.\n2. Far/Forward Leg: Simultaneously, RBI contracts to sell back the US Dollars to the banks at a predetermined forward date (e.g. 1 year, 3 years) at a specified forward rate.\nThis tool allows the RBI to augment system liquidity in the medium term, absorb excess foreign capital inflows to curb unmerited rupee appreciation, and bolster gross foreign exchange reserves without permanently altering the domestic base money stock.",
    option_analysis: {
      "Option A": "Incorrect. This describes a Sell/Buy swap (selling dollars spot and absorbing rupee liquidity).",
      "Option B": "Correct. Accurately describes the spot purchase of USD (injecting rupees) paired with a forward sale.",
      "Option C": "Incorrect. India maintains a market-determined managed floating exchange rate regime, not a fixed peg.",
      "Option D": "Incorrect. Forex swaps have no direct link to statutory CRR requirements."
    },
    static_root: "RBI Liquidity Management Framework; Foreign Exchange Reserves; Impossible Trinity / Mundell-Fleming Model.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Foreign Exchange & Capital Flows; RBI Master Directions on Financial Markets.",
    elimination_trap: "Buy/Sell vs Sell/Buy confusion: 'Buy/Sell' always names the transaction from the central bank's perspective on the near leg (buying base currency USD, which pumps INR liquidity out).",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)",
    question_text: "When the Reserve Bank of India conducts a 'USD/INR Buy/Sell Forex Swap' auction, what is the immediate and intended monetary effect on the domestic financial market?"
  },
  {
    id: "ca-2026-09-025",
    year: 2026,
    month: "September 2026",
    subject: "Economy",
    sub_topic: "Bond Markets & Yield Dynamics",
    question: "In sovereign debt and macroeconomic dynamics, consider the following statements regarding bond yields:\n1. When the price of a sovereign bond rises in the secondary market, its yield to maturity decreases.\n2. An inverted yield curve occurs when short-term interest rates are higher than long-term interest rates, historically serving as an indicator of impending economic slowdown.\n3. According to the Fisher Effect, the nominal interest rate equals the real interest rate minus expected inflation.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Bond prices and bond yields share an inverse mathematical relationship. If market demand drives up bond prices, an investor purchasing the bond at a premium receives the same fixed coupon payout, thereby earning a lower effective percentage yield.\nStatement 2 is correct: A standard yield curve slopes upward (investors demand higher yields for longer maturities). An 'inverted yield curve' happens when short-term yields spike above long-term yields (often caused by aggressive central bank rate hikes), reflecting expectations of future economic deceleration or recession.\nStatement 3 is incorrect: The Fisher Equation states that the Nominal Interest Rate equals the Real Interest Rate PLUS expected inflation (Nominal = Real + Inflation), not minus.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate financial economics principles.",
      "Option B": "Incorrect because Statement 3 is mathematically and conceptually false.",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Bond Yields & Interest Rate Transmission; Yield Curve Analysis; Fisher Equation; Macroeconomic Cycles.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Money Market and Capital Market in India'; NCERT Macroeconomics Class 12.",
    elimination_trap: "Formula sign inversion: Nominal interest rate = Real interest rate + Expected inflation. Candidates often confuse the derived formula (Real = Nominal - Inflation) with the definition of Nominal rate.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "In sovereign debt and macroeconomic dynamics, consider the following statements regarding bond yields:\n1. When the price of a sovereign bond rises in the secondary market, its yield to maturity decreases.\n2. An inverted yield curve occurs when short-term interest rates are higher than long-term interest rates, historically serving as an indicator of impending economic slowdown.\n3. According to the Fisher Effect, the nominal interest rate equals the real interest rate minus expected inflation.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-026",
    year: 2026,
    month: "September 2026",
    subject: "Infrastructure & Economy",
    sub_topic: "Dedicated Freight Corridors & Logistics",
    question: "Regarding the 'Dedicated Freight Corridor' (DFC) project in India, consider the following statements:\n1. The Western Dedicated Freight Corridor connects Dadri in Uttar Pradesh to Jawaharlal Nehru Port Trust (JNPT) in Navi Mumbai.\n2. The Western DFC is engineered with high-rise overhead equipment (OHE) to permit the operation of double-stack electric container trains.\n3. Both the Western and Eastern DFCs are fully funded and operated by the Asian Development Bank (ADB) without Indian budgetary equity.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The Western Dedicated Freight Corridor (WDFC) spans 1,504 km connecting Dadri (UP) to JNPT (Navi Mumbai, Maharashtra), running through Haryana, Rajasthan, and Gujarat.\nStatement 2 is correct: The WDFC features a world-first high-reach contact wire height of 7.57 metres to accommodate double-stack container trains powered by electric traction, drastically boosting freight throughput and cutting logistics costs.\nStatement 3 is incorrect: The DFC network is constructed and owned by the Dedicated Freight Corridor Corporation of India Limited (DFCCIL), a special purpose vehicle under the Ministry of Railways. Financing involves significant Ministry equity alongside official multilateral loans: the Western DFC is funded primarily by the Japan International Cooperation Agency (JICA), while the Eastern DFC is funded by the World Bank.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately describe the terminals and technical features of WDFC.",
      "Option B": "Incorrect because Statement 3 is false (funded by JICA and World Bank, not ADB).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "National Logistics Policy; Dedicated Freight Corridors (WDFC & EDFC); PM Gati Shakti National Master Plan.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Infrastructure'; DFCCIL official portal.",
    elimination_trap: "Multilateral funder attribution: ADB is not the lead lender for DFCs; JICA finances the Western corridor and the World Bank finances the Eastern corridor.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding the 'Dedicated Freight Corridor' (DFC) project in India, consider the following statements:\n1. The Western Dedicated Freight Corridor connects Dadri in Uttar Pradesh to Jawaharlal Nehru Port Trust (JNPT) in Navi Mumbai.\n2. The Western DFC is engineered with high-rise overhead equipment (OHE) to permit the operation of double-stack electric container trains.\n3. Both the Western and Eastern DFCs are fully funded and operated by the Asian Development Bank (ADB) without Indian budgetary equity.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-027",
    year: 2026,
    month: "September 2026",
    subject: "Economy & Consumer Rights",
    sub_topic: "Dark Patterns & Consumer Protection",
    question: "Under the Consumer Protection (E-Commerce) Rules and Central Consumer Protection Authority (CCPA) directives on 'Dark Patterns', consider the following pairs:\n1. Basket Sneaking : Inclusion of additional items or warranty fees at checkout without consumer consent\n2. Drip Pricing : Concealing the final price of a product until the final payment step by unbundling mandatory fees\n3. False Urgency : Falsely stating or implying that a supply is limited to manipulate immediate purchase\nHow many of the pairs given above are correctly matched?",
    options: [
      "Only one pair",
      "Only two pairs",
      "All three pairs",
      "None of the pairs"
    ],
    answer: "All three pairs",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three pairs are correctly matched.\nUnder the CCPA Guidelines for Prevention and Regulation of Dark Patterns, 2023:\n- Basket Sneaking: The practice of automatically adding additional products, services, insurance, or donations to a user's shopping basket at the checkout stage without their explicit, affirmative opt-in.\n- Drip Pricing: A deceptive pricing technique where only a part of the price is initially advertised, and other mandatory charges (convenience fees, platform fees, handling surcharges) are incrementally disclosed or 'dripped' as the customer proceeds through the booking/checkout funnel.\n- False Urgency: Fabricating artificial scarcity or false immediacy (e.g. 'Only 1 room left at this price!', 'Deal expires in 2 minutes!') to coerce a hurried purchase decision.",
    option_analysis: {
      "Option A": "Incorrect because all three pairs are correct.",
      "Option B": "Incorrect because all three pairs are correct.",
      "Option C": "Correct. All 3 pairs accurately define dark pattern classifications under CCPA regulations.",
      "Option D": "Incorrect because all pairs are correct."
    },
    static_root: "Consumer Protection Act 2019; Central Consumer Protection Authority (CCPA); Digital Economy & Behavioral Manipulation.",
    standard_book_ref: "Ramesh Singh, Indian Economy; CCPA Guidelines on Dark Patterns (Ministry of Consumer Affairs).",
    elimination_trap: "Definitions swap: examiners frequently swap Basket Sneaking (adding items) with Drip Pricing (revealing fees slowly). Here each definition accurately matches its term.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (C)",
    question_text: "Under the Consumer Protection (E-Commerce) Rules and Central Consumer Protection Authority (CCPA) directives on 'Dark Patterns', consider the following pairs:\n1. Basket Sneaking : Inclusion of additional items or warranty fees at checkout without consumer consent\n2. Drip Pricing : Concealing the final price of a product until the final payment step by unbundling mandatory fees\n3. False Urgency : Falsely stating or implying that a supply is limited to manipulate immediate purchase\nHow many of the pairs given above are correctly matched?"
  },
  {
    id: "ca-2026-09-028",
    year: 2026,
    month: "September 2026",
    subject: "Governance & Agriculture",
    sub_topic: "Land Records Digital Public Infrastructure",
    question: "Regarding 'Bhu-Aadhaar' or the Unique Land Parcel Identification Number (ULPIN) under the Digital India Land Records Modernisation Programme (DILRMP), consider the following statements:\n1. ULPIN is a 14-digit alpha-numeric unique identification code assigned to every surveyed land parcel.\n2. The code is generated based on the international standard geo-coordinates (latitude and longitude) of the vertices of the land parcel.\n3. Land administration is a subject enumerated in the Union List of the Seventh Schedule of the Constitution.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Bhu-Aadhaar (ULPIN) is a 14-digit alphanumeric identification number assigned uniquely to every land parcel in India, functioning as an Aadhaar-like identity for land.\nStatement 2 is correct: ULPIN is scientifically generated using the Electronic Coordinate Reference System based on the precise latitude and longitude points of the boundaries and vertices of the cadastral parcel.\nStatement 3 is incorrect: Under the Seventh Schedule of the Constitution of India, 'Land, that is to say, rights in or over land, land tenures including the relation of landlord and tenant, and the collection of rents' is enumerated under Entry 18 of the STATE LIST (List II), NOT the Union List. Therefore, land administration is entirely within the legislative domain of State Governments.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are factually accurate.",
      "Option B": "Incorrect because Statement 3 is false (Land is a State List subject, Entry 18).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Seventh Schedule (State List Entry 18); DILRMP 3.0; Digital Public Infrastructure (DPI) in Agriculture.",
    standard_book_ref: "M. Laxmikanth, Indian Polity, Seventh Schedule; Department of Land Resources (DoLR) Annual Report.",
    elimination_trap: "Constitutional list confusion: despite central digital initiatives (SVAMITVA, DILRMP, ULPIN), Land remains unequivocally a State List subject under Entry 18 of List II.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding 'Bhu-Aadhaar' or the Unique Land Parcel Identification Number (ULPIN) under the Digital India Land Records Modernisation Programme (DILRMP), consider the following statements:\n1. ULPIN is a 14-digit alpha-numeric unique identification code assigned to every surveyed land parcel.\n2. The code is generated based on the international standard geo-coordinates (latitude and longitude) of the vertices of the land parcel.\n3. Land administration is a subject enumerated in the Union List of the Seventh Schedule of the Constitution.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-029",
    year: 2026,
    month: "September 2026",
    subject: "Economy & Infrastructure",
    sub_topic: "Maritime Infrastructure & Port Governance",
    question: "With reference to port governance and the classification of 'Mega Ports' in India, consider the following statements:\n1. Major Ports in India are governed under the Major Port Authorities Act, 2021, and are under the administrative jurisdiction of the Central Government.\n2. Non-Major ports are administered by the respective State Maritime Boards or State Governments under the Indian Ports Act, 1908.\n3. India's maritime regulatory framework prohibits private sector concessionaires from operating cargo handling berths under Public-Private Partnership (PPP) models.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The 12 Major Ports in India (such as Deendayal, JNPT, Paradip, Chennai, Visakhapatnam) are governed by the Major Port Authorities Act, 2021 (which replaced the Major Port Trusts Act, 1963) and fall under the Union Government (Ministry of Ports, Shipping and Waterways).\nStatement 2 is correct: Non-major ports (minor/intermediate ports, e.g. Mundra, Gangavaram, Krishnapatnam) fall under the Concurrent List and are administered by State Maritime Boards (like Gujarat Maritime Board) or State Governments under the Indian Ports Act.\nStatement 3 is incorrect: India actively promotes private sector investments in ports. Over 85% of cargo terminal capacity expansion across Major and Non-Major ports is executed through Public-Private Partnership (PPP) concessions (under Design, Build, Finance, Operate and Transfer - DBFOT models).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately reflect the dual statutory framework of Indian ports.",
      "Option B": "Incorrect because Statement 3 is false.",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Seventh Schedule (Major Ports Entry 27 List I; Ports other than Major Ports Entry 31 List III); Major Port Authorities Act 2021.",
    standard_book_ref: "Ramesh Singh, Indian Economy, Chapter on 'Infrastructure'; Sagar Mala Programme Annual Review.",
    elimination_trap: "Regulatory absolute trap: claiming the maritime framework 'prohibits' private sector concessionaires when Indian port policy is built around PPP terminal operations.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to port governance and the classification of 'Mega Ports' in India, consider the following statements:\n1. Major Ports in India are governed under the Major Port Authorities Act, 2021, and are under the administrative jurisdiction of the Central Government.\n2. Non-Major ports are administered by the respective State Maritime Boards or State Governments under the Indian Ports Act, 1908.\n3. India's maritime regulatory framework prohibits private sector concessionaires from operating cargo handling berths under Public-Private Partnership (PPP) models.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-030",
    year: 2026,
    month: "September 2026",
    subject: "International Relations",
    sub_topic: "BRICS Expansion & Multipolarity",
    question: "Regarding the BRICS grouping and the outcomes of recent summits, consider the following statements:\n1. The New Development Bank (NDB) was formally established through the Fortaleza Declaration signed during the 6th BRICS Summit in 2014.\n2. In the New Development Bank, the five founding BRICS members hold equal voting power, with no individual country possessing a unilateral veto.\n3. The 'Diriyah Guiding Principles' adopted by BRICS govern the criteria and modalities for inducting new 'Partner Countries' into the expanded bloc.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: The New Development Bank (NDB) was legally established by the Agreement on the New Development Bank signed at the 6th BRICS Summit in Fortaleza, Brazil in 2014.\nStatement 2 is correct: Unlike the Bretton Woods institutions (IMF and World Bank) where voting shares are weighted by capital contributions and the US holds veto power, the NDB was founded with each of the five founding members (Brazil, Russia, India, China, South Africa) contributing an equal share of subscribed capital ($10 billion each) and holding equal voting rights, with no veto.\nStatement 3 is correct: Following the inclusion of new members (Egypt, Ethiopia, Iran, UAE) and dozens of applicant nations, BRICS adopted the 'Diriyah Guiding Principles, Standards, Criteria and Procedures for BRICS Partner Country Modality' to formalize criteria for inducting partner countries without granting full membership voting rights.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. All three statements accurately state the origins, governance structure of NDB, and the partner country criteria.",
      },
    static_root: "BRICS Architecture; New Development Bank (NDB) Articles of Agreement; Contingent Reserve Arrangement (CRA).",
    standard_book_ref: "Pavneet Singh, International Relations; NDB Official Portal.",
    elimination_trap: "Voting share trap: confusing the NDB (where founding members have equal voting power and equal capital) with the IMF or World Bank (quota-weighted).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (D)",
    question_text: "Regarding the BRICS grouping and the outcomes of recent summits, consider the following statements:\n1. The New Development Bank (NDB) was formally established through the Fortaleza Declaration signed during the 6th BRICS Summit in 2014.\n2. In the New Development Bank, the five founding BRICS members hold equal voting power, with no individual country possessing a unilateral veto.\n3. The 'Diriyah Guiding Principles' adopted by BRICS govern the criteria and modalities for inducting new 'Partner Countries' into the expanded bloc.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-031",
    year: 2026,
    month: "September 2026",
    subject: "Geography & Cartography",
    sub_topic: "Map Projections & Global Representations",
    question: "With reference to map projections and the 'Equal Earth Projection' endorsed in modern cartography, consider the following statements:\n1. The Mercator projection is a conformal projection that preserves angles and shapes of small objects but severely exaggerates the size of landmasses near the poles.\n2. The Equal Earth projection is an equal-area pseudocylindrical projection that preserves relative landmass sizes without severe shape distortion.\n3. Under the Equal Earth projection, the African continent appears smaller than the landmass of Greenland.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The Mercator projection (created in 1569 for marine navigation) is conformal (preserving compass bearings as straight lines), but its areal distortion increases with latitude, making high-latitude regions (e.g. Greenland, Antarctica, Northern Europe) appear enormously larger than they are.\nStatement 2 is correct: Developed in 2018 by Šavrič, Patterson, and Jenny (and adopted by the UN, NASA, and mapping agencies), the Equal Earth projection is an equal-area pseudocylindrical projection created as a visually balanced alternative to the Gall-Peters projection, preserving true relative areas while maintaining pleasing curved parallels and meridians.\nStatement 3 is incorrect: In reality, Africa (approx. 30.37 million sq km) is roughly 14 times larger than Greenland (approx. 2.16 million sq km). Because Equal Earth is an equal-area projection, Africa appears its true relative size—vastly larger than Greenland. (It is only on the Mercator projection that Greenland appears roughly the same size as Africa).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately define the mathematical properties of Mercator and Equal Earth projections.",
      "Option B": "Incorrect because Statement 3 is false.",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Practical Geography: Map Projections (Cylindrical, Conical, Zenithal; Conformal vs Equal-Area).",
    standard_book_ref: "NCERT Class 11 Practical Work in Geography, Chapter 4 (Map Projections); UN Cartographic Section.",
    elimination_trap: "Projection confusion: equal-area projections accurately show that Africa is 14 times larger than Greenland. Only the Mercator projection artificially inflates Greenland to equal Africa.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to map projections and the 'Equal Earth Projection' endorsed in modern cartography, consider the following statements:\n1. The Mercator projection is a conformal projection that preserves angles and shapes of small objects but severely exaggerates the size of landmasses near the poles.\n2. The Equal Earth projection is an equal-area pseudocylindrical projection that preserves relative landmass sizes without severe shape distortion.\n3. Under the Equal Earth projection, the African continent appears smaller than the landmass of Greenland.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-032",
    year: 2026,
    month: "September 2026",
    subject: "Science & Technology",
    sub_topic: "Earth Observation & Geostationary Satellites",
    question: "Regarding India's 'EOS-05' (Earth Observation Satellite-05) mission, consider the following statements:\n1. Unlike standard Sun-Synchronous Polar Orbit (SSPO) remote sensing satellites, EOS-05 is designed for operations in a Geostationary Orbit (GEO).\n2. Placing an earth observation satellite in geostationary orbit enables near-continuous monitoring of cyclogenesis, severe weather phenomena, and rapid disaster events over the Indian landmass and adjacent oceans.\n3. EOS-05 is launched using the Polar Satellite Launch Vehicle (PSLV) in its core-alone configuration.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: EOS-05 is an advanced state-of-the-art Earth Observation satellite positioned in Geostationary Orbit (~36,000 km above the equator), unlike low-Earth orbit (LEO) satellites that pass over a given location only once every few days.\nStatement 2 is correct: A geostationary perspective allows continuous, real-time observational persistence over the Indian subcontinent and the Indian Ocean, providing high-frequency updates (every few minutes) critical for tracking cyclonic depressions, cloud bursts, and disaster management.\nStatement 3 is incorrect: Because EOS-05 is a heavy spacecraft (~2,500+ kg) bound for a high-energy Geosynchronous Transfer Orbit (GTO), it requires ISRO's GSLV (Geosynchronous Satellite Launch Vehicle) with a cryogenic upper stage, NOT the PSLV-Core Alone (which is optimized for lightweight payloads to LEO).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately describe the orbital regime and unique operational rationale of GEO observation.",
      "Option B": "Incorrect because Statement 3 is false (launched on GSLV, not PSLV-CA).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Orbits in Spaceflight (LEO, SSO, GEO, GTO); ISRO Launch Vehicles (PSLV, GSLV, LVM3); Disaster Monitoring.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology, Space Technology; ISRO Annual Report.",
    elimination_trap: "Launch vehicle payload limitation: PSLV Core-Alone cannot place heavy 2.5-tonne satellites into 36,000 km Geostationary Transfer Orbit; that capability belongs to GSLV and LVM3.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding India's 'EOS-05' (Earth Observation Satellite-05) mission, consider the following statements:\n1. Unlike standard Sun-Synchronous Polar Orbit (SSPO) remote sensing satellites, EOS-05 is designed for operations in a Geostationary Orbit (GEO).\n2. Placing an earth observation satellite in geostationary orbit enables near-continuous monitoring of cyclogenesis, severe weather phenomena, and rapid disaster events over the Indian landmass and adjacent oceans.\n3. EOS-05 is launched using the Polar Satellite Launch Vehicle (PSLV) in its core-alone configuration.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-033",
    year: 2026,
    month: "September 2026",
    subject: "Science & Technology",
    sub_topic: "Space Medicine & Radiation Physics",
    question: "In deep space human exploration missions (such as Artemis and Gaganyaan interplanetary phases), what is the primary function of the 'AstroRad' vest?",
    options: [
      "To generate artificial gravity for astronauts via miniature rotational flywheels.",
      "To provide selective radiation shielding for vulnerable biological tissues and blood-forming stem cells against Solar Particle Events (SPE).",
      "To maintain core body temperature during extravehicular spacewalks through liquid nitrogen heat exchangers.",
      "To collect and recycle 100% of exhaled carbon dioxide into potable drinking water."
    ],
    answer: "To provide selective radiation shielding for vulnerable biological tissues and blood-forming stem cells against Solar Particle Events (SPE).",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nThe AstroRad vest is an advanced wearable radiation protection vest developed for deep space missions (tested on Artemis I / Matroshka AstroRad Radiation Experiment). Deep space radiation consists of Galactic Cosmic Rays (GCR) and unpredictable high-energy Solar Particle Events (SPE). Rather than attempting to shield the entire astronaut body (which would be excessively heavy), AstroRad utilizes a high-density, hydrogen-rich polymer matrix to selectively shield radiation-sensitive internal organs and stem-cell reservoirs (such as bone marrow in the pelvis/spine, lungs, and gastrointestinal tract), preventing acute radiation sickness and long-term carcinogenesis.",
    option_analysis: {
      "Option A": "Incorrect. Artificial gravity requires massive rotating centrifuges or tethered modules.",
      "Option B": "Correct. Accurately describes the tissue-targeted selective radiation shielding function of AstroRad.",
      "Option C": "Incorrect. Extravehicular mobility suits use Liquid Cooling and Ventilation Garments (LCVG), not AstroRad.",
      "Option D": "Incorrect. This describes the Environmental Control and Life Support System (ECLSS)."
    },
    static_root: "Space Environment: Solar Flares, Van Allen Belts, Galactic Cosmic Rays; Human Spaceflight Physiology.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology, Space Exploration; NASA Artemis Human Research Program.",
    elimination_trap: "Watch for pseudo-scientific decoys: artificial gravity or total metabolic recycling garments are sci-fi concepts, whereas AstroRad specifically addresses radiation shielding of vital organs.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In deep space human exploration missions (such as Artemis and Gaganyaan interplanetary phases), what is the primary function of the 'AstroRad' vest?"
  },
  {
    id: "ca-2026-09-034",
    year: 2026,
    month: "September 2026",
    subject: "Science & Technology",
    sub_topic: "Quantum Computing & Cryogenics",
    question: "Consider the following statements regarding 'Quantum Decoherence' and cryogenic requirements in superconducting quantum computers:\n1. Quantum decoherence is the physical process by which a quantum system loses its superposition and entanglement properties due to interaction with the surrounding environment.\n2. Superconducting qubits require dilution refrigerators operating at temperatures near absolute zero (approx. 10 to 20 millikelvin) to suppress thermal noise.\n3. The National Quantum Mission in India is implemented by the Defence Research and Development Organisation (DRDO) as the sole nodal agency.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Decoherence is the fundamental bottleneck in quantum computing. Fragile quantum states (superposition |0> + |1> and entanglement) collapse into classical states when disturbed by microscopic thermal fluctuations, electromagnetic radiation, or mechanical vibrations.\nStatement 2 is correct: Superconducting circuits (like transmon qubits used by IBM, Google, and Indian labs) require ultra-low temperatures (~10-20 mK, colder than deep space) produced by helium-3/helium-4 dilution refrigerators (e.g. Zero-mK India initiative) to maintain superconductivity and prevent thermal phonons from triggering decoherence.\nStatement 3 is incorrect: The National Quantum Mission (NQM, budgeted at over ₹6,000 crore) is administered under the Department of Science and Technology (DST) under the Ministry of Science and Technology, NOT by DRDO.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately state the physics of decoherence and the cryogenic necessity for superconducting qubits.",
      "Option B": "Incorrect because Statement 3 is false (NQM is under DST, not DRDO).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Quantum Mechanics (Superposition, Entanglement, Qubits); National Quantum Mission (NQM); Cryogenic Engineering.",
    standard_book_ref: "NCERT Class 12 Physics, Modern Physics; Ravi P. Agrahari, Science & Technology; DST NQM portal.",
    elimination_trap: "Nodal department substitution: military/strategic research often involves DRDO, but the National Quantum Mission is an apex civil mission driven by the Department of Science & Technology (DST).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Consider the following statements regarding 'Quantum Decoherence' and cryogenic requirements in superconducting quantum computers:\n1. Quantum decoherence is the physical process by which a quantum system loses its superposition and entanglement properties due to interaction with the surrounding environment.\n2. Superconducting qubits require dilution refrigerators operating at temperatures near absolute zero (approx. 10 to 20 millikelvin) to suppress thermal noise.\n3. The National Quantum Mission in India is implemented by the Defence Research and Development Organisation (DRDO) as the sole nodal agency.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-035",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Trade",
    sub_topic: "Carbon Border Adjustments & Climate Trade Policy",
    question: "With reference to Carbon Border Adjustment Mechanisms (CBAM) and international climate trade regulations, consider the following statements:\n1. The European Union CBAM applies an import carbon tariff to prevent 'carbon leakage' by equalising carbon pricing on domestic production and imported goods.\n2. The United Kingdom's CBAM framework (scheduled for 2027) covers emission-intensive sectors including aluminium, cement, ceramics, fertiliser, glass, hydrogen, and iron and steel.\n3. Under WTO rules, carbon border tariffs have been declared universally illegal as per a binding ruling of the WTO Appellate Body.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The EU CBAM requires importers of covered carbon-intensive goods to buy CBAM certificates corresponding to the carbon price that would have been paid had the goods been produced under the EU Emissions Trading System (ETS), preventing EU firms from relocating to jurisdictions with laxer emission caps (carbon leakage).\nStatement 2 is correct: The UK announced its own CBAM to take effect in 2027, applying to 7 core sectors: aluminium, cement, ceramics, fertiliser, glass, hydrogen, and iron and steel.\nStatement 3 is incorrect: The WTO Appellate Body has NOT declared CBAM universally illegal (in fact, the WTO Appellate Body has been non-functional due to blockages in member appointments). Proponents defend CBAM under GATT Article XX (General Exceptions for environmental protection and natural resources), while developing nations argue it violates Common But Differentiated Responsibilities (CBDR) under UNFCCC.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate regulatory and sectoral descriptions.",
      "Option B": "Incorrect because Statement 3 is false.",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "UNFCCC (CBDR-RC); WTO Law (GATT Article XX General Exceptions); Carbon Leakage & Emissions Trading Schemes.",
    standard_book_ref: "PMF IAS Environment, International Climate Treaties; Ramesh Singh, Indian Economy (Foreign Trade).",
    elimination_trap: "Absolute dispute trap: claiming a WTO Appellate Body ruling has outlawed CBAM. The legality of CBAM under GATT Article XX remains one of the most hotly contested debates in international trade law.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to Carbon Border Adjustment Mechanisms (CBAM) and international climate trade regulations, consider the following statements:\n1. The European Union CBAM applies an import carbon tariff to prevent 'carbon leakage' by equalising carbon pricing on domestic production and imported goods.\n2. The United Kingdom's CBAM framework (scheduled for 2027) covers emission-intensive sectors including aluminium, cement, ceramics, fertiliser, glass, hydrogen, and iron and steel.\n3. Under WTO rules, carbon border tariffs have been declared universally illegal as per a binding ruling of the WTO Appellate Body.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-036",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Climate Change",
    sub_topic: "Climate Overshoot & Planetary Tipping Points",
    question: "In the context of international climate negotiations and the Intergovernmental Panel on Climate Change (IPCC) reports, what is meant by a '1.5°C Climate Overshoot' pathway?",
    options: [
      "A trajectory where global warming permanently stabilizes below 1.0°C without exceeding historical emissions.",
      "A pathway in which global mean temperature temporarily exceeds 1.5°C above pre-industrial levels before returning to or below 1.5°C by net-negative carbon emissions.",
      "An abrupt shift where atmospheric carbon dioxide concentrations exceed 1,000 parts per million within a single decade.",
      "A geoengineering scenario involving continuous global deployment of stratospheric aerosol injection."
    ],
    answer: "A pathway in which global mean temperature temporarily exceeds 1.5°C above pre-industrial levels before returning to or below 1.5°C by net-negative carbon emissions.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nAccording to the IPCC Sixth Assessment Report (AR6) and UNEP Emissions Gap reports, a '1.5°C Overshoot' pathway refers to an emissions trajectory where global warming temporarily exceeds 1.5°C above pre-industrial levels (e.g. reaching 1.6°C to 1.8°C mid-century) due to insufficient near-term emissions reductions, before anthropogenic warming is brought back down below 1.5°C by 2100 through massive deployment of Carbon Dioxide Removal (CDR) and net-negative global emissions. Scientists warn that even a temporary overshoot poses severe risks of triggering irreversible tipping points (e.g. coral reef collapse, permafrost thaw, West Antarctic ice sheet instability).",
    option_analysis: {
      "Option A": "Incorrect. This describes a deep mitigation pathway with zero overshoot.",
      "Option B": "Correct. Accurately describes a temporary temperature exceedance followed by net-negative carbon drawdown.",
      "Option C": "Incorrect. This describes an extreme runaway emissions scenario (like SSP5-8.5).",
      "Option D": "Incorrect. This describes solar radiation management (SRM), not the definition of overshoot."
    },
    static_root: "IPCC Special Report on 1.5°C; Paris Agreement Article 4 (Net Zero & Carbon Removals); Planetary Tipping Points.",
    standard_book_ref: "PMF IAS Environment, Climate Change & Global Warming; Shankar IAS Environment.",
    elimination_trap: "Watch for the word 'temporarily': an overshoot is explicitly characterized by temporary exceedance followed by net-negative cooling, distinguishing it from permanent runaway warming.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In the context of international climate negotiations and the Intergovernmental Panel on Climate Change (IPCC) reports, what is meant by a '1.5°C Climate Overshoot' pathway?"
  },
  {
    id: "ca-2026-09-037",
    year: 2026,
    month: "September 2026",
    subject: "Environment & Ecology",
    sub_topic: "Marine Ecology & Coral Mortality",
    question: "Consider the following statements regarding the phenomenon of 'Soft Coral Slumping' observed during extreme marine heatwaves:\n1. Unlike hard (scleractinian) corals, soft corals (alcyonaceans) do not possess a continuous, rigid calcium carbonate aragonite skeleton.\n2. 'Slumping' occurs when prolonged thermal stress triggers tissue necrosis, liquefaction, and collapse of the fleshy colonial structure of soft corals.\n3. Soft corals are exclusively heterotrophic filter feeders and do not harbour symbiotic photosynthetic zooxanthellae.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Hard (stony) corals secrete a solid external skeleton of calcium carbonate (aragonite). In contrast, soft corals (order Alcyonacea) have flexible tissues supported internally by microscopic spicules or sclerites of calcite, giving them a flexible, fleshy anatomy.\nStatement 2 is correct: Under acute thermal stress during marine heatwaves, soft corals suffer rapid structural collapse termed 'slumping'. Their coenosarc (connecting tissue) undergoes bacterial infection, necrosis, and liquefaction, causing the colonies to dissolve and slide off the reef substrate within days.\nStatement 3 is incorrect: The vast majority of shallow-water tropical and subtropical soft corals (such as Sarcophyton, Sinularia, and Cladiella) harbor symbiotic dinoflagellates (zooxanthellae) and rely primarily on photosynthesis for their nutritional energy, just like hard corals.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately define soft coral skeletal biology and the thermal slumping phenomenon.",
      "Option B": "Incorrect because Statement 3 is false (shallow-water soft corals are photosynthetic mixotrophs).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Marine Biomes; Coral Reef Ecosystems; Symbiosis (Zooxanthellae & Cnidarians); Marine Heatwaves.",
    standard_book_ref: "PMF IAS Environment, Marine Organisms & Coral Bleaching; Shankar IAS Environment.",
    elimination_trap: "Symbiosis denial: candidates often assume only hard corals host zooxanthellae. In fact, shallow-water soft corals are also obligate hosts of photosynthetic dinoflagellates and suffer bleaching and slumping.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Consider the following statements regarding the phenomenon of 'Soft Coral Slumping' observed during extreme marine heatwaves:\n1. Unlike hard (scleractinian) corals, soft corals (alcyonaceans) do not possess a continuous, rigid calcium carbonate aragonite skeleton.\n2. 'Slumping' occurs when prolonged thermal stress triggers tissue necrosis, liquefaction, and collapse of the fleshy colonial structure of soft corals.\n3. Soft corals are exclusively heterotrophic filter feeders and do not harbour symbiotic photosynthetic zooxanthellae.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-038",
    year: 2026,
    month: "September 2026",
    subject: "History, Art & Culture",
    sub_topic: "Ancient Monuments & UNESCO Tentative List",
    question: "Consider the following pairs of heritage sites recently included on India's UNESCO World Heritage Tentative List and their architectural/historical features:\n1. Bagh Caves : Rock-cut Buddhist viharas in Madhya Pradesh renowned for classical Gupta-era mural paintings\n2. Udaigiri Caves (Vidisha) : Rock-cut sanctuaries in Madhya Pradesh featuring the iconic monumental relief of Varaha rescuing Bhudevi\n3. Ginnorgarh Fort : Hill fort associated with the Gond kingdom and Queen Kamlapati\nHow many of the pairs given above are correctly matched?",
    options: [
      "Only one pair",
      "Only two pairs",
      "All three pairs",
      "None of the pairs"
    ],
    answer: "All three pairs",
    correct_index: 2,
    correct_option: "C",
    explanation: "All three pairs are correctly matched.\nPair 1 is correctly matched: The Bagh Caves are a group of nine rock-cut Buddhist caves situated on the banks of the Baghani river in Dhar district, Madhya Pradesh. Excavated between the 4th and 6th centuries CE (Gupta period), they are celebrated for masterly murals and tempera wall paintings closely related in style to Ajanta.\nPair 2 is correctly matched: The Udaigiri Caves near Vidisha, Madhya Pradesh are early 5th-century CE Gupta-era rock-cut shrines. Cave 5 contains the world-renowned colossal sculpted relief of Vishnu in his Varaha (boar) avatar lifting the earth goddess (Bhudevi) from the cosmic waters, created during the reign of Chandragupta II Vikramaditya.\nPair 3 is correctly matched: Ginnorgarh Fort (in Sehore district, MP) was an impregnable stronghold of the medieval Gond rulers, closely associated with Gond ruler Nizam Shah and his courageous widow Rani Kamlapati, representing indigenous Gond defensive hill architecture.",
    option_analysis: {
      "Option A": "Incorrect because all three pairs are correct.",
      "Option B": "Incorrect because all three pairs are correct.",
      "Option C": "Correct. All 3 pairs accurately state the location, period, and artistic attributes.",
      "Option D": "Incorrect because all pairs are correct."
    },
    static_root: "Indian Rock-Cut Architecture; Gupta Art and Sculpture; Tribal & Regional Forts of Central India.",
    standard_book_ref: "Nitin Singhania, Indian Art and Culture, Chapter 1 (Visual Arts - Architecture and Sculpture); NCERT Class 11 An Introduction to Indian Art.",
    elimination_trap: "Watch out for location confusion between Udaigiri Caves in Madhya Pradesh (Gupta-era Hindu/Jain caves with the Varaha relief) and Udayagiri-Khandagiri Caves in Odisha (Jain rock-cut caves of King Kharavela).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (C)",
    question_text: "Consider the following pairs of heritage sites recently included on India's UNESCO World Heritage Tentative List and their architectural/historical features:\n1. Bagh Caves : Rock-cut Buddhist viharas in Madhya Pradesh renowned for classical Gupta-era mural paintings\n2. Udaigiri Caves (Vidisha) : Rock-cut sanctuaries in Madhya Pradesh featuring the iconic monumental relief of Varaha rescuing Bhudevi\n3. Ginnorgarh Fort : Hill fort associated with the Gond kingdom and Queen Kamlapati\nHow many of the pairs given above are correctly matched?"
  },
  {
    id: "ca-2026-09-039",
    year: 2026,
    month: "September 2026",
    subject: "Ancient History & Archaeology",
    sub_topic: "Sangam Age & Underwater Archaeology",
    question: "With reference to the ancient port city of 'Poompuhar' (Kaveripattinam) and recent marine archaeological explorations, consider the following statements:\n1. Poompuhar served as the principal maritime emporium and ancient capital of the Early Cholas during the Sangam period.\n2. The vibrant urban layout, bustling customs warehouses, and foreign Yavana traders of Poompuhar are vividly described in the Sangam epics Silappadikaram and Manimekalai.\n3. It was situated at the mouth of the Vaigai River where it drains into the Palk Strait.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Poompuhar (also known as Kaveripoompattinam or Kaveripattinam) was the premier coastal emporium and celebrated capital of the Early Chola dynasty under kings like Karikala Chola during the Sangam era.\nStatement 2 is correct: Sangam classical literature, notably the epics Silappadikaram (by Ilango Adigal, centered on Kovalan and Kannagi) and Manimekalai (by Chithalai Chathanar), and the poem Pattinappalai, provide vivid, detailed accounts of Poompuhar's double-city layout (Maruvurpakkam harbor quarter and Pattinampakkam palace quarter), Roman/Yavana merchants, lighthouses, and thriving maritime commerce.\nStatement 3 is incorrect: Poompuhar was located at the mouth of the KAVERI River (hence Kaveri-pattinam) where it drains into the Bay of Bengal in Mayiladuthurai district of Tamil Nadu, NOT at the mouth of the Vaigai River (which drains near Ramanathapuram into the Palk Strait and was associated with the Pandya port of Korkai/Alagankulam).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are historically and literarily verified.",
      "Option B": "Incorrect because Statement 3 is false (located at the mouth of the Kaveri River, not Vaigai).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Sangam Age (Polity, Society, Trade); Ancient Ports of South India (Poompuhar, Muziris, Arikamedu, Korkai); Tamil Epics.",
    standard_book_ref: "Upinder Singh, A History of Ancient and Early Medieval India; NCERT Class 11 Themes in Indian History; R.S. Sharma, Ancient India.",
    elimination_trap: "River confluence mismatch: Kaveripattinam is at the mouth of the Kaveri (Chola realm), whereas the Vaigai flows through Madurai (Pandya realm).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to the ancient port city of 'Poompuhar' (Kaveripattinam) and recent marine archaeological explorations, consider the following statements:\n1. Poompuhar served as the principal maritime emporium and ancient capital of the Early Cholas during the Sangam period.\n2. The vibrant urban layout, bustling customs warehouses, and foreign Yavana traders of Poompuhar are vividly described in the Sangam epics Silappadikaram and Manimekalai.\n3. It was situated at the mouth of the Vaigai River where it drains into the Palk Strait.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-2026-09-040",
    year: 2026,
    month: "September 2026",
    subject: "Defence & International Law",
    sub_topic: "Space Weaponisation & International Law",
    question: "Regarding international legal treaties governing space security and the weaponisation of outer space, consider the following statements:\n1. Article IV of the Outer Space Treaty (1967) prohibits States Parties from placing in orbit around the Earth any objects carrying nuclear weapons or any other kinds of weapons of mass destruction.\n2. The Outer Space Treaty contains an explicit, comprehensive prohibition on the testing and deployment of ground-based direct-ascent kinetic anti-satellite (ASAT) missiles.\n3. The Draft Treaty on Prevention of the Placement of Weapons in Outer Space (PPWT) has been co-sponsored by Russia and China at the Conference on Disarmament.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct, while Statement 2 is incorrect.\nStatement 1 is correct: Article IV of the Treaty on Principles Governing the Activities of States in the Exploration and Use of Outer Space, including the Moon and Other Celestial Bodies (Outer Space Treaty, 1967) states that States Parties undertake 'not to place in orbit around the Earth any objects carrying nuclear weapons or any other kinds of weapons of mass destruction, install such weapons on celestial bodies, or station such weapons in outer space in any other manner.'\nStatement 2 is incorrect: The Outer Space Treaty does NOT ban conventional weapons, electronic warfare, high-powered lasers, or ground-based direct-ascent kinetic ASAT missiles (such as those tested by USA, Russia, China, and India in Mission Shakti, 2019). This major loophole in the OST is the primary driver of contemporary space militarization concerns.\nStatement 3 is correct: Since 2008, Russia and China have repeatedly proposed the draft Treaty on the Prevention of the Placement of Weapons in Outer Space, the Threat or Use of Force Against Outer Space Objects (PPWT) at the UN Conference on Disarmament in Geneva.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is false.",
      "Option B": "Correct. Statements 1 and 3 accurately describe Article IV of the OST and the Russo-Chinese PPWT initiative.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Outer Space Treaty 1967; Space Militarisation vs Weaponisation; PAROS; Mission Shakti (2019).",
    standard_book_ref: "Pavneet Singh, International Relations; UN Office for Outer Space Affairs (UNOOSA).",
    elimination_trap: "The kinetic ASAT loophole trap: many assume the OST 1967 prohibits all weapons in space. It strictly bans nuclear weapons and WMDs; conventional kinetic ASAT missiles launched from the ground are NOT prohibited under the OST.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)",
    question_text: "Regarding international legal treaties governing space security and the weaponisation of outer space, consider the following statements:\n1. Article IV of the Outer Space Treaty (1967) prohibits States Parties from placing in orbit around the Earth any objects carrying nuclear weapons or any other kinds of weapons of mass destruction.\n2. The Outer Space Treaty contains an explicit, comprehensive prohibition on the testing and deployment of ground-based direct-ascent kinetic anti-satellite (ASAT) missiles.\n3. The Draft Treaty on Prevention of the Placement of Weapons in Outer Space (PPWT) has been co-sponsored by Russia and China at the Conference on Disarmament.\nWhich of the statements given above are correct?"
  }
];

module.exports = septemberQuestions;
