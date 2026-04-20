import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Briefcase } from 'lucide-react';

export default function UploadSection({ onSubmit, isLoading }) {
  // useState gives this component memory. [value, setValue] pattern.
  // Whenever setValue is called, React re-renders this component.
  const [file, setFile] = useState(null);         // the resume File object
  const [jobDesc, setJobDesc] = useState('');     // textarea content
  const [error, setError] = useState('');         // validation error message

  // useCallback memoizes this function — it won't be recreated on every render.
  // This matters because we pass it to useDropzone which has its own optimization.
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles.length > 0) {
      setError('Only PDF or DOCX files are accepted (max 10MB).');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  // useDropzone handles ALL drag events, click-to-browse, file validation
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB in bytes
    multiple: false,            // only one file at a time
  });

  const handleSubmit = () => {
    // Validate before submitting
    if (!file) { setError('Please upload your resume first.'); return; }
    if (jobDesc.trim().length < 50) {
      setError('Job description must be at least 50 characters.');
      return;
    }
    setError('');
    onSubmit(file, jobDesc); // calls the function passed from App.jsx
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #e5e7eb',
      padding: '2rem',
      maxWidth: 700,
      margin: '0 auto',
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#111' }}>
        AI Resume Analyzer
      </h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
        Upload your resume and paste a job description to get an AI-powered compatibility score and personalized suggestions.
      </p>

      {/* --- Dropzone Area --- */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#2563eb' : '#d1d5db'}`,
          borderRadius: 12,
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#eff6ff' : '#f9fafb',
          transition: 'all 0.2s',
          marginBottom: 20,
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          // File selected state
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <FileText size={22} color="#2563eb" />
            <span style={{ fontWeight: 500, color: '#111', fontSize: 14 }}>{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              style={{
                background: 'none', border: 'none', color: '#9ca3af',
                display: 'flex', alignItems: 'center', padding: 2,
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          // Empty state
          <>
            <Upload size={28} color="#9ca3af" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontWeight: 500, fontSize: 14, color: '#374151' }}>
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              PDF or DOCX, up to 10MB — or click to browse
            </p>
          </>
        )}
      </div>

      {/* --- Job Description Textarea --- */}
      <label style={{ display: 'block', fontWeight: 500, fontSize: 14, marginBottom: 8, color: '#374151' }}>
        <Briefcase size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
        Job Description
      </label>
      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste the full job description here — the more detail, the better the analysis..."
        rows={6}
        style={{
          width: '100%', border: '1px solid #d1d5db', borderRadius: 10,
          padding: '12px 14px', fontSize: 14, resize: 'vertical',
          outline: 'none', color: '#111', background: '#fff',
          lineHeight: 1.6,
        }}
      />
      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>
        {jobDesc.length} characters {jobDesc.length < 50 && jobDesc.length > 0 && '(need 50+)'}
      </div>

      {/* --- Error Message --- */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, padding: '10px 14px', marginTop: 12,
          fontSize: 13, color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      {/* --- Submit Button --- */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          width: '100%', marginTop: 20, padding: '14px',
          background: isLoading ? '#93c5fd' : '#2563eb',
          color: '#fff', border: 'none', borderRadius: 10,
          fontSize: 15, fontWeight: 600,
          transition: 'background 0.2s',
        }}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Match'}
      </button>
    </div>
  );
}