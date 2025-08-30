import React from "react";
import { Star, TrendingUp, AlertTriangle, Award } from "lucide-react";

const AnalysisResults = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Analyzing your resume...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Analyze
          </h3>
          <p className="text-gray-500">
            Upload your resume to see detailed analysis results
          </p>
        </div>
      </div>
    );
  }

  if (analysis.error) {
    return (
      <div className="card">
        <div className="flex items-center text-red-600 mb-4">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-medium">Analysis Error</span>
        </div>
        <p className="text-gray-600">{analysis.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
          <Award className="h-5 w-5 text-primary-600" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.score}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            {analysis.score}/100
          </span>
        </div>

        <p className="text-gray-600 mt-2">{analysis.scoreExplanation}</p>
      </div>

      {/* Skills Detected */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Skills Detected
          </h3>
        </div>

        {analysis.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No specific skills detected</p>
        )}
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords?.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Missing Keywords
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>

          <p className="text-gray-600 mt-3 text-sm">
            Consider adding these keywords to better match the job description.
          </p>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="bg-primary-100 rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
