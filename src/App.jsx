import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from "./pages/LoginPage/LoginPage"; 
import DashboardPage from "./pages/DashboardPage/DashboardPage"; 
import ProtectedRoute from './routes/ProtectedRoute';
import TransactionDetailPage from './pages/TransactionDetail/TransactionDetail';
function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/login' element={ <LoginPage /> } />
        
          <Route path='/dashboard' element={ 
                                <ProtectedRoute>
                                    <DashboardPage /> 
                                </ProtectedRoute>
                                
            } />

         <Route path='/transactions/:id' element= {
          <ProtectedRoute>
            <TransactionDetailPage />
          </ProtectedRoute>
         } /> 
      </ Routes>
    </BrowserRouter>
  ); 
}; 

export default App
