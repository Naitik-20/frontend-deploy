const fs = require('fs');
let content = fs.readFileSync('src/components/Header.jsx', 'utf8');

content = content.replace(/<div className="mega-col-title">([^<]+)<\/div>/g, (match, p1) => {
  // Decode HTML entities for the URL
  let name = p1.replace(/&amp;/g, '&');
  let encoded = encodeURIComponent(name);
  return `<Link to="/category/${encoded}" className="mega-col-title">${p1}</Link>`;
});

fs.writeFileSync('src/components/Header.jsx', content);
