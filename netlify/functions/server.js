// TODO:
// Parse input (amount, source, target)
//
// Do calculations
// Inject the result in HMTL
// Send HTML in response

// Placeholder data from: https://www.reddit.com/r/gaming/comments/725t5v/exchange_rates_of_video_game_currencies/
const currencies = [
    { id: 0, name: "Euro", rate: 1.0 },
    { id: 1, name: "US Dollar", rate: 0.83675 },
    { id: 2, name: "Mineral (StarCraft)", rate: 34722222.22222 },
    { id: 3, name: "Coin (Super Mario Bros.)", rate: 100000.0 },
    { id: 4, name: "Poke Dollar (Pokémon Red/Blue)", rate: 0.00049 },
];

const handler = async(event, context, callback) => {
    let amount = 100;
    let source = 2;
    let target = 3;

    if (event.body) {
        const params = event.body.split("&");
        amount = parseInt(params[0].split("=")[1]);
        source = parseInt(params[1].split("=")[1]);
        target = parseInt(params[2].split("=")[1]);
        console.log("-> values received:", { source, target });
    }

    const result = amount * source * target;

    console.log({ amount, source, target, result });

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
      </head>

      <body>
        <h1>Video game currency converter</h1>

<pre>amount: ${amount}
source: ${JSON.stringify(currencies[source])}
target: ${JSON.stringify(currencies[target])}
result: ${result}
</pre>

        <form method="post">
          <input type="number" name="amount" value="${amount}">
          ${renderCurrencySelect("source", source)}
          ${renderCurrencySelect("target", target)}
          <button type="submit">submit</button>
        </form>
      </body>

    </html>
  `;
}

function renderCurrencySelect(name, value) {
    return `
      <select name="${name}">
        ${currencies.map((currency, currencyIndex) => {
          return `<option value="${currencyIndex}" ${currencyIndex == value ? "selected" : ""}>${currency.name}</option>`
        }).join("\n")}
      </select>
    `;
}

// () => { return 0; }
// () => ( 0 );

// bla.map(x => <MyComponent x={x == 0 ? "selected" : "bla"} />)

module.exports = { handler };