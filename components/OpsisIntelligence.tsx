'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Globe, AlertTriangle, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Play, BarChart3, Zap, Eye, Bell, Monitor, FileText, Upload, Search, Filter, Plus, Settings, Lock, Mail, Star, RefreshCw, X, Menu, Package, DollarSign, Calendar, Sliders, Layers, UserPlus, FileText as FileTextIcon, BarChart as BarChartIcon, Table
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart } from 'recharts';

// Simulate a Supabase client for demonstration purposes
const supabase = {
  auth: {
    signUp: async (email, password) => {
      console.log('Simulating Supabase signup for:', email);
      return { data: { user: { id: 'simulated-user-id', email } }, error: null };
    },
    signInWithPassword: async (email, password) => {
      console.log('Simulating Supabase signin for:', email);
      return { data: { user: { id: 'simulated-user-id', email } }, error: null };
    },
    getSession: async () => {
      // Simulate a session if in demo mode
      if (typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true') {
        return { data: { session: { user: { id: 'demo-user', email: 'demo@opsis.com' } } }, error: null };
      }
      return { data: { session: null }, error: null };
    },
    signOut: async () => {
      console.log('Simulating Supabase signout');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demoMode');
      }
      return { error: null };
    },
  },
  from: (table) => ({
    select: async () => {
      if (table === 'users') {
        return { data: [{ id: 'user1', name: 'John Doe' }], error: null };
      }
      if (table === 'suppliers') {
        return { data: [
          { id: 1, name: 'Global Logistics Inc.', location: 'Shanghai, China', industry: 'Logistics', criticality: 'Critical', risk_score: 85, threats: ['Port Congestion', 'Geopolitical Tension'], status: 'Active' },
          { id: 2, name: 'Tech Components Ltd.', location: 'Taipei, Taiwan', industry: 'Electronics', criticality: 'Important', risk_score: 72, threats: ['Chip Shortage', 'Cyber Attack Risk'], status: 'Active' },
          { id: 3, name: 'Raw Materials Corp.', location: 'Minas Gerais, Brazil', industry: 'Mining', criticality: 'Critical', risk_score: 92, threats: ['Natural Disaster', 'Supply Chain Disruption'], status: 'Active' },
          { id: 4, name: 'Packaging Solutions SA', location: 'Frankfurt, Germany', industry: 'Manufacturing', criticality: 'Standard', risk_score: 30, threats: [], status: 'Active' },
          { id: 5, name: 'Secure Software Inc.', location: 'Dublin, Ireland', industry: 'IT Services', criticality: 'Important', risk_score: 65, threats: ['Software Vulnerability'], status: 'Active' },
        ], error: null };
      }
      if (table === 'threats') {
        return { data: [
          { id: 1, title: 'Port Congestion in Shanghai', source: 'Logistics News', severity: 'High', impact: 'Shipping delays expected', date: '2025-07-10', affected_suppliers: ['Global Logistics Inc.'], type: 'Logistics' },
          { id: 2, title: 'Major Cyber Attack Targets Electronics Supplier', source: 'Cybersecurity Blog', severity: 'Critical', impact: 'Production halted for 3-5 days', date: '2025-07-09', affected_suppliers: ['Tech Components Ltd.'], type: 'Cyber' },
          { id: 3, title: 'Rare Earth Mineral Mine Collapse', source: 'Mining Weekly', severity: 'Critical', impact: 'Global supply chain impact imminent', date: '2025-07-08', affected_suppliers: ['Raw Materials Corp.'], type: 'Natural Disaster' },
          { id: 4, title: 'New Sanctions on Trade with Region X', source: 'Government Agency', severity: 'High', impact: 'Import/Export restrictions', date: '2025-07-07', affected_suppliers: ['Global Logistics Inc.'], type: 'Geopolitical' },
          { id: 5, title: 'Software Vulnerability Discovered in Supply Chain Tool', source: 'Security Alert', severity: 'Medium', impact: 'Potential data breach risk', date: '2025-07-06', affected_suppliers: ['Secure Software Inc.'], type: 'Cyber' },
          { id: 6, title: 'Typhoon Warning for East Asia', source: 'Weather Bureau', severity: 'High', impact: 'Potential shipping disruptions', date: '2025-07-05', affected_suppliers: ['Global Logistics Inc.', 'Tech Components Ltd.'], type: 'Natural Disaster' },
          { id: 7, title: 'Financial Distress Reported by Major Retailer', source: 'Market Data', severity: 'Medium', impact: 'Potential bankruptcy filing', date: '2025-07-04', affected_suppliers: ['Packaging Solutions SA'], type: 'Financial' },
        ], error: null };
      }
      return { data: [], error: null };
    },
    insert: async (data) => {
      console.log('Simulating Supabase insert:', data);
      return { data: data, error: null };
    },
  }),
};

