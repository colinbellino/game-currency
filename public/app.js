const currencies = JSON.parse(JSON.stringify(window.currencies));

const amountInput = document.querySelector("[name='amount']");
const sourceInput = document.querySelector("[name='source']");
const targetInput = document.querySelector("[name='target']");
const resultElement = document.querySelector("h2");
const currencyFormatter = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 20 });

// Can be placed in the server ?
amountInput.oninput = calculate;
sourceInput.oninput = calculate;
targetInput.oninput = calculate;

function parseData(input) {
    const originalAmount = input.amount;
    const amount = Number(originalAmount);

    if (isNaN(amount)) {
        return [{ message: "Invalid amount." }, {}];
    }

    const source = parseInt(input.source);
    if (isNaN(source)) {
        return [{ message: "Invalid source." }, {}];
    }

    const target = parseInt(input.target);
    if (isNaN(target)) {
        return [{ message: "Invalid target." }, {}];
    }

    return [null, { originalAmount, amount, source, target }];
}

function validate(input) {
    if (input.amount > 1_000_000_000_000) {
        return { message: "Amount too large." };
    }

    if (input.amount < -1_000_000_000_000) {
        return { message: "Amount too small." };
    }

    if (input.source < 0 || input.source > currencies.length - 1) {
        return { message: "Invalid source currency." };
    }

    if (input.target < 0 || input.target > currencies.length - 1) {
        return { message: "Invalid target currency." };
    }

    return null;
}

function extractData() {
    const inputs = {
        amount: amountInput.value,
        source: sourceInput.value,
        target: targetInput.value,
    };

    return [null, inputs];
}

function renderResult({ amount, source, target, result }, currencies, currencyFormatter) {
    return `${amount} ${currencies[source].name} = <b>${currencyFormatter.format(result)} ${currencies[target].name}</b></h2>`;
}

function displayError({ message }) {
    resultElement.classList.add("error");
    resultElement.innerHTML = message;
}

function displayResult({ originalAmount, amount, result, source, target }) {
    resultElement.classList.remove("error");
    resultElement.innerHTML = renderResult({ amount, source, target, result }, currencies, currencyFormatter);
}

function calculate() {
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

    data.result = data.amount * currencies[data.source].rate / currencies[data.target].rate;
    //console.log(JSON.stringify({ inputs, data }, null, 2));

    displayResult(data);
}
