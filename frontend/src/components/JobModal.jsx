import React from 'react';
import { X } from 'lucide-react';

const JobModal = ({ isEditing, currentJob, setCurrentJob, handleSubmit, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Application' : 'New Application'}</h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-white">
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
            <button type="button" onClick={closeModal} className="flex-1 btn-secondary py-2.5">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary py-2.5">
              {isEditing ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
