export default function formatNumber(num: number) {
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Large numbers
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(2) + "M";
  }

  // Small numbers
  if (absNum < 1e-8) {
    return sign + absNum.toExponential(2);
  }

  // Decimals
  if (absNum < 1) {
    return sign + absNum.toFixed(8).replace(/\.?0+$/, "");
  } else {
    return sign + absNum.toFixed(5).replace(/\.?0+$/, "");
  }
}
