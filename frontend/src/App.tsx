import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import BoardPage from '@/pages/BoardPage';
import ContactsPage from '@/pages/ContactsPage';
import VehiclesPage from '@/pages/VehiclesPage';
import ContractsPage from '@/pages/ContractsPage';
import DashboardPage from '@/pages/DashboardPage';
import BoardsManagePage from '@/pages/BoardsManagePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="boards" element={<BoardsManagePage />} />
          <Route path="boards/:boardId" element={<BoardPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="contracts" element={<ContractsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
