import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaperQuestionSelector: React.FC = () => {
  const [paper, setPaper] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [sourceA, setSourceA] = useState<string>("");
  const [sourceB, setSourceB] = useState<string>("");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accepted = localStorage.getItem("disclaimerAccepted");
    if (accepted === "true") {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handlePaperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaper(e.target.value);
  };

  const handleSubmit = () => {
    if (paper === "1" && source) {
      navigate("/questions", {
        state: { outcome: { paper, sources: [source] } },
      });
    } else if (paper === "2" && sourceA && sourceB) {
      navigate("/questions", {
        state: { outcome: { paper, sources: [sourceA, sourceB] } },
      });
    } else {
      alert("Please provide all required sources for the selected paper.");
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    localStorage.setItem("disclaimerAccepted", "true");
  };

  const handleDisclaimerDecline = () => {
    alert("You must accept the disclaimer to continue using the app.");
  };

  if (!disclaimerAccepted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
          <p className="text-sm mb-4">
            This app is designed to support students in their learning journey
            by providing guidance, feedback, and insights based on their
            responses. Please note the following:
            <ul className="list-disc pl-4">
              <li>
                This app is intended to encourage self-reflection and practice.
              </li>
              <li>
                The feedback generated should not be considered a definitive
                assessment of your abilities.
              </li>
              <li>
                All input data is processed temporarily and not retained after
                use.
              </li>
              <li>
                This app is not a substitute for professional assessments from
                educators or mentors.
              </li>
            </ul>
          </p>
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700"
              onClick={handleDisclaimerAccept}
            >
              Accept
            </button>
            <button
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={handleDisclaimerDecline}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Select Paper</h2>
      <div id="select-paper">
        <label className="block text-lg font-medium mb-2" htmlFor="paper">
          Select Paper:
        </label>
        <select
          name="paper"
          id="paper"
          value={paper}
          onChange={handlePaperChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Select Paper --</option>
          <option value="1">Paper 1</option>
          <option value="2">Paper 2</option>
        </select>
      </div>
      {paper === "1" && (
        <div id="source-container">
          <h1 className="text-lg font-medium mb-2">Paste Source:</h1>
          <textarea
            className="w-full p-2 border rounded mb-4"
            placeholder="Paste Source Here"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          ></textarea>
        </div>
      )}
      {paper === "2" && (
        <div>
          <h1 className="text-lg font-medium mb-2">Paste Both Sources:</h1>
          <div id="source-A-container" className="mb-4">
            <label htmlFor="source-A" className="block font-medium mb-2">
              Source A:
            </label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Paste Source A Here"
              value={sourceA}
              onChange={(e) => setSourceA(e.target.value)}
            ></textarea>
          </div>
          <div id="source-B-container" className="mb-4">
            <label htmlFor="source-B" className="block font-medium mb-2">
              Source B:
            </label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Paste Source B Here"
              value={sourceB}
              onChange={(e) => setSourceB(e.target.value)}
            ></textarea>
          </div>
        </div>
      )}
      <button
        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default PaperQuestionSelector;
