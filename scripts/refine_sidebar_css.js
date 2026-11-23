const fs = require('fs');

const prelimsHtmlPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/prelims.html';
let html = fs.readFileSync(prelimsHtmlPath, 'utf8');

// Refine the CSS rules so badges like mistakes badge and tags retain their crisp styling
const searchCss = `    html.dark .sidebar-nav-item:hover span,
    html.dark .sidebar-nav-item:hover div {
      color: #fde68a !important;
    }`;

const replaceCss = `    html.dark .sidebar-nav-item:hover > div > span:not([class*="bg-"]),
    html.dark .sidebar-nav-item:hover > span:not([class*="bg-"]):not([id*="Badge"]) {
      color: #fde68a !important;
    }`;

const searchCssLight = `    html:not(.dark) .sidebar-nav-item:hover span,
    html:not(.dark) .sidebar-nav-item:hover div {
      color: #78350f !important;
    }`;

const replaceCssLight = `    html:not(.dark) .sidebar-nav-item:hover > div > span:not([class*="bg-"]),
    html:not(.dark) .sidebar-nav-item:hover > span:not([class*="bg-"]):not([id*="Badge"]) {
      color: #78350f !important;
    }`;

if (html.includes(searchCss)) {
  html = html.replace(searchCss, replaceCss);
  html = html.replace(searchCssLight, replaceCssLight);
  fs.writeFileSync(prelimsHtmlPath, html, 'utf8');
  console.log('Successfully refined badge protection in sidebar hover rules');
} else {
  console.log('Refinement string not matched directly');
}
