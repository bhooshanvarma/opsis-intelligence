'use client'

import React from 'react';
import { Shield, ArrowRight, Globe, AlertTriangle, Users, Eye, Bell, BarChart3 } from 'lucide-react';

const OpsisIntelligence = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Opsis Intelligence</h1>
                <p className="text-xs text-slate-400">Supply Chain Threat Intelligence</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition-colors">
                Start Free Trial
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Stop Learning About Supply Chain Threats<br />
            <span className="text-orange-500">After They Hit Your Business</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            The world's first comprehensive supply chain threat intelligence platform. 
            Monitor global risks, protect your suppliers, and stay ahead of disruptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center">
              Start 14-Day Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors">
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-slate-400">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">Revolutionary Intelligence Platform</h3>
            <p className="text-xl text-slate-300">AI-powered supply chain threat monitoring</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700">
              <Eye className="w-12 h-12 text-orange-500 mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">Real-Time Monitoring</h4>
              <p className="text-slate-300">Monitor your suppliers 24/7 with global threat intelligence</p>
            </div>
            
            <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700">
              <Bell className="w-12 h-12 text-orange-500 mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">Instant Alerts</h4>
              <p className="text-slate-300">Get notified immediately when threats affect your supply chain</p>
            </div>
            
            <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700">
              <BarChart3 className="w-12 h-12 text-orange-500 mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">Risk Analytics</h4>
              <p className="text-slate-300">Advanced analytics and predictive risk modeling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-bold mb-6">Choose Your Plan</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h4 className="text-2xl font-bold mb-4">Professional</h4>
              <div className="text-4xl font-bold text-orange-500 mb-6">$299<span className="text-lg text-slate-400">/mo</span></div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">Start Trial</button>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-8 border border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h4 className="text-2xl font-bold mb-4">Team</h4>
              <div className="text-4xl font-bold text-orange-500 mb-6">$799<span className="text-lg text-slate-400">/mo</span></div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">Start Trial</button>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h4 className="text-2xl font-bold mb-4">Enterprise</h4>
              <div className="text-4xl font-bold text-orange-500 mb-6">Custom</div>
              <button className="w-full border border-slate-600 hover:border-orange-500 text-white py-3 rounded-lg">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-bold mb-6 text-white">Ready to Protect Your Supply Chain?</h3>
          <button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-bold text-lg">
            Start Free Trial Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Opsis Intelligence</span>
          </div>
          <p className="text-slate-400">© 2025 Opsis Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OpsisIntelligence;
