
import React, { useState } from 'react';

const App = () => {
  const [macroFile, setMacroFile] = useState(null);
  const [microFile, setMicroFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    if (!macroFile || !microFile) return alert("Please upload both images!");
    setLoading(true);

    const formData = new FormData();
    formData.append('macro_file', macroFile);
    formData.append('micro_file', microFile);

    try {
      const response = await fetch('https://lowen-backend-production.up.railway.app/analyze', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-slate-700 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">LOWEN CORP <span className="text-slate-400 font-light">| AI Logistics</span></h1>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Autonomous Measurement Pipeline</p>
          <p className="text-sm font-mono text-green-500">Status: System Online</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <label className="block mb-2 text-sm font-medium text-slate-400 italic">Step 1: Macro View (Whole Trailer)</label>
            <input type="file" onChange={(e) => setMacroFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <label className="block mb-2 text-sm font-medium text-slate-400 italic">Step 2: Micro View (Tape Calibration)</label>
            <input type="file" onChange={(e) => setMicroFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
          </div>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-xl transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-700"
        >
          {loading ? "PROCESSING NEURAL PIPELINE..." : "INITIATE FULL ANALYSIS"}
        </button>

        {/* Results Section */}
        {data && (
          <div className="mt-12 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs text-slate-500 uppercase">Fleet Owner</p>
                <p className="text-2xl font-bold">{data.results.fleet_owner}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-xs text-slate-500 uppercase">Total Area</p>
                <p className="text-2xl font-bold">{data.results.total_area_sqft} <span className="text-sm font-normal">sqft</span></p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-xs text-slate-500 uppercase">Billable Ink</p>
                <p className="text-2xl font-bold">{data.results.ink_yield_sqft} <span className="text-sm font-normal">sqft</span></p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-xs text-slate-500 uppercase">Dimensions</p>
                <p className="text-2xl font-bold">{data.results.length_ft}' x {data.results.height_ft}'</p>
              </div>
            </div>

            {/* Visual Proofs Gallery */}
            <h3 className="text-xl font-semibold mb-6 text-slate-400">Visual Evidence Manifest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <p className="p-2 text-xs font-mono text-blue-400">1. FLATTENED GEOMETRY & STRIP COUNT</p>
                  <img src={`data:image/jpeg;base64,${data.visuals.flattened_strips}`} className="w-full rounded-lg" alt="Strips" />
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <p className="p-2 text-xs font-mono text-green-400">2. OTSU TRUE-INK BINARIZATION</p>
                  <img src={`data:image/jpeg;base64,${data.visuals.pixel_scan}`} className="w-full rounded-lg border border-green-900" alt="Otsu" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <p className="p-2 text-xs font-mono text-yellow-400">3. MASTER DIMENSIONAL MANIFEST</p>
                  <img src={`data:image/jpeg;base64,${data.visuals.final_manifest}`} className="w-full rounded-lg" alt="Final" />
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <p className="p-2 text-xs font-mono text-purple-400">4. TAPE CALIBRATION (MICRO)</p>
                  <img src={`data:image/jpeg;base64,${data.visuals.micro_pattern}`} className="w-full rounded-lg" alt="Tape" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;