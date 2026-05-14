import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { FileUp, Check, Loader, Sparkles, Cpu, Upload } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/resume/skills').then(r => {
      setSkills(r.data.skills || []);
      setFetching(false);
    }).catch(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSkills(res.data.skills || []);
      setMessage('Resume uploaded and parsed successfully!');
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin mb-4" />
      <p className="text-gray-600 animate-pulse text-3d text-black font-bold">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black w-full">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-black text-3d mb-1">Resume Upload</h1>
          <p className="text-gray-600 text-sm text-black text-3d font-semibold">Upload your resume to get AI-personalized interview questions</p>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-50 shadow-md border border-gray-200 rounded-xl p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-50" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-3d">Upload your resume (PDF)</p>
            <p className="text-gray-600 text-xs text-3d font-semibold">Our AI will extract your skills and create targeted questions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-primary-500/50 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-100'}`}>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="hidden" id="resume-input" />
            <label htmlFor="resume-input" className="cursor-pointer flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${file ? 'bg-primary-100' : 'bg-white shadow-sm border border-gray-200'}`}>
                <FileUp className={`w-6 h-6 transition-all ${file ? 'text-primary-600' : 'text-gray-400'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-3d">{file ? file.name : 'Click to select PDF file'}</span>
              {file && <span className="text-xs text-primary-400 flex items-center gap-1"><Check className="w-3 h-3" /> Ready to upload</span>}
            </label>
          </div>
          <button type="submit" disabled={loading || !file} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:hover:scale-100 rounded-2xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02]">
            {loading ? <Loader className="w-5 h-5 animate-spin text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            {loading ? 'AI is parsing your resume...' : 'Upload & Extract Skills'}
          </button>
        </form>
        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-4 p-4 rounded-xl text-sm flex items-center gap-2 border ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-700 font-bold text-3d' : 'bg-red-50 border-red-200 text-red-700 font-bold text-3d'}`}
          >
            {message.includes('success') ? <Check className="w-4 h-4 shrink-0" /> : null}
            {message}
          </motion.div>
        )}
      </motion.div>

      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-black text-3d">Extracted Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm font-bold text-primary-700 text-3d shadow-sm hover:border-primary-300 transition cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
