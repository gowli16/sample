import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis } from '../services/api';
import { AnalysisResult, SeverityLevel } from '../types/analysis';
import FindingCard from '../components/FindingCard';
import { ShieldAlert } from 'lucide-react';

export default function FindingsPage() {
  const { id } = useParams();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SeverityLevel | 'ALL'>('ALL');

  useEffect(() => {
    if (!id) return;
    getAnalysis(id).then(result => {
      setData(result);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!data) return <div className="text-center text-gray-400 mt-20">No data found</div>;

  const filteredFindings = filter === 'ALL'
    ? data.findings
    : data.findings.filter(f => f.severity === filter);

  const counts = {
    CRITICAL: data.findings.filter(f => f.severity === 'CRITICAL').length,
    HIGH: data.findings.filter(f => f.severity === 'HIGH').length,
    MEDIUM: data.findings.filter(f => f.severity === 'MEDIUM').length,
    LOW: data.findings.filter(f => f.severity === 'LOW').length,
  };

  const tabs: { label: string; value: SeverityLevel | 'ALL'; count?: number; color?: string }[] = [
    { label: 'All Findings', value: 'ALL', count: data.findings.length },
    { label: 'Critical', value: 'CRITICAL', count: counts.CRITICAL, color: 'text-red-500 bg-red-500/10' },
    { label: 'High', value: 'HIGH', count: counts.HIGH, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Medium', value: 'MEDIUM', count: counts.MEDIUM, color: 'text-yellow-500 bg-yellow-500/10' },
    { label: 'Low', value: 'LOW', count: counts.LOW, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-500" />
          Vulnerability Findings
        </h1>
        <p className="text-gray-400 text-sm">Security weaknesses detected in the analyzed traffic.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
              filter === tab.value
                ? 'bg-surface-hover border-border text-white'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-surface/50'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab.color || 'bg-surface border border-border text-gray-300'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredFindings.length > 0 ? (
          filteredFindings.map((finding, idx) => (
            <FindingCard key={idx} finding={finding} />
          ))
        ) : (
          <div className="glass-card p-12 text-center text-gray-500">
            {filter === 'ALL' ? 'No findings detected — all sessions meet security standards.' : `No ${filter.toLowerCase()} severity findings.`}
          </div>
        )}
      </div>
    </div>
  );
}
