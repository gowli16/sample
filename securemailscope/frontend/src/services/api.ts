/**
 * SecureMailScope — API client.
 *
 * All endpoints match the FastAPI backend at localhost:8000/api.
 */

import axios from 'axios';
import { AnalysisResponse, AnalysisResult, ScenarioInfo, HealthResponse } from '../types/analysis';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
});

/** Upload a PCAP/PCAPNG file and start analysis. */
export const uploadPcap = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<AnalysisResponse>('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/** Get analysis status and results. */
export const getAnalysis = async (id: string): Promise<AnalysisResult> => {
  const response = await api.get<AnalysisResult>(`/analyze/${id}`);
  return response.data;
};

/** Get the HTML security report. */
export const getReport = async (id: string): Promise<string> => {
  const response = await api.get<string>(`/report/${id}`, {
    responseType: 'text' as any,
  });
  return response.data;
};

/** List available demo scenarios. */
export const getScenarios = async (): Promise<ScenarioInfo[]> => {
  const response = await api.get<ScenarioInfo[]>('/scenarios');
  return response.data;
};

/** Run a demo scenario analysis. */
export const runScenario = async (name: string): Promise<AnalysisResponse> => {
  const response = await api.post<AnalysisResponse>(`/analyze/scenario/${name}`);
  return response.data;
};

/** Health check. */
export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};
