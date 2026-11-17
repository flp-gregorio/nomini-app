import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useIsAdmin } from "../hooks/useAuth";
import { prefetchAdminPage } from "../routes/adminLoader";

const navItemsLeft = [
  { to: "/nominees", label: "NOMINEES" },
  { to: "/winners", label: "WINNERS" },
];

const HeaderComponent = memo(() => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAdmin = useIsAdmin();

  const isProfileActive = location.pathname.startsWith("/profile");

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAdmin) return;

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => {
        void prefetchAdminPage();
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(() => {
      void prefetchAdminPage();
    }, 1000);
    return () => window.clearTimeout(timerId);
  }, [isAdmin]);

  const handlePrefetchAdmin = useCallback(() => {
    if (isAdmin) {
      void prefetchAdminPage();
    }
  }, [isAdmin]);

  const mobileNavItems = useMemo(
    () => [
      { to: "/nominees", label: "NOMINEES" },
      { to: "/winners", label: "WINNERS" },
      { to: "/leaderboard", label: "LEADERBOARD" },
      ...(isAdmin ? [{ to: "/admin", label: "ADMIN" }] : []),
      { to: "/profile", label: "PROFILE" },
    ],
    [isAdmin]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const navLinkClass = (isActive: boolean) =>
    `relative whitespace-nowrap py-2 text-xs lg:text-sm font-montserrat font-bold uppercase tracking-[0.12em] lg:tracking-[0.18em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] ${
      isActive
        ? "text-[#F5F5F5]"
        : "text-zinc-400 hover:text-[#F5F5F5]"
    }`;

  const activeBar = (isActive: boolean) =>
    isActive ? (
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#FF641A]"
      />
    ) : null;

  return (
    <header className="antialiased bg-[#09090B] border-b border-zinc-800/80 w-full z-40">
      <div className="w-full max-w-[1760px] mx-auto px-[clamp(16px,3vw,48px)]">
        {/* Desktop Header */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center h-16"
        >
          {/* Left Links */}
          <div className="flex items-center justify-start gap-4 lg:gap-8 xl:gap-10 min-w-0">
            {navItemsLeft.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#FF641A]" : ""}>
                      {item.label}
                    </span>
                    {activeBar(isActive)}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Center Brand Trophy */}
          <Link
            to="/"
            aria-label="Nomini — The Game Awards 2026 Home"
            className="group relative flex items-center justify-center px-2.5 lg:px-5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[#FF641A]/0 group-hover:bg-[#FF641A]/10 blur-md transition-colors duration-300"
            />
            <svg
              className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105 filter group-hover:drop-shadow-[0_0_12px_rgba(255,100,26,0.45)]"
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="none"
              viewBox="0 0 80 80"
            >
              <path
                className="fill-[#F5F5F5] group-hover:fill-[#FF641A] transition-colors duration-300"
                fillRule="evenodd"
                d="m16.585 21.058 1.83 4.15s-.57 4.072 0 8.145c.54 3.863 1.68 6.89 2.782 9.815.235.624.468 1.244.693 1.865 4.208 6.224 6.952 8.607 6.952 8.607l2.378 9.912 3.841 4.457v1.383h-1.83v1.537H31.22V77h17.56v-6.07h-2.012v-1.538h-1.83V68.01l3.842-4.457 2.378-9.912s2.744-2.383 6.952-8.607c.225-.622.458-1.241.693-1.865 1.101-2.924 2.241-5.952 2.782-9.815.57-4.073 0-8.145 0-8.145l1.83-4.15-8.781-2.766-3.476 2.305 1.28-4.226L40 3 27.56 16.37l1.28 4.227-3.475-2.305-8.78 2.766Zm-.64 5.533v3.227s-2.927 1.768-2.652 4.688c0 3.458 2.652 5.917 2.652 5.917v-3.074h2.927l.915 2.766h-.366v.308c-.203.386 1.59 5.373 2.835 7.607 2.012 2.613 5.671 5.61 5.671 5.61v2.843s-4.76-1.921-7.043-4.918c-1.463-1.921-2.378-3.92-3.475-6.532-4.705-2.438-7.433-5.751-7.409-10.527.01-2.097.242-3.208 1.464-5.226 1.006-1.306 4.481-2.69 4.481-2.69Zm48.11 3.227v-3.227s3.475 1.383 4.481 2.69c1.222 2.017 1.453 3.128 1.464 5.225.024 4.776-2.704 8.09-7.409 10.527-1.097 2.613-2.012 4.61-3.475 6.532-2.283 2.997-7.043 4.918-7.043 4.918V53.64s3.659-2.997 5.67-5.61c1.246-2.234 3.039-7.221 2.836-7.607v-.308h-.366l.915-2.766h2.927v3.074s2.652-2.46 2.652-5.917c.275-2.92-2.652-4.688-2.652-4.688Zm-14.48 8.71-2.561 2.465-.008 2.41 1.285-1.205 1.285-3.67Zm1.101-3.69 1.062-3.47-7.456 7.168v2.316l6.394-6.015Zm2.262-7.369L54 24 41.543 35.977v2.3L52.938 27.47ZM44.474 52 30.463 38.536l1.316 3.699 1.646 1.554-.838.806.661 1.657 1.393-1.324 1.516 1.442-2.07 1.976.661 1.642 2.609-2.479 1.44 1.37L35.548 52h2.516l2.008-1.916L42.081 52h2.393Zm2.986-7.39L26 24l1.062 3.47 11.711 11.17v2.3l1.215-1.153 1.57 1.494v2.19l1.17-1.08 1.6 1.523v2.094l1.108-1.05 1.362 1.294.662-1.642Zm-1.57 3.81L28.31 31.478l1.061 3.47 6.663 6.332v2.286l1.201-1.14 1.539 1.458v2.249l1.2-1.125 1.6 1.524v2.116l1.124-1.05 2.531 2.463.663-1.643Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {/* Right Links */}
          <div className="flex items-center justify-end gap-4 lg:gap-8 xl:gap-10 min-w-0">
            <NavLink
              to="/leaderboard"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-[#FF641A]" : ""}>
                    LEADERBOARD
                  </span>
                  {activeBar(isActive)}
                </>
              )}
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                onMouseEnter={handlePrefetchAdmin}
                onFocus={handlePrefetchAdmin}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#FF641A]" : ""}>
                      ADMIN
                    </span>
                    {activeBar(isActive)}
                  </>
                )}
              </NavLink>
            )}

            {/* Profile with dropdown */}
            <div
              ref={profileRef}
              className="relative flex items-center"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <NavLink
                to="/profile"
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#FF641A]" : ""}>
                      PROFILE
                    </span>
                    {activeBar(isActive)}
                  </>
                )}
              </NavLink>
              <button
                type="button"
                aria-label="Toggle profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`ml-1.5 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] ${
                  isProfileActive
                    ? "text-[#FF641A]"
                    : "text-zinc-400 hover:text-[#F5F5F5]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full pt-2 z-50 min-w-[176px]">
                  <div className="bg-[#141416] border border-zinc-800 shadow-2xl overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-xs font-montserrat font-bold tracking-[0.15em] text-[#F5F5F5] hover:bg-[#1C1C20] hover:text-[#FF641A] transition-colors"
                    >
                      MY PROFILE
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-xs font-montserrat font-bold tracking-[0.15em] text-zinc-300 hover:bg-[#1C1C20] hover:text-red-400 transition-colors border-t border-zinc-800"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Header */}
        <nav aria-label="Mobile Navigation" className="md:hidden">
          <div className="flex items-center justify-center py-2">
            <Link
              to="/"
              aria-label="Nomini — The Game Awards 2026 Home"
              className="group inline-flex items-center justify-center p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A]"
            >
              <svg
                className="w-11 h-11 transition-transform duration-300 group-hover:scale-105"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                fill="none"
                viewBox="0 0 80 80"
              >
                <path
                  className="fill-[#F5F5F5] group-hover:fill-[#FF641A] transition-colors duration-300"
                  fillRule="evenodd"
                  d="m16.585 21.058 1.83 4.15s-.57 4.072 0 8.145c.54 3.863 1.68 6.89 2.782 9.815.235.624.468 1.244.693 1.865 4.208 6.224 6.952 8.607 6.952 8.607l2.378 9.912 3.841 4.457v1.383h-1.83v1.537H31.22V77h17.56v-6.07h-2.012v-1.538h-1.83V68.01l3.842-4.457 2.378-9.912s2.744-2.383 6.952-8.607c.225-.622.458-1.241.693-1.865 1.101-2.924 2.241-5.952 2.782-9.815.57-4.073 0-8.145 0-8.145l1.83-4.15-8.781-2.766-3.476 2.305 1.28-4.226L40 3 27.56 16.37l1.28 4.227-3.475-2.305-8.78 2.766Zm-.64 5.533v3.227s-2.927 1.768-2.652 4.688c0 3.458 2.652 5.917 2.652 5.917v-3.074h2.927l.915 2.766h-.366v.308c-.203.386 1.59 5.373 2.835 7.607 2.012 2.613 5.671 5.61 5.671 5.61v2.843s-4.76-1.921-7.043-4.918c-1.463-1.921-2.378-3.92-3.475-6.532-4.705-2.438-7.433-5.751-7.409-10.527.01-2.097.242-3.208 1.464-5.226 1.006-1.306 4.481-2.69 4.481-2.69Zm48.11 3.227v-3.227s3.475 1.383 4.481 2.69c1.222 2.017 1.453 3.128 1.464 5.225.024 4.776-2.704 8.09-7.409 10.527-1.097 2.613-2.012 4.61-3.475 6.532-2.283 2.997-7.043 4.918-7.043 4.918V53.64s3.659-2.997 5.67-5.61c1.246-2.234 3.039-7.221 2.836-7.607v-.308h-.366l.915-2.766h2.927v3.074s2.652-2.46 2.652-5.917c.275-2.92-2.652-4.688-2.652-4.688Zm-14.48 8.71-2.561 2.465-.008 2.41 1.285-1.205 1.285-3.67Zm1.101-3.69 1.062-3.47-7.456 7.168v2.316l6.394-6.015Zm2.262-7.369L54 24 41.543 35.977v2.3L52.938 27.47ZM44.474 52 30.463 38.536l1.316 3.699 1.646 1.554-.838.806.661 1.657 1.393-1.324 1.516 1.442-2.07 1.976.661 1.642 2.609-2.479 1.44 1.37L35.548 52h2.516l2.008-1.916L42.081 52h2.393Zm2.986-7.39L26 24l1.062 3.47 11.711 11.17v2.3l1.215-1.153 1.57 1.494v2.19l1.17-1.08 1.6 1.523v2.094l1.108-1.05 1.362 1.294.662-1.642Zm-1.57 3.81L28.31 31.478l1.061 3.47 6.663 6.332v2.286l1.201-1.14 1.539 1.458v2.249l1.2-1.125 1.6 1.524v2.116l1.124-1.05 2.531 2.463.663-1.643Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
            {mobileNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={item.to === "/admin" ? handlePrefetchAdmin : undefined}
                onFocus={item.to === "/admin" ? handlePrefetchAdmin : undefined}
                className={({ isActive }) =>
                  `relative whitespace-nowrap py-1.5 text-[11px] sm:text-xs font-montserrat font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641A] ${
                    isActive
                      ? "text-[#FF641A]"
                      : "text-zinc-400 hover:text-[#F5F5F5]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {activeBar(isActive)}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
});

HeaderComponent.displayName = "HeaderComponent";

export default HeaderComponent;
