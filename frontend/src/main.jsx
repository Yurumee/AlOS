import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import Clients from './Clients.jsx'
import Products from './Products.jsx';
import ProductsNew from './ProductsNew.jsx';
import ClientsNew from './ClientsNew.jsx';
import ClientsEdit from './ClientsEdit.jsx';
import ClientsDelete from './ClientsDelete.jsx'
import ModalId from './ModalId.jsx';
import Home from './Home.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
  integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
  crossorigin="anonymous"
/>

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/clientes' element={<Clients />}/>
        <Route path='/novo-cliente' element={<ClientsNew />}/>
        <Route path='/editar-cliente/:id' element={<ClientsEdit />}/>
        <Route path='/deletar-cliente/:id' element={<ClientsDelete />}/>
        <Route path='/editar-cliente/' element={<ModalId operation={'edit'}/>}/>
        <Route path='/deletar-cliente/' element={<ModalId operation={'delete'}/>}/>
        <Route path='/produtos' element={<Products />}/>
        <Route path='/novo-produto' element={<ProductsNew />}/>
        {/* <Route path='/estoque' element={<Stocks />}/> */}
        {/* <Route path='/servicos' element={<Services />}/> */}
        {/* <Route path='/os' element={<OS />}/> */}
      </Routes>
  </BrowserRouter>
)
