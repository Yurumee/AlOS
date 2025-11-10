import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import Clients from './Clients.jsx'
import Home from './Home.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/cliente' element={<Clients />}/>
      </Routes>
  </BrowserRouter>
)
