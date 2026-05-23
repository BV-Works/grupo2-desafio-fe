import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from "./pages/LoginPage/LoginPage"; 
import DashboardPage from "./pages/DashboardPage/DashboardPage"; 
import ProtectedRoute from './routes/ProtectedRoute';
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
          

{/*         <Route path="/transactions" element={ 
          <ProtectedRoute>
            <GenerateProgramPage />
          </ProtectedRoute>
         } />

         <Route path='/transactions/:id' element= {
          <ProtectedRoute>
            <ProgramDetailPage />
          </ProtectedRoute>
         } /> */}
      </ Routes>
    </BrowserRouter>
  ); 
}; 

export default App
