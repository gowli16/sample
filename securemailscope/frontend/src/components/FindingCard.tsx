import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Finding } from '../types/analysis';
import SeverityBadge from './SeverityBadge';

interface Props {
  finding: Finding;
}

export default function FindingCard({ finding }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <SeverityBadge level={finding.severity} />
            <h3 className="text-lg font-semibold text-white">{finding.title}</h3>
          </div>
          <p className="text-gray-400 text-sm">{finding.description}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border grid gap-4 animate-fade-in text-sm">
          <div>
            <span className="text-gray-500 font-medium block mb-1">Impact</span>
            <p className="text-gray-300">{finding.impact}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium block mb-1">Recommendation</span>
            <p className="text-emerald-400">{finding.recommendation}</p>
          </div>
          {finding.evidence && (
            <div>
              <span className="text-gray-500 font-medium block mb-1">Evidence</span>
              <pre className="bg-background p-3 rounded border border-border text-xs text-gray-300 overflow-x-auto">
                {finding.evidence}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
