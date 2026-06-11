const fs = require('fs');
let content = fs.readFileSync('src/components/Header.jsx', 'utf8');

// Remove React import
content = content.replace(/import React from 'react';/, '');

// Add Link import
content = content.replace(/import { Search/, "import { Link } from 'react-router-dom';\nimport { Search");

// Replace top level links
content = content.replace(/<a href="#home">Home<\/a>/, '<Link to="/">Home</Link>');
content = content.replace(/<a href="#shop-all" className="active">Shop All<\/a>/, '<Link to="/" className="active">Shop All</Link>');

// Replace mega-trigger a with span
content = content.replace(/<a href="#categories" className="mega-trigger">([\s\S]*?)<\/a>/, '<span className="mega-trigger">$1</span>');

// Replace all category links
content = content.replace(/<Link to="\/category\/([^"]+)">([^<]+)<\/Link>/g, (match, p1, p2) => {
  // We already ran the previous replacement which turned them into Link. 
  // Let's just fix the `p1` if it has %26amp%3B
  const fixedP1 = p1.replace(/%26amp%3B/g, '%26');
  return `<Link to="/category/${fixedP1}">${p2}</Link>`;
});

fs.writeFileSync('src/components/Header.jsx', content);
