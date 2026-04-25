import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchJobs();
  }, [user]);

  if (loading) return <div className="text-primary-500 flex justify-center mt-20">Loading Dashboard...</div>;

  const totalJobs = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'Applied').length;
  const interviewCount = jobs.filter(j => j.status === 'Interview').length;
  const rejectedCount = jobs.filter(j => j.status === 'Rejected').length;
  const acceptedCount = jobs.filter(j => j.status === 'Accepted').length;

  const statusData = [
    { name: 'Applied', value: appliedCount, color: '#3b82f6' },
    { name: 'Interview', value: interviewCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
    { name: 'Accepted', value: acceptedCount, color: '#10b981' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Applied', count: appliedCount },
    { name: 'Interview', count: interviewCount },
    { name: 'Rejected', count: rejectedCount },
    { name: 'Accepted', count: acceptedCount },
  ];

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="card p-6 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-400">Here's an overview of your job search progress.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={totalJobs} 
          icon={<Briefcase className="h-6 w-6 text-blue-400" />} 
          colorClass="bg-blue-500/10 border border-blue-500/20"
        />
        <StatCard 
          title="In Progress" 
          value={appliedCount + interviewCount} 
          icon={<Clock className="h-6 w-6 text-amber-400" />} 
          colorClass="bg-amber-500/10 border border-amber-500/20"
        />
        <StatCard 
          title="Offers" 
          value={acceptedCount} 
          icon={<CheckCircle className="h-6 w-6 text-emerald-400" />} 
          colorClass="bg-emerald-500/10 border border-emerald-500/20"
        />
        <StatCard 
          title="Rejected" 
          value={rejectedCount} 
          icon={<XCircle className="h-6 w-6 text-red-400" />} 
          colorClass="bg-red-500/10 border border-red-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Application Status Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 col-span-1">
          <h3 className="text-lg font-bold text-white mb-6">Success Rate</h3>
          {totalJobs === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              No data available
            </div>
          ) : (
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">
                  {totalJobs > 0 ? Math.round((acceptedCount / totalJobs) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400">Win Rate</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
