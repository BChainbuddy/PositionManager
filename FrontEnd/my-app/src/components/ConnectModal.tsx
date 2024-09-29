import { connectSmartWallet } from "@/lib/wallet";
import { useState } from "react";

interface ConnectModalProps {
  showModal: boolean;
  setSigner: (s: any) => any;
}

export default function ConnectModal({
  showModal,
  setSigner,
}: ConnectModalProps) {
  const [password, setPassword] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const wallet = await connectSmartWallet(password, (status) =>
        setLoadingStatus(status)
      );

      const s = await wallet.getSigner();
      setSigner(s);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`fixed z-20 left-1/2 top-1/2 text-center rounded-2xl px-10 py-16 ${
        showModal ? "block connectModal" : "hidden"
      }`}
    >
      <h1 className="text-3xl font-juraBold">LOGIN</h1>
      <div className="flex flex-col space-y-4 mt-8">
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
        className={`py-1.5 px-6 rounded-2xl mt-8 font-juraBold transition-all duration-500 text-black ${
          password ? "bg-[#01ff39]" : "bg-[#01ff3960]"
        }`}
      >
        Login
      </button>
    </div>
  );
}
