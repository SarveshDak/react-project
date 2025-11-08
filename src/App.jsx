import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Globe, FileText, Search, Download, TrendingUp, Activity, Database, Lock, Check, X, Bell, Mail, Settings, Users, Zap } from 'lucide-react';

const generateThreatData = () => {
  const countries = ['China', 'Russia', 'USA', 'Brazil', 'India', 'North Korea', 'Iran', 'Germany', 'Vietnam', 'Turkey'];
  const malwareFamilies = ['Emotet', 'TrickBot', 'Ransomware', 'Backdoor', 'Trojan', 'Phishing Kit', 'Rootkit', 'Spyware'];
  const industries = ['Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Technology', 'Energy'];
  const threatTypes = ['Malware', 'Phishing', 'DDoS', 'Data Breach', 'Ransomware', 'SQL Injection', 'XSS Attack'];
  
  return {
    topAttackingCountries: countries.slice(0, 6).map((country, i) => ({
      country,
      attacks: Math.floor(Math.random() * 5000) + 1000,
      severity: i < 2 ? 'high' : i < 4 ? 'medium' : 'low'
    })),
    malwareTrends: malwareFamilies.slice(0, 6).map(family => ({
      name: family,
      count: Math.floor(Math.random() * 300) + 50,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 50) + 5
    })),
    threatTimeline: Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      threats: Math.floor(Math.random() * 2000) + 500,
      critical: Math.floor(Math.random() * 200) + 50,
      high: Math.floor(Math.random() * 400) + 100
    })),
    industryTargets: industries.map(industry => ({
      name: industry,
      value: Math.floor(Math.random() * 1000) + 200,
      incidents: Math.floor(Math.random() * 50) + 10
    })),
    recentThreats: Array.from({ length: 50 }, (_, i) => ({
      id: `THREAT-${String(1000 + i).padStart(4, '0')}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      source: countries[Math.floor(Math.random() * countries.length)],
      ioc: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      description: 'Suspicious activity detected from IP address'
    })),
    stats: {
      totalThreats: 24567,
      activeIOCs: 8934,
      criticalAlerts: 156,
      phishingURLs: 3421,
      blockedAttacks: 15234,
      protectedAssets: 892
    }
  };
};

const ThreatView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('free');
  const [threatData, setThreatData] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
 fetch("https://threatview-backend.onrender.com/api/threats")
    .then(res => res.json())
    .then(data => {
      console.log("Backend Data:", data);

      // AlienVault returns data.alienvault.results (array)
      setThreatData({
        recentThreats: data.alienvault.results || [],     // table/list
        severityData: [],                                 // optional (for charts)
        countryData: [],                                  // optional (for charts)
      });
    })
    .catch(err => console.error("API Fetch Error:", err));
}, []);

  
  useEffect(() => {
    if (activeTab === 'overview') {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const filteredThreats = useMemo(() => {
    let filtered = threatData.recentThreats;
    
    if (searchTerm) {
      filtered = filtered.filter(threat => 
        threat.ioc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(threat => threat.severity === severityFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(threat => threat.type === typeFilter);
    }
    
    if (countryFilter !== 'all') {
      filtered = filtered.filter(threat => threat.source === countryFilter);
    }
    
    return filtered;
  }, [searchTerm, threatData.recentThreats, severityFilter, typeFilter, countryFilter]);

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': '#dc2626',
      'High': '#f59e0b',
      'Medium': '#3b82f6',
      'Low': '#10b981'
    };
    return colors[severity] || '#6b7280';
  };

  const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const StatCard = ({ icon: Icon, title, value, trend, subtitle, locked, color }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      red: 'bg-red-50 text-red-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all relative overflow-hidden">
        {locked && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="text-center text-white">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Pro Feature</p>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-blue-50 text-blue-600'}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const PricingCard = ({ tier, price, period, features, recommended, popular }) => (
    <div className={`bg-white rounded-xl p-8 border-2 transition-all hover:shadow-xl ${
      recommended ? 'border-blue-600 shadow-lg scale-105 relative' : 'border-gray-200'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600 ml-2">/{period}</span>}
        </div>
        <p className="text-sm text-gray-600">
          {tier === 'Free' ? 'Perfect for testing' : tier === 'Pro' ? 'For growing teams' : 'Enterprise solution'}
        </p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => {
          setSelectedTier(tier.toLowerCase());
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          recommended 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {tier === 'Free' ? 'Get Started' : 'Upgrade Now'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3">
          <Check className="w-5 h-5" />
          <span className="font-medium">Live data updated successfully!</span>
          <button onClick={() => setShowNotification(false)} className="ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-10 p-2 rounded-lg backdrop-blur-sm">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">ThreatView</h1>
                <p className="text-blue-200 text-sm">Enterprise Threat Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Activity className="w-4 h-4 animate-pulse text-green-400" />
                <span className="text-sm font-medium">Live Monitoring Active</span>
              </div>
              <button className="bg-white text-blue-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'threats', label: 'Threat Feed', icon: AlertTriangle },
              { id: 'search', label: 'IoC Search', icon: Search },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'pricing', label: 'Pricing', icon: Database }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={AlertTriangle}
                title="Total Threats (24h)"
                value={threatData.stats.totalThreats}
                subtitle={`+${Math.floor(Math.random() * 500)} from yesterday`}
                color="red"
              />
              <StatCard
                icon={Database}
                title="Active IoCs"
                value={threatData.stats.activeIOCs}
                subtitle="Indicators of Compromise"
                color="blue"
              />
              <StatCard
                icon={Shield}
                title="Critical Alerts"
                value={threatData.stats.criticalAlerts}
                subtitle="Requires immediate attention"
                color="purple"
              />
              <StatCard
                icon={Zap}
                title="Blocked Attacks"
                value={selectedTier === 'free' ? '???' : threatData.stats.blockedAttacks}
                subtitle="Last 24 hours"
                color="green"
                locked={selectedTier === 'free'}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Weekly Threat Trend</h2>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={threatData.threatTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="threats" stroke="#3b82f6" strokeWidth={3} name="Total Threats" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={3} name="Critical" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Top Attack Sources</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={threatData.topAttackingCountries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="country" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="attacks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Malware Family Distribution</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={threatData.malwareTrends}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {threatData.malwareTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Targeted Industries</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={threatData.industryTargets} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Critical Threats</h2>
              <div className="space-y-3">
                {threatData.recentThreats.filter(t => t.severity === 'Critical').slice(0, 5).map((threat) => (
                  <div key={threat.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:border-red-300 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{threat.type} - {threat.id}</p>
                        <p className="text-xs text-gray-600 mt-1">{threat.description} from {threat.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                        CRITICAL
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Filter Threats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select 
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Threat Type</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Malware">Malware</option>
                    <option value="Phishing">Phishing</option>
                    <option value="DDoS">DDoS</option>
                    <option value="Ransomware">Ransomware</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source Country</label>
                  <select 
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Countries</option>
                    <option value="China">China</option>
                    <option value="Russia">Russia</option>
                    <option value="USA">USA</option>
                    <option value="Brazil">Brazil</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Real-time Threat Feed</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {filteredThreats.length} threats - Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export CSV</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Threat ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">IoC</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredThreats.slice(0, 15).map((threat) => (
                      <tr key={threat.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono font-medium text-gray-900">{threat.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {new Date(threat.timestamp).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{threat.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-3 py-1 text-xs font-bold rounded-full"
                            style={{
                              backgroundColor: `${getSeverityColor(threat.severity)}15`,
                              color: getSeverityColor(threat.severity)
                            }}
                          >
                            {threat.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{threat.source}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600 hover:underline cursor-pointer">{threat.ioc}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">IoC Database Search</h2>
                <p className="text-gray-600 mb-6">Search for IP addresses, domains, file hashes, or URLs in our threat intelligence database</p>
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter IP address, domain, hash, or URL..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {searchTerm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Search Results ({filteredThreats.length} found)
                </h3>
                <div className="space-y-4">
                  {filteredThreats.slice(0, 10).map((threat) => (
                    <div key={threat.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded-full"
                              style={{
                                backgroundColor: `${getSeverityColor(threat.severity)}20`,
                                color: getSeverityColor(threat.severity)
                              }}
                            >
                              {threat.severity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{threat.type}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{threat.source}</span>
                          </div>
                          <p className="text-sm font-mono text-gray-900 mb-1">{threat.ioc}</p>
                          <p className="text-xs text-gray-500">
                            Detected: {new Date(threat.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Threat Intelligence Reports</h2>
                
                <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Custom Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Weekly Summary</option>
                        <option>Monthly Overview</option>
                        <option>Quarterly Analysis</option>
                        <option>Custom Date Range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>PDF</option>
                        <option>CSV</option>
                        <option>JSON</option>
                        <option>Excel (XLSX)</option>
                      </select>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-md">
                    <Download className="w-5 h-5" />
                    <span>Generate Report</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Weekly Threat Summary - Nov 1-7, 2025', size: '2.4 MB', date: '2 days ago' },
                      { title: 'October 2025 Security Overview', size: '5.1 MB', date: '8 days ago' },
                      { title: 'Q4 2025 Threat Landscape Analysis', size: '8.7 MB', date: '12 days ago' },
                      { title: 'Critical Vulnerabilities Report - October', size: '1.9 MB', date: '15 days ago' }
                    ].map((report, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 transition-colors bg-white">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{report.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{report.size} • Generated {report.date}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-2 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Protection Level</h2>
              <p className="text-lg text-gray-600">
                From startups to enterprises, we have a plan that fits your security needs and budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <PricingCard
                tier="Free"
                price="$0"
                period={null}
                features={[
                  '24-hour threat data access',
                  'Basic dashboard analytics',
                  'Up to 3 custom alerts',
                  'Community support forum',
                  'Weekly email summaries',
                  'Limited IoC search (10/day)'
                ]}
                recommended={false}
                popular={false}
              />
              
              <PricingCard
                tier="Pro"
                price="$49"
                period="month"
                features={[
                  'Unlimited historical data',
                  'Real-time threat alerts',
                  'Advanced filtering and search',
                  'CSV/JSON data export',
                  'Priority email support',
                  'Custom IoC monitoring',
                  'API access (1000 calls/day)',
                  'Advanced visualizations',
                  'Threat trend analysis'
                ]}
                recommended={true}
                popular={true}
              />
              
              <PricingCard
                tier="Business"
                price="$199"
                period="month"
                features={[
                  'All Pro features included',
                  'Team management (up to 10 users)',
                  'Unlimited API access',
                  'White-label custom reports',
                  'Dedicated account manager',
                  'Custom integrations support',
                  'SLA guarantee (99.9% uptime)',
                  '24/7 phone support',
                  'Advanced threat hunting',
                  'Compliance reporting'
                ]}
                recommended={false}
                popular={false}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detailed Feature Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 text-sm font-bold text-gray-900">Feature</th>
                      <th className="text-center py-4 px-6 text-sm font-bold text-gray-900">Free</th>
                      <th className="text-center py-4 px-6 text-sm font-bold text-blue-600 bg-blue-50">Pro</th>
                      <th className="text-center py-4 px-6 text-sm font-bold text-gray-900">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: 'Threat Data Access', free: '24 hours', pro: 'Unlimited', business: 'Unlimited' },
                      { feature: 'Custom Alerts', free: '3', pro: 'Unlimited', business: 'Unlimited' },
                      { feature: 'Data Export', free: '✗', pro: '✓', business: '✓' },
                      { feature: 'API Access', free: '✗', pro: '1000/day', business: 'Unlimited' },
                      { feature: 'Team Members', free: '1', pro: '1', business: '10' },
                      { feature: 'Support Level', free: 'Community', pro: 'Email', business: '24/7 Phone' },
                      { feature: 'Historical Data', free: '✗', pro: '90 days', business: 'Unlimited' },
                      { feature: 'Custom Reports', free: '✗', pro: 'Basic', business: 'White-label' },
                      { feature: 'SLA Guarantee', free: '✗', pro: '✗', business: '99.9%' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{row.feature}</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-600">{row.free}</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-900 bg-blue-50 font-medium">{row.pro}</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-600">{row.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">Need a Custom Enterprise Solution?</h3>
              <p className="text-blue-100 mb-6">
                For organizations with unique requirements, we offer tailored enterprise packages with dedicated infrastructure, custom integrations, and premium support.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                Contact Sales Team
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-xl font-bold">ThreatView</span>
              </div>
              <p className="text-gray-400 text-sm">
                Enterprise-grade threat intelligence for businesses of all sizes. Protect your assets with real-time threat monitoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Threat Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 ThreatView. All rights reserved. Built with enterprise security in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThreatView;