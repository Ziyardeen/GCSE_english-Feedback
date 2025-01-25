import { Route, Routes, Link } from "react-router-dom";
import PaperQuestionSelector from "./components/PaperQuestionSelector.jsx";
import AnalysisForm from "./components/AnalysisForm.jsx";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          AQA GCSE English Paper Practice Feedback Tool
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className="hover:underline hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/questions"
              className="hover:underline hover:text-blue-300 transition duration-300"
            >
              Analysis
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<PaperQuestionSelector />} />
          <Route path="/questions" element={<AnalysisForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
