export default function Footer() {
  return (
    <footer className="glass-panel-fun w-full py-4 px-6 mt-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="mb-2 sm:mb-0 hover:text-[var(--color-primary)] transition-colors duration-300">
          © {new Date().getFullYear()} Garden Soil Calculator
        </div>
        
        <div className="flex gap-6">
          <a
            href="#"
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-primary)]">
              Privacy Policy
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-secondary)]">
              Terms of Service
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-secondary)] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-accent)]">
              Contact
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </footer>
  )
}
