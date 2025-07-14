'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Globe, AlertTriangle, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Play, BarChart3, Zap, Eye, Bell, Monitor, FileText, Upload, Search, Filter, Plus, Settings, Lock, Mail, Star, RefreshCw, X, Menu, Package, DollarSign, Calendar, Sliders, Layers, UserPlus, FileText as FileTextIcon, BarChart as BarChartIcon, Table, Building, Truck, Cloud, AlertCircle, Info, Link
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart } from 'recharts';

// Configuration
const RANSOMWARE_API_KEY = 'c0b51f59-d359-4589-8765-992ce2d498b9';

// Enhanced demo threat data
const ENHANCED_DEMO_THREATS = [
  {
    id: 1,
    severity: 'Critical',
    title: 'Ransomware Group Targets European Manufacturers',
    description: 'Supply chain disruption likely',
    source: 'DarkWebIntel',
    timeAgo: '5 mins ago',
    category: 'Ransomware',
    affectedRegions: ['Europe'],
    color: 'red'
  },
  {
    id: 2,
    severity: 'High',
    title: 'Port Strike Affects Asian Logistics',
    description: 'Shipping delays expected 2-3 weeks',
    source: 'TradeIntel',
    timeAgo: '12 mins ago',
    category: 'Logistics',
    affectedRegions: ['Asia-Pacific'],
    color: 'orange'
  },
  {
    id: 3,
    severity: 'Medium',
    title: 'New Sanctions Impact Tech Supply Chain',
    description: 'Semiconductor availability reduced',
    source: 'GovWatch',
    timeAgo: '18 mins ago',
    category: 'Regulatory',
    affectedRegions: ['Global'],
    color: 'yellow'
  },
  {
    id: 4,
    severity: 'High',
    title: 'Data Breach at Major Supplier Database',
    description: 'Supplier credentials potentially compromised',
    source: 'CyberThreat',
    timeAgo: '25 mins ago',
    category: 'Cyber Security',
    affectedRegions: ['North America'],
    color: 'orange'
  },
  {
    id: 5,
    severity: 'Critical',
    title: 'Factory Fire Shuts Down Key Manufacturer',
    description: 'Alternative suppliers urgently needed',
    source: 'IndustryAlert',
    timeAgo: '32 mins ago',
    category: 'Physical',
    affectedRegions: ['Southeast Asia'],
    color: 'red'
  },
  {
    id: 6,
    severity: 'Medium',
    title: 'Weather Disruption Affects Mining Operations',
    description: 'Raw material shortages possible',
    source: 'WeatherIntel',
    timeAgo: '41 mins ago',
    category: 'Environmental',
    affectedRegions: ['South America'],
    color: 'yellow'
  }
];

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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentThreatIndex, setCurrentThreatIndex] = useState(0);

  // Enhanced Threat Feed Component
  const EnhancedThreatFeed = () => {
    const getSeverityColor = (severity) => {
      switch (severity.toLowerCase()) {
        case 'critical': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getIconForCategory = (category) => {
      switch (category.toLowerCase()) {
        case 'ransomware': return AlertTriangle;
        case 'logistics': return Truck;
        case 'regulatory': return FileText;
        case 'cyber security': return Shield;
        case 'physical': return Building;
        case 'environmental': return Cloud;
        default: return AlertCircle;
      }
    };

    // Display 6 threat boxes in a 2x3 grid
    const visibleThreats = [];
    for (let i = 0; i < 6; i++) {
      const threatIndex = (currentThreatIndex + i) % ENHANCED_DEMO_THREATS.length;
      visibleThreats.push(ENHANCED_DEMO_THREATS[threatIndex]);
    }

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentThreatIndex(prev => (prev + 1) % ENHANCED_DEMO_THREATS.length);
      }, 8000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Live Threat Intelligence Feed
            </h2>
            <p className="text-xl text-white/80 mb-2">
              Real-time monitoring of global supply chain threats
            </p>
            <div className="flex items-center justify-center text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Live Updates Every 30 Seconds
            </div>
          </div>

          {/* 6 Threat Boxes Grid */}
          {/* 6 Threat Boxes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ENHANCED_DEMO_THREATS.slice(0, 6).map((threat, index) => {
              const IconComponent = getIconForCategory(threat.category);
              return (
                <div 
                  key={threat.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <div className="flex items-center text-white/60 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {threat.timeAgo}
                    </div>
                  </div>

                  <div className="flex items-start mb-3">
                    <IconComponent className="w-5 h-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {threat.title}
                    </h3>
                  </div>

                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {threat.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/50 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Source: {threat.source}
                    </div>
                    <span className="text-blue-300 text-xs font-medium">
                      {threat.category}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center text-white/60 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Affected: {threat.affectedRegions.join(', ')}
                    </div>
                  </div>
                </div>
            </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={handleDemoAccess}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg inline-flex items-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Explore Full Threat Dashboard
            </button>
            <p className="text-white/60 text-sm mt-3">
              See how these threats might affect your specific suppliers
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Demo access handler
  const handleDemoAccess = () => {
    setCurrentPage('demo-dashboard');
    setIsDemoMode(true);
  };

  // Demo banner component
  const DemoBanner = () => {
    if (!isDemoMode) return null;
    
    return (
      <div className="bg-orange-100 border border-orange-400 text-orange-800 px-4 py-3 mb-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Demo Mode - Sample Data Only</span>
          </div>
          <button 
            onClick={() => setCurrentPage('signup')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign Up for Full Access
          </button>
        </div>
        <p className="mt-1 text-sm">
          You're viewing sample data. Sign up to manage your own suppliers and threats.
        </p>
      </div>
    );
  };

  // Your existing components and functions continue here...
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalSuppliers: 0,
    activeThreats: 0,
    riskScore: 'Low',
    alertsCount: 0
  });
  
  // Mock data for demo
  const mockSuppliers = [
    {
      id: 1,
      name: "TechCorp Manufacturing",
      location: "Shenzhen, China",
      industry: "Electronics",
      criticality: "High",
      risk_score: 7.5,
      threats: ["Cyberattack", "Regulatory"],
      status: "Active"
    },
    {
      id: 2,
      name: "Global Logistics Solutions",
      location: "Rotterdam, Netherlands",
      industry: "Logistics",
      criticality: "Medium",
      risk_score: 4.2,
      threats: ["Weather", "Strike"],
      status: "Active"
    },
    {
      id: 3,
      name: "Raw Materials Inc",
      location: "Brisbane, Australia",
      industry: "Mining",
      criticality: "High",
      risk_score: 6.8,
      threats: ["Environmental"],
      status: "Under Review"
    }
  ];

  const mockThreats = [
    {
      id: 1,
      title: "Ransomware Attack on Electronics Sector",
      description: "Major ransomware group targeting electronics manufacturers in Asia",
      severity: "Critical",
      impact: "Supply chain disruption expected for 2-3 weeks",
      type: "Cyber Attack",
      source: "DarkWeb Intelligence",
      affected_suppliers: ["TechCorp Manufacturing"],
      date: "2024-07-14"
    },
    {
      id: 2,
      title: "Port Strike in European Hub",
      description: "Labor dispute affecting major shipping routes",
      severity: "High",
      impact: "Delays in shipments, increased costs",
      type: "Labor Dispute",
      source: "Industry Reports",
      affected_suppliers: ["Global Logistics Solutions"],
      date: "2024-07-13"
    }
  ];

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      setSuppliers(mockSuppliers);
      setThreats(mockThreats);
      setDashboardData({
        totalSuppliers: mockSuppliers.length,
        activeThreats: mockThreats.length,
        riskScore: 'Medium',
        alertsCount: 5
      });
    } catch (error) {
      setError('Failed to load dashboard data');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'demo-dashboard') {
      fetchDashboardData();
      if (currentPage === 'dashboard') {
        fetchUserData();
      }
    }
  }, [currentPage]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setTimeout(() => {
          setCurrentPage('dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCurrentPage('dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handleAddSupplier = () => {
    if (isDemoMode) {
      alert('⚠️ Demo Mode: To add real suppliers, please sign up for a free account! This demo uses sample data only.');
      return;
    }
    
    alert('Add supplier functionality will be implemented here');
  };

  const renderLandingPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Navigation */}
        <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-white mr-3" />
                <span className="text-xl font-bold text-white">Opsis Intelligence</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button 
                    onClick={handleDemoAccess}
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Demo
                  </button>
                  <button 
                    onClick={() => setCurrentPage('login')}
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setCurrentPage('signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Supply Chain</span>
                    <span className="block text-blue-300">Threat Intelligence</span>
                  </h1>
                  <p className="mt-3 max-w-md mx-auto text-base text-white/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Protect your business with real-time threat monitoring, supplier risk assessment, and intelligent alerts across your entire supply chain network.
                  </p>
                  <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <div className="rounded-md shadow">
                      <button 
                        onClick={() => setCurrentPage('signup')}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                      >
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <button 
                        onClick={handleDemoAccess}
                        className="w-full flex items-center justify-center px-8 py-3 border border-white/30 text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 md:py-4 md:text-lg md:px-10 transition-colors backdrop-blur-sm"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        See Live Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Threat Feed Section */}
        <EnhancedThreatFeed />

        {/* Features section */}
        <div className="py-16 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-300 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                Complete Supply Chain Visibility
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">Real-time Monitoring</p>
                  <dd className="mt-2 ml-16 text-base text-white/70">
                    Track threats and vulnerabilities across your entire supplier network with live updates and intelligent alerts.
                  </dd>
                  <button 
                    onClick={handleDemoAccess}
                    className="mt-3 ml-16 text-blue-300 hover:text-blue-200 text-sm font-medium"
                  >
                    Try Demo Dashboard →
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">Risk Assessment</p>
                  <dd className="mt-2 ml-16 text-base text-white/70">
                    Advanced analytics and machine learning to assess and predict supplier risks before they impact your business.
                  </dd>
                  <button 
                    onClick={handleDemoAccess}
                    className="mt-3 ml-16 text-blue-300 hover:text-blue-200 text-sm font-medium"
                  >
                    Explore Full Threat Dashboard →
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Bell className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">Intelligent Alerts</p>
                  <dd className="mt-2 ml-16 text-base text-white/70">
                    Get notified instantly when threats affect your suppliers, with actionable insights and mitigation strategies.
                  </dd>
                  <button 
                    onClick={() => setCurrentPage('signup')}
                    className="mt-3 ml-16 text-blue-300 hover:text-blue-200 text-sm font-medium"
                  >
                    Start Monitoring →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-blue-800/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Protecting Supply Chains Worldwide
              </h2>
              <p className="mt-3 text-xl text-white/80 sm:mt-4">
                Join thousands of companies already securing their supply chains
              </p>
            </div>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/80">
                  Companies Protected
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-300">2,000+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/80">
                  Threats Detected Daily
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-300">15,000+</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-white/80">
                  Supplier Networks Monitored
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-300">50,000+</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to secure your supply chain?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Start monitoring threats and protecting your business today with our 14-day free trial.
            </p>
            <button 
              onClick={() => setCurrentPage('signup')}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-colors"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDemoDashboard = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <DemoBanner />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">Opsis Intelligence</span>
              </div>
              <button 
                onClick={() => setCurrentPage('landing')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Suppliers</dt>
                      <dd className="text-lg font-medium text-gray-900">{mockSuppliers.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className
