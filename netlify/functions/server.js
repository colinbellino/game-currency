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
  let amount = 1;
  let source = 0;
  let target = 4;

  if (event.body) {
    const params = event.body.split("&");
    amount = parseInt(params[0].split("=")[1]);
    source = parseInt(params[1].split("=")[1]);
    target = parseInt(params[2].split("=")[1]);
    console.log("-> values received:", { source, target });
  }

  const result = amount * currencies[source].rate / currencies[target].rate;

  // console.log({ amount, source, target, result });

  return {
    statusCode: 200,
    body: renderHTML(amount, source, target, result),
  };
};

function renderHTML(amount, source, target, result) {
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
            <input type="number" name="amount" value="${amount}">
          </label>
          ${renderCurrencySelect("source", source, "From")}
          ${renderCurrencySelect("target", target, "To")}
          <button type="submit">Convert</button>
        </form>

        <h2>${amount} ${currencies[source].name} = <b>${result} ${currencies[target].name}</b></h2>
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

// () => { return 0; }
// () => ( 0 );

// bla.map(x => <MyComponent x={x == 0 ? "selected" : "bla"} />)

module.exports = { handler };