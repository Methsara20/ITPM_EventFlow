const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function analyzeEventConflict(eventDetails) {
  const prompt = `Analyze the following event details for potential scheduling conflicts:
  ${JSON.stringify(eventDetails)}`;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
  });
  return response.data.choices[0].text.trim();
}

module.exports = { analyzeEventConflict };
