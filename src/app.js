(function(){
  const amountInput = document.querySelector("[name='amount']");
  const sourceSelect = document.querySelector("[name='source']");
  const targetSelect = document.querySelector("[name='target']");
  const resultHeading = document.querySelector("h2");
  const swapButton = document.querySelector(".swap-button");

  amountInput.addEventListener("input", onAmountChange);
  sourceSelect.addEventListener("input", onCurencyChange);
  targetSelect.addEventListener("input", onCurencyChange);
  swapButton.addEventListener("click", onCurrencySwap);

  function onAmountChange(_event) {
    calculateAndUpdateResult();
  }

  function onCurencyChange(event) {
    updateSelectImage(event.target);
    calculateAndUpdateResult();
  }

  function onCurrencySwap(event) {
    const initialTarget = targetSelect.value;
    targetSelect.value = sourceSelect.value;
    sourceSelect.value = initialTarget;

    updateSelectImage(targetSelect);
    updateSelectImage(sourceSelect);
    calculateAndUpdateResult();

    event.preventDefault();
  }

  function updateSelectImage(selectElement) {
    const imageElement = selectElement.closest(".select-with-icon").querySelector(".select-icon");
    imageElement.setAttribute("src", getCurrencyURL(currencies[selectElement.value]));
  }

  function calculateAndUpdateResult() {
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

  function extractData() {
    const inputs = {
      amount: amountInput.value,
      source: sourceSelect.value,
      target: targetSelect.value,
    };

    return [null, inputs];
  }

  function displayError({ message }) {
    resultHeading.classList.add("error");
    resultHeading.innerHTML = message;
  }

  function displayResult({ originalAmount, amount, result, source, target }) {
    resultHeading.classList.remove("error");
    resultHeading.innerHTML = renderResult(currencies[source], currencies[target], amount, result);
  }
})();
