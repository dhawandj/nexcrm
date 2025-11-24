import React, { useState } from 'react';
import { User, Building, CreditCard, Users, Save, Trash2, Mail } from 'lucide-react';
import { storage } from '../services/storage';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'org' | 'team' | 'billing'>('profile');
  
  const user = storage.getUser();
  const org = storage.getOrg();

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: ''
  });

  // Org State
  const [orgData, setOrgData] = useState({
    name: org.name,
    domain: 'acme.test',
    address: '123 Business St, Tech City'
  });

  // Team State
  const [team, setTeam] = useState<any[]>(() => storage.getTeam());
  const [inviteEmail, setInviteEmail] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, name: profileData.name, email: profileData.email };
    storage.saveUser(updatedUser);
    alert('Profile updated successfully!');
  };

  const handleOrgSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedOrg = { ...org, name: orgData.name };
    storage.saveOrg(updatedOrg);
    alert('Organization settings updated!');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
        const newMember = { 
            id: Date.now(), 
            name: '', 
            email: inviteEmail, 
            role: 'User', 
            status: 'Invited' 
        };
        const updatedTeam = [...team, newMember];
        setTeam(updatedTeam);
        storage.saveTeam(updatedTeam);
        setInviteEmail('');
    }
  };

  const removeUser = (id: number) => {
      const updatedTeam = team.filter(u => u.id !== id);
      setTeam(updatedTeam);
      storage.saveTeam(updatedTeam);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and organization preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-1">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <User size={18} />
                    My Profile
                </button>
                <button 
                    onClick={() => setActiveTab('org')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'org' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <Building size={18} />
                    Organization
                </button>
                <button 
                    onClick={() => setActiveTab('team')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'team' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <Users size={18} />
                    Team Members
                </button>
                <button 
                    onClick={() => setActiveTab('billing')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <CreditCard size={18} />
                    Billing & Plans
                </button>
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="space-y-6 max-w-lg">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Details</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-gray-200" />
                            <button type="button" className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Change Avatar
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={profileData.name} 
                                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profileData.email} 
                                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Security</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    value={profileData.currentPassword}
                                    onChange={e => setProfileData({...profileData, currentPassword: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={profileData.newPassword}
                                    onChange={e => setProfileData({...profileData, newPassword: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'org' && (
                <form onSubmit={handleOrgSave} className="space-y-6 max-w-lg">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Organization Settings</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input 
                                type="text" 
                                value={orgData.name} 
                                onChange={e => setOrgData({...orgData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    https://
                                </span>
                                <input 
                                    type="text" 
                                    value={orgData.domain} 
                                    onChange={e => setOrgData({...orgData, domain: e.target.value})}
                                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea 
                                value={orgData.address} 
                                onChange={e => setOrgData({...orgData, address: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'team' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
                    </div>

                    <form onSubmit={handleInvite} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-3">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="email" 
                                placeholder="Enter email address" 
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                required
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium whitespace-nowrap">
                            Invite User
                        </button>
                    </form>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">User</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {team.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || 'Pending...'}</div>
                                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select 
                                                defaultValue={user.role} 
                                                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
                                            >
                                                <option>Admin</option>
                                                <option>User</option>
                                                <option>Viewer</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => removeUser(user.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Remove User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'billing' && (
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Billing & Plans</h2>
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="text-indigo-600 font-bold mb-1">Current Plan</div>
                            <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                            <p className="text-indigo-700/80 mt-1">$29/month per user</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-50">
                                Manage Subscription
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                    VISA
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Visa ending in 4242</div>
                                    <div className="text-xs text-gray-500">Expires 12/2025</div>
                                </div>
                                <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                             <h3 className="font-bold text-gray-900 mb-4">Billing Contact</h3>
                             <div className="space-y-2">
                                <div className="text-sm text-gray-900 font-medium">{profileData.name}</div>
                                <div className="text-sm text-gray-500">{profileData.email}</div>
                                <div className="text-sm text-gray-500">123 Business St, Tech City</div>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};