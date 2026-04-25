import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { User, Code2, Plus, X } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim().toLowerCase())) {
      setSkills([...skills, newSkill.trim().toLowerCase()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const saveSkills = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, skills });
      setMessage('Skills updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update skills');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
        <p className="text-slate-400">Manage your skills to get better analysis for job descriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="card p-6 md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-dark-700 border-4 border-primary-500/20 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
            <div className="w-full bg-dark-700 rounded-lg p-3 text-left">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Skills</div>
              <div className="text-2xl font-bold text-primary-400">{skills.length}</div>
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="card p-6 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <Code2 className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-bold text-white">Skill Arsenal</h2>
          </div>

          <form onSubmit={handleAddSkill} className="flex space-x-2 mb-6">
            <input
              type="text"
              className="input-field"
              placeholder="Add a new skill (e.g., React, Node.js)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="submit" className="btn-primary flex items-center space-x-1 shrink-0">
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>
          </form>

          <div className="bg-dark-900/50 rounded-xl p-4 min-h-[200px] border border-dark-700">
            {skills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 pt-10">
                <Code2 className="h-10 w-10 mb-2 opacity-50" />
                <p>No skills added yet. Add some above!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="bg-dark-700 border border-dark-600 text-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm group transition-all hover:border-primary-500/50">
                    <span>{skill}</span>
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
            <button onClick={saveSkills} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
