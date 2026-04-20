import axios from 'axios';

// Base URL for all API calls. During development, backend runs on 8000.
// In production you'd change this to your deployed backend URL.
const API_BASE = 'http://localhost:8000';

/**
 * Sends the resume file and job description to the backend.
 * 
 * WHY FormData? Because we're sending a file + text together.
 * JSON can only hold strings/numbers/objects — not binary file data.
 * FormData is the browser standard for mixed file+text submissions.
 * 
 * onUploadProgress: axios fires this callback as bytes are uploaded,
 * letting us show a progress bar.
 */
export async function analyzeResume(resumeFile, jobDescription, onProgress) {
  const formData = new FormData();
  formData.append('resume', resumeFile);           // the File object
  formData.append('job_description', jobDescription); // plain text

  const response = await axios.post(
    `${API_BASE}/api/resume/analyze`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percent);
        }
      },
      timeout: 120000, // 2 minutes — LLM calls can be slow
    }
  );

  return response.data;
}

export async function checkHealth() {
  const response = await axios.get(`${API_BASE}/api/resume/health`);
  return response.data;
}