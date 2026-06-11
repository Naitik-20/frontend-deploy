const fs = require('fs');
const files = [
  'App.jsx',
  'components/AuthModal.jsx',
  'components/CartDrawer.jsx',
  'components/Footer.jsx',
  'components/Header.jsx',
  'components/ProductCard.jsx',
  'components/ProductDetailModal.jsx',
  'components/Sidebar.jsx'
];

for (const file of files) {
  const path = 'src/' + file;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/import React(, | from | {)/g, (match, p1) => {
    if (p1 === ' from ') return '';
    if (p1 === ', ') return 'import ';
    if (p1 === ' {') return 'import {';
    return match;
  });
  
  if (file === 'components/Sidebar.jsx') {
    content = content.replace(/import { ChevronDown, ChevronUp, /, 'import { ');
  }
  
  fs.writeFileSync(path, content);
}
