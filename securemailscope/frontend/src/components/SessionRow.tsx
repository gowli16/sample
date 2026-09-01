import { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { SessionInfo } from '../types/analysis';
import SeverityBadge from './SeverityBadge';

interface Props {
  session: SessionInfo;
}

export default function SessionRow({ session }: Props) {
  const [expanded, setExpanded] = useState(false);

  const riskScore = session.risk_score ?? 0;
  const isEncrypted = session.crypto_details != null
    && session.crypto_details.tls_version !== 'None'
    && session.crypto_details.tls_version !== '';

  const riskColor = riskScore >= 80 ? 'text-red-500' :
                    riskScore >= 55 ? 'text-amber-500' :
                    riskScore >= 30 ? 'text-yellow-500' : 'text-emerald-500';

  const cd = session.crypto_details;

  return (
    <>
      <tr
        className="border-b border-border hover:bg-surface-hover cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="p-4 py-3 text-sm font-medium text-white">{session.protocol}</td>
        <td className="p-4 py-3 text-sm text-gray-300">{session.src_ip} &rarr; {session.dst_ip}:{session.dst_port}</td>
        <td className="p-4 py-3 text-sm">
          {isEncrypted ? (
            <span className="flex items-center gap-1 text-emerald-500"><Lock className="w-4 h-4"/> Encrypted</span>
          ) : (
            <span className="flex items-center gap-1 text-red-500"><Unlock className="w-4 h-4"/> Plaintext</span>
          )}
        </td>
        <td className={`p-4 py-3 text-sm font-bold ${riskColor}`}>{riskScore}</td>
        <td className="p-4 py-3 text-right">
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-500 inline" /> : <ChevronDown className="w-5 h-5 text-gray-500 inline" />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="p-0 bg-surface/50">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in border-b border-border">
              {/* Connection Details */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Connection Details</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-gray-500 w-28 inline-block">Session ID:</span> {session.id}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Protocol:</span> {session.protocol}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Source:</span> {session.src_ip}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Destination:</span> {session.dst_ip}:{session.dst_port}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Hostname:</span> {session.hostname || 'N/A'}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Bytes:</span> {session.bytes_transferred.toLocaleString()}</p>
                  <p><span className="text-gray-500 w-28 inline-block">Duration:</span> {session.duration_ms}ms</p>
                </div>
              </div>

              {/* Crypto Details */}
              {cd && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cryptographic Config</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-500 w-28 inline-block">TLS Version:</span> {cd.tls_version}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Cipher Suite:</span> <span className="text-xs font-mono">{cd.cipher_suite}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">STARTTLS:</span> {cd.starttls_used ? '✅ Used' : '❌ Not used'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Handshake:</span> {cd.handshake_status}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Key Size:</span> {cd.key_size} bits</p>
                    <p><span className="text-gray-500 w-28 inline-block">Sig Algorithm:</span> {cd.signature_algorithm}</p>
                  </div>
                </div>
              )}

              {/* Certificate Details */}
              {cd && cd.tls_version !== 'None' && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Certificate</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-500 w-28 inline-block">Valid:</span> {cd.cert_valid ? '✅ Yes' : '❌ No'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Expired:</span> {cd.cert_expired ? '❌ Yes' : '✅ No'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Self-Signed:</span> {cd.self_signed ? '⚠️ Yes' : '✅ No'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Hostname Match:</span> {cd.hostname_match ? '✅ Yes' : '❌ No'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Chain Valid:</span> {cd.chain_valid ? '✅ Yes' : '❌ No'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Issuer:</span> {cd.cert_issuer || 'N/A'}</p>
                    <p><span className="text-gray-500 w-28 inline-block">Expiry:</span> {cd.cert_expiry_date || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Session Findings */}
            {session.session_findings && session.session_findings.length > 0 && (
              <div className="p-6 border-b border-border">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Session Vulnerabilities ({session.session_findings.length})
                </h4>
                <div className="space-y-2">
                  {session.session_findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <SeverityBadge level={f.severity} />
                      <div>
                        <span className="text-white font-medium">{f.title}</span>
                        <p className="text-gray-400 text-xs mt-0.5">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
