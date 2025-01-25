import React from "react";

const FeedbackDisplay = ({ analysis }) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 border rounded">
      <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
      <p>
        <strong>Grade:</strong> {analysis.grade}
      </p>
      <p>
        <strong>Feedback:</strong> {analysis.feedback}
      </p>
      <p>
        <strong>Model Answer:</strong> {analysis.modelAnswer}
      </p>
    </div>
  );
};

export default FeedbackDisplay;
