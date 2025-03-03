import { client } from "@/lib/client";
// import { connectSmartWallet } from "@/lib/wallet";
import { useEffect, useState } from "react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount, useConnect } from "thirdweb/react";
import Image from "next/image";

interface ConnectModalProps {
  showModal: boolean;
  setSigner: (s: any) => any;
  setViewModal: (show: boolean) => any;
}

export default function ConnectModal({
  showModal,
  setSigner,
  setViewModal,
}: ConnectModalProps) {
  const [password, setPassword] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const account = useActiveAccount();

  const connectWallet = async () => {
    try {
      // setIsLoading(true);
      // const wallet = await connectSmartWallet(password, (status) =>
      //   setLoadingStatus(status)
      // );
      // const s = await wallet.getSigner();
      // if (s) {
      //   setSigner(s);
      //   setIsLoading(false);
      //   setViewModal(false);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const { connect } = useConnect();

  const handleLogin = async () => {
    await connect(async () => {
      const wallet = inAppWallet();
      await wallet.connect({
        client: client,
        strategy: "google",
      });
      return wallet;
    });
  };

  useEffect(() => {
    if (account) {
      setViewModal(false);
    }
  }, [account]);

  return (
    <div
      className={`fixed z-40 left-1/2 top-1/2 text-center rounded-2xl py-10 w-[20rem] px-8 ${
        showModal ? "block connectModal" : "hidden"
      }`}
    >
      <h1 className="text-3xl font-juraBold">SIGN IN</h1>
      <div className="flex flex-col space-y-4 mt-6">
        <p className="text-lg font-inter">
          Enter password to access/create account
        </p>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg text-lg outline-none px-2 text-black focus:drop-shadow-[0_0_0.3rem_#ffffff] transition-all duration-300 font-inter"
        />
      </div>
      <button
        onClick={() => connectWallet()}
        className={`py-1.5 px-6 rounded-2xl mt-4 font-juraBold transition-all duration-500 text-black ${
          password ? "bg-[#01ff39]" : "bg-[#01ff3960]"
        }`}
      >
        {isLoading ? "Loading..." : "LOGIN"}
      </button>
      <p className="text-sm mt-6 mb-2">Or sign in via</p>
      <div className="flex flex-row justify-around items-center">
        <div
          onClick={() => {
            connect(async () => {
              const wallet = createWallet("io.metamask");
              await wallet.connect({ client: client });
              return wallet;
            });
          }}
          className="rounded-xl bg-white overflow-hidden relative h-[4rem] w-[4rem] cursor-pointer hover:opacity-80 hover:drop-shadow-[0_0_0.3rem_#ffffff] transition-all duration-300 ease-out"
        >
          <Image
            src="/metamaskLogo.png"
            alt="metamask logo"
            fill
            className="bg-white"
          />
        </div>
        <div
          onClick={() => {
            connect(async () => {
              const wallet = createWallet("com.coinbase.wallet");
              await wallet.connect({ client: client });
              return wallet;
            });
          }}
          className="rounded-xl overflow-hidden relative h-[4rem] w-[4rem] cursor-pointer hover:opacity-80 hover:drop-shadow-[0_0_0.3rem_#ffffff] transition-all duration-300 ease-out"
        >
          <Image
            src="/coinbaseWalletLogo.svg"
            alt="coinbase wallet logo"
            className="bg-blue-500"
            fill
          />
        </div>
        <div
          onClick={handleLogin}
          className="rounded-xl overflow-hidden relative h-[4rem] w-[4rem] cursor-pointer hover:opacity-80 hover:drop-shadow-[0_0_0.3rem_#ffffff] transition-all duration-300 ease-out"
        >
          <Image
            src="/gmailLogo.png"
            alt="gmail logo"
            fill
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
}
