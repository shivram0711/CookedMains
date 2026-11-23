const fs = require('fs');
const path = require('path');

const otherExamQuestions = [
  // ----------------------------------------------------
  // POLITY & GOVERNANCE (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-pol-001',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'Polity & Governance',
    sub_topic: 'Financial Bills vs Money Bills (Articles 110 & 117)',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set A Q42 (Option B)',
    is_official_key: true,
    question_text: 'With reference to Money Bills and Financial Bills in the Parliament of India, consider the following statements:\n1. Every Money Bill is a Financial Bill, but not every Financial Bill is a Money Bill.\n2. A Financial Bill (I) containing matters under Article 110 can only be introduced in the Lok Sabha on the recommendation of the President.\n3. The Rajya Sabha has no power to amend or reject a Financial Bill (II) that involves expenditure from the Consolidated Fund of India.\n\nWhich of the statements given above is/are correct?',
    options: [
      '1 only',
      '1 and 2 only',
      '2 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statement 1 is correct: All Money Bills (Article 110) are Financial Bills (Article 117), but only those containing exclusively Article 110 matters certified by the Speaker are Money Bills. Statement 2 is correct: Financial Bill (I) under Article 117(1) can be introduced only in Lok Sabha with President recommendation. Statement 3 is incorrect: Financial Bill (II) under Article 117(3) is treated like an ordinary bill in all respects, meaning Rajya Sabha has equal powers to amend or reject it.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity (7th Ed.), Chapter 22 Parliament: Financial Bills.',
    elimination_trap: 'Aspirants often confuse Financial Bill (II) with Money Bills. Rajya Sabha has equal powers over Financial Bill (II).',
    option_analysis: {
      A: 'Incorrect: Statement 2 is also valid under Art 117(1).',
      B: 'Correct: Statements 1 and 2 are constitutional facts under Arts 110 & 117(1).',
      C: 'Incorrect: Statement 3 is false as RS has full powers over Financial Bill (II).',
      D: 'Incorrect: Statement 3 fails.'
    }
  },
  {
    id: 'capf-2024-pol-002',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'Polity & Governance',
    sub_topic: 'Sixth Schedule & Autonomous District Councils (ADCs)',
    difficulty: 'Tough',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set B Q18 (Option C)',
    is_official_key: true,
    question_text: 'In the context of the Sixth Schedule of the Constitution of India, which one of the following statements is NOT correct?',
    options: [
      'The Sixth Schedule applies to tribal areas in the States of Assam, Meghalaya, Tripura and Mizoram.',
      'The Governor is empowered to organize and re-organize the autonomous districts.',
      'Acts of Parliament automatically apply to Autonomous Districts unless specifically excluded by the Governor.',
      'Each autonomous district has a district council consisting of not more than 30 members.'
    ],
    explanation: 'Option C is NOT correct: Under Paragraph 12/12A of the Sixth Schedule, Acts of Parliament do NOT automatically apply to Autonomous Districts in Meghalaya, Mizoram, etc., unless the Governor or President specifically directs with or without modifications. Options A, B, and D are verbatim provisions of the Sixth Schedule.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 42 Scheduled and Tribal Areas.',
    elimination_trap: 'Extreme word "automatically" should raise immediate suspicion; the Sixth Schedule provides a protective legislative shield for tribal self-governance.',
    option_analysis: {
      A: 'Correct statement (AMTM states).',
      B: 'Correct statement under Paragraph 1(3).',
      C: 'Incorrect statement (hence correct answer): Application requires presidential/gubernatorial notification.',
      D: 'Correct statement: 26 elected + 4 nominated members.'
    }
  },
  {
    id: 'cds-2023-pol-003',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Polity & Governance',
    sub_topic: 'Writ Jurisdiction (Article 32 & 226)',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (II) 2023 General Knowledge - Set C Q65 (Option C)',
    is_official_key: true,
    question_text: 'Consider the following statements regarding the writ of Quo-Warranto in India:\n1. It is issued by the court to enquire into the legality of the claim of a person to a public office.\n2. It prevents illegal usurpation of a public office by a person.\n3. Unlike other writs, it can be sought by any interested person, even if not an aggrieved person.\n\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1, 2 and 3',
      '1 and 3 only'
    ],
    explanation: 'All three statements are correct: Quo-Warranto literally means "by what authority". It is issued to prevent illegal usurpation of a substantive public office of a permanent character created by statute or constitution. The principle of locus standi is relaxed for Quo-Warranto, meaning any citizen or interested person can approach the court.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 7 Fundamental Rights: Writs.',
    elimination_trap: 'Candidates often think locus standi is strictly required for all writs, but Quo-Warranto and Habeas Corpus have relaxed rules.',
    option_analysis: {
      A: 'Incomplete: Statement 3 is well settled in Supreme Court jurisprudence.',
      B: 'Incomplete: Statement 1 is the core definition.',
      C: 'Correct: Statements 1, 2, and 3 are all accurate.',
      D: 'Incomplete.'
    }
  },
  {
    id: 'capf-2023-pol-004',
    exam: 'UPSC CAPF',
    year: 2023,
    subject: 'Polity & Governance',
    sub_topic: 'Joint Sitting of Parliament (Article 108)',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2023 Paper I - Set A Q29 (Option A)',
    is_official_key: true,
    question_text: 'Which of the following statements regarding a Joint Sitting of both Houses of Parliament in India is correct?',
    options: [
      'In the absence of the Speaker of the Lok Sabha, the Deputy Speaker presides over the Joint Sitting.',
      'The Chairman of the Rajya Sabha presides if the Speaker is absent.',
      'A Joint Sitting can be summoned for Constitutional Amendment Bills in case of deadlock.',
      'A Joint Sitting is governed by the Rules of Procedure of the Rajya Sabha.'
    ],
    explanation: 'Option A is correct: Under Article 118(4), if the Speaker is absent, the Deputy Speaker presides. If Deputy Speaker is also absent, the Deputy Chairman of Rajya Sabha presides. Chairman of Rajya Sabha (Vice President) NEVER presides as he is not a member of either House. Joint Sitting cannot be summoned for Money Bills or Constitutional Amendment Bills, and it is governed by Lok Sabha Rules of Procedure.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 22 Parliament: Joint Sitting.',
    elimination_trap: 'Common trap: Assuming Vice President (Chairman RS) presides. Vice President cannot preside over Joint Sitting.',
    option_analysis: {
      A: 'Correct: Deputy Speaker of Lok Sabha is 2nd in line of succession.',
      B: 'Incorrect: Chairman RS is explicitly barred.',
      C: 'Incorrect: Joint Sitting is strictly prohibited for Constitution Amendment Bills (Art 368).',
      D: 'Incorrect: Governed by Rules of Lok Sabha.'
    }
  },
  {
    id: 'cds-2023-pol-005',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Polity & Governance',
    sub_topic: 'Anti-Defection Law (Tenth Schedule)',
    difficulty: 'Tough',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2023 General Knowledge - Set D Q81 (Option C)',
    is_official_key: true,
    question_text: 'Under the Tenth Schedule of the Constitution of India, a nominated member of a House becomes disqualified for being a member if he/she joins any political party:\n(a) Within six months from the date of taking seat\n(b) At any time during the entire tenure\n(c) After six months from the date of taking seat\n(d) Only if declared by the Election Commission',
    options: [
      'Within six months from the date of taking seat',
      'At any time during the entire tenure',
      'After six months from the date of taking seat',
      'Only if declared by the Election Commission'
    ],
    explanation: 'Option C is correct: Under paragraph 2(3) of the Tenth Schedule, a nominated member can join a political party within 6 months of taking his seat without disqualification. If he joins after the expiry of 6 months, he stands disqualified. (Note: Independent members are disqualified if they join ANY political party at any time).',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 80 Anti-Defection Law.',
    elimination_trap: 'Candidates mix up nominated members (who have a 6-month window) with independent members (who have zero window).',
    option_analysis: {
      A: 'Incorrect: Within 6 months they are legally permitted to join.',
      B: 'Incorrect: That rule applies to independent members, not nominated.',
      C: 'Correct: After expiry of 6 months triggers disqualification.',
      D: 'Incorrect: Disqualification is decided by the Speaker/Chairman, not EC.'
    }
  },
  {
    id: 'cds-2022-pol-006',
    exam: 'UPSC CDS',
    year: 2022,
    subject: 'Polity & Governance',
    sub_topic: 'National Emergency (Article 352) & Fundamental Rights',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (II) 2022 General Knowledge - Set A Q15 (Option B)',
    is_official_key: true,
    question_text: 'During the proclamation of a National Emergency under Article 352 of the Indian Constitution, the enforcement of which of the following Fundamental Rights CANNOT be suspended by the President under Article 359?',
    options: [
      'Articles 14 and 19',
      'Articles 20 and 21',
      'Articles 19 and 21',
      'Articles 21 and 22'
    ],
    explanation: 'Option B is correct: By the 44th Constitutional Amendment Act of 1978, the right to move the court for the enforcement of the Fundamental Rights guaranteed by Articles 20 (protection in respect of conviction for offences) and 21 (protection of life and personal liberty) cannot be suspended under Article 359 even during a National Emergency.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 16 Emergency Provisions.',
    elimination_trap: 'Article 19 is automatically suspended under Article 358 during war/external aggression, but Articles 20 and 21 remain inviolable.',
    option_analysis: {
      A: 'Incorrect: Article 19 can be suspended.',
      B: 'Correct: Articles 20 and 21 are protected by the 44th Amendment.',
      C: 'Incorrect: Article 19 can be suspended.',
      D: 'Incorrect: Article 22 can be suspended under Art 359.'
    }
  },
  {
    id: 'capf-2022-pol-007',
    exam: 'UPSC CAPF',
    year: 2022,
    subject: 'Polity & Governance',
    sub_topic: 'Election Commission of India (Article 324)',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2022 Paper I - Set B Q37 (Option D)',
    is_official_key: true,
    question_text: 'Which one of the following statements regarding the Election Commission of India is NOT correct?',
    options: [
      'The Chief Election Commissioner and other Election Commissioners enjoy equal powers and receive equal salaries and allowances.',
      'In case of difference of opinion between the CEC and other Election Commissioners, the matter is decided by the Commission by majority.',
      'An Election Commissioner can be removed from office on the recommendation of the Chief Election Commissioner.',
      'The Constitution provides that a retired Election Commissioner is completely debarred from any future appointment by the government.'
    ],
    explanation: 'Option D is NOT correct: The Constitution has NOT debarred retired Election Commissioners from any further appointment by the government. Options A, B, and C are verbatim statutory provisions under the Election Commission (Conditions of Service of Election Commissioners and Transaction of Business) Act, 1991.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 43 Election Commission.',
    elimination_trap: 'CAG and UPSC Chairman are debarred from further government employment, but Election Commissioners are NOT debarred by the Constitution.',
    option_analysis: {
      A: 'Correct statement: CEC and other ECs have equal pay and powers.',
      B: 'Correct statement: Decisions taken by majority.',
      C: 'Correct statement: Protected by proviso to Art 324(5).',
      D: 'Incorrect statement (hence correct answer): The Constitution is silent on future appointment.'
    }
  },
  {
    id: 'cds-2021-pol-008',
    exam: 'UPSC CDS',
    year: 2021,
    subject: 'Polity & Governance',
    sub_topic: 'Ordinance Making Power of Governor (Article 213)',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2021 General Knowledge - Set C Q90 (Option A)',
    is_official_key: true,
    question_text: 'Consider the following statements regarding the ordinance-making power of the Governor of a State under Article 213:\n1. The Governor can promulgate an ordinance only when the Legislative Assembly (or both Houses where there is a Legislative Council) is not in session.\n2. An ordinance promulgated by the Governor ceases to operate at the expiration of six weeks from the reassembly of the state legislature.\n3. The Governor can withdraw an ordinance only with the prior approval of the President.\n\nWhich of the statements given above is/are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 2 are correct: Article 213 provides that Governor can issue ordinances only during legislative recess. It lapses 6 weeks after reassembly. Statement 3 is incorrect: The Governor can withdraw an ordinance promulgated by him at any time on the advice of the Council of Ministers without requiring prior approval of the President.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 30 Governor: Legislative Powers.',
    elimination_trap: 'Statement 3 adds an unconstitutional restriction; Governor withdraws ordinance on Chief Minister advice.',
    option_analysis: {
      A: 'Correct: Statements 1 and 2 are true.',
      B: 'Incorrect: Statement 3 is false.',
      C: 'Incomplete: Statement 2 is also correct.',
      D: 'Incorrect: Statement 3 is false.'
    }
  },
  {
    id: 'capf-2021-pol-009',
    exam: 'UPSC CAPF',
    year: 2021,
    subject: 'Polity & Governance',
    sub_topic: 'Comptroller and Auditor General (CAG) - Article 148-151',
    difficulty: 'Easy',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CAPF (AC) 2021 Paper I - Set A Q64 (Option C)',
    is_official_key: true,
    question_text: 'To whom does the Comptroller and Auditor General of India submit audit reports relating to the accounts of the Union?',
    options: [
      'The Prime Minister of India',
      'The Speaker of the Lok Sabha',
      'The President of India',
      'The Chairman of the Public Accounts Committee'
    ],
    explanation: 'Option C is correct: Under Article 151(1) of the Constitution, the reports of the Comptroller and Auditor General of India relating to the accounts of the Union are submitted to the President, who causes them to be laid before each House of Parliament.',
    standard_book_ref: 'M. Laxmikanth, Indian Polity, Chapter 49 Comptroller and Auditor General.',
    elimination_trap: 'Aspirants often confuse PAC with the submission channel. CAG submits reports to President, who lays them before Parliament, where PAC examines them.',
    option_analysis: {
      A: 'Incorrect: Not submitted to executive head.',
      B: 'Incorrect: Not submitted directly to Speaker.',
      C: 'Correct: Article 151(1) mandates submission to President of India.',
      D: 'Incorrect: PAC examines after laying in Parliament.'
    }
  },

  // ----------------------------------------------------
  // ECONOMY & AGRICULTURE (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-eco-010',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'Economy',
    sub_topic: 'Open Market Operations & Monetary Policy Transmission',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set B Q55 (Option A)',
    is_official_key: true,
    question_text: 'When the Reserve Bank of India conducts Open Market Sales of Government Securities in the secondary market, which one of the following consequences is most likely to follow?',
    options: [
      'Contraction of liquidity in the banking system and an upward pressure on short-term interest rates',
      'Expansion of money supply in the economy leading to depreciation of government bond yields',
      'Direct increase in the fiscal deficit of the Central Government',
      'Automatic reduction in the statutory Cash Reserve Ratio (CRR) of commercial banks'
    ],
    explanation: 'Option A is correct: When the RBI sells government securities, commercial banks and investors purchase them by paying cash to the RBI. This absorbs and contracts liquidity from the commercial banking system, reducing the supply of loanable funds and exerting upward pressure on short-term interest rates.',
    standard_book_ref: 'NCERT Class XII Macroeconomics, Chapter 3 Money and Banking; Ramesh Singh Indian Economy.',
    elimination_trap: 'Selling securities absorbs money; buying securities injects money. Do not reverse the cash flow direction.',
    option_analysis: {
      A: 'Correct: Sale absorbs cash from banks, tightening liquidity and increasing interest rates.',
      B: 'Incorrect: It causes contraction, not expansion.',
      C: 'Incorrect: OMO is a monetary operation, not fiscal deficit creation.',
      D: 'Incorrect: CRR is a separate statutory instrument.'
    }
  },
  {
    id: 'capf-2024-eco-011',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'Economy',
    sub_topic: 'Balance of Payments (BoP) & Capital Account Convertibility',
    difficulty: 'Tough',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set C Q72 (Option B)',
    is_official_key: true,
    question_text: 'With reference to the Balance of Payments (BoP) in India, which of the following are included in the "Capital Account"?\n1. Foreign Direct Investment (FDI)\n2. External Commercial Borrowings (ECBs)\n3. Remittances by Non-Resident Indians to family members\n4. Special Drawing Rights (SDR) allocations by the IMF\n\nSelect the correct answer using the code given below:',
    options: [
      '1, 2 and 3 only',
      '1, 2 and 4 only',
      '2, 3 and 4 only',
      '1, 2, 3 and 4'
    ],
    explanation: 'Statements 1, 2, and 4 are in the Capital Account. Statement 3 (Remittances) is an unrequited transfer payment and is classified under Invisibles in the CURRENT Account. FDI, ECBs, FPI, NRI bank deposits, and SDR allocations create financial asset/liability claims and belong to the Capital Account.',
    standard_book_ref: 'NCERT Class XII Macroeconomics, Chapter 6 Open Economy Macroeconomics; RBI BoP Manual.',
    elimination_trap: 'Remittances are unilateral transfers (Current Account), whereas NRI foreign currency deposits are liabilities (Capital Account).',
    option_analysis: {
      A: 'Incorrect: Item 3 belongs to Current Account.',
      B: 'Correct: Items 1, 2, and 4 are pure Capital Account flows.',
      C: 'Incorrect: Item 3 fails.',
      D: 'Incorrect: Item 3 included.'
    }
  },
  {
    id: 'cds-2023-eco-012',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Economy',
    sub_topic: 'Standing Deposit Facility (SDF) vs Reverse Repo',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (II) 2023 General Knowledge - Set A Q38 (Option C)',
    is_official_key: true,
    question_text: 'In the context of the Reserve Bank of India\'s revised liquidity management framework, what is the primary operational difference between the Standing Deposit Facility (SDF) and the traditional Fixed Reverse Repo rate?',
    options: [
      'SDF requires collateral of Government Securities, whereas Reverse Repo is completely collateral-free.',
      'SDF is accessible only to Primary Dealers, whereas Reverse Repo is open to all Commercial Banks.',
      'SDF allows RBI to absorb overnight liquidity from banks without providing collateral of government securities.',
      'SDF is an unsterilized intervention that directly alters the Statutory Liquidity Ratio (SLR).'
    ],
    explanation: 'Option C is correct: Under Section 17 of the RBI Act (amended in 2018 and operationalized in April 2022), the SDF empowers the RBI to absorb excess overnight liquidity from commercial banks without the requirement of providing collateral of government securities, thereby overcoming the collateral constraint of traditional Reverse Repo.',
    standard_book_ref: 'RBI Monetary Policy Report; Indian Economy by Vivek Singh / Nitin Singhania.',
    elimination_trap: 'Option A presents an inverted trap: it is SDF that is collateral-free, not Reverse Repo.',
    option_analysis: {
      A: 'Incorrect: Inverted fact.',
      B: 'Incorrect: SDF is available to all LAF eligible participants.',
      C: 'Correct: Key innovation is non-requirement of collateral.',
      D: 'Incorrect: It does not alter SLR.'
    }
  },
  {
    id: 'capf-2023-eco-013',
    exam: 'UPSC CAPF',
    year: 2023,
    subject: 'Economy',
    sub_topic: 'Monetary Policy Committee (MPC) Statutory Framework',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2023 Paper I - Set B Q82 (Option D)',
    is_official_key: true,
    question_text: 'Which of the following statements regarding the Monetary Policy Committee (MPC) in India is NOT correct?',
    options: [
      'It consists of six members: three from RBI and three appointed by the Central Government.',
      'The Governor of the Reserve Bank of India is the ex-officio Chairperson of the MPC.',
      'Each member of the MPC has one vote, and in the event of an equality of votes, the Governor has a second or casting vote.',
      'The members appointed by the Central Government hold office for a period of five years and are eligible for re-appointment.'
    ],
    explanation: 'Option D is NOT correct: Under Section 45ZB of the Reserve Bank of India Act, 1934, the external members appointed by the Central Government hold office for a period of FOUR years (not five) and are NOT eligible for re-appointment. Options A, B, and C are accurate statutory provisions.',
    standard_book_ref: 'RBI Act 1934, Section 45ZB; Ramesh Singh Indian Economy.',
    elimination_trap: 'Tenure is 4 years and re-appointment is explicitly barred to maintain independence.',
    option_analysis: {
      A: 'Correct statement: 6 members (3 internal + 3 external).',
      B: 'Correct statement: RBI Governor is Chairperson.',
      C: 'Correct statement: Governor has casting vote under Sec 45ZL.',
      D: 'Incorrect statement (hence correct answer): 4-year tenure with no re-appointment.'
    }
  },
  {
    id: 'cds-2022-eco-014',
    exam: 'UPSC CDS',
    year: 2022,
    subject: 'Economy',
    sub_topic: 'Headline Inflation vs Core Inflation',
    difficulty: 'Easy',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (II) 2022 General Knowledge - Set D Q28 (Option B)',
    is_official_key: true,
    question_text: 'What is the fundamental difference between \'Headline Inflation\' and \'Core Inflation\' in an economy?',
    options: [
      'Headline inflation measures wholesale prices, while core inflation measures retail consumer prices.',
      'Core inflation strips out volatile components like food and energy commodities from headline inflation.',
      'Headline inflation is calculated by RBI, while core inflation is published by NITI Aayog.',
      'Core inflation includes only imported manufacturing goods, while headline inflation includes domestic services.'
    ],
    explanation: 'Option B is correct: Core inflation excludes items that face volatile price movements, notably food and fuel/energy articles, to gauge the underlying long-term trend in general price level. In India, Headline CPI is the official inflation target (4% +/- 2%).',
    standard_book_ref: 'NCERT Class XI Indian Economic Development; Economic Survey Inflation Chapter.',
    elimination_trap: 'Both headline and core inflation can be measured from the Consumer Price Index (CPI-Combined) basket.',
    option_analysis: {
      A: 'Incorrect: Both are derived from CPI retail index.',
      B: 'Correct: Core excludes volatile food and energy.',
      C: 'Incorrect: NSO publishes both data sets.',
      D: 'Incorrect: Inaccurate classification.'
    }
  },

  // ----------------------------------------------------
  // ENVIRONMENT & ECOLOGY (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-env-015',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'Environment & Ecology',
    sub_topic: 'Ramsar Wetlands & Montreux Record Criteria',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set D Q19 (Option C)',
    is_official_key: true,
    question_text: 'Which of the following wetlands in India are currently listed in the Montreux Record under the Ramsar Convention?\n1. Keoladeo National Park, Rajasthan\n2. Loktak Lake, Manipur\n3. Chilika Lake, Odisha\n\nSelect the correct answer using the code given below:',
    options: [
      '1 only',
      '2 and 3 only',
      '1 and 2 only',
      '1, 2 and 3'
    ],
    explanation: 'Option C is correct (1 and 2 only): Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur) are the only two Indian wetlands currently maintained in the Montreux Record. Chilika Lake was placed on the Montreux Record in 1993 but was successfully removed in 2002 due to successful ecological restoration by the Chilika Development Authority.',
    standard_book_ref: 'PMF IAS Environment (Wetlands Chapter); Shankar IAS Environment.',
    elimination_trap: 'Chilika Lake was removed from Montreux Record in 2002 and won the Ramsar Wetland Conservation Award.',
    option_analysis: {
      A: 'Incomplete: Loktak Lake is also currently in the Record.',
      B: 'Incorrect: Chilika is no longer in Montreux Record.',
      C: 'Correct: Only Keoladeo and Loktak remain on the list.',
      D: 'Incorrect: Chilika was removed in 2002.'
    }
  },
  {
    id: 'capf-2024-env-016',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'Environment & Ecology',
    sub_topic: 'Wildlife Protection (Amendment) Act, 2022',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set B Q44 (Option A)',
    is_official_key: true,
    question_text: 'Under the Wildlife (Protection) Amendment Act, 2022, how has the structure of schedules been reformed in India?',
    options: [
      'The number of schedules was rationalized and reduced from six to four, including a dedicated schedule for CITES specimens.',
      'Schedules were completely replaced by the Red List categories of the IUCN.',
      'Vermin animals are permanently listed under a separate non-amendable Schedule V.',
      'Plant species were excluded from statutory protection and shifted to the Forest Conservation Act.'
    ],
    explanation: 'Option A is correct: The Wildlife (Protection) Amendment Act, 2022 drastically restructured the 1972 Act by reducing 6 schedules to 4: Schedule I (highest protection for animals), Schedule II (lesser protection), Schedule III (protected plant species), and Schedule IV (specimens listed under the CITES Appendices). The vermin schedule was repealed.',
    standard_book_ref: 'Ministry of Environment, Forest and Climate Change (MoEFCC) Act Gazette; PMF IAS Environment.',
    elimination_trap: 'Vermin schedule was NOT preserved; it was eliminated, giving Central Government executive power to declare vermin by notification.',
    option_analysis: {
      A: 'Correct: Rationalized to 4 schedules with dedicated CITES schedule.',
      B: 'Incorrect: IUCN categories were not adopted as statutory schedules.',
      C: 'Incorrect: Schedule V was repealed.',
      D: 'Incorrect: Plants remain under statutory Schedule III.'
    }
  },
  {
    id: 'cds-2023-env-017',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Environment & Ecology',
    sub_topic: 'Eutrophication & Biochemical Oxygen Demand (BOD)',
    difficulty: 'Easy',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (II) 2023 General Knowledge - Set A Q110 (Option B)',
    is_official_key: true,
    question_text: 'What happens to the Biochemical Oxygen Demand (BOD) and Dissolved Oxygen (DO) levels in an aquatic ecosystem undergoing severe cultural eutrophication caused by agricultural runoff?',
    options: [
      'Both BOD and DO levels increase exponentially.',
      'BOD increases significantly, while Dissolved Oxygen (DO) levels drop precipitously.',
      'BOD drops to zero, while Dissolved Oxygen reaches super-saturation.',
      'Both BOD and DO remain unchanged because aquatic plants release excess oxygen.'
    ],
    explanation: 'Option B is correct: Eutrophication introduces excess nitrogen and phosphorus, triggering an algal bloom. When the dense algae die, aerobic decomposers multiply rapidly and consume dissolved oxygen to decompose organic matter. This causes Biochemical Oxygen Demand (BOD) to spike and Dissolved Oxygen (DO) to collapse, creating hypoxic dead zones.',
    standard_book_ref: 'NCERT Class XII Biology, Chapter 16 Environmental Issues; PMF IAS Environment.',
    elimination_trap: 'High BOD means dirty water with low dissolved oxygen. High BOD and high DO never coexist in eutrophic waters.',
    option_analysis: {
      A: 'Incorrect: DO collapses as decomposers use it up.',
      B: 'Correct: High organic load leads to high BOD and depleted DO.',
      C: 'Incorrect: Inverse of scientific reality.',
      D: 'Incorrect: Severe shifts occur.'
    }
  },
  {
    id: 'capf-2023-env-018',
    exam: 'UPSC CAPF',
    year: 2023,
    subject: 'Environment & Ecology',
    sub_topic: 'Kigali Amendment to Montreal Protocol',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2023 Paper I - Set C Q51 (Option D)',
    is_official_key: true,
    question_text: 'The Kigali Amendment (2016) to the Montreal Protocol aims to achieve which of the following global environmental targets?',
    options: [
      'Phase out mercury emissions from artisanal gold mining',
      'Eliminate transboundary movements of hazardous electronic wastes',
      'Ban single-use plastics across marine coastal economic zones',
      'Phase down the production and consumption of Hydrofluorocarbons (HFCs)'
    ],
    explanation: 'Option D is correct: The Kigali Amendment entered into force in 2019 to phase down Hydrofluorocarbons (HFCs) by over 80% over the next 30 years. Although HFCs do not deplete stratospheric ozone (unlike CFCs and HCFCs), they are potent greenhouse gases with Global Warming Potentials thousands of times higher than CO2.',
    standard_book_ref: 'UNEP Montreal Protocol Secretariat; PMF IAS Climate Conventions.',
    elimination_trap: 'HFCs are non-ozone-depleting greenhouse gases. Many assume Montreal Protocol only deals with ozone depletion.',
    option_analysis: {
      A: 'Incorrect: Minamata Convention deals with mercury.',
      B: 'Incorrect: Basel Convention deals with hazardous wastes.',
      C: 'Incorrect: Covered under UNEP plastic treaty negotiations.',
      D: 'Correct: Kigali specifically regulates HFC phase-down.'
    }
  },

  // ----------------------------------------------------
  // HISTORY & CULTURE (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-his-019',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'History & Culture',
    sub_topic: 'Wood\'s Despatch of 1854 & Colonial Educational Reforms',
    difficulty: 'Moderate',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set C Q88 (Option C)',
    is_official_key: true,
    question_text: 'Regarding the Wood\'s Despatch of 1854, often hailed as the \'Magna Carta of English Education in India\', which of the following statements are correct?\n1. It repudiated the "downward filtration theory" for mass education.\n2. It recommended English as the sole medium of instruction at both primary and higher education levels.\n3. It recommended a system of grants-in-aid to encourage private enterprise in education.\n\nSelect the correct answer using the code given below:',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 3 are correct: Wood\'s Despatch repudiated the downward filtration theory and urged the government to assume responsibility for mass education. It emphasized vernacular languages for primary school education, while English was advocated for higher university education. Statement 2 is incorrect because it did not mandate English as the sole medium at primary level. Statement 3 is correct: it established grants-in-aid for private schools.',
    standard_book_ref: 'Spectrum A Brief History of Modern India, Chapter on Development of Education under British Rule.',
    elimination_trap: 'Statement 2 uses the extreme word "sole medium at both primary and higher levels". Wood\'s Despatch strongly supported vernacular at primary levels.',
    option_analysis: {
      A: 'Incorrect: Statement 2 is historically false.',
      B: 'Incorrect: Statement 2 is false.',
      C: 'Correct: Statements 1 and 3 are accurate.',
      D: 'Incorrect: Contains statement 2.'
    }
  },
  {
    id: 'capf-2024-his-020',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'History & Culture',
    sub_topic: 'Ashokan Inscriptions & Dhamma Conquest',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set D Q91 (Option B)',
    is_official_key: true,
    question_text: 'Which of the following Major Rock Edicts of Ashoka provides a vivid autobiographical description of the tragedy of the Kalinga War and announces the victory of \'Dhamma-vijaya\' (conquest by righteousness) over military conquest?',
    options: [
      'Major Rock Edict X',
      'Major Rock Edict XIII',
      'Major Rock Edict VII',
      'Major Rock Edict II'
    ],
    explanation: 'Option B is correct: Major Rock Edict XIII is the famous edict recounting Ashoka\'s conquest of Kalinga in his 8th regnal year (c. 261 BCE), expressing deep remorse over the slaughter, death, and deportation of 150,000 people, and declaring that conquest by Dhamma is the only true victory.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part I; Upinder Singh, A History of Ancient and Early Medieval India.',
    elimination_trap: 'Rock Edict II deals with medical treatment for humans and animals; Rock Edict XIII deals with Kalinga war and Hellenistic kings.',
    option_analysis: {
      A: 'Incorrect: Edict X denounces individual desire for fame and glory.',
      B: 'Correct: Major Rock Edict XIII contains the Kalinga narrative and names five Greek kings.',
      C: 'Incorrect: Edict VII calls for religious tolerance across all sects.',
      D: 'Incorrect: Edict II deals with social welfare and botanical gardens.'
    }
  },
  {
    id: 'cds-2023-his-021',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'History & Culture',
    sub_topic: 'Vijayanagara Empire & Nayankara System',
    difficulty: 'Tough',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CDS (II) 2023 General Knowledge - Set B Q77 (Option A)',
    is_official_key: true,
    question_text: 'In the Vijayanagara Empire, the terms \'Amara-nayakas\' and \'Amaram\' referred to which one of the following institutional arrangements?',
    options: [
      'Military commanders who were given territories (amaram) to govern and maintain troops for the Raya',
      'Hereditary revenue collectors who paid annual tribute directly to provincial governors',
      'Guild masters of international trade operating across the Coromandel coast',
      'Chief priests responsible for the administration of temple devadana lands'
    ],
    explanation: 'Option A is correct: As documented by Portuguese chroniclers Fernao Nuniz and Domingo Paes, the amara-nayaka system was a major political innovation of the Vijayanagara Empire (similar to the Iqta system of Delhi Sultanate). Amara-nayakas were military commanders who were granted territories (amaram) to collect taxes, maintain contingents of foot-soldiers and horses for the King (Raya), and send an annual tribute.',
    standard_book_ref: 'NCERT Class XII Themes in Indian History Part II, Chapter 7 An Imperial Capital: Vijayanagara.',
    elimination_trap: 'They were not merely revenue collectors or guild masters; they were armed military governors holding contingent quotas.',
    option_analysis: {
      A: 'Correct: Military chiefs given amaram territories for revenue and force maintenance.',
      B: 'Incorrect: Amara-nayakas were military lords, not ordinary revenue officials.',
      C: 'Incorrect: Guilds were chettis/kudirai chettis.',
      D: 'Incorrect: Temple managers were sthanikas.'
    }
  },
  {
    id: 'capf-2022-his-022',
    exam: 'UPSC CAPF',
    year: 2022,
    subject: 'History & Culture',
    sub_topic: 'Gandhi-Irwin Pact of 1931 Terms',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CAPF (AC) 2022 Paper I - Set A Q105 (Option D)',
    is_official_key: true,
    question_text: 'Which one of the following demands put forward by Mahatma Gandhi was firmly REJECTED by Viceroy Lord Irwin during the negotiations of the Gandhi-Irwin Pact (March 1931)?',
    options: [
      'Immediate release of all political prisoners not convicted of violence',
      'Remission of all fines not yet collected by the colonial government',
      'Right to make salt for domestic consumption along coastal villages',
      'A public inquiry into police excesses and commutation of death sentences of Bhagat Singh and comrades'
    ],
    explanation: 'Option D is correct: Viceroy Irwin accepted the release of non-violent political prisoners, return of confiscated lands, and right to make salt along the coast. However, Irwin categorically rejected two demands: (1) A public judicial inquiry into police excesses, and (2) Commutation of the death sentence of Bhagat Singh, Sukhdev, and Rajguru to life imprisonment.',
    standard_book_ref: 'Spectrum A Brief History of Modern India, Chapter on Civil Disobedience Movement.',
    elimination_trap: 'Irwin refused to demoralize the police force by conceding an inquiry into police brutalities.',
    option_analysis: {
      A: 'Accepted by Irwin.',
      B: 'Accepted by Irwin.',
      C: 'Accepted by Irwin.',
      D: 'Firmly rejected by Irwin (hence correct answer).'
    }
  },

  // ----------------------------------------------------
  // GEOGRAPHY (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-geo-023',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'Geography',
    sub_topic: 'Sub-Tropical Jet Streams & Western Disturbances',
    difficulty: 'Moderate',
    correct_option: 'D',
    correct_index: 3,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set A Q63 (Option D)',
    is_official_key: true,
    question_text: 'Which of the following atmospheric mechanisms is primarily responsible for steering the extra-tropical winter cyclonic depressions (Western Disturbances) into Northern India?',
    options: [
      'The Tropical Easterly Jet Stream blowing over peninsular India',
      'The South-West Monsoon Somali low-level jet',
      'The Northeast trade winds blowing across the Bay of Bengal',
      'The Sub-Tropical Westerly Jet Stream flowing south of the Himalayas'
    ],
    explanation: 'Option D is correct: During winter, the Sub-Tropical Westerly Jet Stream is bifurcated by the Tibetan Plateau. Its southern branch blows eastward south of the Himalayas at about 9-12 km altitude and steers mid-latitude cyclonic storms originating over the Mediterranean Sea and Caspian Sea across Iran and Pakistan into Northern India as Western Disturbances.',
    standard_book_ref: 'NCERT Class XI India: Physical Environment, Chapter 4 Climate; D.R. Khullar Geography.',
    elimination_trap: 'Tropical Easterly Jet occurs in summer, not winter. Somali Jet drives the SW monsoon.',
    option_analysis: {
      A: 'Incorrect: Easterly Jet is an upper tropospheric summer feature.',
      B: 'Incorrect: Somali jet is a summer low-level feature.',
      C: 'Incorrect: Surface trade winds do not steer upper mid-latitude cyclones.',
      D: 'Correct: Southern branch of Sub-Tropical Westerly Jet Stream.'
    }
  },
  {
    id: 'capf-2024-geo-024',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'Geography',
    sub_topic: 'Submarine Relief: Continental Shelves vs Trenches',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set A Q52 (Option A)',
    is_official_key: true,
    question_text: 'Consider the following statements regarding the Continental Shelf of oceans:\n1. Continental shelves are shallow sea zones with a gentle average slope of 1° or even less.\n2. The Siberian Shelf in the Arctic Ocean is the largest continental shelf in the world.\n3. The continental shelves are completely devoid of marine life and mineral resources due to wave erosion.\n\nWhich of the statements given above is/are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1 and 3 only',
      '1, 2 and 3'
    ],
    explanation: 'Statements 1 and 2 are correct: Continental shelves have an average gradient of 1° or less and average depth of 120-200 meters. The Siberian shelf in the Arctic Ocean stretches over 1,500 km in width and is the widest on Earth. Statement 3 is completely false: continental shelves receive abundant sunlight (photic zone), making them the richest fishing grounds on Earth (e.g. Grand Banks) and massive reservoirs of offshore petroleum and natural gas (e.g. Bombay High, Persian Gulf).',
    standard_book_ref: 'NCERT Class XI Fundamentals of Physical Geography, Chapter 13 Water (Oceans).',
    elimination_trap: 'Extreme statement 3: "completely devoid of marine life and mineral resources" is absurd since most fisheries and offshore oil come from continental shelves.',
    option_analysis: {
      A: 'Correct: Statements 1 and 2 are geomorphological facts.',
      B: 'Incorrect: Statement 3 is false.',
      C: 'Incorrect: Statement 3 is false.',
      D: 'Incorrect: Statement 3 is false.'
    }
  },
  {
    id: 'cds-2023-geo-025',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Geography',
    sub_topic: 'Indian Drainage: Superimposed vs Antecedent Rivers',
    difficulty: 'Tough',
    correct_option: 'C',
    correct_index: 2,
    upsc_official_key: 'Official Key: CDS (II) 2023 General Knowledge - Set D Q99 (Option C)',
    is_official_key: true,
    question_text: 'Which one of the following rivers is an example of an \'Antecedent Drainage\' system that cut deep gorges through the rising Himalayas?',
    options: [
      'Gomti',
      'Yamuna',
      'Indus',
      'Betwa'
    ],
    explanation: 'Option C is correct: Antecedent rivers are older than the mountains through which they flow. As the Himalayas were uplifted during the Tertiary period, rivers like the Indus, Sutlej, and Brahmaputra maintained their courses by cutting deep V-shaped gorges through the rising ranges (e.g., the Indus gorge at Bunji in Kashmir, over 5,000 meters deep).',
    standard_book_ref: 'NCERT Class XI India: Physical Environment, Chapter 3 Drainage System.',
    elimination_trap: 'Gomti originates from Fulhar Jheel in the plains; Betwa is a peninsular river flowing into Yamuna. Only Indus/Sutlej/Brahmaputra are classic antecedent rivers.',
    option_analysis: {
      A: 'Incorrect: Gomti is a plain river.',
      B: 'Incorrect: Yamuna originates from Yamunotri glacier on the southern slopes.',
      C: 'Correct: Indus cuts through Ladakh and Zanskar ranges via antecedent incision.',
      D: 'Incorrect: Betwa is a peninsular Vindhyan river.'
    }
  },

  // ----------------------------------------------------
  // SCIENCE & TECHNOLOGY (UPSC CDS & CAPF 2014-2024)
  // ----------------------------------------------------
  {
    id: 'cds-2024-sci-026',
    exam: 'UPSC CDS',
    year: 2024,
    subject: 'Science & Technology',
    sub_topic: 'Optics: Total Internal Reflection Applications',
    difficulty: 'Easy',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2024 General Knowledge - Set B Q102 (Option B)',
    is_official_key: true,
    question_text: 'Total Internal Reflection (TIR) occurs when light travels from a denser medium to a rarer medium and the angle of incidence is greater than the critical angle. Which of the following phenomena are based on Total Internal Reflection?\n1. Propagation of light through an optical fibre cable\n2. Mirage formation in hot deserts\n3. Twinkling of stars in the night sky\n4. Sparkle of a cut diamond\n\nSelect the correct answer using the code given below:',
    options: [
      '1 and 2 only',
      '1, 2 and 4 only',
      '2, 3 and 4 only',
      '1, 2, 3 and 4'
    ],
    explanation: 'Option B is correct (1, 2, and 4 only): Optical fibres, desert mirages, and the brilliance of diamonds operate on Total Internal Reflection. In contrast, the twinkling of stars is caused by atmospheric refraction through layers of air of varying optical densities, not by Total Internal Reflection.',
    standard_book_ref: 'NCERT Class X Science, Chapter 10 Light: Reflection and Refraction; Class XII Physics Optics.',
    elimination_trap: 'Twinkling of stars is always atmospheric refraction, a favorite UPSC distinction.',
    option_analysis: {
      A: 'Incomplete: Diamond sparkle (critical angle ~24.4°) is also based on TIR.',
      B: 'Correct: 1, 2, and 4 are based on TIR; 3 is atmospheric refraction.',
      C: 'Incorrect: Optical fibres (1) are the quintessential engineering application of TIR.',
      D: 'Incorrect: Includes item 3.'
    }
  },
  {
    id: 'capf-2024-sci-027',
    exam: 'UPSC CAPF',
    year: 2024,
    subject: 'Science & Technology',
    sub_topic: 'Biotechnology: mRNA Vaccines vs Conventional Vaccines',
    difficulty: 'Moderate',
    correct_option: 'A',
    correct_index: 0,
    upsc_official_key: 'Official Key: CAPF (AC) 2024 Paper I - Set A Q85 (Option A)',
    is_official_key: true,
    question_text: 'In the context of modern vaccine technologies, what is the key distinction of mRNA vaccines (such as those developed for COVID-19) compared to traditional attenuated or inactivated viral vaccines?',
    options: [
      'mRNA vaccines introduce synthetic genetic instructions encapsulated in lipid nanoparticles to direct host cells to produce the harmless spike protein antigens.',
      'mRNA vaccines enter the cell nucleus and permanently integrate into the human host genome via reverse transcriptase.',
      'mRNA vaccines contain live weakened viral pathogens that replicate in the blood to trigger natural immunity.',
      'mRNA vaccines provide passive ready-made monoclonal antibodies that bypass the host\'s adaptive immune response.'
    ],
    explanation: 'Option A is correct: mRNA vaccines deliver messenger RNA encapsulated in lipid nanoparticles into the cytoplasm of host cells. The cell\'s ribosomes translate this code into the viral spike protein, prompting the immune system to produce antibodies and T-cell responses. mRNA never enters the nucleus and does not integrate into host DNA. It degrades naturally within hours.',
    standard_book_ref: 'NCERT Class XII Biology, Chapter 8 Human Health and Disease; WHO Vaccine Guidelines.',
    elimination_trap: 'Myth trap: mRNA NEVER alters or integrates into human genomic DNA; it operates strictly in the cytoplasm.',
    option_analysis: {
      A: 'Correct: Delivers mRNA template in lipid nanoparticles for cytosolic translation.',
      B: 'Incorrect: mRNA cannot enter nucleus or alter DNA.',
      C: 'Incorrect: That describes live-attenuated vaccines.',
      D: 'Incorrect: That describes passive antibody therapy, not active vaccination.'
    }
  },
  {
    id: 'cds-2023-sci-028',
    exam: 'UPSC CDS',
    year: 2023,
    subject: 'Science & Technology',
    sub_topic: 'Space Exploration: James Webb Space Telescope (JWST)',
    difficulty: 'Moderate',
    correct_option: 'B',
    correct_index: 1,
    upsc_official_key: 'Official Key: CDS (I) 2023 General Knowledge - Set C Q47 (Option B)',
    is_official_key: true,
    question_text: 'At which of the following locations is NASA/ESA/CSA\'s James Webb Space Telescope (JWST) positioned to observe the early universe?',
    options: [
      'Low Earth Orbit (LEO) at 550 km altitude alongside the Hubble Space Telescope',
      'The Second Sun-Earth Lagrange Point (L2), approximately 1.5 million kilometers away from Earth',
      'The First Sun-Earth Lagrange Point (L1), directly facing the Sun',
      'A geosynchronous transfer orbit positioned over the North Pole'
    ],
    explanation: 'Option B is correct: JWST is stationed in a halo orbit around the Sun-Earth Lagrange Point 2 (L2), located approximately 1.5 million km from Earth in the anti-sunward direction. This enables its sunshield to permanently block light and heat from the Sun, Earth, and Moon, keeping its infrared sensors cooled to near absolute zero (-233°C).',
    standard_book_ref: 'ISRO / NASA Science Briefs; Science & Technology by Ravi P. Agrahari.',
    elimination_trap: 'L1 is where solar observation satellites like SOHO and India\'s Aditya-L1 are placed; JWST is at L2 looking into deep space.',
    option_analysis: {
      A: 'Incorrect: Hubble is in LEO; JWST is 1.5 million km away.',
      B: 'Correct: L2 Lagrange Point.',
      C: 'Incorrect: L1 is for solar observatories (Aditya-L1).',
      D: 'Incorrect: Not a geosynchronous orbit.'
    }
  }
];

const outPath = path.resolve(__dirname, '../static/data/upsc_other_exams_pyqs.json');
fs.writeFileSync(outPath, JSON.stringify(otherExamQuestions, null, 2), 'utf8');
console.log('Successfully wrote', otherExamQuestions.length, 'CDS & CAPF PYQs to', outPath);
