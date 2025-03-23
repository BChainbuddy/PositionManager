export default function Footer() {
  return (
    <div className="flex flex-col sm:flex-row mt-16 md:mt-44 justify-evenly items-center text-center bg-[#01FF39] py-4 md:text-sm text-xs">
      <p className="text-black md:w-[15rem]">
        Powered by Jaka Potokar a.k.a. BChainBuddy
      </p>
      <p className="my-2 md:my-0">© 2024 Trade Forge. All rights reserved.</p>
      <p className="text-black sm:w-[15rem]">
        Explore more projects on GitHub:{" "}
        <a
          href="https://github.com/BchainBuddy"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/BChainBuddy
        </a>
      </p>
    </div>
  );
}
