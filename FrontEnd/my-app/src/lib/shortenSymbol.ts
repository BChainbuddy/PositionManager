export function shortenSymbol(maxChar: number, symbol: string) {
  if (symbol.length > maxChar) {
    return `${symbol.substring(0, maxChar / 2)}..${symbol.substring(
      symbol.length - maxChar / 2,
      symbol.length
    )}`;
  } else {
    return symbol;
  }
}