const OpsisIntelligence = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'signup', 'dashboard', 'demo-dashboard'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // For dashboard tabs
  const [threats, setThreats] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [threatFeedData, setThreatFeedData] = useState([]);
  const threatIntervalRef = useRef(null);
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulated live threat intelligence feed data
  const allThreatFeedData = [
    { id: 1, title: 'Major Port Strike Looms in LA', source: 'LogisticsToday', severity: 'High', impact: 'Potential delays for electronics', time: 'Just now' },
    { id: 2, title: 'Ransomware Group Targets European Manufacturers', source: 'DarkWebIntel', severity: 'Critical', impact: 'Supply chain disruption likely', time: '5 mins ago' },
    { id: 3, title: 'Typhoon Season Intensifies in Southeast Asia', source: 'WeatherAlerts', severity: 'High', impact: 'Shipping routes affected', time: '15 mins ago' },
    { id: 4, title: 'New Trade Tariffs Announced by G7 Nations', source: 'GovWatch', severity: 'Medium', impact: 'Cost increases for imports', time: '30 mins ago' },
    { id: 5, title: 'Key Supplier Faces Financial Restructuring', source: 'MarketBeat', severity: 'Medium', impact: 'Risk of production halts', time: '1 hour ago' },
    { id: 6, title: 'Cyber Vulnerability Found in Popular IoT Device', source: 'SecBugs', severity: 'High', impact: 'Component supply risk', time: '2 hours ago' },
    { id: 7, title: 'Flooding Disrupts Road Networks in Midwest US', source: 'LocalNews', severity: 'Low', impact: 'Minor transport delays', time: '4 hours ago' },
  ];

  useEffect(() => {
    // Simulate fetching initial data
    const fetchInitialData = async () => {
      const { data: threatsData, error: threatsError } = await supabase.from('threats').select();
      if (threatsData) setThreats(threatsData);
      const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select();
      if (suppliersData) setSuppliers(suppliersData);
    };

    fetchInitialData();

    // Simulate live threat feed cycling
    let currentIndex = 0;
    setThreatFeedData([allThreatFeedData[currentIndex]]);

    threatIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % allThreatFeedData.length;
      setThreatFeedData([allThreatFeedData[currentIndex]]);
    }, 5000); // Cycle every 5 seconds

    return () => {
      if (threatIntervalRef.current) {
        clearInterval(threatIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'demo-dashboard') {
      localStorage.setItem('demoMode', 'true');
      const loadDemoData = async () => {
        setIsLoading(true);
        const { data: threatsData, error: threatsError } = await supabase.from('threats').select();
        if (threatsData) setThreats(threatsData);
        const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select();
        if (suppliersData) setSuppliers(suppliersData);
        setIsLoading(false);
      };
      loadDemoData();
    } else if (currentPage === 'dashboard') {
      localStorage.removeItem('demoMode');
      // In a real app, you'd fetch user-specific data here after login
    }
  }, [currentPage]);


  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError('');
    if (!email || !password || !companyName || !role) {
      setSignupError('All fields are required.');
      setIsLoading(false);
      return;
    }

    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSignupError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Password strength (simple check)
    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp(email, password);
    if (error) {
      console.error('Signup error:', error.message);
      setSignupError(error.message);
    } else if (data.user) {
      // Simulate saving company and role
      await supabase.from('users').insert([{ id: data.user.id, email, company_name: companyName, role }]);
      setSignupSuccess(true);
      setCurrentPage('dashboard');
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError('');
    const { data, error } = await supabase.auth.signInWithPassword(email, password);
    if (error) {
      console.error('Login error:', error.message);
      setSignupError(error.message);
    } else if (data.user) {
      setCurrentPage('dashboard');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('landing');
  };

  const navigateToSignup = () => {
    setSignupSuccess(false);
    setSignupError('');
    setEmail('');
    setPassword('');
    setCompanyName('');
    setRole('');
    setCurrentPage('signup');
  };

  const navigateToDemoDashboard = () => {
    setCurrentPage('demo-dashboard');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (score) => {
    if (score > 80) return 'bg-red-500';
    if (score > 60) return 'bg-orange-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskStatus = (score) => {
    if (score > 80) return 'Critical';
    if (score > 60) return 'High';
    if (score > 40) return 'Medium';
    return 'Low';
  };

  const filteredThreats = threats.filter(threat => {
    const matchesType = filterType === 'All' || threat.type === filterType;
    const matchesSeverity = filterSeverity === 'All' || threat.severity === filterSeverity;
    const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          threat.affected_suppliers.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSeverity && matchesSearch;
  });

  const riskScoresData = [
    { name: 'Critical', value: suppliers.filter(s => s.risk_score > 80).length, color: '#ef4444' },
    { name: 'High', value: suppliers.filter(s => s.risk_score > 60 && s.risk_score <= 80).length, color: '#f97316' },
    { name: 'Medium', value: suppliers.filter(s => s.risk_score > 40 && s.risk_score <= 60).length, color: '#f59e0b' },
    { name: 'Low', value: suppliers.filter(s => s.risk_score <= 40).length, color: '#22c55e' },
  ];

  const totalSuppliers = suppliers.length;

  const threatTypeData = Object.entries(threats.reduce((acc, threat) => {
    acc[threat.type] = (acc[threat.type] || 0) + 1;
    return acc;
  }, {})).map(([name, value]: [string, number]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700 p-2 border border-slate-600 rounded shadow-lg text-sm">
          <p className="font-bold">{`${payload[0].name}`}</p>
          <p>{`Suppliers: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {currentPage === 'landing' && (
        // LANDING PAGE JSX
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 bg-opacity-80 backdrop-blur-sm shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="text-orange-500" size={30} />
                <span className="text-2xl font-bold text-white">Opsis Intelligence</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-slate-300 hover:text-orange-500 transition-colors">Features</a>
                <a href="#pricing" className="text-slate-300 hover:text-orange-500 transition-colors">Pricing</a>
                <a href="#testimonials" className="text-slate-300 hover:text-orange-500 transition-colors">Testimonials</a>
                <a href="#contact" className="text-slate-300 hover:text-orange-500 transition-colors">Contact</a>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={navigateToSignup}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors duration-300 shadow-md"
                >
                  Sign Up
                </button>
                <button
                  onClick={navigateToDemoDashboard}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md flex items-center space-x-2"
                >
                  <Play size={20} />
                  <span>Try Demo Dashboard</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center text-center px-6" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzE3OHwwfDF8c2VhcmNofDE2fHxzdXBwbHl%yienNzdGVtJTIwcmlza3xlbnwwfHx8fDE3MDY3MjM4MzZ8MA&ixlib=rb-4.0.3&q=80&w=1080)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-slate-900 opacity-70"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6 animate-fade-in-up">
                Stop Learning About Supply Chain Threats <span className="text-orange-500">After They Hit Your Business.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-10 animate-fade-in-up delay-200">
                Opsis Intelligence provides the world's FIRST comprehensive, real-time threat intelligence platform for procurement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-400">
                <button
                  onClick={navigateToSignup}
                  className="px-10 py-4 bg-orange-600 text-white text-xl font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <ArrowRight size={24} />
                  <span>Start 14-Day Free Trial</span>
                </button>
                <button
                  onClick={navigateToDemoDashboard}
                  className="px-10 py-4 bg-slate-700 text-white text-xl font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Play size={24} />
                  <span>See Live Demo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Live Threat Intelligence Feed */}
          <section className="py-20 bg-slate-800 border-b border-slate-700">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold text-white mb-12">Live Threat Intelligence Feed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {threatFeedData.map((threat) => (
                  <div key={threat.id} className="bg-slate-700 rounded-lg p-6 shadow-xl border border-slate-600 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getSeverityColor(threat.severity).replace('text-', 'bg-').replace('-500', '-600')} bg-opacity-20`}>
                        {threat.severity}
                      </span>
                      <span className="text-slate-400 text-sm">{threat.time}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{threat.title}</h3>
                    <p className="text-slate-300 text-base mb-4">{threat.impact}</p>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Eye size={16} className="mr-2" />
                      <span>Source: {threat.source}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <button
                  onClick={navigateToDemoDashboard}
                  className="px-8 py-3 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-lg flex items-center justify-center mx-auto space-x-2"
                >
                  <BarChart3 size={20} />
                  <span>Explore Full Threat Dashboard</span>
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold text-white mb-12">Revolutionary Intelligence for Your Supply Chain</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Feature 1 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <Shield className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Intelligence</h3>
                  <p className="text-slate-300">Leverage NLP for threat analysis, ML for risk prediction, and AI-generated summaries to understand complex risks instantly.</p>
                </div>
                {/* Feature 2 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <Globe className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">Advanced Data Sources</h3>
                  <p className="text-slate-300">Integrate satellite imagery, financial indicators, social sentiment, and patent monitoring for a 360° view.</p>
                </div>
                {/* Feature 3 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <Monitor className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">Enterprise-Grade Features</h3>
                  <p className="text-slate-300">Multi-tenant architecture, RBAC, SSO, and compliance reporting ensure security and scalability for large organizations.</p>
                </div>
                {/* Feature 4 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <TrendingUp className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">Predictive Risk Modeling</h3>
                  <p className="text-slate-300">Utilize Monte Carlo simulations and advanced analytics to foresee potential disruptions and plan effectively.</p>
                </div>
                {/* Feature 5 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <Users className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">Global Intelligence Network</h3>
                  <p className="text-slate-300">Benefit from crowdsourced reporting, industry-specific feeds, and government agency integrations.</p>
                </div>
                {/* Feature 6 */}
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700 transform hover:translate-y-[-5px] transition-transform duration-300">
                  <CheckCircle className="text-orange-500 mb-4 mx-auto" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-4">Actionable Recommendations</h3>
                  <p className="text-slate-300">Receive personalized supplier intelligence, alternative sourcing, and immediate response protocols.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-slate-800 border-b border-slate-700">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold text-white mb-12">Flexible Pricing for Every Business</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Professional Plan */}
                <div className="bg-slate-700 rounded-lg p-8 shadow-xl border border-slate-600 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-orange-500 mb-4">Professional</h3>
                    <p className="text-slate-300 text-lg mb-6">Perfect for small teams and growing businesses.</p>
                    <p className="text-5xl font-extrabold text-white mb-6">$299<span className="text-xl font-normal text-slate-400">/month</span></p>
                    <ul className="text-slate-300 text-left space-y-3 mb-8">
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Real-time threat alerts</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> 50 supplier monitors</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Basic analytics dashboard</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Email support</li>
                    </ul>
                  </div>
                  <button
                    onClick={navigateToSignup}
                    className="w-full px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md"
                  >
                    Get Started
                  </button>
                </div>

                {/* Team Plan */}
                <div className="bg-slate-900 rounded-lg p-8 shadow-2xl border-2 border-orange-500 flex flex-col justify-between transform scale-105 relative z-10">
                  <div className="absolute -top-3 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-500 mb-4">Team</h3>
                    <p className="text-slate-300 text-lg mb-6">Designed for collaborative procurement teams.</p>
                    <p className="text-5xl font-extrabold text-white mb-6">$799<span className="text-xl font-normal text-slate-400">/month</span></p>
                    <ul className="text-slate-300 text-left space-y-3 mb-8">
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> All Professional features</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> 250 supplier monitors</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Advanced risk modeling</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Supply chain network visualization</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Priority email + chat support</li>
                    </ul>
                  </div>
                  <button
                    onClick={navigateToSignup}
                    className="w-full px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md"
                  >
                    Choose Plan
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-slate-700 rounded-lg p-8 shadow-xl border border-slate-600 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-orange-500 mb-4">Enterprise</h3>
                    <p className="text-slate-300 text-lg mb-6">Custom solutions for large organizations.</p>
                    <p className="text-5xl font-extrabold text-white mb-6">Custom</p>
                    <ul className="text-slate-300 text-left space-y-3 mb-8">
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> All Team features</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Unlimited supplier monitors</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> AI-powered intelligence suite</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> Dedicated account manager</li>
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-400 mr-3" /> On-premise deployment options</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => alert('Contact sales for Enterprise plan!')}
                    className="w-full px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors duration-300 shadow-md"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold text-white mb-12">What Our Customers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
                  <Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} />
                  <p className="text-slate-300 text-lg italic mb-6">"Opsis Intelligence transformed our risk management. We now have visibility we never thought possible."</p>
                  <p className="font-semibold text-white">- Jane Doe, Head of Procurement, GlobalCorp</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
                  <Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} /><Star className="text-yellow-400 inline-block mb-4" size={24} />
                  <p className="text-slate-300 text-lg italic mb-6">"Early warnings from Opsis saved us millions. A must-have for any serious supply chain professional."</p>
                  <p className="font-semibold text-white">- John Smith, Supply Chain Director, OmniTech</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-orange-600 text-white text-center">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-bold mb-6">Ready to Protect Your Supply Chain?</h2>
              <p className="text-xl mb-10">Join leading companies using Opsis Intelligence to stay ahead of threats.</p>
              <button
                onClick={navigateToSignup}
                className="px-10 py-4 bg-white text-orange-600 text-xl font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto space-x-3"
              >
                <ArrowRight size={24} />
                <span>Start Your Free Trial Now</span>
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="bg-slate-900 py-12 text-slate-400 text-center text-sm border-t border-slate-700">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <Shield className="text-orange-500" size={24} />
                  <span className="text-xl font-bold text-white">Opsis Intelligence</span>
                </div>
                <p>&copy; {new Date().getFullYear()} Opsis Intelligence. All rights reserved.</p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {currentPage === 'signup' && (
        // SIGNUP PAGE JSX
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up for Opsis Intelligence</h2>
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="email">
                  Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="Global Corp Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="role">
                  Your Role
                </label>
                <input
                  type="text"
                  id="role"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="Procurement Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
              {signupError && <p className="text-red-400 text-sm text-center">{signupError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    <span>Start 14-Day Free Trial</span>
                  </>
                )}
              </button>
              <p className="text-slate-400 text-sm text-center mt-4">
                Already have an account?{' '}
                <button type="button" onClick={() => setCurrentPage('login')} className="text-orange-500 hover:underline">
                  Log In
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {currentPage === 'login' && (
        // LOGIN PAGE JSX
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Log In to Opsis Intelligence</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="loginEmail">
                  Work Email
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {signupError && <p className="text-red-400 text-sm text-center">{signupError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    <span>Log In</span>
                  </>
                )}
              </button>
              <p className="text-slate-400 text-sm text-center mt-4">
                Don't have an account?{' '}
                <button type="button" onClick={navigateToSignup} className="text-orange-500 hover:underline">
                  Sign Up
                </button>
              </p>
              <p className="text-slate-400 text-sm text-center mt-2">
                <button type="button" onClick={() => alert('Forgot password functionality will be added later!')} className="text-slate-500 hover:underline">
                  Forgot password?
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {currentPage === 'dashboard' || currentPage === 'demo-dashboard' && (
        // DASHBOARD JSX
        <div className="min-h-screen bg-slate-900 text-white font-sans flex">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-10">
                <Shield className="text-orange-500" size={30} />
                <span className="text-2xl font-bold text-white">Opsis Intelligence</span>
              </div>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'overview' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <BarChart3 size={20} />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('suppliers')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'suppliers' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Package size={20} />
                  <span>Suppliers</span>
                </button>
                <button
                  onClick={() => setActiveTab('threats')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'threats' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <AlertTriangle size={20} />
                  <span>Threats</span>
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'alerts' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Bell size={20} />
                  <span>Alerts</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'reports' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <FileTextIcon size={20} />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === 'settings' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
            <div>
              {['dashboard', 'demo-dashboard'].includes(currentPage) && trialDaysLeft > 0 && (
                <div className="bg-slate-700 p-4 rounded-lg text-center mb-6 border border-slate-600">
                  <p className="text-sm font-semibold text-orange-400">
                    {trialDaysLeft} days left in trial!
                  </p>
                  <button
                    onClick={() => alert('Upgrade to unlock full features!')}
                    className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-slate-700 transition-colors duration-200"
              >
                <Lock size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'overview' && (
              <section>
                <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-600 rounded-full">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-slate-400">Total Suppliers Monitored</p>
                        <p className="text-3xl font-bold text-white">{suppliers.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-600 rounded-full">
                        <AlertTriangle size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-slate-400">Active Critical Threats</p>
                        <p className="text-3xl font-bold text-white">{threats.filter(t => t.severity === 'Critical').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <Zap size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-slate-400">New Alerts Today</p>
                        <p className="text-3xl font-bold text-white">12</p> {/* Placeholder */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Supplier Risk Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskScoresData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {riskScoresData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center mt-4 space-x-4">
                      {riskScoresData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                          <span className="text-sm text-slate-300">{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-bold mb-4">Threats by Type</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={threatTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center mt-4 gap-4">
                      {threatTypeData.map((entry, index) => (
                        <div key={`type-legend-${index}`} className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="text-sm text-slate-300">{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 mt-6">
                  <h2 className="text-xl font-bold mb-4">Recent Threat Activity</h2>
                  <ul className="space-y-4">
                    {threats.slice(0, 5).map(threat => (
                      <li key={threat.id} className="flex items-start space-x-3 bg-slate-700 p-4 rounded-md">
                        <AlertTriangle className={`${getSeverityColor(threat.severity)} mt-1`} size={20} />
                        <div>
                          <p className="font-semibold text-white">{threat.title} <span className="text-sm text-slate-400">({threat.date})</span></p>
                          <p className="text-slate-300 text-sm">Impact: {threat.impact}</p>
                          <p className="text-slate-400 text-xs">Source: {threat.source} | Affected: {threat.affected_suppliers.join(', ')}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {activeTab === 'suppliers' && (
              <section>
                <h1 className="text-4xl font-bold text-white mb-8">My Suppliers</h1>
                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Supplier Portfolio ({totalSuppliers})</h2>
                    <button className="px-5 py-2 bg-orange-600 rounded-lg text-white text-sm flex items-center space-x-2 hover:bg-orange-700 transition-colors">
                      <Plus size={18} />
                      <span>Add New Supplier</span>
                    </button>
                  </div>
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search suppliers..."
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Supplier Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Industry
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Criticality
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Risk Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Threats
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {suppliers.filter(supplier =>
                          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.industry.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((supplier) => (
                          <tr key={supplier.id} className="hover:bg-slate-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Package size={20} className="text-slate-400 mr-3" />
                                <span className="text-white font-medium">{supplier.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-300">{supplier.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-300">{supplier.industry}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                supplier.criticality === 'Critical' ? 'bg-red-100 text-red-800' :
                                supplier.criticality === 'Important' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {supplier.criticality}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${getRiskColor(supplier.risk_score)}`}></span>
                                <span className="text-white">{supplier.risk_score} <span className="text-slate-400 text-xs">({getRiskStatus(supplier.risk_score)})</span></span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                              {supplier.threats && supplier.threats.length > 0 ? supplier.threats.join(', ') : 'None'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => alert(`View details for ${supplier.name}`)} className="text-orange-500 hover:text-orange-700 mr-3">View</button>
                              <button onClick={() => alert(`Edit ${supplier.name}`)} className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button onClick={() => alert(`Delete ${supplier.name}`)} className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'threats' && (
                <section>
                  <h1 className="text-4xl font-bold text-white mb-8">Global Threat Monitor</h1>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-white mr-auto">All Threats ({filteredThreats.length})</h2>
                      <input
                        type="text"
                        placeholder="Search threats..."
                        className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Cyber">Cyber</option>
                        <option value="Natural Disaster">Natural Disaster</option>
                        <option value="Geopolitical">Geopolitical</option>
                        <option value="Financial">Financial</option>
                        <option value="Other">Other</option>
                      </select>
                      <select
                        className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                      >
                        <option value="All">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredThreats.map(threat => (
                      <div key={threat.id} className="bg-slate-700 rounded-lg p-5 shadow-md border border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getSeverityColor(threat.severity).replace('text-', 'bg-').replace('-500', '-600')} bg-opacity-20`}>
                            {threat.severity}
                          </span>
                          <span className="text-slate-400 text-sm">{threat.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{threat.title}</h3>
                        <p className="text-slate-300 text-sm mb-3">Type: {threat.type}</p>
                        <p className="text-slate-300 text-base mb-3">{threat.impact}</p>
                        <p className="text-slate-400 text-xs">Source: {threat.source}</p>
                        <p className="text-slate-400 text-xs mt-1">Affected Suppliers: {threat.affected_suppliers.join(', ')}</p>
                        <div className="mt-4 text-right">
                          <button onClick={() => alert(`Viewing full report for: ${threat.title}`)} className="text-orange-500 hover:text-orange-700 text-sm">
                            View Details <ArrowRight size={14} className="inline ml-1" />
                          </button>
                        </div>
                      </div>
                      ))}
                    </div>
                    {filteredThreats.length === 0 && (
                    <p className="text-center text-slate-400 text-lg py-8">No threats found matching your criteria.</p>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'alerts' && (
                <section>
                  <h1 className="text-4xl font-bold text-white mb-8">My Alerts</h1>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Alerts</h2>
                    <ul className="space-y-4">
                      <li className="bg-slate-700 p-4 rounded-md flex items-start space-x-3">
                        <Bell size={20} className="text-red-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Your supplier Global Logistics Inc. mentioned in "Port Congestion in Shanghai" alert.</p>
                          <p className="text-slate-400 text-sm">Source: Opsis Threat Feed | Impact: Potential Shipping Delays | July 10, 2025</p>
                          <button className="text-orange-500 text-sm mt-2 hover:underline" onClick={() => alert('Viewing alert details...')}>View Details</button>
                        </div>
                      </li>
                      <li className="bg-slate-700 p-4 rounded-md flex items-start space-x-3">
                        <Bell size={20} className="text-orange-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Geographic Risk Notification: Suppliers in East Asia affected by "Typhoon Warning".</p>
                          <p className="text-slate-400 text-sm">Source: Weather Bureau | Impact: Shipping Disruptions | July 05, 2025</p>
                          <button className="text-orange-500 text-sm mt-2 hover:underline" onClick={() => alert('Viewing alert details...')}>View Details</button>
                        </div>
                      </li>
                      <li className="bg-slate-700 p-4 rounded-md flex items-start space-x-3">
                        <Bell size={20} className="text-yellow-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Industry Impact Analysis: Electronics industry facing "Chip Shortage" due to supply chain issues.</p>
                          <p className="text-slate-400 text-sm">Source: Industry Report | Impact: Production Delays | July 01, 2025</p>
                          <button className="text-orange-500 text-sm mt-2 hover:underline" onClick={() => alert('Viewing alert details...')}>View Details</button>
                        </div>
                      </li>
                    </ul>
                    <div className="mt-6 text-center">
                      <button onClick={() => alert('Loading more alerts...')} className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        Load More Alerts
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'reports' && (
                <section>
                  <h1 className="text-4xl font-bold text-white mb-8">Reports & Analytics</h1>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Generate Custom Reports</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <FileTextIcon size={20} className="text-orange-500" />
                        <p className="text-slate-300">Executive Threat Briefing (PDF)</p>
                        <button className="ml-auto px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700 transition-colors" onClick={() => alert('Generating Executive Briefing...')}>Generate</button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BarChartIcon size={20} className="text-orange-500" />
                        <p className="text-slate-300">Supplier Risk Heatmap (Interactive)</p>
                        <button className="ml-auto px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700 transition-colors" onClick={() => alert('Generating Heatmap...')}>Generate</button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Table size={20} className="text-orange-500" /> {/* Assuming Table icon from lucide-react */}
                        <p className="text-slate-300">Threat Impact Assessment (CSV)</p>
                        <button className="ml-auto px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700 transition-colors" onClick={() => alert('Exporting CSV...')}>Export</button>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Historical Trends</h2>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Monthly Threat Volume</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={[
                          { name: 'Jan', threats: 15 }, { name: 'Feb', threats: 20 }, { name: 'Mar', threats: 18 },
                          { name: 'Apr', threats: 25 }, { name: 'May', threats: 30 }, { name: 'Jun', threats: 28 },
                          { name: 'Jul', threats: 35 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="name" stroke="#cbd5e1" />
                          <YAxis stroke="#cbd5e1" />
                          <Tooltip />
                          <Line type="monotone" dataKey="threats" stroke="#f97316" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'settings' && (
                <section>
                  <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
                  <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="settingEmail">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="settingEmail"
                          className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                          defaultValue={currentPage === 'demo-dashboard' ? 'demo@opsis.com' : email}
                          readOnly={currentPage === 'demo-dashboard'}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="settingCompanyName">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-orange-500 outline-none"
                          defaultValue={currentPage === 'demo-dashboard' ? 'Demo Company Inc.' : companyName}
                          readOnly={currentPage === 'demo-dashboard'}
                        />
                      </div>
                      <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors" onClick={() => alert('Settings saved!')}>
                        Save Settings
                      </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Subscription</h2>
                    <div className="bg-slate-700 p-4 rounded-lg flex justify-between items-center border border-slate-600">
                      <div>
                        <p className="text-white font-semibold">Current Plan: {currentPage === 'demo-dashboard' ? 'Trial' : 'Professional'}</p>
                        <p className="text-slate-400 text-sm">Next billing date: July 30, 2025</p>
                      </div>
                      {['dashboard', 'demo-dashboard'].includes(currentPage) && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors" onClick={() => alert('Managing subscription via Stripe portal...')}>
                          Manage Subscription
                        </button>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Notifications</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-orange-600" defaultChecked />
                        <label htmlFor="emailNotifications" className="ml-2 text-slate-300">Email Notifications for Critical Alerts</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="pushNotifications" className="form-checkbox h-5 w-5 text-orange-600" defaultChecked />
                        <label htmlFor="pushNotifications" className="ml-2 text-slate-300">Push Notifications for Supplier Mentions</label>
                      </div>
                      <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors" onClick={() => alert('Notification preferences saved!')}>
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        )}
      </>
    );
  };

  export default OpsisIntelligence;
