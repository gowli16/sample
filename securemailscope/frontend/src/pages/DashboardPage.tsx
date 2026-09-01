import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, Lock, Unlock, MailWarning, Shield, AlertTriangle } from 'lucide-react';
import { getAnalysis } from '../services/api';
import { AnalysisResult, FeatureContribution } from '../types/analysis';
import ScoreGauge from '../components/ScoreGauge';
import StatCard from '../components/StatCard';
import FindingCard from '../components/FindingCard';
import FeatureBar from '../components/FeatureBar';
import ProtocolChart from '../charts/ProtocolChart';
import TlsVersionChart from '../charts/TlsVersionChart';
import RiskFactorChart from '../charts/RiskFactorChart';

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAnalysis(id).then(result => {
      setData(result);
      // If still processing, redirect back to analysis page
      if (result.status === 'PROCESSING' || result.status === 'PENDING') {
        navigate(`/analysis/${id}`);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!data) return <div className="text-center text-gray-400 mt-20">Analysis data not found</div>;

  // ── NOT APPLICABLE: no email traffic ───────────────────────────────
  if (data.status === 'NOT_APPLICABLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border border-border">
          <MailWarning className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">No Supported Email Communication Detected</h2>
        <p className="text-gray-400 text-lg">
          The uploaded PCAP file does not contain supported email protocols (SMTP, IMAP, POP3).
        </p>
        <div className="glass-card p-6 w-full text-left space-y-4">
          <h3 className="font-semibold text-white">Detected Traffic</h3>
          {data.detected_traffic_types && data.detected_traffic_types.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.detected_traffic_types.map((t) => (
                <span key={t} className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-gray-300">{t}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No identifiable traffic types found.</p>
          )}
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-gray-400"><span className="text-gray-500">Email Sessions:</span> 0</p>
            <p className="text-sm text-gray-400"><span className="text-gray-500">Status:</span> NOT APPLICABLE</p>
          </div>
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-medium text-white mb-2">Recommendations</h4>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/upload')} className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-400 transition-colors">
          Upload Another PCAP
        </button>
      </div>
    );
  }

  // ── MAIN DASHBOARD ─────────────────────────────────────────────────
  const ra = data.risk_assessment;
  const contributions: FeatureContribution[] = ra?.feature_contributions ?? [];
  const maxContrib = Math.max(...contributions.map(c => c.contribution), 10);

  // Build TLS version chart data from tls_version_counts
  const tlsChartData: Record<string, number> = {};
  if (data.tls_version_counts) {
    const tc = data.tls_version_counts;
    if (tc.tls_1_3 > 0) tlsChartData['TLS 1.3'] = tc.tls_1_3;
    if (tc.tls_1_2 > 0) tlsChartData['TLS 1.2'] = tc.tls_1_2;
    if (tc.tls_1_1 > 0) tlsChartData['TLS 1.1'] = tc.tls_1_1;
    if (tc.tls_1_0 > 0) tlsChartData['TLS 1.0'] = tc.tls_1_0;
    if (tc.ssl > 0) tlsChartData['SSL'] = tc.ssl;
    if (tc.unencrypted > 0) tlsChartData['Unencrypted'] = tc.unencrypted;
  }

  // Build crypto details summary from sessions
  const firstEncryptedSession = data.sessions.find(s =>
    s.crypto_details && s.crypto_details.tls_version !== 'None'
  );
  const cd = firstEncryptedSession?.crypto_details;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Security Dashboard</h1>
          <p className="text-gray-400 text-sm font-mono">Analysis ID: {data.id}</p>
        </div>
        <div className="text-sm text-gray-500 bg-surface px-4 py-2 rounded-lg border border-border">
          Sessions: <span className="text-gray-300 font-medium">{data.total_sessions}</span>
          <span className="mx-2">|</span>
          Status: <span className="text-emerald-400 font-medium">{data.status}</span>
        </div>
      </header>

      {/* ── Score + Stats ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 glass-card p-6 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 w-full text-left">Overall Posture</h2>
          {ra ? (
            <ScoreGauge score={ra.score} riskLevel={ra.level} />
          ) : (
            <div className="text-gray-500 text-center py-10">No assessment</div>
          )}
        </div>

        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard title="Total Sessions" value={data.total_sessions} icon={Network} colorClass="text-blue-500" />
          <StatCard title="Encrypted" value={data.encrypted_sessions} icon={Lock} colorClass="text-emerald-500" />
          <StatCard title="Unencrypted" value={data.unencrypted_sessions} icon={Unlock} colorClass="text-red-500" />
          <StatCard title="SMTP" value={
            Object.entries(data.protocol_counts)
              .filter(([k]) => k.includes('SMTP'))
              .reduce((sum, [, v]) => sum + v, 0)
          } icon={Network} colorClass="text-purple-500" />
          <StatCard title="IMAP" value={
            Object.entries(data.protocol_counts)
              .filter(([k]) => k.includes('IMAP'))
              .reduce((sum, [, v]) => sum + v, 0)
          } icon={Network} colorClass="text-cyan-500" />
          <StatCard title="POP3" value={
            Object.entries(data.protocol_counts)
              .filter(([k]) => k.includes('POP3'))
              .reduce((sum, [, v]) => sum + v, 0)
          } icon={Network} colorClass="text-amber-500" />
        </div>
      </section>

      {/* ── Traffic Overview (charts) ──────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Protocol Distribution</h2>
          <ProtocolChart data={data.protocol_counts} />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">TLS Versions</h2>
          <TlsVersionChart data={tlsChartData} />
        </div>
      </section>

      {/* ── Cryptographic Security ─────────────────────────────────── */}
      {cd && (
        <section className="glass-card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Cryptographic Security Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'TLS Version', value: cd.tls_version, secure: cd.tls_version === 'TLSv1.3' || cd.tls_version === 'TLSv1.2' },
              { label: 'Cipher Suite', value: cd.cipher_suite, secure: !cd.cipher_suite.includes('RC4') && !cd.cipher_suite.includes('DES') && cd.cipher_suite !== 'None' },
              { label: 'STARTTLS', value: cd.starttls_used ? 'Enabled' : 'Not Used', secure: cd.starttls_used || cd.tls_version !== 'None' },
              { label: 'Certificate', value: cd.cert_valid ? 'Valid' : cd.cert_expired ? 'Expired' : 'Invalid', secure: cd.cert_valid && !cd.cert_expired },
              { label: 'Hostname Match', value: cd.hostname_match ? 'Match' : 'Mismatch', secure: cd.hostname_match },
              { label: 'Chain Valid', value: cd.chain_valid ? 'Valid' : 'Invalid', secure: cd.chain_valid },
              { label: 'Key Size', value: `${cd.key_size} bits`, secure: cd.key_size >= 2048 },
              { label: 'Signature', value: cd.signature_algorithm, secure: !cd.signature_algorithm.includes('SHA1') && !cd.signature_algorithm.includes('MD5') },
              { label: 'Handshake', value: cd.handshake_status, secure: cd.handshake_status === 'Successful' },
              { label: 'Self-Signed', value: cd.self_signed ? 'Yes' : 'No', secure: !cd.self_signed },
            ].map((item, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-white truncate" title={item.value}>{item.value}</p>
                <div className={`mt-2 text-xs font-semibold ${item.secure ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.secure ? '✓ Secure' : '✗ Issue'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── AI Risk Assessment ─────────────────────────────────────── */}
      {ra && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              AI Risk Assessment
            </h2>
            <div className="mb-6 flex justify-between items-center pb-4 border-b border-border">
              <div>
                <p className="text-sm text-gray-500 mb-1">Model Confidence</p>
                <p className="text-xl font-medium text-white">{(ra.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                <p className="text-xl font-bold" style={{
                  color: ra.level === 'CRITICAL' ? '#ef4444' :
                         ra.level === 'HIGH' ? '#f59e0b' :
                         ra.level === 'MEDIUM' ? '#eab308' : '#10b981'
                }}>{ra.score} / 100</p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-white mb-4">Why this score?</h3>
            <div className="space-y-3">
              {contributions.slice(0, 6).map((fc, idx) => (
                <FeatureBar
                  key={idx}
                  feature={fc.description || fc.feature}
                  contribution={fc.contribution}
                  maxContribution={maxContrib}
                />
              ))}
              {contributions.length === 0 && (
                <p className="text-gray-500 text-sm">No significant risk factors identified.</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Risk Factor Impact</h2>
            <div className="flex-1 min-h-[300px]">
              <RiskFactorChart data={contributions} />
            </div>
          </div>
        </section>
      )}

      {/* ── Vulnerability Findings ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Vulnerability Findings
          </h2>
          <span className="px-3 py-1 bg-surface border border-border rounded-full text-sm font-medium text-gray-300">
            {data.findings.length} findings
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.findings.slice(0, 5).map((finding, idx) => (
            <FindingCard key={idx} finding={finding} />
          ))}
        </div>

        {data.findings.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(`/findings/${id}`)}
              className="text-cyan-500 hover:text-cyan-400 text-sm font-medium transition-colors"
            >
              View all {data.findings.length} findings &rarr;
            </button>
          </div>
        )}

        {data.findings.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-emerald-400 font-medium">No vulnerabilities detected</p>
            <p className="text-gray-500 text-sm mt-1">All analyzed sessions meet security standards.</p>
          </div>
        )}
      </section>
    </div>
  );
}
