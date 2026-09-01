import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PipelineStep from '../components/PipelineStep';
import { getAnalysis } from '../services/api';

const PIPELINE_STEPS = [
  "Reading PCAP file",
  "Identifying network protocols",
  "Detecting email traffic",
  "Reconstructing email sessions",
  "Analyzing TLS handshakes",
  "Inspecting certificates",
  "Evaluating cryptographic configuration",
  "Running AI security assessment",
  "Generating security report"
];

export default function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let intervalId: ReturnType<typeof setInterval>;

    // Simulate pipeline progression visually while polling the backend
    const visualProgressId = setInterval(() => {
      setCurrentStep(prev => prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev);
    }, 1200);

    const checkStatus = async () => {
      try {
        const data = await getAnalysis(id);
        if (data.status === 'COMPLETED' || data.status === 'NOT_APPLICABLE') {
          clearInterval(intervalId);
          clearInterval(visualProgressId);
          setCurrentStep(PIPELINE_STEPS.length); // All complete

          setTimeout(() => {
            navigate(`/dashboard/${id}`);
          }, 800);
        } else if (data.status === 'FAILED') {
          clearInterval(intervalId);
          clearInterval(visualProgressId);
          setError(data.error_message || 'Analysis failed');
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    intervalId = setInterval(checkStatus, 1500);
    checkStatus();

    return () => {
      clearInterval(intervalId);
      clearInterval(visualProgressId);
    };
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Traffic</h2>
          <p className="text-gray-400 text-sm">Please wait while SecureMailScope processes your file.</p>
          <p className="text-xs text-gray-600 mt-2 font-mono">ID: {id}</p>
        </div>

        <div className="glass-card p-8">
          {error ? (
            <div className="text-red-500 text-center py-8">
              <p className="font-bold text-lg mb-2">Analysis Failed</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors border border-border text-gray-300"
              >
                Back to Upload
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {PIPELINE_STEPS.map((step, index) => {
                const state = currentStep > index ? 'completed' : currentStep === index ? 'processing' : 'pending';
                return (
                  <PipelineStep
                    key={index}
                    stepNumber={index + 1}
                    label={step}
                    state={state}
                    isLast={index === PIPELINE_STEPS.length - 1}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
