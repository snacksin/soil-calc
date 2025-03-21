import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1.5rem 0'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            fontFamily: "'Poppins', sans-serif",
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: 'var(--color-accent)' }}>🌱</span>
            Garden Soil Calculator
          </span>
        </Link>
        <div>
          <button
            className="btn"
            aria-label="Switch to dark mode"
            style={{
              background: 'var(--color-primary)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🌙</span> Switch Theme
          </button>
        </div>
      </div>
    </header>
  );
}
