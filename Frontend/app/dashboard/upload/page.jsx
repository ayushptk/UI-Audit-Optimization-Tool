// page.jsx
'use client';

import { useState, useRef } from 'react';
import { uploadFile } from '../../lib/upload';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);


  //it checked the duplication file or not if duplicated then it will not add
  const onFilesAdd = (incoming) => {
    const list = Array.from(incoming);
    const mapped = list.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
    }));
    const existing = new Set(files.map((f) => f.id));
    const merged = [...files, ...mapped.filter((m) => !existing.has(m.id))];
    setFiles(merged);
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

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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
    if (!files) {
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

    if (!allowedTypes.includes(files.type) && !files.name.endsWith(".fig")) {
      setError("File type not allowed. Please upload png, jpg, svg or fig files.");
      return;
    }

    setError("");
    setMessage("");
    setProgress(0);

    try {
      const token = localStorage.getItem("access_token");

      await uploadFile(files, token, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      setMessage("Upload successful!");
      setFiles(null);
      setProgress(0);
      document.getElementById("fileInput").value = null;
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed.");
      setProgress(0);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full  px-4  sm:px-4 lg:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Upload Files
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Drag and drop files here, or click to browse from your device.
          </p>
        </header>

        <section
          className={[
            'rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm',
            'transition-colors',
            isDragging ? 'ring-2 ring-neutral-900/10' : '',
          ].join(' ')}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                inputRef.current?.click();
              }
            }}
            className={[
              'flex cursor-pointer flex-col items-center justify-center gap-3',
              'rounded-xl border-2 border-dashed p-10',
              isDragging
                ? 'border-neutral-900/30 bg-neutral-50'
                : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50',
              'transition-colors',
            ].join(' ')}
            aria-label="Upload files by dragging and dropping or browsing"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              {/* Minimal icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15.75A4.5 4.5 0 017.5 11.25h.75m0 0a4.5 4.5 0 018.25-1.75m-8.25 1.75h6a3.75 3.75 0 110 7.5H7.5a4.5 4.5 0 01-4.5-4.5m9-6v10.5m0 0l-3.5-3.5m3.5 3.5l3.5-3.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-900">
                Drag and drop files here
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                or click to browse. PNG, JPG, PDF up to 10MB.
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleBrowse}
              accept=".png,.jpg,.jpeg,.pdf"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-neutral-900">
                Selected files
              </div>
              <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
                {files.map(({ id, file }) => (
                  <li
                    key={id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
                        <span className="text-xs text-neutral-700">
                          {file.type.startsWith('image') ? 'IMG' : file.type.includes('pdf') ? 'PDF' : 'FILE'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {humanSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(id)}
                      className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.828-10.828a.75.75 0 00-1.06-1.06L10 7.94 8.232 6.172a.75.75 0 10-1.06 1.06L8.94 9l-1.768 1.768a.75.75 0 101.06 1.06L10 10.06l1.768 1.768a.75.75 0 101.06-1.06L11.06 9l1.768-1.768z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                   onClick={handleUpload}
                  disabled={files.length === 0}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
