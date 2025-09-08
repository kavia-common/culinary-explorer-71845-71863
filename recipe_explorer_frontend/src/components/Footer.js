import React from 'react';

// PUBLIC_INTERFACE
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        © {new Date().getFullYear()} Recipe Explorer • Built with ❤️ • Images from Unsplash
        • <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>
      </div>
    </footer>
  );
}
