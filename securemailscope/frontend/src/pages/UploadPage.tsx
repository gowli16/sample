import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, Play, AlertCircle } from 'lucide-react';
import { uploadPcap, getScenarios, runScenario } from '../services/api';
import { ScenarioInfo } from '../types/analysis';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);

  useEffect(() => {
    getScenarios().then(setScenarios).catch(console.error);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.pcap') && !file.name.endsWith('.pcapng')) {
      setError('Invalid file type. Please upload a .pcap or .pcapng file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await uploadPcap(selectedFile);
      navigate(`/analysis/${response.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setIsUploading(false);
    }
  };

  const handleScenario = async (name: string) => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await runScenario(name);
      navigate(`/analysis/${response.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start scenario');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">SecureMailScope</h1>
          <p className="text-gray-400 text-lg">AI-assisted cryptographic security posture assessment</p>
        </div>

        <div className="glass-card p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 ${
              isDragging ? 'border-cyan-500 bg-cyan-500/5' : 
              selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 
              'border-gray-700 hover:border-gray-500 bg-surface/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <File className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 cursor-pointer">
                <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="w-8 h-8 text-cyan-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">Drag & drop your PCAP file here</p>
                  <p className="text-gray-400 text-sm mt-2">Supports .pcap and .pcapng formats</p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pcap,.pcapng"
              onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
            />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isUploading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                !selectedFile || isUploading
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Analyze Traffic'}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Supports SMTP (25, 465, 587), IMAP (143, 993), and POP3 (110, 995)
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Demo Scenarios</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenarios.map((s) => (
                <button
                  key={s.name}
                  onClick={() => handleScenario(s.name)}
                  disabled={isUploading}
                  className="glass-card p-4 text-left hover:bg-surface-hover transition-colors group flex items-start justify-between"
                >
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">{s.name}</h4>
                    <p className="text-gray-500 text-xs line-clamp-2">{s.description}</p>
                  </div>
                  <Play className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 mt-1 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
