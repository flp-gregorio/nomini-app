const About = () => {
  return (
    <div className="flex flex-col items-center text-center text-white uppercase font-roboto-mono w-full">
      <div className="w-2/3 mt-4">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4">
          The Gamesweep is a web application that allows users to nominate their
          favorite games for the upcoming The Game Awards.
        </p>
        <p className="mt-4">
          Users can nominate their winner prediction for all oficial categories.
          The app will display the popular vote winners, the official winners,
          and rank the users in a global leaderboard to see who can predict the
          industry the most.
        </p>
        <p className="mt-4">
          The Gamesweep is a project created by{" "}
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
