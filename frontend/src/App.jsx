import React, { useState } from "react";
import UploadSection from "./components/UploadSection";
import JobDescriptionInput from "./components/JobDescriptionInput";
import AnalysisResults from "./components/AnalysisResults";
import { FileText, Brain, Target } from "lucide-react";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-900 p-2.5 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Resume Analyzer
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Analyze Your Resume with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get instant insights on skills, missing
            keywords, and overall score
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-gray-300 hover:shadow-lg transition-all duration-200 group">
            <div className="bg-gray-50 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-200">
              <FileText className="h-8 w-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
              Upload Resume
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Support for PDF and DOCX formats
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-gray-300 hover:shadow-lg transition-all duration-200 group">
            <div className="bg-gray-50 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-200">
              <Brain className="h-8 w-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
              AI Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced AI-powered resume analysis
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-gray-300 hover:shadow-lg transition-all duration-200 group">
            <div className="bg-gray-50 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-200">
              <Target className="h-8 w-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
              Job Matching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compare against job descriptions
            </p>
          </div>
        </div>

        {/* Upload and Analysis Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <UploadSection
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              analysis={analysis}
              setAnalysis={setAnalysis}
              jobDescription={jobDescription}
              loading={loading}
              setLoading={setLoading}
            />
            <JobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />
          </div>

          <div>
            <AnalysisResults analysis={analysis} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
