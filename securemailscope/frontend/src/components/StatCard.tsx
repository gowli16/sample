import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
}

export default function StatCard({ title, value, icon: Icon, colorClass = "text-cyan-500" }: Props) {
  return (
    <div className="glass-card p-6 flex items-center gap-4 glass-card-hover cursor-default">
      <div className={`p-3 rounded-lg bg-surface border border-border ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
