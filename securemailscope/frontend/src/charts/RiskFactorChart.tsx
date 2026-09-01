import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FeatureContribution } from '../types/analysis';

interface Props {
  data: FeatureContribution[];
}

export default function RiskFactorChart({ data }: Props) {
  if (!data || data.length === 0) return (
    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
      No risk factors to display
    </div>
  );

  // Use description for display, fallback to feature name
  const chartData = data.slice(0, 8).map(d => ({
    name: d.description || d.feature.replace(/_/g, ' '),
    contribution: Number(d.contribution.toFixed(1)),
  }));

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" stroke="#6b7280" fontSize={12} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#9ca3af"
            fontSize={11}
            width={180}
            tick={{ fill: '#9ca3af' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [`+${value}`, 'Contribution']}
          />
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.contribution > 20 ? '#ef4444' : entry.contribution > 10 ? '#f59e0b' : '#06b6d4'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
