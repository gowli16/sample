import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis } from '../services/api';
import { AnalysisResult } from '../types/analysis';
import SessionRow from '../components/SessionRow';
import { Search, Filter } from 'lucide-react';

export default function SessionsPage() {
  const { id } = useParams();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!id) return;
    getAnalysis(id).then(result => {
      setData(result);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!data) return <div className="text-center text-gray-400 mt-20">No data found</div>;

  const filteredSessions = data.sessions.filter(s => {
    const matchProto = protocolFilter === 'ALL' || s.protocol.includes(protocolFilter);
    const matchSearch = search === '' ||
      s.src_ip.includes(search) ||
      s.dst_ip.includes(search) ||
      s.id.includes(search) ||
      (s.hostname && s.hostname.includes(search));
    return matchProto && matchSearch;
  });

  const protocols = ['ALL', ...Array.from(new Set(data.sessions.map(s => s.protocol)))];

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-white mb-2">Network Sessions</h1>
        <p className="text-gray-400 text-sm">Detailed view of all reconstructed email communications.</p>
      </header>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search IP, hostname or Session ID..."
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex bg-background border border-border rounded-lg p-1 flex-wrap">
            {protocols.map(p => (
              <button
                key={p}
                onClick={() => setProtocolFilter(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  protocolFilter === p ? 'bg-surface text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 py-3">Protocol</th>
                <th className="p-4 py-3">Connection</th>
                <th className="p-4 py-3">Security</th>
                <th className="p-4 py-3">Risk Score</th>
                <th className="p-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <SessionRow key={session.id} session={session} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No sessions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
