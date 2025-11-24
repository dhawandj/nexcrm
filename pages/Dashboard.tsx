import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Briefcase } from 'lucide-react';
import { storage } from '../services/storage';
import { DealStage } from '../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Load data from storage on render
  const deals = storage.getDeals();
  const tasks = storage.getTasks();

  const { totalValue, activeDeals, wonDeals, pendingTasks, chartData } = useMemo(() => {
    const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
    const activeDeals = deals.length;
    const wonDeals = deals.filter(d => d.stage === DealStage.WON).length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;

    const chartData = [
      { name: 'New', count: deals.filter(d => d.stage === DealStage.NEW).length },
      { name: 'Qualified', count: deals.filter(d => d.stage === DealStage.QUALIFIED).length },
      { name: 'Proposal', count: deals.filter(d => d.stage === DealStage.PROPOSAL).length },
      { name: 'Negotiation', count: deals.filter(d => d.stage === DealStage.NEGOTIATION).length },
      { name: 'Won', count: wonDeals },
    ];

    return { totalValue, activeDeals, wonDeals, pendingTasks, chartData };
  }, [deals, tasks]);

  const StatCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${trendUp ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
          {trendUp ? <ArrowUpRight size={16} className="ml-1" /> : <ArrowDownRight size={16} className="ml-1" />}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pipeline" 
          value={`$${totalValue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12.5%" 
          trendUp={true} 
        />
        <StatCard 
          title="Active Deals" 
          value={activeDeals} 
          icon={Briefcase} 
          trend="+4.3%" 
          trendUp={true} 
        />
        <StatCard 
          title="Won Deals" 
          value={wonDeals} 
          icon={Users} 
          trend="+2.1%" 
          trendUp={true} 
        />
        <StatCard 
          title="Pending Tasks" 
          value={pendingTasks} 
          icon={ArrowUpRight} 
          trend="-5%" 
          trendUp={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Deals by Stage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <input 
                  type="checkbox" 
                  checked={task.status === 'done'}
                  readOnly 
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">Due {task.due_date}</p>
                </div>
                <div className={`
                  ml-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold
                  ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('tasks')}
            className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};