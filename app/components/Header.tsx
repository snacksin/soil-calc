import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container-custom siimple-navbar">
        <Link href="/">
          <span className="siimple-navbar-title" style={{ textDecoration: 'none' }}>
            Garden Soil Calculator
          </span>
        </Link>
        <div>
          <button className="btn siimple-btn siimple-btn--primary" aria-label="Switch to dark mode">
            Switch Theme
          </button>
        </div>
      </div>
    </header>
  );
}
