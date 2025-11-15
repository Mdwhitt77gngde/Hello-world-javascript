// src/js/api.js

// We switch to a stable source for currency symbols
// Symbols endpoint from open.er-api.com works reliably.
export const SYMBOLS_URL = "https://open.er-api.com/v6/latest/USD";

/**
 * Fetch list of currency symbols (from stable source)
 */
export async function fetchSymbols() {
  try {
    const res = await fetch(SYMBOLS_URL);
    const data = await res.json();

    if (!data || !data.rates) {
      console.error("fetchSymbols: no symbol data", data);
      return {};
    }

    // Convert rates keys -> symbols dictionary
    const symbols = {};
    Object.keys(data.rates).forEach(code => {
      symbols[code] = { description: `Currency: ${code}` };
    });

    return symbols;
  } catch (err) {
    console.error("fetchSymbols error:", err);
    return {};
  }
}

/**
 * Convert currency — using exchangerate.host (still works)
 */
export async function convert(amount, from, to) {
  const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Conversion failed");
  return res.json();
}

/**
 * Latest rates for graphing
 */
export async function fetchTimeseries(base, symbol, start, end) {
  const url = `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${base}&symbols=${symbol}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Timeseries failed");
  return res.json();
}
