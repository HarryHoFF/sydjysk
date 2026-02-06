const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

const pwaMeta = `
    <meta name="theme-color" content="#0A0F0A" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Sydjyske Business" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="Sydjyske Business" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />`;

html = html.replace('</head>', pwaMeta + '\n  </head>');
html = html.replace('<html lang="en">', '<html lang="da">');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('PWA meta tags injected successfully');
