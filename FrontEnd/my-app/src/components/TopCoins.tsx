// components/TopCoins.tsx
import Image from "next/image";
import { useEffect, useState } from "react";
import CircleLoading from "./CircleLoading";

export default function TopCoins() {
  const [coins, setCoins] = useState<any[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const fetchCoins = async () => {
    try {
      const response = await fetch("/api/coins");
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();
      // console.log(data.data);
      setCoins(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div>
      <h2 className="text-center font-interBold text-[#FFE500]">
        Top 10 Cryptocurrencies by Price Change
      </h2>
      <div className="grid grid-cols-5 gap-2 mt-6">
        {coins &&
          coins.map((coin, i) => (
            <div
              key={i}
              className="relative h-[4rem] w-[4rem] bg-white rounded-lg overflow-hidden shadow-md group"
            >
              {coin.symbol ? (
                <>
                  <p className="font-juraBold absolute z-30 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] hidden group-hover:flex">
                    {coin.symbol}
                  </p>
                  <p className="absolute z-20 h-full w-full hidden group-hover:flex opacity-80 bg-[#01FF39]"></p>
                  <Image
                    src={coin.image}
                    alt={`${coin.symbol} image`}
                    fill
                    className="z-10"
                  />
                </>
              ) : (
                <CircleLoading
                  height="h-5"
                  width="w-5"
                  innerColor="fill-[#01FF39]"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}