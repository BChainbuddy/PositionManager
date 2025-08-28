import { useEffect, useState } from "react";

export default function MarketCap() {
  const [marketcap, setMarketcap] = useState<number>(0);

  const fetchMarketCap = async () => {
    try {
      const response = await fetch("/api/marketcap");
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();

      const totalMarketcap = data.data.data.total_market_cap.usd;
      const loops = 50;
      const dividedPart = totalMarketcap / loops;
      let currentAmount = 0;
      const intervalTime = 60;

      const interval = setInterval(() => {
        currentAmount += dividedPart;
        if (currentAmount >= totalMarketcap) {
          currentAmount = totalMarketcap;
          clearInterval(interval);
        }
        setMarketcap(currentAmount);
      }, intervalTime);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMarketCap();
  }, []);

  return (
    <div className="bg-[#01FF39] py-2 text-center w-[23rem] rounded-xl font-juraBold self-end mr-2 hidden md:block">
      <p className="text-sm">Current marketcap of cryptocurrency market</p>
      <p className="text-lg">
        {Math.floor(marketcap).toLocaleString("de-DE")} USD
      </p>
    </div>
  );
}
