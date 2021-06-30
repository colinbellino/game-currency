const { parseParams } = require("./server.js");

async function handler(event, context, callback) {
  if (Object.keys(event.multiValueQueryStringParameters).length == 0) {
    return { statusCode: 301, headers: { Location: `/` } };
  }

  const [parseError, inputs] = parseParams(event.multiValueQueryStringParameters);
  if (parseError != null) {
    console.error(parseError);
    return { statusCode: 301, headers: { Location: `/` } };
  }
  
  return {
    statusCode: 301,
    headers: {
      Location: `/?amount=${inputs.amount}&source=${inputs.target}&target=${inputs.source}`
    },
  };
};

module.exports = { handler };