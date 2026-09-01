import { Check, Loader2, Circle } from 'lucide-react';

interface Props {
  stepNumber: number;
  label: string;
  state: 'pending' | 'processing' | 'completed';
  isLast?: boolean;
}

export default function PipelineStep({ stepNumber, label, state, isLast = false }: Props) {
  return (
    <div className="flex gap-4 min-h-[4rem]">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500
          ${state === 'completed' ? 'bg-emerald-500 border-emerald-500 text-background' :
            state === 'processing' ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' :
            'border-gray-700 text-gray-600'
          }`}
        >
          {state === 'completed' ? <Check className="w-5 h-5" /> : 
           state === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           <span className="text-sm font-medium">{stepNumber}</span>}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-2 transition-colors duration-500 
            ${state === 'completed' ? 'bg-emerald-500' : 'bg-gray-800'}`} 
          />
        )}
      </div>
      <div className={`pt-1 transition-colors duration-300 font-medium
        ${state === 'completed' ? 'text-gray-200' : 
          state === 'processing' ? 'text-white' : 
          'text-gray-600'}`}
      >
        {label}
      </div>
    </div>
  );
}
