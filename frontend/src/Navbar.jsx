import './styles/index.css'
import useToken from './components/useToken';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
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
        
        window.location.reload()

        window.location.href = '/login'

    }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <Navbar expand="lg" bg='warning'>
            <Container fluid>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/os">Início</Nav.Link>
                        
                        <NavDropdown title='Ordem de Serviço'>
                            <NavDropdown.Item href='/os'>Ir para OS</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/nova-os'>Nova Ordem</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-os'>Editar Ordem</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-os'>Deletar Ordem</NavDropdown.Item>
                        </NavDropdown>
                        
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
                        
                        <NavDropdown title='Estoque'>
                            <NavDropdown.Item href='/estoque'>Ir para Estoque</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-item'>Novo Item</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-item'>Editar um Item</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-item'>Deletar um Item</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/categorias'>Ir para Categorias</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title='Serviços'>
                            <NavDropdown.Item href='/servicos'>Ir para Serviços</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-servico'>Novo Serviço</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-servico'>Editar Serviço</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-servico'>Deletar Serviço</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/categorias'>Ir para Categorias</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title='Técnicos'>
                            <NavDropdown.Item href='/tecnicos'>Ir para Técnicos</NavDropdown.Item>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <NavDropdown.Item href='/novo-tecnico'>Novo Técnico</NavDropdown.Item>
                            <NavDropdown.Item href='/editar-tecnico'>Editar Técnico</NavDropdown.Item>
                            <NavDropdown.Item href='/deletar-tecnico'>Deletar Técnico</NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                    
                    <Button variant='danger' onClick={logout} style={{'marginLeft':'8px'}}>Sair</Button>

                </Navbar.Collapse>
            </Container>
            </Navbar>
        </>

    )
}

export default NavBar