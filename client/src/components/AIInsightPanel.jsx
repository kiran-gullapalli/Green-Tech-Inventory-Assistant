import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AIInsightPanel({ items }) {
    const [report, setReport] = useState('');
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        setReport('');
        setSource('');
        try {
            const res = await fetch(`${API_URL}/api/ai/insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });
            const json = await res.json();
            if (json.success) {
                setReport(json.data);
                setSource(json.source);
            } else {
                setError(json.error);
            }
        } catch {
            setError('Failed to generate report');
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            {/* Panel Header */}
            <div className="mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    🧠 AI Insights
                </h2>
                <p className="text-gray-600">Generate intelligent recommendations for your inventory</p>
            </div>

            {/* Generate Button */}
            <div className="card-shadow bg-white rounded-2xl p-8 border border-gray-100 mb-6">
                <button
                    className="btn-premium w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={generateReport}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            Generate AI Report
                        </>
                    )}
                </button>
            </div>

            {/* Fallback Warning */}
            {source === 'fallback' && (
                <div className="card-shadow bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 text-yellow-800 p-6 rounded-2xl mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">⚠️</span>
                        <div>
                            <p className="font-bold text-lg">AI Unavailable</p>
                            <p className="text-sm mt-1">Showing rule-based analysis instead. Connect to API for AI-powered insights.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="card-shadow bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl mb-6">
                    <p className="font-bold">❌ Error</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {/* Report Display */}
            {report && (
                <div className="card-shadow bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-2xl font-bold text-gray-800">Generated Report</h3>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium leading-relaxed">{report}</pre>
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center p-4 italic">
                💡 AI-generated suggestions are recommendations only. Please verify and make procurement decisions based on your specific needs.
            </div>
        </div>
    );
}

export default AIInsightPanel;
