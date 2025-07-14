'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Globe, AlertTriangle, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Play, BarChart3, Zap, Eye, Bell, Monitor, FileText, Upload, Search, Filter, Plus, Settings, Lock, Mail, Star, RefreshCw, X, Menu, Package, DollarSign, Calendar, Sliders, Layers, UserPlus, FileText as FileTextIcon, BarChart as BarChartIcon, Table
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart } from 'recharts';

// Types for our data
interface User {
  id: number;
  email: string;
  full_name: string;
  company_name: string;
  role: string;
  subscription_tier: string;
  trial_ends_at: string;
}

interface Supplier {
  id: number;
  name: string;
  location: string;
  industry: string;
  criticality: string;
  risk_score: number;
  threats: string[];
  status: string;
}

interface Threat {
  id: number;
  title: string;
  description: string;
  severity: string;
  impact: string;
  type: string;
  source: string;
  affected_suppliers: string[];
  date: string;
}

const OpsisIntelligence = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [threatFeedData, setThreatFeedData] = useState<any[]>([]);
  const threatIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Real authentication functions
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError('');

    if (!email || !password || !fullName || !companyName || !role) {
      setSignupError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setSignupError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          company_name: companyName,
          role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess(true);
        // Send welcome email
        await fetch('/api/emails/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, full_name: fullName }),
        });
        setCurrentPage('dashboard');
        await loadUserData();
      } else {
        setSignupError(data.error || 'Signup failed');
      }
    } catch (error) {
      setSignupError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentPage('dashboard');
        await loadUserData();
      } else {
        setSignupError(data.error || 'Login failed');
      }
    } catch (error) {
      setSignupError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSuppliers([]);
      setCurrentPage('landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadUserData = async () => {
    try {
      // Load user profile
      const userResponse = await fetch('/api/user/profile');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Calculate trial days left
        const trialEnd = new Date(userData.trial_ends_at);
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        setTrialDaysLeft(daysLeft);
      }

      // Load suppliers
      const suppliersResponse = await fetch('/api/suppliers');
      if (suppliersResponse.ok) {
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData);
      }

      // Load threats
      const threatsResponse = await fetch('/api/threats');
      if (threatsResponse.ok) {
        const threatsData = await threatsResponse.json();
        setThreats(threatsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const navigateToSignup = () => {
    setSignupSuccess(false);
    setSignupError('');
    setEmail('');
    setPassword('');
    setFullName('');
    setCompanyName('');
    setRole('');
    setCurrentPage('signup');
  };

  const navigateToDemoDashboard = () => {
    setCurrentPage('demo-dashboard');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 80) return 'bg-red-500';
    if (score > 60) return 'bg-orange-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskStatus = (score: number) => {
    if (score > 80) return 'Critical';
    if (score > 60) return 'High';
    if (score > 40) return 'Medium';
    return 'Low';
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData.user) {
            setCurrentPage('dashboard');
            await loadUserData();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();

    // Load initial threat data for landing page
    const loadThreats = async () => {
      try {
        const response = await fetch('/api/threats');
        if (response.ok) {
          const threatsData = await response.json();
          setThreats(threatsData);
        }
      } catch (error) {
        console.error('Error loading threats:', error);
      }
    };

    loadThreats();

    // Simulate live threat feed cycling
    let currentIndex = 0;
    setThreatFeedData([allThreatFeedData[currentIndex]]);

    threatIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % allThreatFeedData.length;
      setThreatFeedData([allThreatFeedData[currentIndex]]);
    }, 5000);

    return () => {
      if (threatIntervalRef.current) {
        clearInterval(threatIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentPage === 'demo-dashboard') {
      // Load demo data - use the same API but mark as demo
      setIsLoading(true);
      const loadDemoData = async () => {
        try {
          const threatsResponse = await fetch('/api/threats');
          if (threatsResponse.ok) {
            const threatsData = await threatsResponse.json();
            setThreats(threatsData);
          }

          // Set demo suppliers
          setSuppliers([
            { id: 1, name: 'Global Logistics Inc.', location: 'Shanghai, China', industry: 'Logistics', criticality: 'Critical', risk_score: 85, threats: ['Port Congestion', 'Geopolitical Tension'], status: 'Active' },
            { id: 2, name: 'Tech Components Ltd.', location: 'Taipei, Taiwan', industry: 'Electronics', criticality: 'Important', risk_score: 72, threats: ['Chip Shortage', 'Cyber Attack Risk'], status: 'Active' },
            { id: 3, name: 'Raw Materials Corp.', location: 'Minas Gerais, Brazil', industry: 'Mining', criticality: 'Critical', risk_score: 92, threats: ['Natural Disaster', 'Supply Chain Disruption'], status: 'Active' },
            { id: 4, name: 'Packaging Solutions SA', location: 'Frankfurt, Germany', industry: 'Manufacturing', criticality: 'Standard', risk_score: 30, threats: [], status: 'Active' },
            { id: 5, name: 'Secure Software Inc.', location: 'Dublin, Ireland', industry: 'IT Services', criticality: 'Important', risk_score: 65, threats: ['Software Vulnerability'], status: 'Active' },
          ]);
        } catch (error) {
          console.error('Error loading demo data:', error);
        }
        setIsLoading(false);
      };
      loadDemoData();
    }
  }, [currentPage]);

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
  }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

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

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'professional' }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  return (
    <>
      {currentPage === 'landing' && (
        // LANDING PAGE JSX - Same as before
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
                      <li className="flex items-center"><CheckCircle size={20} className="text-green-
