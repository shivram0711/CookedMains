// Batch 1: Questions 1 to 27 (Governance, Health, Biotech, Social Issues, Education, Digital Governance)
const batch1 = [
  {
    id: "ca-gov-2026-04-001",
    year: 2026,
    month: "April 2026",
    subject: "Polity & Governance",
    sub_topic: "Living Wills, Clinically Assisted Nutrition and Hydration (CANH) & End-of-Life Jurisprudence",
    difficulty: "Tough",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "Supreme Court in Harish Rana v. Union of India (2026) & Common Cause v. Union of India (2018/2023)",
    question_text: "With reference to Advance Medical Directives (Living Wills) and end-of-life care in India, consider the following statements:\n1. In Harish Rana v. Union of India (2026), the Supreme Court permitted the withdrawal of Clinically Assisted Nutrition and Hydration (CANH) as a medical treatment measure while requiring palliative care to continue.\n2. Under the simplified guidelines issued in 2023, an Advance Directive must be countersigned by a Judicial Magistrate of First Class to be legally operational.\n3. The Supreme Court observed that the term 'passive euthanasia' has become obsolete in modern legal and medical discourse.\n4. The ethical justification for withdrawing life-sustaining treatment draws upon the bioethical 'Theory of Double Effect' formulated by St. Thomas Aquinas.\n\nWhich of the statements given above are correct?",
    options: [
      "1, 2 and 3 only",
      "2 and 4 only",
      "1, 3 and 4 only",
      "1, 2, 3 and 4"
    ],
    explanation: "Statement 1 is correct: In Harish Rana v. Union of India (2026), the Supreme Court for the first time permitted the withdrawal of Clinically Assisted Nutrition and Hydration (CANH) and clarified that artificial feeding may be withdrawn as a treatment measure while comfort care and palliative care continue.\nStatement 2 is incorrect: In the 2023 Common Cause judgment, the Supreme Court streamlined the procedure and removed the mandatory judicial oversight requirement (countersignature by a Judicial Magistrate of First Class); an Advance Directive now requires signatures of two witnesses and attestation by a public notary or gazetted officer.\nStatement 3 is correct: The Supreme Court noted that the phrase 'passive euthanasia' is obsolete and should not be used in legal or medical discourse because withholding or withdrawing futile treatment is not an act of killing or abandonment, but allowing natural death with dignity.\nStatement 4 is correct: Bioethical jurisprudence applies St. Thomas Aquinas's Theory of Double Effect, which holds that an action having both harmful (shortening biological existence) and beneficial (relieving intractable suffering) consequences is ethically justified if undertaken without malice and primarily to alleviate pain.",
    standard_book_ref: "Constitution of India, Article 21; Indian Association of Palliative Care (IAPC) Guidelines; Supreme Court Rulings",
    elimination_trap: "Trap on Statement 2: Believing that judicial magistrate countersignature is still mandatory. The 2023 amendment explicitly removed this cumbersome procedural bottleneck.",
    static_root: "Fundamental Right to Life and Dignified Death under Article 21",
    option_analysis: {
      A: "Incorrect: Statement 2 is false as JMFC countersignature was removed in 2023.",
      B: "Incorrect: Statements 1 and 3 are also correct.",
      C: "Correct: Statements 1, 3 and 4 are legally and ethically accurate.",
      D: "Incorrect: Statement 2 is false."
    },
    mains_linkage: "GS Paper II: Health, Fundamental Rights (Article 21), and Bioethics in Judicial Pronouncements",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-04-002",
    year: 2026,
    month: "April 2026",
    subject: "Polity & Governance",
    sub_topic: "Vaccine Injury Compensation & Adverse Events Following Immunisation (AEFI)",
    difficulty: "Moderate",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "Supreme Court in Rachana Gangu v. Union of India (2026) & National AEFI Guidelines",
    question_text: "Consider the following statements regarding Adverse Events Following Immunisation (AEFI) and vaccine injury compensation in India:\n1. The Supreme Court in Rachana Gangu v. Union of India (2026) directed the Union Government to formulate a no-fault compensation policy for severe adverse events resulting from vaccination.\n2. In traditional Indian tort law, compensation for vaccine-induced autoimmune reactions can be claimed without having to establish manufacturer negligence or state fault.\n3. Thrombosis with Thrombocytopenia Syndrome (TTS) is a recognized severe AEFI associated with adenoviral vector-based COVID-19 vaccines.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "3 only",
      "1, 2 and 3"
    ],
    explanation: "Statement 1 is correct: In Rachana Gangu v. Union of India (2026), the Supreme Court directed the Union government to frame a comprehensive no-fault compensation mechanism for serious adverse events following COVID-19 immunization, rooting it in the constitutional duty under Article 21.\nStatement 2 is incorrect: Under conventional Indian tort law, liability is fault-based and requires proof of negligence, breach of duty, or defect, making it structurally unsuited for idiosyncratic immunological reactions where no negligence occurred.\nStatement 3 is correct: Thrombosis with Thrombocytopenia Syndrome (TTS)—characterized by blood clots alongside low platelet counts—is an internationally and nationally documented rare adverse reaction to viral-vector vaccines.",
    standard_book_ref: "Law of Torts; Ministry of Health & Family Welfare AEFI Surveillance Guidelines; Article 21",
    elimination_trap: "Trap on Statement 2: Confusing 'no-fault liability' (which is what is being demanded/proposed) with existing tort law (which strictly requires proof of fault or negligence).",
    static_root: "State Responsibility, Public Health Obligations and Article 21",
    option_analysis: {
      A: "Incorrect: Statement 2 is wrong because Indian tort law requires proof of fault.",
      B: "Correct: Statements 1 and 3 are correct.",
      C: "Incorrect: Statement 1 is also correct.",
      D: "Incorrect: Statement 2 is false."
    },
    mains_linkage: "GS Paper II: Government Policies and Interventions for Health Development; Public Accountability",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-04-003",
    year: 2026,
    month: "April 2026",
    subject: "Environment & Ecology",
    sub_topic: "One Health Quadripartite Collaboration & Zoonotic Surveillance",
    difficulty: "Moderate",
    correct_option: "A",
    correct_index: 0,
    upsc_official_key: "One Health Joint Plan of Action (2022-2026) by Quadripartite Organizations",
    question_text: "Which of the following international organizations constitute the 'Quadripartite' partnership driving the global One Health Joint Plan of Action?\n1. World Health Organization (WHO)\n2. Food and Agriculture Organization (FAO)\n3. United Nations Environment Programme (UNEP)\n4. World Organisation for Animal Health (WOAH)\n5. International Union for Conservation of Nature (IUCN)\n\nSelect the correct answer using the code given below:",
    options: [
      "1, 2, 3 and 4 only",
      "1, 2 and 4 only",
      "2, 3, 4 and 5 only",
      "1, 3, 4 and 5 only"
    ],
    explanation: "The Quadripartite collaboration on One Health consists of four international entities: the Food and Agriculture Organization (FAO), the United Nations Environment Programme (UNEP), the World Health Organization (WHO), and the World Organisation for Animal Health (WOAH, formerly OIE). Together, they launched the One Health Joint Plan of Action (2022–2026) to integrate human, animal, and environmental health surveillance against emerging zoonoses, antimicrobial resistance (AMR), and food safety risks. IUCN is not a formal member of the Quadripartite partnership.",
    standard_book_ref: "Shankar IAS Environment; UNEP & WHO Official Briefs on One Health",
    elimination_trap: "Trap on Option 5: Aspirants often confuse IUCN with UNEP in global environmental health pacts. IUCN is an NGO/state membership union, not part of the UN-led Quadripartite.",
    static_root: "Zoonotic Disease Dynamics, Wildlife-Human Interface & Global Environmental Health",
    option_analysis: {
      A: "Correct: 1, 2, 3 and 4 are the four pillars of the Quadripartite.",
      B: "Incorrect: Misses UNEP, which joined the tripartite in 2022 to make it quadripartite.",
      C: "Incorrect: Includes IUCN and omits WHO.",
      D: "Incorrect: Includes IUCN and omits FAO."
    },
    mains_linkage: "GS Paper III: Environment, Biodiversity, and Emerging Zoonotic Pandemic Risks",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-04-004",
    year: 2026,
    month: "April 2026",
    subject: "Sci-Tech",
    sub_topic: "PreVenTB Clinical Trial & Novel Vaccines for Extrapulmonary Tuberculosis",
    difficulty: "Tough",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "ICMR PreVenTB Trial Results published in the British Medical Journal (BMJ)",
    question_text: "In the context of the PreVenTB clinical trial conducted by the Indian Council of Medical Research (ICMR), consider the following statements:\n1. The trial evaluated the efficacy of VPM1002 and Immuvac vaccines specifically among household contacts of pulmonary tuberculosis patients.\n2. VPM1002 is a recombinant BCG vaccine modified to express listeriolysin to enhance phagosomal escape and antigen presentation.\n3. The trial demonstrated that both vaccines exhibited significant protective efficacy against Extrapulmonary Tuberculosis (EPTB), an endpoint previously unstudied in global TB vaccine trials.\n\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1, 2 and 3",
      "1 and 3 only"
    ],
    explanation: "All statements are correct:\nStatement 1 is correct: The PreVenTB trial conducted by ICMR across 18 clinical sites involved over 12,700 household contacts of TB patients, assessing VPM1002 and Immuvac (Mycobacterium indicus pranii).\nStatement 2 is correct: VPM1002 is genetically engineered from Mycobacterium bovis BCG, incorporating the gene for listeriolysin O from Listeria monocytogenes, allowing the bacterium to perforate the phagosomal membrane and trigger robust CD4+ and CD8+ T-cell immune responses.\nStatement 3 is correct: The trial showed over 50% efficacy for VPM1002 against Extrapulmonary TB (EPTB) and over 60% for Immuvac in children, providing the world's first clinical trial efficacy evidence against EPTB endpoints.",
    standard_book_ref: "Science & Technology, NCERT Class 12 Biology (Microbes & Immunology); ICMR Publications",
    elimination_trap: "Aspirants might suspect that BCG-derived vaccines cannot protect against extrapulmonary manifestations or that EPTB endpoints are standard in vaccine trials (they were historically neglected in favor of sputum-positive pulmonary TB).",
    static_root: "Immunology, Biotechnology, Genetic Modification in Vaccine Platforms",
    option_analysis: {
      A: "Incorrect: Statement 3 is also correct.",
      B: "Incorrect: Statement 1 is also correct.",
      C: "Correct: All statements 1, 2 and 3 are correct.",
      D: "Incorrect: Statement 2 is also correct."
    },
    mains_linkage: "GS Paper III: Science and Technology - Developments and their Applications in Health and Disease Control",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-04-005",
    year: 2026,
    month: "April 2026",
    subject: "Sci-Tech",
    sub_topic: "Mesenchymal Stem Cell Therapy & Cellular Biology of Frailty",
    difficulty: "Moderate",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "Phase IIb CRATUS Trial & ICMR National Guidelines for Stem Cell Research",
    question_text: "With reference to Mesenchymal Stem Cells (MSCs) and recent therapeutic advances for biological frailty (such as Lomecel-B), consider the following statements:\n1. Mesenchymal stem cells are multipotent adult stem cells capable of differentiating into osteocytes, chondrocytes, and adipocytes.\n2. MSCs typically provoke a strong hyper-acute allogeneic rejection response, necessitating aggressive long-term immunosuppressive chemotherapy in recipients.\n3. Under the ICMR National Guidelines for Stem Cell Research, the commercial administration of stem cells for age-related frailty outside approved clinical trials is strictly prohibited.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 only",
      "1, 2 and 3"
    ],
    explanation: "Statement 1 is correct: Mesenchymal stem cells (MSCs) are non-hematopoietic, multipotent stromal cells that can differentiate into mesenchymal lineages, including bone (osteocytes), cartilage (chondrocytes), and fat (adipocytes).\nStatement 2 is incorrect: One of the hallmark clinical advantages of MSCs is their 'immune-privileged' nature—they express low levels of MHC class I, lack MHC class II and co-stimulatory molecules (CD40, CD80, CD86), and secrete anti-inflammatory cytokines, allowing allogeneic transplantation without routine immunosuppressive therapy.\nStatement 3 is correct: The Indian Council of Medical Research (ICMR) explicitly categorizes stem cell treatments outside hematopoietic stem cell transplantation for approved hematological conditions as experimental, strictly barring commercial therapy for frailty, anti-aging, or autism outside clinical trials.",
    standard_book_ref: "NCERT Class 12 Biology; ICMR Guidelines for Stem Cell Research",
    elimination_trap: "Trap on Statement 2: Assuming all transplanted foreign human cells require heavy immunosuppression. MSCs are renowned in medical biology for immune-evasion.",
    static_root: "Stem Cell Biology, Cellular Differentiation & National Regulatory Frameworks",
    option_analysis: {
      A: "Incorrect: Statement 2 is scientifically false.",
      B: "Correct: Statements 1 and 3 are correct.",
      C: "Incorrect: Statement 1 is factually true.",
      D: "Incorrect: Statement 2 is false."
    },
    mains_linkage: "GS Paper III: Science & Technology - Applications of Biotechnology and Ethics in Medicine",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-04-006",
    year: 2026,
    month: "April 2026",
    subject: "Sci-Tech",
    sub_topic: "Human Papillomavirus (HPV) & National Cervical Cancer Elimination Campaign",
    difficulty: "Moderate",
    correct_option: "D",
    correct_index: 3,
    upsc_official_key: "WHO 90-70-90 Cervical Cancer Elimination Strategy & MoHFW Guidelines",
    question_text: "With reference to Human Papillomavirus (HPV) and cervical cancer elimination strategies in India, consider the following statements:\n1. Over 80% of cervical cancer cases in India are attributed to persistent infection by high-risk HPV types 16 and 18.\n2. Cervical Intraepithelial Neoplasia (CIN) represents a prolonged precancerous window that can be detected through cytological Pap smear screening.\n3. The World Health Organization (WHO) and India's National Technical Advisory Group on Immunization (NTAGI) have approved a single-dose HPV vaccination schedule for adolescent girls.\n4. India's national campaign under the Viksit Bharat 2047 roadmap provides free HPV vaccination targeted at 14-year-old girls.\n\nWhich of the statements given above are correct?",
    options: [
      "1, 2 and 3 only",
      "2 and 4 only",
      "1 and 3 only",
      "1, 2, 3 and 4"
    ],
    explanation: "All statements are correct:\nStatement 1 is correct: High-risk HPV genotypes 16 and 18 account for approximately 85% of all invasive cervical cancer cases diagnosed in Indian women.\nStatement 2 is correct: Cervical Intraepithelial Neoplasia (CIN) takes approximately 10 to 15 years to progress into invasive carcinoma, offering an extensive window for secondary prevention via visual inspection with acetic acid (VIA) or Pap smear cytology.\nStatement 3 is correct: Following evidence from the SAGE committee of the WHO, a single-dose regimen was found to deliver comparable immunological efficacy to the multi-dose schedule, leading to its adoption in national rollouts.\nStatement 4 is correct: India launched the National HPV Vaccination Campaign on February 28, 2026, offering free vaccination to 14-year-old girls at government health centers to achieve the WHO elimination target.",
    standard_book_ref: "NCERT Class 12 Biology, Human Health and Disease; Ministry of Health & Family Welfare",
    elimination_trap: "Aspirants might assume that HPV vaccines still require a rigid 3-dose regimen or that the Indian government has not yet operationalized free single-age vaccination.",
    static_root: "Viral Oncology, Immunization Schedules, Public Health Disease Eradication",
    option_analysis: {
      A: "Incorrect: Statement 4 is also correct.",
      B: "Incorrect: Statements 1 and 3 are also correct.",
      C: "Incorrect: Statements 2 and 4 are also correct.",
      D: "Correct: All four statements are correct."
    },
    mains_linkage: "GS Paper II: Welfare Schemes for Vulnerable Sections, Healthcare Management",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-001",
    year: 2026,
    month: "May 2026",
    subject: "Environment & Ecology",
    sub_topic: "Hantavirus Transmission Dynamics & Zoonotic Reservoir Ecology",
    difficulty: "Moderate",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "WHO Disease Outbreak News (MV Hondius Outbreak, May 2026)",
    question_text: "Consider the following statements regarding Hantavirus infections:\n1. Hantaviruses are primarily transmitted to humans through inhalation of aerosolized excreta, saliva, or urine of infected rodents.\n2. Unlike most other hantaviruses, the Andes virus strain has demonstrated person-to-person transmission among close domestic contacts.\n3. Hantavirus infections in the Americas typically manifest as Haemorrhagic Fever with Renal Syndrome (HFRS), whereas Asian and European strains primarily cause Hantavirus Pulmonary Syndrome (HPS).\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "2 and 3 only",
      "1 and 2 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: The primary route of human hantavirus infection is inhalation of aerosolized viral particles originating from rodent droppings, urine, or nesting materials during cleaning of poorly ventilated spaces.\nStatement 2 is correct: While almost all hantaviruses are non-contagious between humans, the Andes virus strain (endemic to South America, implicated in the 2026 MV Hondius cruise ship outbreak) has documented person-to-person transmission through intimate contact or bodily secretions.\nStatement 3 is incorrect (Reversal Trap): 'Old World' hantaviruses found in Europe and Asia (such as Hantaan, Dobrava, and Puumala viruses) primarily cause Haemorrhagic Fever with Renal Syndrome (HFRS), whereas 'New World' hantaviruses in the Americas (such as Sin Nombre and Andes viruses) primarily cause Hantavirus Pulmonary Syndrome (HPS).",
    standard_book_ref: "CDC Zoonotic Arboviruses & Hantaviruses; Shankar IAS / PMF IAS Biology",
    elimination_trap: "Classic UPSC geographical reversal trap: New World (Americas) = Pulmonary Syndrome (HPS); Old World (Asia/Europe) = Renal Syndrome (HFRS).",
    static_root: "Zoonotic Viral Pathologies, Host-Reservoir Dynamics & Global Epidemic Surveillance",
    option_analysis: {
      A: "Incorrect: Statement 2 is also correct.",
      B: "Incorrect: Statement 3 has geographic manifestations reversed.",
      C: "Correct: Statements 1 and 2 are scientifically correct.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper III: Disaster Management, Emerging Biological Hazards & Health Security",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-002",
    year: 2026,
    month: "May 2026",
    subject: "International Relations",
    sub_topic: "WHO International Health Regulations (IHR 2005) & Ebola Viral Strains",
    difficulty: "Tough",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "WHO International Health Regulations (2005) & Neglected Tropical Diseases Roadmap",
    question_text: "With reference to Ebola Virus Disease (EVD) and the declaration of a Public Health Emergency of International Concern (PHEIC), consider the following statements:\n1. A PHEIC is defined under the International Health Regulations (2005) as an extraordinary event that constitutes a public health risk to other States through international spread.\n2. The Director-General of the WHO is constitutionally barred from declaring a PHEIC without the prior unanimous approval of the IHR Emergency Committee.\n3. The licensed Ebola vaccines 'Ervebo' and 'Zabdeno-Mvabea' confer equal cross-protective immunity against the Bundibugyo and Sudan ebolavirus species.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "1 and 2 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    explanation: "Statement 1 is correct: Under Article 12 of the International Health Regulations (IHR 2005), a PHEIC is formally defined as an extraordinary public health event determined to constitute a public health risk to other States through the international spread of disease and to potentially require a coordinated international response.\nStatement 2 is incorrect: Under the IHR, the final legal determination to declare a PHEIC rests with the Director-General of the WHO. The Emergency Committee provides expert advice and recommendations, but its consensus or unanimous approval is not a mandatory prerequisite; the DG may declare a PHEIC even when committee members are divided or before formal convening in rapid situations.\nStatement 3 is incorrect: Both approved Ebola vaccines—Ervebo (rVSV-ZEBOV) and Zabdeno-Mvabea (Ad26.ZEBOV/MVA-BN-Filo)—are engineered specifically against the surface glycoprotein of the Zaire ebolavirus species. They do not confer effective protective immunity against the distinct Bundibugyo or Sudan ebolavirus species, leaving outbreaks of the latter without licensed vaccines.",
    standard_book_ref: "WHO IHR (2005) Legal Framework; Gavi & CEPI Vaccine Portfolios",
    elimination_trap: "Trap on Statement 3: Assuming that vaccines against 'Ebola' provide broad pan-filovirus immunity across all five distinct viral species.",
    static_root: "International Health Law, Multilateral Governance & Global Health Security",
    option_analysis: {
      A: "Correct: Statement 1 is the only correct statement.",
      B: "Incorrect: Statement 2 is incorrect.",
      C: "Incorrect: Statements 2 and 3 are both incorrect.",
      D: "Incorrect: Statements 2 and 3 are false."
    },
    mains_linkage: "GS Paper II: Role of International Institutions (WHO), Global Treaties and Health Diplomacy",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-003",
    year: 2026,
    month: "May 2026",
    subject: "Sci-Tech",
    sub_topic: "Bacteriology of Shigellosis & Antimicrobial Resistance (AMR)",
    difficulty: "Moderate",
    correct_option: "A",
    correct_index: 0,
    upsc_official_key: "CDC Bacterial Enteric Infections & ICMR National AMR Surveillance Network",
    question_text: "Consider the following statements regarding the bacterium *Shigella* and the infection shigellosis:\n1. It is a Gram-negative, facultatively anaerobic bacterium that primarily invades the epithelial lining of the colon.\n2. Unlike cholera, which requires millions of bacteria to cause clinical disease, an infectious dose as low as 10 to 100 *Shigella* bacilli can trigger severe dysentery.\n3. Routine prophylactic administration of broad-spectrum fluoroquinolones to all asymptomatic community contacts is the standard public health protocol for outbreak containment in India.\n\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: *Shigella* species (such as *S. dysenteriae*, *S. flexneri*, and *S. sonnei*) are Gram-negative, rod-shaped, facultative anaerobes that cause bacillary dysentery by penetrating and multiplying within human colonic enterocytes.\nStatement 2 is correct: *Shigella* is characterized by exceptional acid tolerance, allowing it to survive the gastric barrier in very small numbers. As few as 10–100 organisms are sufficient to cause disease, explaining its high secondary household transmission rate.\nStatement 3 is incorrect: Mass or prophylactic antibiotic administration is strongly contraindicated because multi-drug resistant (MDR) *Shigella* is rampant. Unregulated antibiotic use accelerates resistance. Management focuses on rehydration, strict sanitation, and culture-directed antibiotic use only for severe, vulnerable, or dysenteric cases.",
    standard_book_ref: "NCERT Class 12 Biology; ICMR Treatment Guidelines for Antimicrobial Use in Common Syndromes",
    elimination_trap: "Trap on Statement 3: In infectious disease control, mass antibiotic prophylaxis for enteric infections is virtually never recommended due to AMR selection pressure.",
    static_root: "Microbiology, Pathogen Virulence Mechanisms & Antimicrobial Resistance",
    option_analysis: {
      A: "Correct: Statements 1 and 2 are correct.",
      B: "Incorrect: Statement 3 violates AMR containment principles.",
      C: "Incorrect: Statement 3 is false.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper III: Science & Technology - Health, Microbial Pathogens and Antibiotic Stewardship",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-004",
    year: 2026,
    month: "May 2026",
    subject: "Sci-Tech",
    sub_topic: "GLP-1 Receptor Agonists, Sarcopenia & Metabolic Phenotypes",
    difficulty: "Tough",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "Lancet Diabetes & Endocrinology / National NCD Monitoring Survey",
    question_text: "With reference to novel anti-obesity therapeutics (such as Semaglutide and Tirzepatide) and metabolic health in India, consider the following statements:\n1. Semaglutide mimics the endogenous incretin hormone Glucagon-Like Peptide-1 (GLP-1), which stimulates insulin secretion in a glucose-dependent manner and delays gastric emptying.\n2. Tirzepatide functions as a dual agonist targeting both the GLP-1 receptor and the Glucose-Dependent Insulinotropic Polypeptide (GIP) receptor.\n3. A significant clinical concern observed with rapid weight loss induced by GLP-1 agonists is sarcopenia, where up to 40% of the total lost weight may consist of lean skeletal muscle mass.\n4. The 'thin-fat' Indian phenotype is characterized by a high Body Mass Index (BMI) coupled with low visceral adiposity.\n\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2, 3 and 4 only",
      "1, 2 and 3 only",
      "1, 2, 3 and 4"
    ],
    explanation: "Statements 1, 2 and 3 are correct; Statement 4 is incorrect:\nStatement 1 is correct: Semaglutide is a synthetic GLP-1 receptor agonist that augments glucose-dependent insulin secretion, inhibits glucagon release, and slows gastric motility to promote satiety.\nStatement 2 is correct: Tirzepatide is a 'twincretin' that binds to and activates both GLP-1 and GIP receptors, producing superior glycemic and weight-reduction outcomes compared to selective GLP-1 monotherapy.\nStatement 3 is correct: Clinical trials indicate that approximately 25% to 40% of total weight reduction on GLP-1 agonists can be skeletal muscle loss (sarcopenia), leading to impaired metabolic rate unless paired with resistance exercise and adequate dietary protein.\nStatement 4 is incorrect: The 'thin-fat' South Asian/Indian phenotype is defined by normal or relatively low general BMI but disproportionately high visceral body fat, elevated waist-to-hip ratio, and lower skeletal muscle mass, making them vulnerable to Type-2 diabetes at lower weight thresholds.",
    standard_book_ref: "NCERT Class 11 Human Physiology (Endocrine System); ICMR-INDIAB Study Reports",
    elimination_trap: "Trap on Statement 4: The 'thin-fat' phenotype is the exact inverse of high BMI: it is low/normal BMI with *high* abdominal/visceral adiposity.",
    static_root: "Human Physiology, Incretin Hormones, Endocrine Regulation & Metabolic Syndromes",
    option_analysis: {
      A: "Incorrect: Statement 3 is also correct.",
      B: "Incorrect: Statement 4 is false.",
      C: "Correct: Statements 1, 2 and 3 are scientifically accurate.",
      D: "Incorrect: Statement 4 is false."
    },
    mains_linkage: "GS Paper II: Health Sector Governance, Regulation of Pharmaceuticals and Public Health",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-005",
    year: 2026,
    month: "May 2026",
    subject: "Social Issues & Welfare",
    sub_topic: "National Health Accounts (NHA) & Health Financing Dynamics in India",
    difficulty: "Moderate",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "National Health Accounts (NHA) Estimates 2022-23 & NSS 80th Round (2025)",
    question_text: "According to the National Health Accounts (NHA) estimates (2022-23) and recent health expenditure surveys, consider the following statements:\n1. Out-of-Pocket Expenditure (OOPE) as a percentage of Total Health Expenditure (THE) has dropped below 45%.\n2. In India's fiscal federalism, the Union Government finances more than 70% of total Government Health Expenditure (GHE), with States contributing the remainder.\n3. The National Health Policy (2017) target of raising public health spending to 2.5% of GDP has been officially achieved.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "1 and 2 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    explanation: "Statement 1 is correct: As per NHA 2022-23, Out-of-Pocket Expenditure (OOPE) as a share of Total Health Expenditure (THE) declined from 64.2% in 2013-14 to 43.4% in 2022-23, driven by expanded social safety nets and primary care schemes.\nStatement 2 is incorrect: In India's federal structure, health is primarily a State subject (Seventh Schedule, List II, Entry 6). State governments contribute over 63% of total Government Health Expenditure (GHE), while the Union Government contributes approximately 36%.\nStatement 3 is incorrect: As per NHA 2022-23, Government Health Expenditure stands at approximately 1.43% to 1.48% of GDP, remaining well below both the National Health Policy 2017 target of 2.5% of GDP and the WHO global recommendation of 5% of GDP.",
    standard_book_ref: "National Health Accounts Guidelines; Economic Survey of India; Seventh Schedule of the Constitution",
    elimination_trap: "Trap on Statement 2: Thinking the Centre pays for the majority of health spending. States foot nearly two-thirds of all government health expenditure.",
    static_root: "Fiscal Federalism, Public Expenditure on Social Infrastructure & Seventh Schedule",
    option_analysis: {
      A: "Correct: Statement 1 is the only correct statement.",
      B: "Incorrect: Statement 2 is factually inverted.",
      C: "Incorrect: Statements 2 and 3 are both false.",
      D: "Incorrect: Statements 2 and 3 are false."
    },
    mains_linkage: "GS Paper II: Issues Relating to Development and Management of Social Sector/Services relating to Health",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-05-006",
    year: 2026,
    month: "May 2026",
    subject: "Polity & Governance",
    sub_topic: "Higher Education Governance & Viksit Bharat Shiksha Adhisthan (VBSA) Bill",
    difficulty: "Tough",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "Constitution of India (Seventh Schedule, Entry 66 Union List & Entry 25 Concurrent List) and VBSA Bill Analysis",
    question_text: "With reference to the constitutional allocation of powers over higher education in India and legislative proposals under the Viksit Bharat Shiksha Adhisthan (VBSA) Bill, consider the following statements:\n1. While 'Education' is placed on the Concurrent List, 'coordination and determination of standards in institutions for higher education or research' is an exclusive Union subject under Entry 66 of List I.\n2. The VBSA Bill proposes a tripartite regulatory structure consisting of the Viniyaman Parishad (Regulation), Gunvatta Parishad (Accreditation), and Manak Parishad (Standards).\n3. Under Entry 66 of the Union List, Parliament possesses the constitutional competence to disburse day-to-day administrative block grants to State universities without legislative authorization by State Assemblies.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "2 and 3 only",
      "1 and 2 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: Under the 42nd Constitutional Amendment Act (1976), 'Education' was moved from the State List to the Concurrent List (Entry 25). However, 'coordination and determination of standards in institutions for higher education or research and scientific and technical institutions' remains an exclusive domain of Parliament under Entry 66 of the Union List.\nStatement 2 is correct: The VBSA Bill replaces multiple regulatory agencies (UGC, AICTE) with vertical functional councils: Viniyaman Parishad (regulatory enforcement), Gunvatta Parishad (accreditation), and Manak Parishad (learning standards).\nStatement 3 is incorrect: Entry 66 of List I is strictly limited to 'coordination and determination of standards'; it does not confer blanket financial or administrative power to usurp the State legislatures' authority over State universities incorporated under State statutes.",
    standard_book_ref: "M. Laxmikanth, Indian Polity (Seventh Schedule & Center-State Legislative Relations)",
    elimination_trap: "Trap on Statement 3: Overestimating the scope of Entry 66. Supreme Court precedents consistently hold that Entry 66 relates to standards of education, not administrative and financial absorption of state universities.",
    static_root: "Center-State Legislative Relations, Seventh Schedule & Higher Education Regulatory Architecture",
    option_analysis: {
      A: "Incorrect: Statement 2 is also correct.",
      B: "Incorrect: Statement 3 is false.",
      C: "Correct: Statements 1 and 2 are correct.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper II: Federal Structure, Devolution of Powers and Higher Education Regulatory Reforms",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-001",
    year: 2026,
    month: "June 2026",
    subject: "Social Issues & Welfare",
    sub_topic: "Section 12(1)(c) of RTE Act 2009 & Constitutional Equality of Status",
    difficulty: "Moderate",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "Supreme Court Rulings on Section 12(1)(c) of RTE Act 2009 & Society for Unaided Private Schools v. UOI (2012)",
    question_text: "With reference to Section 12(1)(c) of the Right of Children to Free and Compulsory Education (RTE) Act, 2009, consider the following statements:\n1. It mandates private unaided schools to admit at least 25% of children from Economically Weaker Sections (EWS) and disadvantaged groups in Class 1 or pre-school.\n2. The Supreme Court in 2026 reaffirmed that the reservation applies equally to minority educational institutions protected under Article 30(1) of the Constitution.\n3. The statutory provision has been judicially characterized as a constitutional strategy to operationalize 'equality of status' by dismantling segregated learning environments.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "3 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect:\nStatement 1 is correct: Section 12(1)(c) of the RTE Act, 2009 requires all private, non-minority unaided schools to reserve at least 25% of their entry-level seats (nursery/Class 1) for children belonging to disadvantaged groups and economically weaker sections.\nStatement 2 is incorrect: In Pramati Educational and Cultural Trust v. Union of India (2014), a Constitution Bench of the Supreme Court held that the RTE Act, insofar as it applies to minority institutions (both aided and unaided) protected under Article 30(1), is ultra vires the Constitution. Minority institutions remain exempt from the 25% mandate.\nStatement 3 is correct: The Supreme Court observed that Section 12(1)(c) is not merely a subsidy scheme but an affirmative constitutional measure to realize the Preamble's guarantee of 'equality of status and opportunity' through integrated classroom environments.",
    standard_book_ref: "M. Laxmikanth, Fundamental Rights (Articles 21A & 30); RTE Act, 2009",
    elimination_trap: "Trap on Statement 2: The exemption of minority educational institutions from Section 12(1)(c) under Article 30(1) is an established constitutional exception that cannot be overridden by ordinary statute.",
    static_root: "Right to Education (Article 21A), Minority Rights (Article 30) & Social Inclusion",
    option_analysis: {
      A: "Incorrect: Statement 2 is false due to Article 30(1) exemption.",
      B: "Correct: Statements 1 and 3 are constitutionally sound.",
      C: "Incorrect: Statement 1 is also correct.",
      D: "Incorrect: Statement 2 is false."
    },
    mains_linkage: "GS Paper II: Government Policies and Interventions for Social Justice and Education",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-002",
    year: 2026,
    month: "June 2026",
    subject: "Social Issues & Welfare",
    sub_topic: "Disability Pensions, Article 41 & Rights of Persons with Disabilities Act 2016",
    difficulty: "Moderate",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "Article 41, DPSP & Section 24 of RPwD Act, 2016",
    question_text: "Consider the following statements regarding social security for Persons with Disabilities (PwDs) in India:\n1. Article 41 of the Directive Principles of State Policy directs the State to make effective provision for securing public assistance in cases of disablement.\n2. Under Section 24 of the Rights of Persons with Disabilities Act, 2016, the State is mandated to formulate social security schemes and disability pensions within the limit of its economic capacity.\n3. India currently spends more than 1.5% of its GDP on dedicated disability pensions and social security schemes, matching the average of OECD economies.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "2 and 3 only",
      "1 and 2 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: Article 41 directs that 'The State shall, within the limits of its economic capacity and development, make effective provision for securing the right to work, to education and to public assistance in cases of unemployment, old age, sickness and disablement.'\nStatement 2 is correct: Section 24(1) of the RPwD Act, 2016 requires the appropriate Government to frame schemes and programmes to safeguard and promote an adequate standard of living for persons with disabilities.\nStatement 3 is incorrect: India currently spends approximately 0.02% of its GDP on disability pensions and welfare assistance, which is significantly lower than OECD nations (averaging 2.2% of GDP) and peer emerging economies like Brazil (0.45%–0.50% of GDP).",
    standard_book_ref: "M. Laxmikanth, Directive Principles of State Policy (Part IV); RPwD Act, 2016",
    elimination_trap: "Trap on Statement 3: Gross overestimation of India's disability welfare expenditure. India spends merely 0.02% of GDP on disability welfare.",
    static_root: "Directive Principles of State Policy (Article 41) & Statutory Rights of Disabled Citizens",
    option_analysis: {
      A: "Incorrect: Statement 2 is also correct.",
      B: "Incorrect: Statement 3 is false.",
      C: "Correct: Statements 1 and 2 are correct.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper II: Welfare Schemes for Vulnerable Sections, Performance and Mechanisms",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-003",
    year: 2026,
    month: "June 2026",
    subject: "Polity & Governance",
    sub_topic: "Transgender Rights, Self-Determination & NALSA v. Union of India (2014)",
    difficulty: "Tough",
    correct_option: "A",
    correct_index: 0,
    upsc_official_key: "NALSA v. Union of India (2014) & Transgender Persons (Protection of Rights) Act, 2019",
    question_text: "In *National Legal Services Authority (NALSA) v. Union of India (2014)*, the Supreme Court established foundational constitutional doctrines regarding gender identity. In this context, consider the following statements:\n1. The Supreme Court recognized that the right to express one's self-identified gender is an integral facet of freedom of expression under Article 19(1)(a) and personal liberty under Article 21.\n2. The judgment held that no psychological or surgical intervention can be insisted upon as a condition precedent for granting legal recognition of one's gender identity.\n3. The judgment conflated the biological definition of 'intersex persons' with 'transgender identity' as being synonymous under the Constitution.\n\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: The Supreme Court held that gender identity falls within the core of personal autonomy and self-expression, grounded in Articles 19(1)(a) and 21 of the Constitution.\nStatement 2 is correct: NALSA explicitly ruled that insisting on Sex Reassignment Surgery (SRS) or hormonal therapy as a prerequisite for legally changing one's gender violates bodily integrity and human dignity; self-determination alone is sufficient.\nStatement 3 is incorrect: NALSA recognized the distinct scientific nature of 'intersex' (a biological variation in sex characteristics) versus 'transgender' (a self-determined psychological/social gender identity that differs from the sex assigned at birth). Conflating the two has been criticized as biologically and constitutionally flawed.",
    standard_book_ref: "M. Laxmikanth, Fundamental Rights (Articles 14, 19, 21); NALSA Judgment (2014)",
    elimination_trap: "Trap on Statement 3: Failing to distinguish between biological sex characteristics (intersex) and cognitive/social gender identity (transgender).",
    static_root: "Fundamental Rights, Transformative Constitutionalism & Gender Self-Determination",
    option_analysis: {
      A: "Correct: Statements 1 and 2 reflect the core legal holding of NALSA.",
      B: "Incorrect: Statement 3 is false.",
      C: "Incorrect: Statement 3 is false.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper II: Social Justice, Judiciary and Protection of Transgender Rights",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-004",
    year: 2026,
    month: "June 2026",
    subject: "Polity & Governance",
    sub_topic: "Foreign Contribution (Regulation) Act (FCRA) & Civil Society Asset Management",
    difficulty: "Tough",
    correct_option: "C",
    correct_index: 2,
    upsc_official_key: "Foreign Contribution (Regulation) Act, 2010 & Proposed 2026 Amendments",
    question_text: "With reference to the Foreign Contribution (Regulation) Act (FCRA), 2010 and the FCRA Amendment Bill, 2026, consider the following statements:\n1. An FCRA registration certificate granted to a non-governmental organization is valid for a period of five years and is subject to renewal.\n2. The 2026 Amendment proposes that upon cancellation or non-renewal of an FCRA certificate, assets acquired through foreign funds shall provisionally vest in a government-appointed Designated Authority without requiring a prior judicial decree.\n3. The administration of FCRA falls under the statutory purview of the Ministry of Finance.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "1 and 3 only",
      "1 and 2 only",
      "2 and 3 only"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: Under Section 12 of the FCRA, 2010, registration remains valid for five years from the date of grant and must be renewed within six months before expiry.\nStatement 2 is correct: The proposed Section 16A of the FCRA Amendment Bill, 2026 creates a statutory mechanism whereby assets and properties created through foreign contributions automatically vest provisionally in a Designated Authority upon cancellation, suspension, or non-renewal, exercisable through executive action.\nStatement 3 is incorrect: The FCRA is administered by the Ministry of Home Affairs (MHA), not the Ministry of Finance, because foreign contribution regulation is grounded in national security, public interest, and sovereignty.",
    standard_book_ref: "M. Laxmikanth, Non-Governmental Organisations; FCRA Act, 2010",
    elimination_trap: "Nodal Ministry Trap: Assuming that since FCRA deals with 'foreign funds/contributions' and banking, it is handled by the Ministry of Finance. It is administered by the Ministry of Home Affairs (MHA).",
    static_root: "Statutory Bodies, Executive Powers, Freedom of Association (Article 19(1)(c)) & MHA Mandate",
    option_analysis: {
      A: "Incorrect: Statement 2 is also correct.",
      B: "Incorrect: Statement 3 is false (MHA, not MoF).",
      C: "Correct: Statements 1 and 2 are correct.",
      D: "Incorrect: Statement 3 is false."
    },
    mains_linkage: "GS Paper II: Development Processes and the Role of NGOs, Civil Society and Statutory Regulations",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-005",
    year: 2026,
    month: "June 2026",
    subject: "Sci-Tech",
    sub_topic: "Information Technology Act, Website Blocking & DNS Manipulation",
    difficulty: "Moderate",
    correct_option: "B",
    correct_index: 1,
    upsc_official_key: "Section 69A of Information Technology Act, 2000 & Shreya Singhal v. Union of India (2015)",
    question_text: "Consider the following statements regarding the legal and technical mechanisms of website blocking in India:\n1. Section 69A of the Information Technology Act, 2000 empowers the Central Government to issue directions for blocking public access to any information through any computer resource on grounds of sovereignty, integrity of India, or public order.\n2. In *Shreya Singhal v. Union of India (2015)*, the Supreme Court struck down Section 69A of the IT Act as unconstitutional.\n3. In India, Internet Service Providers (ISPs) predominantly implement website blocking through Domain Name System (DNS) poisoning, as it is computationally less resource-intensive than Deep Packet Inspection (DPI).\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "3 only",
      "1, 2 and 3"
    ],
    explanation: "Statements 1 and 3 are correct; Statement 2 is incorrect:\nStatement 1 is correct: Section 69A authorizes the Central Government (or designated officers) to issue blocking orders in the interest of India's sovereignty, defense, security of the State, friendly relations with foreign States, or public order.\nStatement 2 is incorrect: In Shreya Singhal v. Union of India (2015), the Supreme Court struck down Section 66A of the IT Act, but expressly UPHELD the constitutional validity of Section 69A and the Blocking Rules, 2009, observing that it contains adequate procedural safeguards, including recording of reasons in writing and review by a committee.\nStatement 3 is correct: Most Indian ISPs implement court and governmental blocking orders via DNS tampering/poisoning (returning an NXDOMAIN or redirecting to a notice page) because it operates at the resolver level without requiring deep packet inspection (DPI) hardware at line rate.",
    standard_book_ref: "Information Technology Act, 2000; Landmark Supreme Court Judgments on Digital Rights",
    elimination_trap: "Trap on Statement 2: Confusing Section 66A (struck down in Shreya Singhal) with Section 69A (upheld with procedural safeguards in the same judgment).",
    static_root: "Freedom of Speech (Article 19(1)(a)), Reasonable Restrictions (Article 19(2)) & Cyber Law",
    option_analysis: {
      A: "Incorrect: Statement 2 is false.",
      B: "Correct: Statements 1 and 3 are correct.",
      C: "Incorrect: Statement 1 is also correct.",
      D: "Incorrect: Statement 2 is false."
    },
    mains_linkage: "GS Paper III: Cyber Security, Digital Governance, Internal Security and Freedom of Speech",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  },
  {
    id: "ca-gov-2026-06-006",
    year: 2026,
    month: "June 2026",
    subject: "Polity & Governance",
    sub_topic: "Capital Punishment, Fixed-Term Sentences & Bachan Singh Edifice",
    difficulty: "Tough",
    correct_option: "D",
    correct_index: 3,
    upsc_official_key: "Supreme Court in Union of India v. V. Sriharan (2015) & Swamy Shraddananda v. State of Karnataka (2008)",
    question_text: "With reference to the sentencing jurisprudence on capital punishment and life imprisonment in India, consider the following statements:\n1. The 'rarest of rare cases' doctrine was laid down by the Constitution Bench in *Bachan Singh v. State of Punjab (1980)*.\n2. Under Section 433A of the Code of Criminal Procedure (CrPC), a person sentenced to imprisonment for life cannot be released on remission before serving a minimum of fourteen years of actual incarceration.\n3. The special category of fixed-term life imprisonment without remission (e.g., life imprisonment for 25 or 30 years) can be imposed by Sessions Courts as well as High Courts.\n\nWhich of the statements given above is/are correct?",
    options: [
      "1 only",
      "2 and 3 only",
      "1 and 3 only",
      "1 and 2 only"
    ],
    explanation: "Statements 1 and 2 are correct; Statement 3 is incorrect:\nStatement 1 is correct: In Bachan Singh v. State of Punjab (1980), the Supreme Court upheld the constitutional validity of the death penalty under Section 302 IPC, formulating the principle that capital punishment must only be awarded in the 'rarest of rare' cases when the alternative option of life imprisonment is unquestionably foreclosed.\nStatement 2 is correct: Section 433A of CrPC (now Section 475 of BNSS 2023) mandates that where a life sentence is imposed for an offence carrying the death penalty, the prisoner cannot be released by executive remission until they have served at least 14 years of actual imprisonment.\nStatement 3 is incorrect: In Swamy Shraddananda (2008) and reaffirmed by a Constitution Bench in Union of India v. V. Sriharan (2015), the Supreme Court ruled that the special intermediate sentencing power—substituting death with a specified term of 20, 25, or 30 years without remission—is an inherent power exercisable ONLY by Constitutional Courts (the Supreme Court and High Courts), and is NOT available to trial/Sessions courts.",
    standard_book_ref: "M. Laxmikanth, Judicial Reforms and Criminal Justice Administration; Code of Criminal Procedure",
    elimination_trap: "Trap on Statement 3: Believing that trial courts (Sessions courts) can invent custom sentences without remission. Constitutional jurisprudence strictly confines this power to High Courts and the Supreme Court.",
    static_root: "Judicial Sentencing Discretion, Article 21, Executive Remission Powers (Articles 72 & 161)",
    option_analysis: {
      A: "Incorrect: Statement 2 is also correct.",
      B: "Incorrect: Statement 3 is false.",
      C: "Incorrect: Statement 3 is false.",
      D: "Correct: Statements 1 and 2 are correct."
    },
    mains_linkage: "GS Paper II: Judiciary, Criminal Justice System and Due Process under Article 21",
    source_tag: "Decode Civils Current Affairs (April-June 2026) - Governance"
  }
];

console.log('Batch 1 prepared with', batch1.length, 'questions.');
module.exports = batch1;
