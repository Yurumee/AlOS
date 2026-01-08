import './styles/NavBar.css'
import './styles/index.css'
import useToken from './components/useToken';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
    const { removeToken } = useToken()

    async function logout(){
        const URL = 'http://localhost:5000/tecnico/logout'
        await fetch(URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => {removeToken()})
        .catch((error) => console.log(error))

        window.location.href = '/'
    }

    // function goto_home() {
    //     window.location.href = '/'
    // }

    // function goto_client() {
    //     window.location.href = '/clientes'
    // }

    // function goto_product() {
    //     window.location.href = '/produtos'
    // }

    // function goto_stock() {
    //     window.location.href = '/estoque'
    // }

    // function goto_service() {
    //     window.location.href = '/servicos'
    // }

    // function goto_os() {
    //     window.location.href = '/ordem-servicos'
    // }

    // function search() {

    // }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <Navbar expand="lg" bg='warning'>
            <Container fluid>
                <Navbar.Brand href='/'>Logo Empresa</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/clientes">Ordem de Serviço</Nav.Link>
                        {/* <Nav.Link href="/clientes">Clientes</Nav.Link> */}
                        
                        <NavDropdown title='Clientes'>
                            <NavDropdown.Item href='/clientes'>Ir para Clientes</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-cliente'>Novo Cliente</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-cliente'>Editar Cliente</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-cliente'>Deletar Cliente</NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown title='Produtos'>
                            <NavDropdown.Item href='/produtos'>Ir para Produtos</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-produto'>Novo Produto</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-produto'>Editar Produto</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-produto'>Deletar Produto</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Nav.Link href="/clientes">Estoque</Nav.Link>
                        <Nav.Link href="/clientes">Serviços</Nav.Link>
                    </Nav>

                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    
                    <Button variant='danger' onClick={logout} style={{'marginLeft':'8px'}}>Sair</Button>

                </Navbar.Collapse>
            </Container>
            </Navbar>
        </>

        // <>
        //     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        //     <header>
        //         <div className='navbar'>

        //             <img className='logo' onClick={goto_home} src='/logo-placeholder.png' alt="logo da empresa" />

        //             <div className='categories'>
        //                 <div onClick={goto_os}>
        //                     Ordens de Serviço
        //                 </div>

        //                 <div onClick={goto_client}>
        //                     Clientes
        //                 </div>

        //                 <div onClick={goto_product}>
        //                     Produtos
        //                 </div>

        //                 <div onClick={goto_stock}>
        //                     Estoque
        //                 </div>

        //                 <div onClick={goto_service}>
        //                     Serviços
        //                 </div>

        //                 <input className='searchbar' type="text" />
        //                 <span className="material-icons md-24 md-primary search-icon" onClick={search}>search</span>
        //             </div>

        //         </div>
        //     </header>
        // </>
    )
}

export default NavBar

// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

// function NavScrollExample() {
//   return (
//     <Navbar expand="lg" className="bg-body-tertiary">
//       <Container fluid>
//         <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav
//             className="me-auto my-2 my-lg-0"
//             style={{ maxHeight: '100px' }}
//             navbarScroll
//           >
//             <Nav.Link href="#action1">Home</Nav.Link>
//             <Nav.Link href="#action2">Link</Nav.Link>
//             <NavDropdown title="Link" id="navbarScrollingDropdown">
//               <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
//               <NavDropdown.Item href="#action4">
//                 Another action
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#action5">
//                 Something else here
//               </NavDropdown.Item>
//             </NavDropdown>
//             <Nav.Link href="#" disabled>
//               Link
//             </Nav.Link>
//           </Nav>
//           <Form className="d-flex">
//             <Form.Control
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               aria-label="Search"
//             />
//             <Button variant="outline-success">Search</Button>
//           </Form>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default NavScrollExample;