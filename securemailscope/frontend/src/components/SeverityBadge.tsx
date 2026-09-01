import { SeverityLevel } from '../types/analysis';

interface Props {
  level: SeverityLevel;
}

export default function SeverityBadge({ level }: Props) {
  const getSeverityClass = (lvl: SeverityLevel) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'MEDIUM': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'INFO': return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${getSeverityClass(level)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {level}
    </span>
  );
}
