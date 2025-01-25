import axios from "axios";

const apiKey = import.meta.env.VITE_COHERE_API_KEY;

export const analyzeWithCohere = async (text) => {
  const response = await axios.post(
    "https://api.cohere.ai/v1/generate",
    {
      model: "command-xlarge-nightly",
      prompt: `Analyze this GCSE English answer: "${text}" and provide feedback.`,
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data.generations[0].text;
};
