interface Props {
  feature: string;
  contribution: number;
  maxContribution: number;
}

export default function FeatureBar({ feature, contribution, maxContribution }: Props) {
  const width = Math.max(5, (contribution / maxContribution) * 100);
  
  const color = contribution > 20 ? 'bg-red-500' : 
                contribution > 10 ? 'bg-amber-500' : 
                contribution > 5 ? 'bg-yellow-500' : 'bg-cyan-500';

  return (
    <div className="mb-3 animate-fade-in">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 truncate pr-2">{feature.replace(/_/g, ' ')}</span>
        <span className="text-gray-400 font-mono">+{contribution.toFixed(1)}</span>
      </div>
      <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
