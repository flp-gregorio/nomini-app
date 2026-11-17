import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <footer className="bg-[#09090B] text-zinc-500 body-font font-barlow w-full antialiased border-t border-zinc-800/80">
      <div className="w-full max-w-[1760px] py-3.5 px-[clamp(16px,3vw,48px)] flex flex-col sm:flex-row justify-between items-center gap-3 mx-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm text-zinc-400 hover:text-[#F5F5F5] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
          >
            About
          </Link>
        </div>

        <div className="inline-flex items-center gap-4">
          <span className="text-sm text-zinc-400">© 2026 Felipe Gregorio</span>
          <a
            href="https://www.instagram.com/felipe.gregoriooo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-zinc-400 hover:text-[#F5F5F5] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] p-1"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/felipe-gregorio-85bb4b1a2/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-400 hover:text-[#F5F5F5] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] p-1"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
