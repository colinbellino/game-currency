// for each currency:
// rate
// name
// icon

const handler = (event, context, callback) => {
    let amount = 100;
    let source = 2;
    let target = 3;

    if (event.body) {
        const params = event.body.split("&");
        amount = parseInt(params[0].split("=")[1]);
        source = parseInt(params[1].split("=")[1]);
        target = parseInt(params[2].split("=")[1]);
    }

    // We could also do somthing like this:
    // const [amount, source, target] = params.map(param => {
    //     var [key, value] = param.split("=");
    //     return parseInt(value);
    // });

    console.log({
        amount,
        source,
        target,
    });

    const result = amount * source * target;

    // Parse input (amount, source, target)
    // Do calculations
    // Inject the result in HMTL
    // Send HTML in response

    return {
        statusCode: 200,
        body: renderHTML(amount, source, target, result),
    }
}

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
source: ${source}
target: ${target}
result: ${result}
</pre>

        <form action="/.netlify/functions/hello-world" method="post">
          <input type="number" name="amount" value="${amount}">
          <input type="number" name="currency_source" value="${source}">
          <input type="number" name="currency_target" value="${target}">
          <button type="submit">submit</button>
        </form>
      </body>

    </html>
  `;
}

module.exports = { handler }
