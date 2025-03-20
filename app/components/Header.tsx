import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container-custom flex justify-between items-center">
        <Link href="/">
          <span className="no-underline font-bold text-xl sm:text-2xl">
            Garden Soil Calculator
          </span>
        </Link>
        <div>
          <button className="btn" aria-label="Switch to dark mode">
            Switch Theme
          </button>
        </div>
      </div>
    </header>
  );
}
