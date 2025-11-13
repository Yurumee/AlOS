import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import Clients from './Clients.jsx'
import ClientsNew from './ClientsNew.jsx';
import Home from './Home.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/clientes' element={<Clients />}/>
        <Route path='/novo-cliente' element={<ClientsNew />}/>
        {/* <Route path='/produtos' element={<Products />}/> */}
        {/* <Route path='/estoque' element={<Stocks />}/> */}
        {/* <Route path='/servicos' element={<Services />}/> */}
        {/* <Route path='/os' element={<OS />}/> */}
      </Routes>
  </BrowserRouter>
)
