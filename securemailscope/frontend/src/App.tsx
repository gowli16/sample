import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';
import SessionsPage from './pages/SessionsPage';
import FindingsPage from './pages/FindingsPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/analysis/:id" element={<AnalysisPage />} />
      
      <Route element={<Layout />}>
        <Route path="/dashboard/:id" element={<DashboardPage />} />
        <Route path="/sessions/:id" element={<SessionsPage />} />
        <Route path="/findings/:id" element={<FindingsPage />} />
        <Route path="/reports/:id" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}

export default App;
