"use client";

import { useEffect } from "react";

interface ChartProps {
  symbol1?: string;
  symbol2?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Chart({
  symbol1 = "ETH",
  symbol2 = "USDT",
}: ChartProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview_chart",
          symbol: `${symbol1 + symbol2}`,
          interval: "60",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          calendar: true,
          autosize: true,
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="h-[22rem] w-[33rem] border-2 border-[#01FF39] rounded-sm shadow-lg shadow-[#01FF39] ">
      <div id="tradingview_chart" className="h-full w-full"></div>
    </div>
  );
}
