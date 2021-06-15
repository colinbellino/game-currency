// Placeholder data from: https://www.reddit.com/r/gaming/comments/725t5v/exchange_rates_of_video_game_currencies/
// FIXME: These rates are in € but we use them as if they were in USD !
const currencies = [
  { id: 0, name: "US Dollar", rate: 1.0 },
  { id: 1, name: "Euro", rate: 1.223093 },
  { id: 2, name: "Mineral (StarCraft)", rate: 34722222.22222 },
  { id: 3, name: "Coin (Super Mario Bros.)", rate: 100000 },
  { id: 4, name: "Poke Dollar (Pokémon Red/Blue)", rate: 0.00049 },
  { id: 5, name: "Rupee (Zelda)", rate: 0.09633 },
];

const handler = async (event, context, callback) => {
  let data = {
    originalAmount: "1",
    amount: 1,
    source: 0,
    target: 4,
    result: 0,
  };

  if (event.body) {
    const [parseError, parsedData] = parseBody(event.body);
    if (parseError) {
      console.error(parseError);
      return { statusCode: 400, body: renderHTML(parseError, data) };
    }

    data.originalAmount = parsedData.originalAmount;

    const validationError = validate(parsedData);
    if (validationError) {
      console.error(validationError);
      return { statusCode: 400, body: renderHTML(validationError, data) };
    }

    data = parsedData;
  }

  data.result = data.amount * currencies[data.source].rate / currencies[data.target].rate;

  return { statusCode: 200, body: renderHTML(null, data) };
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

  const originalAmount = amountKeyValue[1];
  const amount = Number(originalAmount);
  if (isNaN(amount)) {
    return [{ message: "Invalid amount." }, {}];
  }

  const sourceKeyValue = params[1].split("=");
  if (sourceKeyValue.length != 2) {
    return [{ message: "Missing source." }, {}];
  }

  const source = parseInt(sourceKeyValue[1]);
  if (isNaN(source)) {
    return [{ message: "Invalid source." }, {}];
  }

  const targetKeyValue = params[2].split("=");
  if (targetKeyValue.length != 2) {
    return [{ message: "Missing target." }, {}];
  }

  const target = parseInt(targetKeyValue[1]);
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

function renderHTML(error, { originalAmount, amount, source, target, result }) {
  return `
    <!DOCTYPE html>
    <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video game currency converter</title>
        <link rel="stylesheet" href="/style.css">
      </head>

      <body>
        <h1>Video game currency converter</h1>

        <section>
        <form method="post">
          <label>
            <span>Amount:</span>
            <input type="text" name="amount" value="${amount}">
          </label>
          ${renderCurrencySelect("source", source, "From")}
          ${renderCurrencySelect("target", target, "To")}
          ${error
      ? `<h2 style="color: red;">${error.message}</h2>`
      : `<h2>${amount} ${currencies[source].name} = <b>${result} ${currencies[target].name}</b></h2>`
    }
          <button type="submit">Convert</button>
        </form>
        </section>
      </body>
    </html>
  `;
}

function renderCurrencySelect(name, value, label) {
  return `
      <label>
        <span>${label}:</span>
        <select name="${name}">
          ${currencies.map((currency, currencyIndex) => {
    return `<option value="${currencyIndex}" ${currencyIndex == value ? "selected" : ""}>${currency.name}</option>`
  }).join("\n")}
        </select>
      </label>
    `;
}

module.exports = { handler };
