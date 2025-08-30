import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";

const UploadSection = ({
  uploadedFile,
  setUploadedFile,
  analysis,
  setAnalysis,
  jobDescription,
  loading,
  setLoading,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        analyzeResume(file);
      }
    },
    [jobDescription]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const analyzeResume = async (file) => {
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysis({
        error: "Failed to analyze resume. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Your Resume
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400"
        }`}
      >
        <input {...getInputProps()} />

        {uploadedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <File className="h-8 w-8 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your resume here, or click to select
            </p>
            <p className="text-gray-500">Supports PDF and DOCX files</p>
          </div>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => analyzeResume(uploadedFile)}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </span>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
