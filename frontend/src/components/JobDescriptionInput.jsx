import React from "react";
import { Briefcase } from "lucide-react";

const JobDescriptionInput = ({ jobDescription, setJobDescription }) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Job Description (Optional)
        </h3>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here to get more targeted analysis..."
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />

      <p className="text-sm text-gray-500 mt-2">
        Adding a job description will help identify missing keywords and improve
        matching accuracy.
      </p>
    </div>
  );
};

export default JobDescriptionInput;
