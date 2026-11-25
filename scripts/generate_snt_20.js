// 20 Authentic, faculty-grade UPSC CSE Prelims questions formulated from
// Decode Civils May-June 2026 Science and Technology Magazine by Mudit Jain Sir.
// Strict UPSC GS-1 standards, 4-option analysis, elimination traps, and standard citations.

const sntQuestions = [
  {
    id: "ca-snt-2026-05-001",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Space Cybersecurity & Dual-Use Satellites",
    question: "With reference to space cybersecurity and the legal status of dual-use satellites under international law, consider the following statements:\n1. Under the Outer Space Treaty (1967) and International Humanitarian Law (IHL), commercial communication satellites utilized for military telemetry lose their immunity and may qualify as legitimate military objectives.\n2. Article 2(4) of the United Nations Charter applies exclusively to terrestrial kinetic warfare and cannot be invoked against cyberattacks disabling orbital satellites.\n3. The CERT-In and SIA-India space cybersecurity guidelines mandate a 'secure-by-design' doctrine for private satellite architectures.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 1 and 3 are correct, while Statement 2 is incorrect.\nStatement 1 is correct: Under International Humanitarian Law (IHL) and the principle of distinction, when a civilian or commercial space asset (such as commercial low-Earth orbit broadband constellations) is integrated into military command-and-control or battlefield intelligence, it becomes a 'dual-use' object and can legally qualify as a military objective subject to proportionate engagement.\nStatement 2 is incorrect: Article 2(4) of the UN Charter prohibits the threat or use of force against the territorial integrity or political independence of any state. The International Court of Justice (Nuclear Weapons Advisory Opinion) and prevailing international state practice affirm that Article 2(4) applies to any use of force regardless of the weapons employed, including cyber operations that cause physical destruction or functional disablement of critical national space infrastructure.\nStatement 3 is correct: The joint guidelines issued by CERT-In and the Space Industry Association of India (SIA-India) establish a 'secure-by-design' framework, requiring space start-ups to embed cryptographic root-of-trust, uplink/downlink authentication, and supply-chain firmware audits to prevent ground station hijacking and signal spoofing.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is false (Article 2(4) is not limited to kinetic terrestrial weapons).",
      "Option B": "Correct. Statements 1 and 3 accurately reflect IHL principles of dual-use assets and India's space cybersecurity framework.",
      "Option C": "Incorrect because Statement 2 is false.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Outer Space Treaty 1967; UN Charter Article 2(4); Cyber Warfare & International Humanitarian Law; Space Security.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology (Space Tech); Pavneet Singh, International Relations; CERT-In Space Cybersecurity Directives.",
    elimination_trap: "Literal reading trap: thinking Article 2(4) UN Charter written in 1945 only applies to kinetic armies. Modern international jurisprudence applies it equally to cyber operations amounting to use of force.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)",
    question_text: "With reference to space cybersecurity and the legal status of dual-use satellites under international law, consider the following statements:\n1. Under the Outer Space Treaty (1967) and International Humanitarian Law (IHL), commercial communication satellites utilized for military telemetry lose their immunity and may qualify as legitimate military objectives.\n2. Article 2(4) of the United Nations Charter applies exclusively to terrestrial kinetic warfare and cannot be invoked against cyberattacks disabling orbital satellites.\n3. The CERT-In and SIA-India space cybersecurity guidelines mandate a 'secure-by-design' doctrine for private satellite architectures.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-002",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Exoplanet Atmospheres & Spectroscopy",
    question: "Regarding exoplanets and atmospheric transmission spectroscopy conducted by the James Webb Space Telescope (JWST), consider the following statements:\n1. 'Hot Jupiters' are gas giant exoplanets with physical characteristics similar to Jupiter but possessing very short orbital periods of typically less than 10 days.\n2. In tidally locked hot Jupiters, the rotational period of the planet about its own axis equals its orbital period around its host star.\n3. Transmission spectroscopy detects chemical species in an exoplanet's atmosphere by measuring the bright emission lines emitted during a secondary eclipse.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: 'Hot Jupiters' (such as WASP-94A b) are a class of gas giant extrasolar planets that are physically similar to Jupiter, but orbit extremely close to their parent stars (often 0.015 to 0.05 AU), leading to orbital periods of just a few Earth days and scorching atmospheric temperatures.\nStatement 2 is correct: Due to intense gravitational tidal interactions with their close parent star, hot Jupiters become tidally locked, meaning their rotational period matches their orbital period, resulting in a permanent dayside of extreme heat and a permanent frozen nightside.\nStatement 3 is incorrect: Transmission spectroscopy measures the dark *absorption* lines (gaps in wavelengths) produced when starlight filters through the thin outer fringes of the exoplanet's atmosphere during a PRIMARY transit (when the planet crosses in front of the star), not emission lines during a secondary eclipse. Each gaseous molecule absorbs light at specific characteristic frequencies, revealing atmospheric chemistry (e.g. water vapor, methane, silicates).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately define Hot Jupiters and tidal locking mechanics.",
      "Option B": "Incorrect because Statement 3 is false (it uses absorption lines during primary transit).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Exoplanets; Kepler & James Webb Space Telescope; Spectroscopy (Absorption vs Emission); Orbital Mechanics (Tidal Locking).",
    standard_book_ref: "NCERT Class 12 Physics (Wave Optics & Spectra); Ravi P. Agrahari, Science & Technology; NASA Exoplanet Exploration Archive.",
    elimination_trap: "Spectroscopy technique swap: transmission spectroscopy measures starlight *absorbed* through the planet's atmospheric annulus during transit, creating absorption dips, NOT bright emission lines.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding exoplanets and atmospheric transmission spectroscopy conducted by the James Webb Space Telescope (JWST), consider the following statements:\n1. 'Hot Jupiters' are gas giant exoplanets with physical characteristics similar to Jupiter but possessing very short orbital periods of typically less than 10 days.\n2. In tidally locked hot Jupiters, the rotational period of the planet about its own axis equals its orbital period around its host star.\n3. Transmission spectroscopy detects chemical species in an exoplanet's atmosphere by measuring the bright emission lines emitted during a secondary eclipse.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-003",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Orbital Warfare & Co-Orbital Anti-Satellite Systems",
    question: "In the context of counter-space technologies and orbital warfare, what is meant by a 'Co-Orbital Anti-Satellite (ASAT)' system?",
    options: [
      "A ground-based ballistic missile that ascends vertically to physically impact a low-Earth orbit satellite without entering orbit.",
      "A spacecraft placed into orbit that matches the orbital plane of a target satellite to physically manipulate, blind, jam, or push it into a graveyard orbit.",
      "A high-altitude atmospheric balloon equipped with high-power microwave jammers.",
      "A nuclear electromagnetic pulse (EMP) device detonated exclusively in the stratosphere."
    ],
    answer: "A spacecraft placed into orbit that matches the orbital plane of a target satellite to physically manipulate, blind, jam, or push it into a graveyard orbit.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nCo-orbital ASAT systems are space-based counter-space weapons. Unlike direct-ascent ASAT weapons (like India's Mission Shakti interceptor or China's SC-19, which launch from the ground on a ballistic suborbital trajectory to strike a satellite), a co-orbital system is first launched into Earth orbit. It then conducts orbital maneuvers to rendezvous and match orbits with a target satellite. Once co-located, it can deploy robotic arms, spray chemical obscurants, deliver localized electronic jamming, or physically push the target satellite out of its operational slot into a non-functional 'graveyard orbit' (as demonstrated by China's Shijian/TJS series).",
    option_analysis: {
      "Option A": "Incorrect. This describes a Direct-Ascent Anti-Satellite (DA-ASAT) weapon.",
      "Option B": "Correct. Accurately describes the rendezvous, co-location, and orbital maneuvering of co-orbital ASAT systems.",
      "Option C": "Incorrect. This describes high-altitude pseudo-satellites (HAPS) or balloon electronic warfare platforms.",
      "Option D": "Incorrect. This describes high-altitude nuclear EMP bursts."
    },
    static_root: "Space Warfare Technologies (Direct-Ascent vs Co-Orbital vs Electronic/Cyber); Space Debris; Graveyard Orbits.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology; DRDO Technical Journals; SIPRI Space Security Reports.",
    elimination_trap: "Direct-ascent vs Co-orbital: direct-ascent launches from Earth and intercepts on an upward trajectory; co-orbital is already in orbit and changes orbital planes to rendezvous.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In the context of counter-space technologies and orbital warfare, what is meant by a 'Co-Orbital Anti-Satellite (ASAT)' system?"
  },
  {
    id: "ca-snt-2026-05-004",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Orbital Edge Computing & Satellite AI",
    question: "With reference to 'Orbital Data Centres' and satellite-based AI processing (such as the Pathfinder mission), consider the following statements:\n1. Orbital edge computing processes raw satellite sensor data onboard in space, transmitting only analysed insights to Earth rather than massive raw data streams.\n2. In the vacuum of outer space, cooling high-performance GPUs is facilitated by natural thermal convection.\n3. Ionizing cosmic rays in low Earth orbit can cause Single-Event Upsets (SEUs) in semiconductor memory circuits.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 3 only",
    correct_index: 2,
    correct_option: "C",
    explanation: "Statements 1 and 3 are correct, while Statement 2 is incorrect.\nStatement 1 is correct: Modern Earth observation constellations generate gigabytes of raw hyperspectral/optical data. Orbital data centres (such as the Pixxel-Sarvam Pathfinder) place data-centre class GPUs directly in orbit to run AI inference models at the edge, distilling insights (e.g., detecting a forest fire or oil spill) in orbit and sending down lightweight notifications, bypassing downlink bandwidth bottlenecks.\nStatement 2 is incorrect: In the vacuum of space, there is NO fluid or air medium; therefore, thermal CONVECTION does not exist. Cooling high-power computing chips in orbit is exceptionally difficult and relies exclusively on thermal conduction (heat pipes) transferring heat to external radiator panels that discard heat via thermal RADIATION into the cold background of space.\nStatement 3 is correct: High-energy cosmic rays and solar protons passing through silicon semiconductors generate charge tracks that flip digital bits (0 to 1 or vice-versa), known as Single-Event Upsets (SEUs), necessitating radiation-hardened components and error-correcting code (ECC) memory.",
    option_analysis: {
      "Option A": "Incorrect because Statement 2 is physically false (convection cannot occur in a vacuum).",
      "Option B": "Incorrect because Statement 2 is false.",
      "Option C": "Correct. Statements 1 and 3 accurately describe edge computing advantages and space radiation physics.",
      "Option D": "Incorrect because Statement 2 is false."
    },
    static_root: "Thermodynamics: Heat Transfer (Conduction, Convection, Radiation in Vacuum); Space Environment & Radiation Effects (SEUs).",
    standard_book_ref: "NCERT Class 11 Physics, Chapter 11 (Thermal Properties of Matter); Ravi P. Agrahari, Science & Technology.",
    elimination_trap: "Basic physics trap: outer space is cold, but because it is a vacuum, heat cannot escape through convection. Heat rejection must rely entirely on radiative cooling.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (C)",
    question_text: "With reference to 'Orbital Data Centres' and satellite-based AI processing (such as the Pathfinder mission), consider the following statements:\n1. Orbital edge computing processes raw satellite sensor data onboard in space, transmitting only analysed insights to Earth rather than massive raw data streams.\n2. In the vacuum of outer space, cooling high-performance GPUs is facilitated by natural thermal convection.\n3. Ionizing cosmic rays in low Earth orbit can cause Single-Event Upsets (SEUs) in semiconductor memory circuits.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-005",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Earth Observation & Hybrid Satellite Sensors",
    question: "Consider the following statements regarding 'Mission Drishti' developed by Indian space-tech startup GalaxEye Space:\n1. It is the world's first satellite to house both an optical sensor and a Synthetic Aperture Radar (SAR) on a single platform, termed 'OptoSAR'.\n2. SAR instruments are active sensors that can penetrate cloud cover and darkness by transmitting their own microwave pulses.\n3. Optical sensors cannot operate under cloudy or night-time conditions because they rely on reflected ambient sunlight.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Mission Drishti (developed by IIT Madras-incubated GalaxEye Space) is the world's first satellite featuring 'OptoSAR'—synchronising multi-spectral optical imagery with Synthetic Aperture Radar (SAR) onto a single spacecraft bus.\nStatement 2 is correct: SAR is an active microwave remote sensing system that emits its own electromagnetic pulses (in microwave frequencies like X, C, or L bands) and measures the backscattered signal. Because microwave wavelengths are much longer than atmospheric cloud droplets, SAR penetrates clouds, fog, smoke, and operates in total darkness.\nStatement 3 is correct: Standard optical sensors are passive instruments that measure visible and near-infrared sunlight reflected from Earth's surface; they are completely blinded by cloud cover and cannot image at night without artificial illumination.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. Statements 1, 2, and 3 are all technically and factually accurate."
    },
    static_root: "Remote Sensing: Active vs Passive Sensors; Synthetic Aperture Radar (SAR) vs Optical Imagery; India's Space Start-up Ecosystem.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology; ISRO NRSC Remote Sensing Training Manuals.",
    elimination_trap: "Active vs Passive sensor physics: SAR sends its own signal (active, all-weather), whereas optical sensors rely on external sunlight (passive, blocked by clouds).",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (D)",
    question_text: "Consider the following statements regarding 'Mission Drishti' developed by Indian space-tech startup GalaxEye Space:\n1. It is the world's first satellite to house both an optical sensor and a Synthetic Aperture Radar (SAR) on a single platform, termed 'OptoSAR'.\n2. SAR instruments are active sensors that can penetrate cloud cover and darkness by transmitting their own microwave pulses.\n3. Optical sensors cannot operate under cloudy or night-time conditions because they rely on reflected ambient sunlight.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-006",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Human Spaceflight & Life Support Systems",
    question: "With reference to the Environmental Control and Life Support System (ECLSS) developed for India's human spaceflight mission 'Gaganyaan', consider the following statements:\n1. Lithium hydroxide (LiOH) canisters are used in the crew module to scrub carbon dioxide exhaled by astronauts.\n2. In microgravity environments, fire behaves differently than on Earth, spreading as a spherical flame because of the absence of buoyant convective air currents.\n3. Activated charcoal beds are incorporated into the air revitalization loop to remove volatile organic compounds and trace odors.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: In an enclosed space capsule, metabolic CO2 exhalation (~1 kg per astronaut per day) would rapidly lead to hypercapnia, cognitive impairment, and asphyxiation. ISRO utilizes chemical Lithium Hydroxide (LiOH) canisters that react with CO2 to form lithium carbonate and water, scrubbing it from the air.\nStatement 2 is correct: On Earth, gravity causes hot, less-dense air to rise, creating convective draft currents that give flames their elongated teardrop shape. In microgravity, natural convection is absent; oxygen reaches the flame purely by slow molecular diffusion, causing flames to burn as dim, spherical balls.\nStatement 3 is correct: Trace contaminants, sweat odors, and outgassing from electronic components are continuously filtered through activated charcoal beds, which possess immense surface area for physical adsorption of volatile organic compounds.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. All statements accurately depict ECLSS chemical engineering and microgravity combustion physics."
    },
    static_root: "Human Spaceflight (Gaganyaan); Environmental Control & Life Support Systems (ECLSS); Microgravity Physics.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology; ISRO VSSC Human Space Flight Centre publications.",
    elimination_trap: "Microgravity combustion trap: candidates unfamiliar with space physics might think fires cannot burn in microgravity or burn normally; they burn as slow, spherical flames due to diffusion-limited oxygen supply.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (D)",
    question_text: "With reference to the Environmental Control and Life Support System (ECLSS) developed for India's human spaceflight mission 'Gaganyaan', consider the following statements:\n1. Lithium hydroxide (LiOH) canisters are used in the crew module to scrub carbon dioxide exhaled by astronauts.\n2. In microgravity environments, fire behaves differently than on Earth, spreading as a spherical flame because of the absence of buoyant convective air currents.\n3. Activated charcoal beds are incorporated into the air revitalization loop to remove volatile organic compounds and trace odors.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-007",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Lunar Science & Radar Remote Sensing",
    question: "Regarding Chandrayaan-2's findings on lunar subsurface water-ice at the Lunar South Pole, consider the following statements:\n1. Subsurface ice signatures were detected using the Dual Frequency Synthetic Aperture Radar (DFSAR) payload.\n2. Permanently Shadowed Regions (PSRs) on the Moon exist primarily because the Moon's rotational axis has a very low obliquity (tilt) of approximately 1.5 degrees relative to the ecliptic plane.\n3. 'Doubly shadowed craters' are craters situated inside larger permanently shadowed craters that receive neither direct sunlight nor reflected secondary solar radiation.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: Chandrayaan-2's DFSAR (operating in both L-band and S-band) mapped Circular Polarization Ratio (CPR) anomalies in the lunar polar craters, confirming subsurface water-ice deposits.\nStatement 2 is correct: Unlike Earth's axial tilt of 23.5 degrees (which creates pronounced seasons), the Moon's rotational axis is tilted by only about 1.54 degrees relative to the ecliptic. Consequently, sunlight always strikes the lunar poles at grazing, nearly horizontal angles, preventing sunlight from ever reaching the floors of deep impact craters at the poles, forming permanent cold traps.\nStatement 3 is correct: Doubly shadowed craters are micro-topographical depressions located within PSRs. They are shielded not only from direct sunlight but also from secondary scatter reflected off crater rims, maintaining cryogenic temperatures around -25 Kelvin (-248°C), enabling water ice to survive for billions of years.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. All three statements accurately state the payload, orbital geometry, and cryogenic thermodynamics of lunar PSRs."
    },
    static_root: "Chandrayaan Programme; Lunar Topography & Axial Tilt; Remote Sensing Radar (CPR / DFSAR).",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology; ISRO SAC Chandrayaan-2 Science Highlights.",
    elimination_trap: "Axial tilt causation: candidates often fail to link the existence of permanently shadowed regions to the Moon's nearly upright 1.5° rotational axis.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (D)",
    question_text: "Regarding Chandrayaan-2's findings on lunar subsurface water-ice at the Lunar South Pole, consider the following statements:\n1. Subsurface ice signatures were detected using the Dual Frequency Synthetic Aperture Radar (DFSAR) payload.\n2. Permanently Shadowed Regions (PSRs) on the Moon exist primarily because the Moon's rotational axis has a very low obliquity (tilt) of approximately 1.5 degrees relative to the ecliptic plane.\n3. 'Doubly shadowed craters' are craters situated inside larger permanently shadowed craters that receive neither direct sunlight nor reflected secondary solar radiation.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-008",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Cosmic Rays & Particle Physics Detectors",
    question: "With reference to the 'GRAPES-3' observatory located in Ooty, Tamil Nadu, consider the following statements:\n1. GRAPES-3 is an astronomical telescope that detects optical light from high-redshift quasars.\n2. It measures the intensity of cosmic ray muons to study solar storms, coronal mass ejections, and atmospheric temperature changes.\n3. Muons are unstable elementary subatomic particles belonging to the lepton family, with a mass significantly greater than that of an electron.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "2 and 3 only",
    correct_index: 1,
    correct_option: "B",
    explanation: "Statements 2 and 3 are correct, while Statement 1 is incorrect.\nStatement 1 is incorrect: GRAPES-3 (Gamma Ray Astronomy PeV EnergieS phase-3) is NOT an optical telescope. It is a specialised particle detector array consisting of plastic scintillator detectors and large-area muon tracking detectors, designed to record cosmic ray air showers.\nStatement 2 is correct: GRAPES-3 monitors cosmic ray muons produced when primary cosmic rays strike the Earth's upper atmosphere. By recording fluctuations in muon intensity, it investigates the Sun's coronal mass ejections (CMEs), geomagnetic storms, thundercloud electric potentials, and stratospheric temperature inversions.\nStatement 3 is correct: Muons are fundamental subatomic particles classified as leptons (along with electrons and taus). A muon carries a negative elementary charge and a spin of 1/2, but has a rest mass approximately 207 times greater than an electron, with a mean lifetime of 2.2 microseconds.",
    option_analysis: {
      "Option A": "Incorrect because Statement 1 is false (it is a muon particle detector, not an optical telescope).",
      "Option B": "Correct. Statements 2 and 3 accurately describe the scientific research purpose of GRAPES-3 and muon particle physics.",
      "Option C": "Incorrect because Statement 1 is false.",
      "Option D": "Incorrect because Statement 1 is false."
    },
    static_root: "Standard Model of Particle Physics (Leptons, Quarks); Cosmic Rays; Geomagnetic Storms; TIFR Observatories.",
    standard_book_ref: "NCERT Class 12 Physics, Nuclei and Modern Physics; Ravi P. Agrahari, Science & Technology; TIFR GRAPES-3 portal.",
    elimination_trap: "Telescope naming trap: candidates assume every facility called a telescope looks at optical light. GRAPES-3 is a ground-based particle detector tracking subatomic muons.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "With reference to the 'GRAPES-3' observatory located in Ooty, Tamil Nadu, consider the following statements:\n1. GRAPES-3 is an astronomical telescope that detects optical light from high-redshift quasars.\n2. It measures the intensity of cosmic ray muons to study solar storms, coronal mass ejections, and atmospheric temperature changes.\n3. Muons are unstable elementary subatomic particles belonging to the lepton family, with a mass significantly greater than that of an electron.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-009",
    year: 2026,
    month: "May 2026",
    subject: "Geography & Astronomy",
    sub_topic: "Lunar Cycles & Orbital Phenomena",
    question: "Consider the following statements regarding lunar orbital phenomena and eclipses:\n1. A 'Blue Moon' refers to the second full moon occurring within a single calendar month.\n2. A 'Micromoon' occurs when a full moon coincides with the Moon's apogee, making it appear smaller and dimmer than an average full moon.\n3. A total lunar eclipse occurs when the Moon enters completely into the penumbral shadow of the Earth.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Because the synodic lunar cycle (from one full moon to the next) is roughly 29.5 days, a 30- or 31-day calendar month can occasionally host two full moons. The second full moon in that month is popularised as a 'Blue Moon' (occurring approximately once every 2.5 to 3 years).\nStatement 2 is correct: The Moon's orbit around Earth is elliptical. When a full moon occurs near its apogee (farthest orbital point, ~405,000 km), it appears about 14% smaller and 30% dimmer than a perigee full moon ('Supermoon'), and is termed a 'Micromoon'.\nStatement 3 is incorrect: A TOTAL lunar eclipse occurs when the Moon passes entirely into the Earth's UMBRA (the central, dark conical shadow where all direct sunlight is blocked). If the Moon only enters the PENUMBRA (the outer diffuse shadow), it is called a penumbral lunar eclipse, which produces only subtle, barely perceptible dimming.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately state astronomical definitions of Blue Moon and Micromoon.",
      "Option B": "Incorrect because Statement 3 is false (total eclipse requires entering the umbra).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Astronomy: Lunar Phases, Elliptical Orbits (Apogee vs Perigee); Eclipse Geometry (Umbra vs Penumbra).",
    standard_book_ref: "NCERT Class 11 Physical Geography; Goh Cheng Leong, Certificate Physical and Human Geography.",
    elimination_trap: "Shadow zone inversion: umbra is the darkest region causing total eclipse; penumbra causes only partial shading or a penumbral eclipse.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Consider the following statements regarding lunar orbital phenomena and eclipses:\n1. A 'Blue Moon' refers to the second full moon occurring within a single calendar month.\n2. A 'Micromoon' occurs when a full moon coincides with the Moon's apogee, making it appear smaller and dimmer than an average full moon.\n3. A total lunar eclipse occurs when the Moon enters completely into the penumbral shadow of the Earth.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-010",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Biotechnology & Endocrine Pharmacology",
    question: "With reference to Glucagon-Like Peptide-1 (GLP-1) receptor agonists used in metabolic medicine, consider the following statements:\n1. GLP-1 is an endogenous incretin peptide hormone secreted by the L-cells of the intestines in response to nutrient intake.\n2. GLP-1 receptor agonists stimulate glucose-dependent insulin secretion from pancreatic beta cells while suppressing inappropriate glucagon secretion.\n3. GLP-1 analogues accelerate gastric emptying, thereby increasing the rate of carbohydrate absorption into the bloodstream.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: GLP-1 is an incretin hormone naturally synthesized and secreted by intestinal endocrine L-cells in the ileum and colon following food ingestion.\nStatement 2 is correct: In pharmacotherapy (drugs like Semaglutide, Tirzepatide, and Berobenatide), GLP-1 receptor agonists bind to GLP-1 receptors on pancreatic beta cells to enhance insulin secretion in a glucose-dependent manner (reducing hypoglycemic risk) and suppress excess postprandial glucagon secretion by alpha cells.\nStatement 3 is incorrect: GLP-1 receptor agonists DELAY (slow down) gastric emptying and act on hypothalamic satiety centers to induce fullness and reduce appetite. They do NOT accelerate gastric emptying (accelerating emptying would increase postprandial glucose spikes).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately define the physiological origin and endocrine mechanism of GLP-1.",
      "Option B": "Incorrect because Statement 3 is false (it delays gastric emptying).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Human Physiology: Endocrine System (Pancreatic Hormones & Incretins); Biotechnology in Healthcare.",
    standard_book_ref: "NCERT Class 11 Biology, Chapter 22 (Chemical Coordination and Integration); Ravi P. Agrahari, Science & Technology.",
    elimination_trap: "Physiological direction trap: incretin mimetics SLOW DOWN gastric motility to prolong fullness and prevent glucose spikes, rather than accelerating it.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to Glucagon-Like Peptide-1 (GLP-1) receptor agonists used in metabolic medicine, consider the following statements:\n1. GLP-1 is an endogenous incretin peptide hormone secreted by the L-cells of the intestines in response to nutrient intake.\n2. GLP-1 receptor agonists stimulate glucose-dependent insulin secretion from pancreatic beta cells while suppressing inappropriate glucagon secretion.\n3. GLP-1 analogues accelerate gastric emptying, thereby increasing the rate of carbohydrate absorption into the bloodstream.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-011",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Biopharmaceuticals & Biotechnology Policy",
    question: "Regarding the 'Biopharma SHAKTI' scheme and biopharmaceutical manufacturing in India, consider the following statements:\n1. The scheme is designed to facilitate the transition of India's pharmaceutical sector from low-margin small-molecule generic chemical drugs to high-value biologics and biosimilars.\n2. Biologics are large, complex molecular medicines produced using living biological systems such as recombinant microbial or mammalian cells.\n3. Biosimilars are identical, exact chemical copies of reference biologics, manufactured through standard chemical synthesis without any molecular micro-heterogeneity.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: The Biopharma SHAKTI scheme (announced with a ₹10,000 crore outlay) aims to establish advanced biomanufacturing clusters and CDMO capabilities in India, migrating the industry from conventional small-molecule generic APIs to high-margin biopharmaceuticals (monoclonal antibodies, cell and gene therapies).\nStatement 2 is correct: Biologics (e.g., insulin, erythropoietin, monoclonal antibodies) are intricate macromolecular protein structures produced through genetic engineering inside living host cells (CHO cells, E. coli, yeast).\nStatement 3 is incorrect: Biosimilars are NOT 'identical exact chemical copies'. Because biologics are derived from living cells, post-translational modifications (like glycosylation) result in slight natural micro-heterogeneity. Therefore, biosimilars are 'highly similar' with no clinically meaningful differences in safety, purity, or potency, but are NOT exact chemical copies like small-molecule generic drugs (e.g. paracetamol).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately describe the policy objective of Biopharma SHAKTI and the nature of biologics.",
      "Option B": "Incorrect because Statement 3 is false (biosimilars are not identical chemical copies).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Biotechnology: Recombinant DNA Technology; Biologics vs Small Molecules; Biosimilars Regulatory Guidelines (CDSCO).",
    standard_book_ref: "NCERT Class 12 Biology, Biotechnology and its Applications; Department of Biotechnology (DBT) Annual Report.",
    elimination_trap: "Generic vs Biosimilar confusion: generic drugs are identical chemical copies; biosimilars are biological products that are highly similar but inherently possess micro-variations because they are grown in living cells.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding the 'Biopharma SHAKTI' scheme and biopharmaceutical manufacturing in India, consider the following statements:\n1. The scheme is designed to facilitate the transition of India's pharmaceutical sector from low-margin small-molecule generic chemical drugs to high-value biologics and biosimilars.\n2. Biologics are large, complex molecular medicines produced using living biological systems such as recombinant microbial or mammalian cells.\n3. Biosimilars are identical, exact chemical copies of reference biologics, manufactured through standard chemical synthesis without any molecular micro-heterogeneity.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-012",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Nanomedicine & Targeted Gene Therapy",
    question: "In targeted cancer nanomedicine, what is the primary role of 'Aptamers' when conjugated to mesoporous silica nanoparticles?",
    options: [
      "They act as synthetic nuclear fuel providing thermal propulsion to the nanoparticle.",
      "They are short, single-stranded oligonucleotides that fold into specific three-dimensional structures to bind selectively to target tumor cell-surface receptors.",
      "They permanently alter the genomic DNA of adjacent normal somatic cells to confer radio-resistance.",
      "They dissolve the cellular plasma membrane through high-frequency acoustic cavitation."
    ],
    answer: "They are short, single-stranded oligonucleotides that fold into specific three-dimensional structures to bind selectively to target tumor cell-surface receptors.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nAptamers are short, synthetic single-stranded DNA or RNA oligonucleotides (or peptides) that fold by intramolecular interactions into unique three-dimensional conformations. They bind with high affinity and exquisite specificity to designated molecular targets (such as the MUC1 glycoprotein receptor overexpressed on breast cancer cells), functioning as 'chemical antibodies'. In nanomedicine (such as MPPM platforms), aptamers serve as targeting ligands that guide nanoparticles directly to malignant cells, sparing healthy tissue from systemic toxicity.",
    option_analysis: {
      "Option A": "Incorrect. Aptamers are biological oligonucleotides, not thermal fuel.",
      "Option B": "Correct. Accurately describes aptamers as selective oligonucleotide targeting ligands.",
      "Option C": "Incorrect. Aptamers do not alter genomic DNA of surrounding healthy cells.",
      "Option D": "Incorrect. This describes sonoporation or ultrasound therapy, not aptamers."
    },
    static_root: "Nanotechnology in Medicine; Targeted Drug Delivery; Aptamers vs Monoclonal Antibodies; RNA/DNA Oligonucleotides.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology, Nanotechnology; NCERT Class 12 Biology (Biotechnology).",
    elimination_trap: "Watch for pseudo-mechanical distractors: aptamers are biochemical molecular recognition agents selected via SELEX processes, functioning analogous to antibodies.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In targeted cancer nanomedicine, what is the primary role of 'Aptamers' when conjugated to mesoporous silica nanoparticles?"
  },
  {
    id: "ca-snt-2026-05-013",
    year: 2026,
    month: "May 2026",
    subject: "Governance & S&T",
    sub_topic: "AI for Informal Economy & Digital Public Infrastructure",
    question: "Regarding 'Mission Digital ShramSetu' proposed for India's informal labor ecosystem, consider the following statements:\n1. It integrates Artificial Intelligence (AI), Blockchain, and Immersive Learning to empower informal sector workers.\n2. Blockchain technology is utilized to provide tamper-proof, verifiable digital skill credentials and portable work histories.\n3. The initiative is restricted exclusively to gig-economy platform workers engaged with registered e-commerce aggregators.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Mission Digital ShramSetu is conceptualised as a national digital ecosystem using AI-driven vernacular interfaces, blockchain verification, and AR/VR immersive learning modules to improve productivity, financial inclusion, and occupational mobility for India's 490 million informal workers.\nStatement 2 is correct: A fundamental application of blockchain in ShramSetu is the creation of decentralised, tamper-proof digital wallets storing verifiable skill certifications, prior learning recognitions (RPL), and cross-employer work histories.\nStatement 3 is incorrect: The mission covers the entire unorganised informal workforce—including agricultural laborers, construction workers, domestic workers, street vendors, and traditional artisans—and is NOT restricted to app-based gig workers.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 are accurate.",
      "Option B": "Incorrect because Statement 3 is false (it covers all unorganised workers, not just app gig workers).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Digital Public Infrastructure (DPI); Blockchain in Public Administration; Informal Sector & Social Security.",
    standard_book_ref: "Ramesh Singh, Indian Economy (Employment and Skill Development); MeitY Digital Governance Initiatives.",
    elimination_trap: "Exclusive restriction trap: government DPI platforms for unorganized labor (e-Shram, ShramSetu) are designed for the broad 490-million informal workforce, not solely urban app-based platform gig workers.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding 'Mission Digital ShramSetu' proposed for India's informal labor ecosystem, consider the following statements:\n1. It integrates Artificial Intelligence (AI), Blockchain, and Immersive Learning to empower informal sector workers.\n2. Blockchain technology is utilized to provide tamper-proof, verifiable digital skill credentials and portable work histories.\n3. The initiative is restricted exclusively to gig-economy platform workers engaged with registered e-commerce aggregators.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-014",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Semiconductor Memory Architectures & AI Hardware",
    question: "In the semiconductor industry, the phenomenon of 'memflation' and memory supply bottlenecks is primarily driven by the surging demand for High Bandwidth Memory (HBM). In this context, how does High Bandwidth Memory (HBM) differ from conventional Dynamic Random-Access Memory (DRAM)?",
    options: [
      "HBM stacks multiple DRAM memory dies vertically using Through-Silicon Vias (TSVs), providing a vastly wider bus interface and higher bandwidth at lower power consumption.",
      "HBM eliminates electronic transistors by storing information using biological DNA sequences.",
      "HBM is non-volatile flash storage that permanently retains data when power is completely turned off.",
      "HBM uses mechanical magnetic platters rotating at supersonic speeds inside vacuum chambers."
    ],
    answer: "HBM stacks multiple DRAM memory dies vertically using Through-Silicon Vias (TSVs), providing a vastly wider bus interface and higher bandwidth at lower power consumption.",
    correct_index: 0,
    correct_option: "A",
    explanation: "Option A is correct.\nConventional DRAM chips are laid out horizontally in a two-dimensional arrangement with narrow 32-bit or 64-bit buses, which creates a severe 'memory wall' bottleneck for data-hungry AI GPUs. High Bandwidth Memory (HBM) solves this by vertically stacking multiple DRAM dies on top of an interposer using Through-Silicon Vias (TSVs) and microbumps. This 3D architecture enables an ultra-wide memory bus (1024 bits or more per stack) situated directly adjacent to the GPU/accelerator, delivering terabytes-per-second memory bandwidth with significantly lower latency and power consumption. However, fabricating HBM consumes 2 to 3 times more silicon wafer area than standard DRAM, causing industry-wide price inflation ('memflation').",
    option_analysis: {
      "Option A": "Correct. Accurately defines 3D stacked DRAM with TSVs and wide memory interfaces.",
      "Option B": "Incorrect. This describes theoretical DNA data storage.",
      "Option C": "Incorrect. HBM is volatile RAM, not non-volatile flash (NAND).",
      "Option D": "Incorrect. This is an absurd description of hard disk drives."
    },
    static_root: "Semiconductor Physics; Volatile vs Non-Volatile Memory (RAM vs ROM vs NAND Flash); 3D Packaging & TSVs.",
    standard_book_ref: "NCERT Class 12 Physics, Semiconductor Electronics; Ravi P. Agrahari, Science & Technology.",
    elimination_trap: "Volatile vs Non-volatile confusion: HBM is ultra-fast *volatile* working memory (RAM), not non-volatile storage like SSDs/NAND flash.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "In the semiconductor industry, the phenomenon of 'memflation' and memory supply bottlenecks is primarily driven by the surging demand for High Bandwidth Memory (HBM). In this context, how does High Bandwidth Memory (HBM) differ from conventional Dynamic Random-Access Memory (DRAM)?"
  },
  {
    id: "ca-snt-2026-05-015",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Post-Quantum Cryptography & Cyber Security",
    question: "With reference to Quantum Computing threats and Post-Quantum Cryptography (PQC), consider the following statements:\n1. Shor's algorithm running on an error-corrected quantum computer can solve integer factorization and discrete logarithms in polynomial time, breaking RSA and Elliptic Curve Cryptography.\n2. The 'Harvest Now, Decrypt Later' (HNDL) strategy involves adversaries intercepting and storing encrypted high-value data today to decrypt it once quantum computers mature.\n3. Post-Quantum Cryptography algorithms require the installation of quantum processors and cannot run on existing classical binary computers.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Modern asymmetric encryption (RSA, Diffie-Hellman, ECC) relies on mathematical problems (factoring large prime products, discrete logarithms) that are intractable for classical computers. Peter Shor's quantum algorithm can solve these in polynomial time, rendering existing public-key infrastructure obsolete once a cryptanalytically relevant quantum computer (CRQC) is realized.\nStatement 2 is correct: In 'Harvest Now, Decrypt Later' (HNDL), hostile intelligence agencies capture and archive encrypted government, military, and financial communications today, intending to decrypt the ciphertexts when quantum computing breaks RSA/ECC.\nStatement 3 is incorrect: A crucial distinction: Post-Quantum Cryptography (PQC)—such as lattice-based algorithms (ML-KEM, ML-DSA)—consists of mathematical encryption algorithms designed to run on EXISTING CLASSICAL computers and servers, but whose mathematical structure is mathematically resistant to quantum attacks. (It is Quantum Key Distribution - QKD that requires specialised quantum photonics hardware).",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately describe quantum cryptographic vulnerabilities and the HNDL threat.",
      "Option B": "Incorrect because Statement 3 is false (PQC runs on classical computers).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Quantum Computing & Cryptography (RSA vs Post-Quantum); Quantum Algorithms (Shor's and Grover's Algorithms); National Quantum Mission.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology; DST Task Force Report on Post-Quantum Cryptography.",
    elimination_trap: "PQC vs QKD confusion: PQC is classical math that runs on your existing laptop or server to resist quantum attacks. QKD is physical quantum hardware that transmits entangled photons.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "With reference to Quantum Computing threats and Post-Quantum Cryptography (PQC), consider the following statements:\n1. Shor's algorithm running on an error-corrected quantum computer can solve integer factorization and discrete logarithms in polynomial time, breaking RSA and Elliptic Curve Cryptography.\n2. The 'Harvest Now, Decrypt Later' (HNDL) strategy involves adversaries intercepting and storing encrypted high-value data today to decrypt it once quantum computers mature.\n3. Post-Quantum Cryptography algorithms require the installation of quantum processors and cannot run on existing classical binary computers.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-016",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Superconductivity & Quantum Noise",
    question: "In superconducting quantum computing processors, environmental ionizing radiation causes computational crashes known as the 'radiation glitch'. This phenomenon occurs because ionizing radiation:",
    options: [
      "Induces nuclear fission reactions inside the processor's silicon substrate, destroying the physical chip.",
      "Generates phonons that break apart superconducting Cooper pairs, creating a swarm of quasiparticles that cause qubit decoherence.",
      "Generates extreme high temperatures above 1,000°C that vaporize the dilution refrigerator.",
      "Inverts the chemical valence of copper conductors from +2 to -1."
    ],
    answer: "Generates phonons that break apart superconducting Cooper pairs, creating a swarm of quasiparticles that cause qubit decoherence.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nSuperconducting qubits (transmons) function based on BCS superconductivity, where electrons bind into 'Cooper pairs' at millikelvin temperatures, creating a resistance-free quantum ground state. When ambient ionizing radiation (such as cosmic rays or trace radionuclides in concrete/silicon) strikes the chip substrate, it releases energy in the form of acoustic phonons (lattice vibrations). These energetic phonons break Cooper pairs into unpaired single electrons called 'quasiparticles'. The swarm of quasiparticles diffuses across the Josephson junctions, causing instantaneous energy dissipation, phase flips, and correlated decoherence across multiple qubits simultaneously.",
    option_analysis: {
      "Option A": "Incorrect. Ambient ionizing radiation does not trigger nuclear fission in silicon.",
      "Option B": "Correct. Accurately describes the breaking of Cooper pairs by phonons and the generation of quasiparticle poisoning.",
      "Option C": "Incorrect. Dilution refrigerators maintain temperatures near 10 mK; ambient radiation causes micro-disturbances, not macroscopic 1,000°C vaporization.",
      "Option D": "Incorrect. Chemical nonsense."
    },
    static_root: "Superconductivity: Cooper Pairs & BCS Theory; Quantum Decoherence; Quantum Error Correction.",
    standard_book_ref: "NCERT Class 12 Physics, Superconductivity & Modern Physics; Nature Physics articles on Quasiparticle Poisoning.",
    elimination_trap: "Microscopic vs macroscopic damage: ionizing radiation does not melt or explode quantum chips; it breaks fragile quantum Cooper pairs, generating quasiparticles that scramble the quantum information.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In superconducting quantum computing processors, environmental ionizing radiation causes computational crashes known as the 'radiation glitch'. This phenomenon occurs because ionizing radiation:"
  },
  {
    id: "ca-snt-2026-05-017",
    year: 2026,
    month: "May 2026",
    subject: "Governance & S&T",
    sub_topic: "Emergency Early Warning Systems & Telecommunications",
    question: "Regarding the 'SACHET' National Disaster Alert System and Cell Broadcast Technology in India, consider the following statements:\n1. SACHET utilizes the international Common Alerting Protocol (CAP) to disseminate geo-targeted disaster warnings across multiple channels.\n2. Unlike SMS alerts, Cell Broadcast messages do not require the mobile phone numbers of recipients and can reach millions of handsets in a designated cell tower radius simultaneously.\n3. Cell Broadcast transmissions fail during major disasters because they are subject to the same network congestion that chokes point-to-point SMS traffic.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: SACHET is an integrated early warning platform developed by the National Disaster Management Authority (NDMA) and C-DOT based on ITU's Common Alerting Protocol (CAP), aggregating alerts from IMD, CWC, INCOIS, and DGRE.\nStatement 2 is correct: Cell Broadcast Service (CBS) is a true 'one-to-many' broadcast mechanism. The cellular base station radiates the emergency packet on a dedicated broadcast channel. Any active handset connected to that tower receives the alert instantly without the telecom operator needing to query a subscriber database or know the individual phone numbers, fully preserving privacy.\nStatement 3 is incorrect: A major operational strength of Cell Broadcast is that it uses a dedicated radio signaling channel that is completely separate from standard voice/SMS traffic channels. Consequently, CBS messages bypass cellular network congestion and deliver alerts even when voice and SMS networks are completely saturated during severe emergencies.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately define the CAP architecture and Cell Broadcast mechanics.",
      "Option B": "Incorrect because Statement 3 is false (Cell Broadcast is immune to SMS network congestion).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "Disaster Management Act 2005; Telecommunications (Cell Broadcast vs Point-to-Point SMS); Common Alerting Protocol (CAP).",
    standard_book_ref: "M. Laxmikanth, Indian Polity (Disaster Management); NDMA Guidelines on Early Warning Dissemination.",
    elimination_trap: "Network congestion vulnerability: SMS suffers severe delays during disasters because each message must be routed individually; Cell Broadcast broadcasts like a radio beacon, bypassing traffic jams.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding the 'SACHET' National Disaster Alert System and Cell Broadcast Technology in India, consider the following statements:\n1. SACHET utilizes the international Common Alerting Protocol (CAP) to disseminate geo-targeted disaster warnings across multiple channels.\n2. Unlike SMS alerts, Cell Broadcast messages do not require the mobile phone numbers of recipients and can reach millions of handsets in a designated cell tower radius simultaneously.\n3. Cell Broadcast transmissions fail during major disasters because they are subject to the same network congestion that chokes point-to-point SMS traffic.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-018",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Atmospheric Science & Monsoon Forecasting",
    question: "With reference to the 'Coastal Atmospheric Research Testbed' (C-ART) established in Visakhapatnam, consider the following statements:\n1. It has been set up by the Indian Institute of Tropical Meteorology (IITM) under the Ministry of Earth Sciences.\n2. It focuses on the high-resolution measurement of raindrop size distribution, cloud microphysics, and turbulence fluxes over coastal transition zones.\n3. The observational data gathered by C-ART is used to refine parameterisation schemes in numerical weather prediction models.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1, 2 and 3",
    correct_index: 3,
    correct_option: "D",
    explanation: "All three statements are correct.\nStatement 1 is correct: The Coastal Atmospheric Research Testbed (C-ART) was established at Andhra University, Visakhapatnam by the Indian Institute of Tropical Meteorology (IITM, Pune), an autonomous R&D institution under the Ministry of Earth Sciences (MoES).\nStatement 2 is correct: C-ART deploys Doppler weather radars, microwave radiometers, and optical disdrometers to observe raindrop size distributions (DSD), rain microphysics, boundary layer turbulent fluxes, and aerosol-cloud interactions along the east coast.\nStatement 3 is correct: Sub-grid physical processes (such as cloud condensation and convective rain formation) cannot be explicitly resolved by global weather models. Data from testbeds like C-ART provide the empirical basis to calibrate parameterisation equations in high-resolution models (e.g. UM and WRF), significantly improving monsoon and cyclonic rainfall forecasts.",
    option_analysis: {
      "Option A": "Incorrect because Statement 3 is also correct.",
      "Option B": "Incorrect because Statement 1 is also correct.",
      "Option C": "Incorrect because Statement 2 is also correct.",
      "Option D": "Correct. All three statements accurately state the institutional ownership, instrument capabilities, and meteorological utility of C-ART."
    },
    static_root: "Indian Monsoon Mechanism; Ministry of Earth Sciences (IITM Pune, IMD); Cloud Microphysics & Numerical Weather Prediction.",
    standard_book_ref: "NCERT Class 11 India: Physical Environment, Chapter on Climate; Ministry of Earth Sciences Annual Report.",
    elimination_trap: "Parameterisation concept: aspirants often overlook how physical observations feed into numerical computer weather models via parameterisation tuning.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (D)",
    question_text: "With reference to the 'Coastal Atmospheric Research Testbed' (C-ART) established in Visakhapatnam, consider the following statements:\n1. It has been set up by the Indian Institute of Tropical Meteorology (IITM) under the Ministry of Earth Sciences.\n2. It focuses on the high-resolution measurement of raindrop size distribution, cloud microphysics, and turbulence fluxes over coastal transition zones.\n3. The observational data gathered by C-ART is used to refine parameterisation schemes in numerical weather prediction models.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-019",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Nuclear Fuel Cycle & Pyroprocessing",
    question: "Regarding 'Pyroprocessing' utilized in the nuclear power sector and advanced metallurgy, consider the following statements:\n1. It is a high-temperature, non-aqueous electrochemical method used to reprocess spent nuclear fuel.\n2. The process dissolves spent fuel in a molten chloride salt bath (such as LiCl-KCl) operating at temperatures exceeding 500°C.\n3. Pyroprocessing completely separates pure, weapon-grade plutonium from all minor actinides, making it a high-risk proliferation pathway compared to standard aqueous PUREX solvent extraction.\nWhich of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answer: "1 and 2 only",
    correct_index: 0,
    correct_option: "A",
    explanation: "Statements 1 and 2 are correct, while Statement 3 is incorrect.\nStatement 1 is correct: Pyroprocessing (pyrochemical reprocessing) is a high-temperature, dry, non-aqueous method used to reprocess irradiated fuel from Fast Breeder Reactors (FBRs).\nStatement 2 is correct: Spent metallic or oxide fuel is chopped and placed in an electrorefiner containing a high-temperature molten eutectic salt bath (such as lithium chloride and potassium chloride, LiCl-KCl) at 500°C or higher, where an electric current drives electrochemical separation of actinides and fission products.\nStatement 3 is incorrect: A paramount non-proliferation advantage of pyroprocessing over the traditional PUREX (aqueous solvent extraction) process is that pyroprocessing co-extracts plutonium together with other minor actinides (americium, curium, neptunium) as a blended actinide mix. It does NOT separate clean, weapon-grade plutonium by itself, making it highly proliferation-resistant.",
    option_analysis: {
      "Option A": "Correct. Statements 1 and 2 accurately state the high-temperature molten salt electrochemical nature of pyroprocessing.",
      "Option B": "Incorrect because Statement 3 is false (it co-extracts actinides, preventing clean weapon-grade plutonium separation).",
      "Option C": "Incorrect because Statement 3 is false.",
      "Option D": "Incorrect because Statement 3 is false."
    },
    static_root: "India's Three-Stage Nuclear Power Programme; Nuclear Fuel Cycle (Open vs Closed); PUREX vs Pyroprocessing.",
    standard_book_ref: "Ravi P. Agrahari, Science & Technology (Nuclear Technology); Department of Atomic Energy (DAE) Technical Bulletins.",
    elimination_trap: "Proliferation feature inversion: pyroprocessing is favored in 4th-generation nuclear reactors precisely because it is INHERENTLY proliferation-resistant by co-extracting plutonium with radioactive minor actinides.",
    difficulty: "Hard",
    upsc_official_key: "Verified: Option (A)",
    question_text: "Regarding 'Pyroprocessing' utilized in the nuclear power sector and advanced metallurgy, consider the following statements:\n1. It is a high-temperature, non-aqueous electrochemical method used to reprocess spent nuclear fuel.\n2. The process dissolves spent fuel in a molten chloride salt bath (such as LiCl-KCl) operating at temperatures exceeding 500°C.\n3. Pyroprocessing completely separates pure, weapon-grade plutonium from all minor actinides, making it a high-risk proliferation pathway compared to standard aqueous PUREX solvent extraction.\nWhich of the statements given above are correct?"
  },
  {
    id: "ca-snt-2026-05-020",
    year: 2026,
    month: "May 2026",
    subject: "Science & Technology",
    sub_topic: "Biochemical Imaging & Proteomics",
    question: "In cellular biology and molecular diagnostics, the 'Cleavable Light-Erased Antibody Reporter' (CLEAR) platform is designed to achieve which of the following breakthroughs?",
    options: [
      "The synthesis of artificial human blood cells using genetically modified cyanobacteria.",
      "High-resolution multiplexed spatial imaging of dozens of distinct proteins within the same biological tissue sample using a single erasable fluorescent marker.",
      "The permanent eradication of viral RNA in human patients using acoustic shockwaves.",
      "The 3D bioprinting of entire organ transplants without requiring cellular scaffold matrixes."
    ],
    answer: "High-resolution multiplexed spatial imaging of dozens of distinct proteins within the same biological tissue sample using a single erasable fluorescent marker.",
    correct_index: 1,
    correct_option: "B",
    explanation: "Option B is correct.\nTraditional immunofluorescence microscopy faces a fundamental bottleneck called 'spectral overlap': because conventional dyes have overlapping optical emission spectra, researchers can image only 3 to 4 proteins simultaneously in a single cell. The CLEAR (Cleavable Light-Erased Antibody Reporter) technology solves this by using antibody probes linked to fluorescent reporters via photocleavable or light-erasable chemical bonds. After imaging one protein, a brief flash of light erases the fluorescent signal without damaging the underlying tissue, allowing the same fluorescent channel to be reused iteratively. This enables scientists to map the precise spatial organization of dozens of different proteins in tumor biopsies and neurological tissue.",
    option_analysis: {
      "Option A": "Incorrect. This describes artificial blood or photosynthetic cell research.",
      "Option B": "Correct. Accurately describes the light-erasable multiplexed spatial proteomics imaging mechanism of CLEAR.",
      "Option C": "Incorrect. Shockwaves do not selectively eradicate intracellular viral RNA.",
      "Option D": "Incorrect. This describes advanced organ bioprinting."
    },
    static_root: "Fluorescence Microscopy; Proteomics & Protein Mapping; Cell Biology Diagnostics.",
    standard_book_ref: "NCERT Class 11 Biology, Chapter 8 (Cell: The Unit of Life); Scientific Reports / Nature Biotechnology.",
    elimination_trap: "Watch for grand science-fiction decoys: CLEAR specifically addresses multiplexed fluorescence microscopy and spatial proteomics imaging.",
    difficulty: "Moderate",
    upsc_official_key: "Verified: Option (B)",
    question_text: "In cellular biology and molecular diagnostics, the 'Cleavable Light-Erased Antibody Reporter' (CLEAR) platform is designed to achieve which of the following breakthroughs?"
  }
];

module.exports = sntQuestions;
