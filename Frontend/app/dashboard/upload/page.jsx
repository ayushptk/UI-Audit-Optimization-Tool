'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile } from '../../lib/upload';
import { analyzeDesignById } from '../../lib/analyze';
import ScanningAnimation from '../../components/ScanningAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiImage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef(null);
  const [status, setStatus] = useState("Uploading…");

  useEffect(() => {
    if (!isAnalyzing) return;

    // Simulate progress
    const labels = [
      "Uploading design assets...",
      "Preprocessing layers...",
      "Analyzing typography hierarchy...",
      "Evaluating spacing & grid...",
      "Checking color contrast accessibility...",
      "Assessing layout consistency...",
      "Finalizing audit report...",
    ];

    const t = setInterval(() => {
      setProgress((p) => {
        const newProgress = p + (Math.random() * 5);
        return Math.min(98, newProgress);
      });
      setStatus(labels[Math.floor(Math.random() * labels.length)]);
    }, 800);

    return () => clearInterval(t);
  }, [isAnalyzing]);


  const onFilesAdd = (incoming) => {
    if (incoming.length > 0) {
      setSelectedFile(incoming[0]);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      onFilesAdd(e.dataTransfer.files);
    }
  };

  const handleBrowse = (e) => {
    if (e.target.files?.length) {
      onFilesAdd(e.target.files);
      // reset input so selecting same file again triggers change
      e.target.value = '';
    }
  };

  const humanSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let b = bytes;
    while (b >= 1024 && i < units.length - 1) {
      b /= 1024;
      i++;
    }
    return `${b.toFixed(b < 10 ? 1 : 0)} ${units[i]}`;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "application/octet-stream", // for .fig files
    ];

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".fig")) {
      setError("File type not allowed. Please upload PNG, JPG, SVG or .fig files.");
      return;
    }

    setError("");
    setMessage("");
    setProgress(0);

    try {
      const token = localStorage.getItem("access_token");

      // Upload file
      const uploadResponse = await uploadFile(selectedFile, token, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // We'll let the simulation take over for the "analysis" part, so just go up to 30% for upload
        setProgress(Math.min(30, percentCompleted));
      });

      // Start analyzing animation
      setIsAnalyzing(true);

      // Analyze the uploaded file by design id
      await analyzeDesignById(uploadResponse.id, token);

      setProgress(100);
      setStatus("Analysis complete!");
      setMessage("Upload and analysis successful!");

      // Small delay to show 100%
      setTimeout(() => {
        setIsAnalyzing(false);
        setSelectedFile(null);
        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = '';
        }

        // Navigate to reports page with dynamic id
        const reportId = uploadResponse.id || '1';
        router.push(`/dashboard/reports/${reportId}`);
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.detail || "Upload or analysis failed. Please try again.");
      setProgress(0);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-outfit text-slate-900 tracking-tight mb-3">
            Upload Design
          </h1>
          <p className="text-slate-500 text-lg">
            Upload your UI design to get instant AI-powered feedback.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          {/* Glassmorphism decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="p-8 md:p-12 relative z-10">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !selectedFile && inputRef.current?.click()}
              className={`
                relative group cursor-pointer
                flex flex-col items-center justify-center gap-4
                rounded-2xl border-2 border-dashed transition-all duration-300
                h-80 w-full
                ${isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                  : selectedFile
                    ? 'border-slate-200 bg-slate-50/30'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleBrowse}
                accept=".png,.jpg,.jpeg,.pdf,.fig"
              />

              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300
                      ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}
                    `}>
                      <FiUploadCloud className="w-10 h-10" />
                    </div>
                    <p className="text-xl font-semibold text-slate-900 mb-2">
                      Drag & drop your design here
                    </p>
                    <p className="text-slate-500">
                      or <span className="text-indigo-600 font-medium underline decoration-2 decoration-indigo-200 underline-offset-2 group-hover:decoration-indigo-500 transition-all">browse files</span> from your computer
                    </p>
                    <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Supports PNG, JPG, PDF, FIG
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                      {selectedFile.type.startsWith('image') ? <FiImage className="w-8 h-8" /> : <FiFile className="w-8 h-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">{humanSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
                className={`
                  relative overflow-hidden group
                  px-8 py-4 rounded-xl font-semibold text-white shadow-lg shadow-indigo-200
                  transition-all duration-300
                  ${!selectedFile || isAnalyzing
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAnalyzing ? 'Analyzing...' : 'Start Audit'}
                  {!isAnalyzing && <FiCheckCircle className="w-5 h-5" />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isAnalyzing && (
        <ScanningAnimation
          progress={progress}
          status={status}
          image={selectedFile?.type?.startsWith('image') ? selectedFile : undefined}
        />
      )}
    </div>
  );
}
