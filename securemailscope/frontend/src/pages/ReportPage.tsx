import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileText, Eye, ArrowLeft } from 'lucide-react';
import { getReport, getAnalysis } from '../services/api';
import { AnalysisResult } from '../types/analysis';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!id) return;
    getAnalysis(id).then(setData).catch(console.error);
  }, [id]);

  const handleGenerate = async () => {
    if (!id) return;
    setGenerating(true);
    setError(null);
    try {
      const html = await getReport(id);
      setReportHtml(html);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!reportHtml || !id) return;
    setDownloading(true);
    try {
      const blob = new Blob([reportHtml], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `securemailscope-report-${id.slice(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
      setError("Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  const ra = data?.risk_assessment;

  return (
    <div className="space-y-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Security Report</h1>
          <p className="text-gray-400 text-sm">Generate and download a comprehensive security assessment report.</p>
        </div>
      </header>

      {/* Report summary card */}
      {data && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Report Contents</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-gray-500 text-xs">Sessions</p>
              <p className="text-white font-bold text-lg">{data.total_sessions}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-gray-500 text-xs">Findings</p>
              <p className="text-white font-bold text-lg">{data.findings.length}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-gray-500 text-xs">Risk Score</p>
              <p className="font-bold text-lg" style={{
                color: ra ? (ra.level === 'CRITICAL' ? '#ef4444' : ra.level === 'HIGH' ? '#f59e0b' : ra.level === 'MEDIUM' ? '#eab308' : '#10b981') : '#fff'
              }}>{ra?.score ?? 'N/A'}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-gray-500 text-xs">Risk Level</p>
              <p className="text-white font-bold text-lg">{ra?.level ?? 'N/A'}</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-gray-500 text-xs">Sections</p>
              <p className="text-white font-bold text-lg">10</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>Report includes: Executive Summary, Security Score, Traffic Summary, Email Sessions, TLS Analysis, Certificate Analysis, Cryptographic Weaknesses, Vulnerability Findings, AI Risk Assessment, and Remediation Recommendations.</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-colors ${
            generating ? 'bg-gray-700 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
          }`}
        >
          <Eye className="w-5 h-5" />
          {generating ? 'Generating...' : reportHtml ? 'Regenerate Report' : 'Generate Report'}
        </button>

        {reportHtml && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-colors bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download Report'}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Report Preview */}
      {reportHtml && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Report Preview</h3>
            <span className="text-xs text-gray-500">HTML Report</span>
          </div>
          <iframe
            srcDoc={reportHtml}
            className="w-full border-0"
            style={{ height: '600px' }}
            title="Security Report Preview"
          />
        </div>
      )}
    </div>
  );
}
