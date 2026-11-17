const About = () => {
  return (
    <div className="flex flex-col items-center text-center text-white uppercase font-roboto-mono w-full">
      <div className="w-2/3 mt-4">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4">
          Nomini is a web application that allows users to nominate their
          favorite games for The Game Awards 2026 — taking place live on
          December 10, 2026 at Peacock Theater in Los Angeles, California — and
          get ranked based on their predictions.
        </p>
        <p className="mt-4">
          Users can nominate their winner prediction for all official 2026
          categories. The app displays the official winners, preserves
          historical 2025 results, and ranks users on the 2026 and all-time
          global leaderboards to see who can predict the industry best.
        </p>
        <p className="mt-4">
          Nomini is a project created by{" "}
          <a
            href="https://www.linkedin.com/in/felipe-gregorio-85bb4b1a2/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Felipe Gregorio
          </a>{" "}
          as a self imposed challenge while I'm on break.
        </p>
        <p>
          Many thanks to{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://github.com/LeandroRochAlg"
          >
            Leandro Rocha
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://github.com/douglasew"
          >
            Douglas Ewerton
          </a>{" "}
          for the help with the project organization. It woundn't be possible
          without them.
        </p>
      </div>
    </div>
  );
};

export default About;
