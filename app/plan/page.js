'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch('/api/plan');
        if (response.status === 404) {
          router.push('/generator?error=No business plan found. Please generate one first.');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to load plan data');
        }
        
        const data = await response.json();
        setPlan(data);
      } catch (err) {
        setError(err.message || 'Error loading the business plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [router]);

  const cleanMarkdown = (text) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') 
      .replace(/\*(.*?)\*/g, '$1')     
      .replace(/```(.*?)```/gs, '$1')  
      .replace(/^#+\s+/gm, '')         
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') 
      .replace(/~~(.*?)~~/g, '$1')     
      .replace(/^>\s+/gm, '')          
      .replace(/\n-{3,}/g, '\n')       
      .replace(/\n={3,}/g, '\n'); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-12">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="border-b-2 border-purple-500 border-t-2 h-16 rounded-full w-16 animate-spin"></div>
        </div>
      ) : error || !plan ? (
        <div className="flex flex-col justify-center p-4 items-center min-h-screen">
          <div className="bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-4 px-4 py-3">
            {error || "There was an error loading the business plan data."}
          </div>
          <button
            onClick={() => router.push('/generator')}
            className="bg-gradient-to-r rounded-full text-white from-purple-500 hover:opacity-90 px-6 py-3 to-pink-500 transition-opacity"
          >
            Generate New Plan
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="bg-clip-text bg-gradient-to-r text-4xl text-center text-transparent font-bold font-playfair from-purple-400 mb-8 to-pink-400">
            {plan.businessName || 'Your Business Plan'}
          </h1>
          
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
            {/* Business Info */}
            <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-purple-300 text-sm font-medium mb-2">Business Name</h3>
                <div className="text-white">{plan.businessName || "Not specified"}</div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-purple-300 text-sm font-medium mb-2">Industry</h3>
                <div className="text-white">{plan.industry || "Not specified"}</div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-purple-300 text-sm font-medium mb-2">Business Type</h3>
                <div className="text-white">{plan.businessType || "Not specified"}</div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-purple-300 text-sm font-medium mb-2">Location</h3>
                <div className="text-white">{plan.location || "Not specified"}</div>
              </div>
            </div>
            
            {plan.rawResponse && (
              <div className="mt-8">
                <h2 className="bg-clip-text bg-gradient-to-r border-b border-purple-400/30 text-2xl text-transparent font-bold font-playfair from-purple-400 mb-6 pb-2 to-pink-400">
                  Complete Business Plan
                </h2>
                <div className="bg-gray-700/20 p-6 rounded-lg text-sm text-white leading-relaxed whitespace-pre-wrap">
                  {cleanMarkdown(plan.rawResponse)}
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r rounded-full text-white from-purple-500 hover:opacity-90 px-6 py-3 to-pink-500 transition-opacity"
              >
                Print Plan
              </button>
              <button
                onClick={() => router.push('/generator')}
                className="bg-gray-700 rounded-full text-white hover:bg-gray-600 px-6 py-3 transition-colors"
              >
                Generate New Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}