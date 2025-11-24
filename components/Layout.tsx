import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  LogOut,
  Check,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { storage } from '../services/storage';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => storage.getNotifications());
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{type: string, id: number, title: string, sub: string, icon: any}[]>([]);

  // Read from storage on render to reflect changes
  const user = storage.getUser();
  const org = storage.getOrg();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'deals', label: 'Deals', icon: Kanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    storage.saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    storage.saveNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const term = query.toLowerCase();
    const allContacts = storage.getContacts();
    const allDeals = storage.getDeals();
    const allTasks = storage.getTasks();
    
    const contacts = allContacts
      .filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      .map(c => ({ type: 'contacts', id: c.id, title: c.name, sub: c.company, icon: Users }));

    const deals = allDeals
      .filter(d => d.title.toLowerCase().includes(term))
      .map(d => ({ type: 'deals', id: d.id, title: d.title, sub: `$${d.value.toLocaleString()}`, icon: Kanban }));

    const tasks = allTasks
      .filter(t => t.title.toLowerCase().includes(term))
      .map(t => ({ type: 'tasks', id: t.id, title: t.title, sub: t.due_date, icon: CheckSquare }));

    setSearchResults([...contacts, ...deals, ...tasks]);
  };

  const handleResultClick = (page: string) => {
    onNavigate(page);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="font-bold text-lg tracking-tight">Nexus CRM</span>
          </div>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            {org.name}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activePage === item.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full bg-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-white"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setSearchResults([]), 200)}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Results ({searchResults.length})
                    </div>
                    {searchResults.map((result) => (
                    <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result.type)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-indigo-500"
                    >
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md shrink-0">
                            <result.icon size={16} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                            <div className="text-xs text-gray-500 truncate">{result.sub}</div>
                        </div>
                    </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="relative text-gray-500 hover:text-gray-700 transition-colors p-1"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animation-fade-in origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scroll">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0 ${notification.read ? 'opacity-70' : 'bg-blue-50/30'}`}
                          >
                            <div className="flex gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                  <p className="text-sm font-medium text-gray-900 truncate pr-2">
                                    {notification.title}
                                  </p>
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {notification.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-gray-100 bg-gray-50/30 text-center">
                        <button 
                          onClick={handleClearNotifications}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium py-1"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};