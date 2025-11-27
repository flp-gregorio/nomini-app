const FooterComponent = () => {
  return (
    <footer className="bg-zinc-900 text-gray-600 body-font font-barlow w-full max-h-12 antialiased">
      <div className="container py-2 flex justify-evenly mx-auto">
        <span className="mr-auto pl-3">
          <a href="/about" className="text-sm text-gray-500">
            About
          </a>
        </span>
        <span className="inline-flex items-center pr-2">
          <span className="text-sm text-gray-500 pr-3 ml-auto">© 2024 Felipe Gregorio</span>
          <a
            href="https://www.instagram.com/felipe.gregoriooo/"
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-3 text-gray-500 hover:text-rose-400 transition-all duration-500"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/felipe-gregorio-85bb4b1a2/"
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-3 text-gray-500 hover:text-blue-300 transition-all duration-500"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              className="w-4 h-4"
              viewBox="0 0 24 24"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
};

export default FooterComponent;
