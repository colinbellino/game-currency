const { currencies, renderResult, parseData, validate, calculateResult, renderCurrencySelect } = require("../../public/shared.js");

async function handler(event, context, callback) {
  let data = {
    originalAmount: "1",
    amount: 1,
    source: 0,
    target: 4,
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
        <link rel="stylesheet" href="/public/app.css">
      </head>

      <body>
        <h1>Video game currency converter</h1>

        <section>
          <form method="get">
            <label>
              <span>Amount</span>
              <input type="text" name="amount" value="${originalAmount}">
            </label>
            ${renderCurrencySelect("source", source, "From", currencies)}
            ${renderCurrencySelect("target", target, "To", currencies)}
            ${error ?
              `<h2 class="error">${error.message}</h2>` :
              `<h2>${renderResult(currencies[source], currencies[target], amount, result)}`
            }
            <button type="submit">Convert</button>
            <button type="submit" formaction="/.netlify/functions/swap_currencies">Swap currency</button>
          </form>
        </section>
        <script type="module" src="/public/app.js"></script>
      </body>
    </html>
  `;
}

module.exports = { handler, parseParams };