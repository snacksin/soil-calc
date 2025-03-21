export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1.5rem 0'
    }}>
      <div className="container-custom">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <p style={{ textAlign: 'center', margin: 0 }}>
            &copy; {new Date().getFullYear()} Garden Soil Calculator
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
            <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
