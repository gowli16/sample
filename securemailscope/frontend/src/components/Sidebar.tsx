import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, Network, AlertTriangle, FileText, ShieldAlert, Upload } from 'lucide-react';

export default function Sidebar() {
  const { id } = useParams();
  const analysisId = id || '';

  const navItems = [
    { to: `/dashboard/${analysisId}`, icon: LayoutDashboard, label: 'Dashboard' },
    { to: `/upload`, icon: Upload, label: 'PCAP Analysis' },
    { to: `/sessions/${analysisId}`, icon: Network, label: 'Sessions' },
    { to: `/findings/${analysisId}`, icon: AlertTriangle, label: 'Findings' },
    { to: `/reports/${analysisId}`, icon: FileText, label: 'Reports' },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1e293b] flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-[#1e293b]">
        <ShieldAlert className="w-8 h-8 text-cyan-500" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">SecureMailScope</h1>
          <p className="text-[10px] text-gray-500 -mt-0.5">Security Posture Assessment</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e293b]">
        <p className="text-xs text-gray-600 text-center">SecureMailScope v1.0.0</p>
      </div>
    </aside>
  );
}
