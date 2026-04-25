import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Plus, Building, Edit2, Trash2, X } from 'lucide-react';

const JobTracker = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState({ company: '', role: '', status: 'Applied' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('job_applications')
          .update({ company: currentJob.company, role: currentJob.role, status: currentJob.status })
          .eq('id', currentJob.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_applications')
          .insert([{ 
            user_id: user.id, 
            company: currentJob.company, 
            role: currentJob.role, 
            status: currentJob.status 
          }]);
        if (error) throw error;
      }
      setShowModal(false);
      fetchJobs();
      setCurrentJob({ company: '', role: '', status: 'Applied' });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const { error } = await supabase.from('job_applications').delete().eq('id', id);
        if (error) throw error;
        setJobs(jobs.filter(j => j.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setIsEditing(true);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Interview': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
          <p className="text-slate-400">Track and manage your active applications.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentJob({ company: '', role: '', status: 'Applied' });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Application</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center text-primary-500 mt-20">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md">You haven't added any job applications. Start tracking your job hunt by adding your first application.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-secondary"
          >
            Add Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="card p-5 group hover:border-primary-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white line-clamp-1">{job.role}</h3>
                    <p className="text-sm text-slate-400">{job.company}</p>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(job)} className="p-1.5 text-slate-400 hover:text-primary-400 bg-dark-700 hover:bg-dark-600 rounded-md">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-1.5 text-slate-400 hover:text-red-400 bg-dark-700 hover:bg-dark-600 rounded-md">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Application' : 'New Application'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={currentJob.company}
                  onChange={e => setCurrentJob({...currentJob, company: e.target.value})}
                  placeholder="e.g. Google, Stripe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Role / Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={currentJob.role}
                  onChange={e => setCurrentJob({...currentJob, role: e.target.value})}
                  placeholder="e.g. Frontend Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                <select
                  className="input-field"
                  value={currentJob.status}
                  onChange={e => setCurrentJob({...currentJob, status: e.target.value})}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary py-2.5">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-2.5">
                  {isEditing ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;
