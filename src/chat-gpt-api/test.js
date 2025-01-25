// Replace with your Hugging Face API key
const API_KEY = import.meta.env.VITE_APP_HUGGINGFACE_API_KEY;
console.log(API_KEY, "?????");

// Replace with the model endpoint you want to test
const MODEL_ENDPOINT =
  "https://api-inference.huggingface.co/models/google-bert/bert-base-uncased";

async function analyzeSimpleQuestion() {
  const question = "What is matter?";
  console.log("Question:", question);

  const prompt = `Explain the following question as a teacher would explain to a GCSE student: ${question}`;

  try {
    const result = await fetch(MODEL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await result.json();

    if (data.error) {
      console.error("Error from API:", data.error);
      return;
    }

    const explanation = data.choices?.[0]?.text || "No response received.";
    console.log("Response:", explanation);
  } catch (error) {
    console.error("Error during API call:", error.message);
  }
}

// Run the test
analyzeSimpleQuestion();
