import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { analyzeJobDescription } from '../utils/skillAnalyzer';
import { Search, Sparkles, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const SkillAnalyzer = () => {
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!description.trim()) {
      setError('Please paste a job description first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Analyze locally using the imported utility function
      const analysis = analyzeJobDescription(description, user?.skills || []);
      setResults(analysis);
    } catch (err) {
      setError('Failed to analyze job description.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
          Skill Gap Analyzer <Sparkles className="h-6 w-6 text-primary-400" />
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Paste a job description below. Our AI-powered engine will extract the required skills, compare them with your profile, and tell you exactly what you need to learn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col h-full">
          <div className="card flex-1 p-6 flex flex-col relative">
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              Job Description text
            </label>
            
            <textarea
              className="w-full flex-1 bg-dark-900 border border-dark-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none min-h-[300px]"
              placeholder="Paste the requirements, responsibilities, and qualifications here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="mt-6 w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>{loading ? 'Analyzing...' : 'Analyze Requirements'}</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col">
          {results ? (
            <div className="card p-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-dark-900 border-[8px] border-dark-700 relative mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-dark-700" />
                    <circle 
                      cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" 
                      className={`${results.matchScore >= 70 ? 'text-emerald-500' : results.matchScore >= 40 ? 'text-amber-500' : 'text-red-500'}`}
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * results.matchScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">{results.matchScore}%</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">Profile Match</h2>
                <p className="text-slate-400 text-sm mt-1">Based on {results.requiredSkills.length} identified skills</p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="flex items-center gap-2 text-emerald-400 font-medium mb-3">
                    <CheckCircle2 className="h-5 w-5" />
                    Skills You Have ({results.matchedSkills.length})
                  </h3>
                  {results.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.matchedSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No matching skills found in your profile.</p>
                  )}
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-red-400 font-medium mb-3">
                    <XCircle className="h-5 w-5" />
                    Missing Skills to Learn ({results.missingSkills.length})
                  </h3>
                  {results.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-500 text-sm">You have all the required skills! 🎉</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-dark-600 bg-transparent">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Awaiting Description</h3>
              <p className="text-slate-500 max-w-sm">Paste a job description on the left and click analyze to see your skill match.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAnalyzer;
