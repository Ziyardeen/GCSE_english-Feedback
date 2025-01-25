import { useState } from "react";
import { useLocation } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

interface LocationState {
  outcome?: {
    paper?: string;
    sources?: string[];
  };
}

const AnalysisForm: React.FC = () => {
  const [selectedPaper, setSelectedPaper] = useState<string>("Paper 1");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const location = useLocation();
  const { paper, sources } = (location.state as LocationState)?.outcome || {};

  if (!paper || !sources) {
    return (
      <div className="text-red-500 text-center px-4 py-6">
        Error: Missing paper or sources. Please check the input data.
      </div>
    );
  }

  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_APP_GOOGLE_API_KEY as string
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis("");

    const combinedQuestion = `${selectedQuestion}: ${customQuestion}`.trim();
    if (!combinedQuestion || !response.trim()) {
      setError("Question and response fields cannot be empty.");
      setLoading(false);
      return;
    }

    const context = sources.join("\n");
    const prompt = `
      Paper: ${paper}
      Selected Paper: ${selectedPaper}
      Question: ${combinedQuestion}
      Sources: ${context}
      Student Response: ${response}

      Your task is to:
      1. Assign a mark and level based on the AQA mark scheme.
      2. Provide concise feedback and suggestions for improvement aligned with the question's requirements.
      3. If the response is incomplete, offer a concise model answer.

      Format your response as follows:
      **Mark:** [x/y]
      **Level:** [Level]
      **Feedback:** [Provide specific feedback.]
      **Improvements:** [Identify places in my response that need improvement, ways, and examples on how to improve them.]
      **Model Answer:** [Expected response.]
    `;

    const fetchAnalysis = async () => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await model.generateContent(prompt);
          const responseData = await result.response.text();

          setAnalysis(responseData || "No response provided.");
          setLoading(false);
          return;
        } catch (err) {
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          } else {
            setError(
              "Failed to analyze the response after multiple attempts. Please try again later."
            );
            setLoading(false);
          }
        }
      }
    };

    try {
      await fetchAnalysis();
    } catch (err) {
      setError("Failed to analyze the response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionsForPaper = (
    paper: string
  ): { value: string; label: string }[] => {
    if (paper === "Paper 1") {
      return [
        { value: "Q1", label: "Q1: List four things. (4 marks)" },
        {
          value: "Q2",
          label: "Q2: How does the writer use language? (8 marks)",
        },
        { value: "Q3", label: "Q3: Analyze the structure. (8 marks)" },
        { value: "Q4", label: "Q4: Evaluate a statement. (20 marks)" },
        { value: "Q5", label: "Q5: Creative Writing Task. (40 marks)" },
      ];
    } else {
      return [
        { value: "Q1", label: "Q1: Select four true statements. (4 marks)" },
        {
          value: "Q2",
          label: "Q2: Summarize differences/similarities. (8 marks)",
        },
        {
          value: "Q3",
          label: "Q3: Analyze the writer's use of language. (12 marks)",
        },
        {
          value: "Q4",
          label: "Q4: Compare ideas and perspectives. (16 marks)",
        },
        {
          value: "Q5",
          label: "Q5: Persuasive/Argumentative Writing. (40 marks)",
        },
      ];
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Answer Form</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h3 className="text-lg font-medium mb-2">Source Text(s):</h3>
          <div className="bg-gray-100 p-4 rounded-md text-sm max-h-40 overflow-y-auto">
            {sources.map((source, index) => (
              <p key={index}>
                <strong>Source {index + 1}:</strong> {source}
              </p>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Select Paper:</label>
            <select
              value={selectedPaper}
              onChange={(e) => {
                setSelectedPaper(e.target.value);
                setSelectedQuestion("");
              }}
              className="w-full p-3 border rounded-md text-sm"
            >
              <option value="Paper 1">
                Paper 1: Explorations in Creative Reading
              </option>
              <option value="Paper 2">
                Paper 2: Writers’ Viewpoints and Perspectives
              </option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Select Question:</label>
            <select
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              className="w-full p-3 border rounded-md text-sm"
            >
              <option value="">-- Select Question --</option>
              {getQuestionsForPaper(selectedPaper).map((question) => (
                <option key={question.value} value={question.value}>
                  {question.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Provide Your Question:
          </label>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            placeholder="Write your question here"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Your Response:</label>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            placeholder="Write your response here"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {analysis && (
        <div className="bg-white p-6 mt-6 rounded-md shadow-md text-sm max-w-4xl mx-auto">
          <h3 className="font-semibold mb-2 text-blue-700">Analysis Result:</h3>
          <p>
            <strong>Paper:</strong> {selectedPaper}
          </p>
          <p>
            <strong>Question:</strong>{" "}
            {`${selectedQuestion || "Custom"}: ${customQuestion}`}
          </p>
          <pre className="whitespace-pre-wrap mt-2">{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default AnalysisForm;
