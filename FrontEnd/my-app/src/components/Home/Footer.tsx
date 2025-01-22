export default function Footer() {
  return (
    <div className="flex flex-row mt-44 justify-evenly items-center text-center bg-[#01FF39] py-[1.2rem] text-sm">
      <p className="text-black w-[15rem]">
        Powered by Jaka Potokar a.k.a. BChainBuddy
      </p>
      <p>© 2024 Trade Forge. All rights reserved.</p>
      <p className="text-black w-[15rem]">
        Explore more projects on GitHub:{" "}
        <a href="https://github.com/BchainBuddy" target="_blank">
          github.com/BChainBuddy
        </a>
      </p>
    </div>
  );
}
