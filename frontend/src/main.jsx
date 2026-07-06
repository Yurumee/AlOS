import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'

import Technicians from './Technicians.jsx';
import TechniciansNew from './TechniciansNew.jsx';
import TechniciansEdit from './TechniciansEdit.jsx';
import TechniciansDelete from './TechniciansDelete.jsx';

import Clients from './Clients.jsx'
import ClientsNew from './ClientsNew.jsx';
import ClientsEdit from './ClientsEdit.jsx';
import ClientsDelete from './ClientsDelete.jsx'

import Products from './Products.jsx';
import ProductsNew from './ProductsNew.jsx';
import ProductsEdit from './ProductsEdit.jsx'
import ProductsDelete from './ProductsDelete.jsx'

import Categories from './Categories.jsx';
import CategoriesNew from './CategoriesNew.jsx';
import CategoriesEdit from './CategoriesEdit.jsx';
import CategoriesDelete from './CategoriesDelete.jsx';

import Storages from './Storages.jsx';
import StoragesNew from './StoragesNew.jsx';
import StoragesEdit from './StoragesEdit.jsx';
import StoragesDelete from './StoragesDelete.jsx';

import Services from './Services.jsx'
import ServicesNew from './ServicesNew.jsx';
import ServicesEdit from './ServicesEdit.jsx';
import ServicesDelete from './ServicesDelete.jsx';

import ModalId from './ModalId.jsx';
import ModalProd from './ModalProd.jsx';
import ModalTech from './ModalTech.jsx';
import ModalCat from './ModalCat.jsx';
import ModalItem from './ModalItem.jsx';
import ModalServ from './ModalServ.jsx';
import ModalOS from './ModalOS.jsx';

import BudgetOS from './BudgetOS.jsx';

import OS from './OS.jsx';
import OSNew from './OSNew.jsx';
import OSEdit from './OSEdit.jsx';
import OSDelete from './OSDelete.jsx';

import AttachmentsNew from './Attachments.jsx';
import AttachmentsVisualize from './AttachmentsVisualize.jsx';
import AttachmentsEdit from './AttachmentsEdit.jsx';
import AttachmentsDelete from './AttachmentsDelete.jsx';
import AttachmentsOS from './AttachmentsOS.jsx';

// import Home from './Home.jsx';
import Login from './Login.jsx';

import PageNotFound from './NotFound.jsx';
import useToken from './components/useToken.js';
import 'bootstrap/dist/css/bootstrap.min.css';


<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
  integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
  crossorigin="anonymous"
/>

