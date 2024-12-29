"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POSITIONS_BY_ID } from "@/lib/queries";
import CircleLoading from "@/ui/CircleLoading";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Chart() {
  const { positionId } = useParams();

  const { loading, error, data } = useQuery(GET_POSITIONS_BY_ID, {
    variables: { id: positionId },
    skip: !positionId,
  });

  const unwrapSymbol = (symbol: string) => {
    if (symbol === "WETH") {
      return "ETH";
    } else if (symbol === "WBTC") {
      return "BTC";
    } else {
      return symbol;
    }
  };

  useEffect(() => {
    if (data?.positions.length) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;

      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: "tradingview_chart",
            symbol: `${
              unwrapSymbol(data.positions[0].tokenIn.symbol) +
              unwrapSymbol(data.positions[0].tokenOut.symbol)
            }`,
            interval: "60",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            details: false,
            hotlist: false,
            calendar: true,
            autosize: true,
          });
        }
      };

      document.body.appendChild(script);
    }
  }, [data]);

  return (
    <div className="h-[22rem] w-[33rem] border-2 border-[#01FF39] rounded-sm shadow-lg shadow-[#01FF39] outline-none">
      {loading ? (
        <CircleLoading height="h-6" width="w-6" innerColor="fill-[#01FF39]" />
      ) : data.positions.length ? (
        <div
          id="tradingview_chart"
          className="h-full w-full outline-none"
        ></div>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-white"></div>
      )}
    </div>
  );
}
