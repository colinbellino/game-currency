const handler = async (event, context, callback) => {
  return { statusCode: 200, body: renderHTML() };
};


function renderHTML() {
  return `
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <pre>

          </pre>

          <script type="module">
            import * as bla from "/public/shared.js";

            console.log('bla : ', bla);
            // console.log('result:', renderResult({name:"USD"}, {name:"EUR"}, 0, 2));
          </script>
        </body>
      </html>
    `;
}

module.exports = { handler };