const { currencies, renderResult, parseData, validate, calculateResult, renderCurrencySelect } = require("../shared.js");

async function handler(event, context, callback) {
  let data = {
    originalAmount: "1",
    amount: 1,
    source: 0,
    target: 16,
    result: 0,
  };

  if (Object.keys(event.multiValueQueryStringParameters).length > 0) {
    const [_, inputs] = parseParams(event.multiValueQueryStringParameters);
    data.originalAmount = inputs.amount;

    const [parseError, parsedData] = parseData(inputs);
    if (parseError) {
      console.error(parseError);
      return { statusCode: 400, body: renderHTML(parseError, data, currencies) };
    }

    const validationError = validate(parsedData);
    if (validationError) {
      console.error(validationError);
      return { statusCode: 400, body: renderHTML(validationError, data, currencies) };
    }

    data = parsedData;
  }

  data.result = calculateResult(data.amount, currencies[data.source].rate, currencies[data.target].rate);

  return { statusCode: 200, body: renderHTML(null, data, currencies) };
};

function parseParams(params) {
  if (
    params.hasOwnProperty("amount") === false ||
    params.hasOwnProperty("source") === false ||
    params.hasOwnProperty("target") === false
  ) {
    return [{ message: "Invalid params." }, {}];
  }
  if (params.amount.length != 1) {
    return [{ message: "Missing amount." }, {}];
  }
  if (params.source.length != 1) {
    return [{ message: "Missing source." }, {}];
  }
  if (params.target.length != 1) {
    return [{ message: "Missing target." }, {}];
  }

  const data = {
    amount: params.amount[0],
    source: params.source[0],
    target: params.target[0],
  };
  return [null, data]
}

function renderHTML(error, { originalAmount, amount, source, target, result }) {
  return `
    <!DOCTYPE html>
    <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video game currency converter</title>
        <link rel="stylesheet" href="/build/app.min.css">
        <link rel="manifest" href="/public/manifest.json">
      </head>

      <body>
        <h1><a href="/">Video game currency converter</a></h1>

        <section>
          <form method="get">
            <label>
              <span>Amount</span>
              <input type="text" name="amount" value="${originalAmount}">
            </label>
            ${renderCurrencySelect("source", source, "From", currencies)}
            <button type="submit" formaction="/.netlify/functions/swap_currencies" class="swap-button" aria-labelledby="swap-button-label">
              <span id="swap-button-label" hidden>Swap currencies</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M388.9 266.3c-5.1-5-5.2-13.3-.1-18.4L436 200H211c-7.2 0-13-5.8-13-13s5.8-13 13-13h224.9l-47.2-47.9c-5-5.1-5-13.3.1-18.4 5.1-5 13.3-5 18.4.1l69 70c1.1 1.2 2.1 2.5 2.7 4.1.7 1.6 1 3.3 1 5 0 3.4-1.3 6.6-3.7 9.1l-69 70c-5 5.2-13.2 5.3-18.3.3zm-265.8 138c5.1-5 5.2-13.3.1-18.4L76.1 338H301c7.2 0 13-5.8 13-13s-5.8-13-13-13H76.1l47.2-47.9c5-5.1 5-13.3-.1-18.4-5.1-5-13.3-5-18.4.1l-69 70c-1.1 1.2-2.1 2.5-2.7 4.1-.7 1.6-1 3.3-1 5 0 3.4 1.3 6.6 3.7 9.1l69 70c5 5.2 13.2 5.3 18.3.3z"/></svg>
            </button>
            ${renderCurrencySelect("target", target, "To", currencies)}
            ${error ?
              `<h2 class="error">${error.message}</h2>` :
              `<h2>${renderResult(currencies[source], currencies[target], amount, result)}`
            }
            <button type="submit" class="convert-button">Convert</button>
          </form>
        </section>
        <script type="module" src="/build/app.min.js"></script>
      </body>
    </html>
  `;
}

module.exports = { handler, parseParams };
