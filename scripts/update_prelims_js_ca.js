const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../static/prelims.js');
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Add Aug, Sep, Oct 2026 to MONTHLY_DOSSIERS_METADATA
const targetJuly = `      source: 'InsightsIAS Jul 2026 / MoSPI / DGCA / IN-SPACe'\n    }\n  ];`;

const replacementDossiers = `      source: 'InsightsIAS Jul 2026 / MoSPI / DGCA / IN-SPACe'
    },
    {
      month: 'August 2026',
      icon: '🌾',
      color: 'amber',
      title: 'August 2026 Comprehensive Dossier',
      leadTheme: 'Glaw Lake Ramsar, Asan ESZ & IPMDA',
      topics: ['Glaw Lake (101st Ramsar)', 'SC 10-km Buffer on Ramsar Mining (Asan)', 'Asiatic Lion Barda Sanctuary & Babarkot', 'Houbara / MacQueens Bustard', 'Clouded Leopard Arboreal Adaptations', 'Vulture Recovery (NSAIDs Bans)', 'Danube River Capitals', 'Lake Mead & Hoover Dam', 'Nauru & Ceuta Enclave', 'IPMDA Quad Maritime Awareness', 'GOBARdhan SATAT Bioenergy Offtake', 'Open Natural Ecosystems (ONEs)', 'Makkah Pact', 'PM Surya Sarovar Floating Solar', 'National Honour Act 1971'],
      source: 'InsightsIAS Aug 2026 / PIB / MoEFCC / SC Judgments'
    },
    {
      month: 'September 2026',
      icon: '🍁',
      color: 'emerald',
      title: 'September 2026 Comprehensive Dossier',
      leadTheme: 'Coral Bleaching GCRMN & DSR Soil Carbon',
      topics: ['GCRMN Global Coral Reef Status (4th Bleaching)', 'Neelakurinji (WPA Sch III & Shola Masting)', 'Ammannia telanganensis (Amrabad TR)', 'Trishuli River Antecedent Drainage', 'Lake Ontario & St. Lawrence Seaway', 'Larak Island Salt Diapirs & Strait of Hormuz', 'Lake Magadi Trona Kenya Rift', 'Mount Anak Krakatau Sunda Strait', 'Kathmandu Declaration (SAWEN)', 'ECI Totaliser Machines in EVMs', 'Article 371K Ladakh Proposals', 'Lipulekh Pass & Kali River', 'Sohar Port (Gulf of Oman)', 'Djibouti & Lake Assal (-155m)', 'Indus Waters Treaty PCA Ruling', 'Direct Seeded Rice (DSR) Carbon Credits', 'Badri Cattle OPU-IVF'],
      source: 'InsightsIAS Sep 2026 / ICRI / ECI / PCA The Hague'
    },
    {
      month: 'October 2026',
      icon: '🍂',
      color: 'indigo',
      title: 'October 2026 Comprehensive Dossier',
      leadTheme: 'Sukhna & Sauj Jheel Ramsar & BNSS 163',
      topics: ['Sukhna Lake & Sauj Jheel (102nd & 103rd Ramsar)', 'Buxa Tiger Reserve Reintroduction', 'Kallakkadal Swell Surge Waves (INCOIS)', 'Himalayan Tahr Hoof Adaptations', 'Sarus Crane Non-Migratory Ecology', 'Black Sea Anoxic Deep Meromictic Basin', 'Caspian Sea Volga Drainage & Littorals', 'Dakhla Oasis Nubian Sandstone Aquifer', 'Section 163 BNSS (CrPC 144 Evolution)', 'Supreme Court Collegium Three Judges Cases', 'SIOFA Southern Indian Ocean Fisheries', 'Eight Core Industries Index Weightages', 'Quantum Key Distribution (QKD) Free-Space', 'UN Declaration on Sea Level Rise & UNCLOS Baselines', 'Kufri Jamunia Anthocyanin Potato'],
      source: 'InsightsIAS Oct 2026 / UNCLOS / NTCA / INCOIS / CPRI'
    }
  ];`;

if (js.includes(targetJuly)) {
  js = js.replace(targetJuly, replacementDossiers);
  console.log('Successfully updated MONTHLY_DOSSIERS_METADATA with Aug, Sep, Oct 2026!');
} else {
  console.warn('targetJuly not matched exactly; searching by substring...');
  const idx = js.indexOf("source: 'InsightsIAS Jul 2026 / MoSPI / DGCA / IN-SPACe'");
  if (idx !== -1) {
    const endIdx = js.indexOf('];', idx);
    js = js.substring(0, endIdx) + replacementDossiers.substring(replacementDossiers.indexOf('\n    },\n    {'));
    console.log('Patched MONTHLY_DOSSIERS_METADATA via index slice.');
  }
}

// 2. Add Aug, Sep, Oct to renderVaultCaPills
const targetPills = `{ id: 'July 2026', label: '⚡ Jul 2026' }\n    ];`;
const replacementPills = `{ id: 'July 2026', label: '⚡ Jul 2026' },
      { id: 'August 2026', label: '🌾 Aug 2026' },
      { id: 'September 2026', label: '🍁 Sep 2026' },
      { id: 'October 2026', label: '🍂 Oct 2026' }
    ];`;

if (js.includes(targetPills)) {
  js = js.replace(targetPills, replacementPills);
  console.log('Successfully updated renderVaultCaPills with Aug, Sep, Oct 2026!');
} else {
  const pIdx = js.indexOf("{ id: 'July 2026', label: '⚡ Jul 2026' }");
  if (pIdx !== -1) {
    const pEnd = js.indexOf('];', pIdx);
    js = js.substring(0, pEnd) + "},\n      { id: 'August 2026', label: '🌾 Aug 2026' },\n      { id: 'September 2026', label: '🍁 Sep 2026' },\n      { id: 'October 2026', label: '🍂 Oct 2026' }\n    ];" + js.substring(pEnd + 2);
    console.log('Patched renderVaultCaPills via index slice.');
  }
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Updated static/prelims.js successfully.');
