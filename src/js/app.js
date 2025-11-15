// src/js/app.js

import { fetchSymbols, convert, fetchTimeseries } from "./api.js";
import { populateSelect } from "./ui.js";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const resultBox = document.getElementById("result");

// ------------- INIT --------------------

async function init() {
  console.log("App starting…");

  const symbols = await fetchSymbols();
  console.log("Symbols loaded:", Object.keys(symbols).length);

  populateSelect(fromSelect, symbols, "USD");
  populateSelect(toSelect, symbols, "EUR");
}

init();

// ------------- EVENTS --------------------

async function handleConvert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || !from || !to) {
    resultBox.textContent = "Missing input.";
    return;
  }

  const data = await convert(amount, from, to);
  if (!data.result) {
    resultBox.textContent = "Conversion failed.";
    return;
  }

  resultBox.textContent = `${amount} ${from} = ${data.result} ${to}`;
}

fromSelect.addEventListener("change", handleConvert);
toSelect.addEventListener("change", handleConvert);
amountInput.addEventListener("input", handleConvert);
