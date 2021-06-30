import { currencies, parseData, validate, renderResult, calculateResult, getCurrencyURL } from "/public/shared.js";

{
  const amountInput = document.querySelector("[name='amount']");
  const sourceInput = document.querySelector("[name='source']");
  const targetInput = document.querySelector("[name='target']");
  const resultElement = document.querySelector("h2");

  amountInput.addEventListener("input", calculateAndUpdateResult);
  sourceInput.addEventListener("input", calculateAndUpdateResult);
  sourceInput.addEventListener("input", updateSelectImage);
  targetInput.addEventListener("input", calculateAndUpdateResult);
  targetInput.addEventListener("input", updateSelectImage);

  function extractData() {
    const inputs = {
      amount: amountInput.value,
      source: sourceInput.value,
      target: targetInput.value,
    };

    return [null, inputs];
  }

  function displayError({ message }) {
    resultElement.classList.add("error");
    resultElement.innerHTML = message;
  }

  function displayResult({ originalAmount, amount, result, source, target }) {
    resultElement.classList.remove("error");
    resultElement.innerHTML = renderResult(currencies[source], currencies[target], amount, result);
  }

  function updateSelectImage(event) {
    var imageElement = event.target.closest(".select-with-icon").querySelector(".select-icon");
    imageElement.setAttribute("src", getCurrencyURL(currencies[event.target.value]));
  }

  function calculateAndUpdateResult(_event) {
    const [_, inputs] = extractData();

    const [parseError, data] = parseData(inputs);
    if (parseError) {
      displayError(parseError);
      return;
    }

    const validationError = validate(data);
    if (validationError) {
      displayError(validationError);
      return;
    }

    data.result = calculateResult(data.amount, currencies[data.source].rate, currencies[data.target].rate);

    displayResult(data);
  }
}
