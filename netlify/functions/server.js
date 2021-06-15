const { currencies, renderResult, parseData, validate } = require('../../public/shared.js');

async function handler(event, context, callback) {
  let data = {
    originalAmount: "1",
    amount: 1,
    source: 0,
    target: 4,
    result: 0,
  };

  if (event.body) {
    const [_, inputs] = parseBody(event.body);
    const [parseError, parsedData] = parseData(inputs);
    if (parseError) {
      console.error(parseError);
      return { statusCode: 400, body: renderHTML(parseError, data, currencies) };
    }

    data.originalAmount = parsedData.originalAmount;

    const validationError = validate(parsedData);
    if (validationError) {
      console.error(validationError);
      return { statusCode: 400, body: renderHTML(validationError, data, currencies) };
    }

    data = parsedData;
  }

  data.result = data.amount * currencies[data.source].rate / currencies[data.target].rate;

  return { statusCode: 200, body: renderHTML(null, data, currencies) };
};

function parseBody(body) {
  const params = body.split("&");
  if (params.length != 3) {
    return [{ message: "Invalid params." }, {}];
  }
  const amountKeyValue = params[0].split("=");
  if (amountKeyValue.length != 2) {
    return [{ message: "Missing amount." }, {}];
  }
  const sourceKeyValue = params[1].split("=");
  if (sourceKeyValue.length != 2) {
    return [{ message: "Missing source." }, {}];
  }
  const targetKeyValue = params[2].split("=");
  if (targetKeyValue.length != 2) {
    return [{ message: "Missing target." }, {}];
  }

  const data = {
    amount: amountKeyValue[1],
    source: sourceKeyValue[1],
    target: targetKeyValue[1],
  };
  return [null, data]
}

function renderHTML(error, { originalAmount, amount, source, target, result }, currencies) {
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
        <form method="post">
          <label>
            <span>Amount</span>
            <input type="text" name="amount" value="${amount}">
          </label>
          ${renderCurrencySelect("source", source, "From")}
          ${renderCurrencySelect("target", target, "To")}
          ${error ?
      `<h2 class="error">${error.message}</h2>` :
      `<h2>${renderResult(currencies[source], currencies[target], amount, result)}
          `}
          <button type="submit">Convert</button>
        </form>
        </section>
        <script>window.currencies = ${JSON.stringify(currencies)}</script>
        <script src="/public/app.js"></script>
      </body>
    </html>
  `;
}

function renderCurrencySelect(name, value, label) {
  return `
      <label>
        <span>${label}</span>
        <select name="${name}">
          ${currencies.map((currency, currencyIndex) => {
    return `<option value="${currencyIndex}" ${currencyIndex == value ? "selected" : ""}>${currency.name}</option>`
  }).join("\n")}
        </select>
      </label>
    `;
}

module.exports = { handler };