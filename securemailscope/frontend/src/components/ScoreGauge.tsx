import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskLevel } from '../types/analysis';

interface Props {
  score: number;
  riskLevel: RiskLevel;
}

export default function ScoreGauge({ score, riskLevel }: Props) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#10b981';
      default: return '#06b6d4';
    }
  };

  const color = getColor(riskLevel);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} className="animate-pulse-glow" />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center top-1/2 -mt-4">
        <span className="text-5xl font-bold" style={{ color }}>{Math.round(score)}</span>
        <span className="text-sm font-medium text-gray-400 mt-2 uppercase">{riskLevel} RISK</span>
      </div>
    </div>
  );
}
