import './styles/NavBar.css'
import './styles/index.css'
import useToken from './components/useToken';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// import { useNavigate } from 'react-router-dom';

function NavBar() {
    // const navigation = useNavigate()
    
    const { removeToken } = useToken()

    async function logout(){
        const URL = 'http://localhost:5000/tecnico/logout'
        await fetch(URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => {removeToken()})
        .catch((error) => console.log(error))

        // if(localStorage.getItem('token'))
        // {
        //     window.location.reload()
        // }
        window.location.reload()

        // navigation("/login", { replace: true } );
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
                        
                        <Nav.Link href="/estoque">Estoque</Nav.Link>
                        <Nav.Link href="/clientes">Serviços</Nav.Link>

                        <NavDropdown title='Técnicos'>
                            <NavDropdown.Item href='/tecnicos'>Ir para Técnicos</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-tecnico'>Novo Técnico</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-tecnico'>Editar Técnico</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-tecnico'>Deletar Técnico</NavDropdown.Item>
                        </NavDropdown>
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

    )
}

export default NavBar