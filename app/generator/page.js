'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Generator() {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    businessType: '',
    location: '',
    
    businessConcept: '',
    targetMarket: '',
    uniqueValue: '',
    
    startupCosts: '',
    expectedRevenue: '',
    
    keyMilestones: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
      setError(errorMsg);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          useAI
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate business plan');
      }
      
      const data = await response.json();
      
      const saveResponse = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!saveResponse.ok) {
        console.error('Failed to save business plan');
      }
      
      router.push('/plan');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="bg-clip-text bg-gradient-to-r text-4xl text-center text-transparent font-bold font-playfair from-purple-400 mb-8 to-pink-400">
          Business Plan Generator
        </h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-8 px-4 py-3">
            {error}
          </div>
        )}
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer inline-flex items-center relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                />
                <div className="bg-gray-600 h-6 rounded-full w-11 after:absolute after:bg-white after:border after:border-gray-300 after:h-5 after:left-[2px] after:rounded-full after:top-[2px] after:transition-all after:w-5 peer peer-checked:after:border-white peer-checked:after:translate-x-full peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/30"></div>
                <span className="text-gray-300 text-sm font-medium ml-3">Generate with AI (recommended)</span>
              </label>
            </div>

            <div className="space-y-6">
              <h2 className="bg-clip-text bg-gradient-to-r text-2xl text-center text-transparent font-bold font-playfair from-purple-400 to-pink-400">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="businessName" className="text-gray-300 text-sm block font-medium mb-2">
                    Business Name*
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="text-gray-300 text-sm block font-medium mb-2">
                    Industry*
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Tech, Food, Healthcare, etc."
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="businessType" className="text-gray-300 text-sm block font-medium mb-2">
                    Business Type*
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Franchise">Franchise</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="text-gray-300 text-sm block font-medium mb-2">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State, Country"
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="bg-clip-text bg-gradient-to-r text-2xl text-center text-transparent font-bold font-playfair from-purple-400 to-pink-400">
                Business Concept
              </h2>
              <div>
                <label htmlFor="businessConcept" className="text-gray-300 text-sm block font-medium mb-2">
                  Business Concept/Idea*
                </label>
                <textarea
                  id="businessConcept"
                  name="businessConcept"
                  value={formData.businessConcept}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your business idea in detail. What problem does it solve? What makes it unique?"
                  className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="targetMarket" className="text-gray-300 text-sm block font-medium mb-2">
                    Target Market*
                  </label>
                  <textarea
                    id="targetMarket"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your target customers. Include demographics, needs, behaviors, and pain points."
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="uniqueValue" className="text-gray-300 text-sm block font-medium mb-2">
                    Unique Value Proposition*
                  </label>
                  <textarea
                    id="uniqueValue"
                    name="uniqueValue"
                    value={formData.uniqueValue}
                    onChange={handleChange}
                    rows="3"
                    placeholder="What distinguishes your business from competitors? Why will customers choose you?"
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="bg-clip-text bg-gradient-to-r text-2xl text-center text-transparent font-bold font-playfair from-purple-400 to-pink-400">
                Financial & Goals (Optional)
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="startupCosts" className="text-gray-300 text-sm block font-medium mb-2">
                    Estimated Startup Costs
                  </label>
                  <input
                    type="text"
                    id="startupCosts"
                    name="startupCosts"
                    value={formData.startupCosts}
                    onChange={handleChange}
                    placeholder="E.g., $10,000 for equipment, $5,000 for inventory, etc."
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="expectedRevenue" className="text-gray-300 text-sm block font-medium mb-2">
                    Expected First Year Revenue
                  </label>
                  <input
                    type="text"
                    id="expectedRevenue"
                    name="expectedRevenue"
                    value={formData.expectedRevenue}
                    onChange={handleChange}
                    placeholder="E.g., $120,000 in year one with 15% growth annually"
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="keyMilestones" className="text-gray-300 text-sm block font-medium mb-2">
                  Key Milestones & Goals
                </label>
                <textarea
                  id="keyMilestones"
                  name="keyMilestones"
                  value={formData.keyMilestones}
                  onChange={handleChange}
                  rows="3"
                  placeholder="E.g., MVP launch in 3 months, 100 customers by month 6, expansion to new market in year 2"
                  className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:border-transparent focus:ring-2 focus:ring-purple-500 px-4 py-2"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex bg-gradient-to-r rounded-full text-lg text-white disabled:cursor-not-allowed disabled:opacity-50 font-semibold from-purple-500 hover:opacity-90 items-center px-8 py-4 space-x-2 to-pink-500 transition-opacity"
              >
                {isGenerating ? (
                  <>
                    <div className="border-b-2 border-t-2 border-white h-5 rounded-full w-5 animate-spin"></div>
                    <span>Generating Comprehensive Plan...</span>
                  </>
                ) : (
                  <span>Generate Detailed Business Plan</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}