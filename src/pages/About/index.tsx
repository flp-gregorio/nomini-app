const About = () => {
  return (
    <div className="w-[92%] max-w-6xl mx-auto px-2 sm:px-4 py-8 text-white uppercase font-roboto-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-zinc-900/70 border border-zinc-800 rounded-lg p-6 sm:p-8 text-left">
          <h1 className="text-3xl sm:text-4xl font-bold font-barlow text-orange-500 tracking-tight">
            About Nomini
          </h1>
          <p className="mt-4 leading-relaxed max-w-prose">
            Nomini is a web application that allows users to nominate their
            favorite games for The Game Awards 2026 — taking place live on
            December 10, 2026 at Peacock Theater in Los Angeles, California — and
            get ranked based on their predictions.
          </p>
          <p className="mt-4 leading-relaxed max-w-prose">
            Users can nominate their winner prediction for all official 2026
            categories. The app displays the official winners, preserves
            historical 2025 results, and ranks users on the 2026 and all-time
            global leaderboards to see who can predict the industry best.
          </p>
        </div>

        <div className="lg:col-span-5 bg-zinc-900/70 border border-zinc-800 rounded-lg p-6 sm:p-8 text-left">
          <h2 className="text-xl font-bold font-barlow text-white tracking-wider">
            Credits &amp; Project
          </h2>
          <p className="mt-4 leading-relaxed text-sm text-zinc-300">
            Nomini is a project created by{" "}
            <a
              href="https://www.linkedin.com/in/felipe-gregorio-85bb4b1a2/"
              className="underline text-orange-400 hover:text-orange-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Felipe Gregorio
            </a>{" "}
            as a self imposed challenge while I'm on break.
          </p>
          <p className="mt-4 leading-relaxed text-sm text-zinc-300">
            Many thanks to{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-orange-400 hover:text-orange-300"
              href="https://github.com/LeandroRochAlg"
            >
              Leandro Rocha
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-orange-400 hover:text-orange-300"
              href="https://github.com/douglasew"
            >
              Douglas Ewerton
            </a>{" "}
            for the help with the project organization. It woundn't be possible
            without them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