// eslint-disable-next-line react-refresh/only-export-components
function Main(){
  const {token, setToken} = useToken()

  return(
    <BrowserRouter>
    { !token && token !=='' && token !== undefined ?
    <Login path='/login' setToken={setToken} /> :(
      <>

      <Routes>
        <Route index element={<OS token={token} />} />
        <Route path='/clientes' element={<Clients token={token} />}/>
        <Route path='/novo-cliente' element={<ClientsNew token={token}/>}/>
        <Route path='/editar-cliente/:id' element={<ClientsEdit token={token}/>}/>
        <Route path='/deletar-cliente/:id' element={<ClientsDelete token={token}/>}/>
        <Route path='/editar-cliente' element={<ModalId operation={'edit'} show={() => true} close={() => {false; window.location.href = '/clientes'}}/>}/>
        <Route path='/deletar-cliente' element={<ModalId operation={'delete'} show={() => true} close={() => {false; window.location.href = '/clientes'}} />}/>

        <Route path='/produtos' element={<Products token={token}/>}/>
        <Route path='/novo-produto' element={<ProductsNew token={token}/>}/>
        <Route path='/editar-produto/:id' element={<ProductsEdit token={token}/>}/>
        <Route path='/deletar-produto/:id' element={<ProductsDelete token={token}/>}/>
        <Route path='/editar-produto' element={<ModalProd operation={'edit'} show={() => true} close={() => {false; window.location.href = '/produtos'}} />}/>
        <Route path='/deletar-produto' element={<ModalProd operation={'delete'} show={() => true} close={() => {false; window.location.href = '/produtos'}} />}/>
        
        <Route path='/tecnicos' element={<Technicians token={token}/>}/>
        <Route path='/novo-tecnico' element={<TechniciansNew token={token}/>}/>
        <Route path='/editar-tecnico/:id' element={<TechniciansEdit token={token}/>}/>
        <Route path='/deletar-tecnico/:id' element={<TechniciansDelete token={token}/>}/>
        <Route path='/editar-tecnico' element={<ModalTech operation={'edit'} show={() => true} close={() => {false; window.location.href = '/tecnicos'}} />}/>
        <Route path='/deletar-tecnico' element={<ModalTech operation={'delete'} show={() => true} close={() => {false; window.location.href = '/tecnicos'}} />}/>
          
        <Route path='/estoque' element={<Storages token={token}/>}/>
        <Route path='/novo-item' element={<StoragesNew token={token}/>}/>
        <Route path='/editar-item/:id' element={<StoragesEdit token={token}/>}/>
        <Route path='/deletar-item/:id' element={<StoragesDelete token={token}/>}/>
        <Route path='/editar-item' element={<ModalItem operation={'edit'} show={() => true} close={() => {false; window.location.href = '/estoque'}} />}/>
        <Route path='/deletar-item' element={<ModalItem operation={'delete'} show={() => true} close={() => {false; window.location.href = '/estoque'}} />}/>

        <Route path='/categorias' element={<Categories token={token}/>}/>
        <Route path='/nova-categoria' element={<CategoriesNew token={token}/>}/>
        <Route path='/editar-categoria/:id' element={<CategoriesEdit token={token}/>}/>
        <Route path='/deletar-categoria/:id' element={<CategoriesDelete token={token}/>}/>
        <Route path='/editar-categoria' element={<ModalCat operation={'edit'} show={() => true} close={() => {false; window.location.href = '/categorias'}} />}/>
        <Route path='/deletar-categoria' element={<ModalCat operation={'delete'} show={() => true} close={() => {false; window.location.href = '/categorias'}} />}/>

        <Route path='/servicos' element={<Services token={token}/>}/>
        <Route path='/novo-servico' element={<ServicesNew token={token}/>}/>
        <Route path='/editar-servico/:id' element={<ServicesEdit token={token}/>}/>
        <Route path='/deletar-servico/:id' element={<ServicesDelete token={token}/>}/>
        <Route path='/editar-servico' element={<ModalServ operation={'edit'} show={() => true} close={() => {false; window.location.href = '/servicos'}} />}/>
        <Route path='/deletar-servico' element={<ModalServ operation={'delete'} show={() => true} close={() => {false; window.location.href = '/servicos'}} />}/>

        <Route path='/os' element={<OS  token={token}/>}/>
        <Route path='/nova-os' element={<OSNew  token={token}/>}/>
        <Route path='/editar-os/:id' element={<OSEdit token={token}/>}/>
        <Route path='/orcamento-os/:id' element={<BudgetOS token={token}/>}/>
        <Route path='/deletar-os/:id' element={<OSDelete token={token}/>}/>
        <Route path='/editar-os' element={<ModalOS operation={'edit'} show={() => true} close={() => {false; window.location.href = '/os'}}/>}/>
        <Route path='/deletar-os' element={<ModalOS operation={'delete'} show={() => true} close={() => {false; window.location.href = '/os'}} />}/>

        <Route path='/cadastrar-anexo-os/:id' element={<AttachmentsNew token={token}/>}/>
        <Route path='/exibir-anexo-os/:id' element={<AttachmentsVisualize token={token}/>}/>
        <Route path='/editar-anexo-os/:id' element={<AttachmentsEdit token={token}/>}/>
        <Route path='/deletar-anexo-os/:id' element={<AttachmentsDelete token={token}/>}/>
        <Route path='/anexo-os/:id' element={<AttachmentsOS token={token}/>}/>

        <Route path='*' element={<PageNotFound/>} />
      </Routes>
      </>
    )
  }
  </BrowserRouter>
  )
}


createRoot(document.getElementById('root')).render(
  <Main />
  
)
