import './styles/Clients.css'
import './styles/index.css'
import NavBar from './Navbar'
import ClientsVisualize from './ClientsVisualize'
import ModalId from './ModalId'

import { useEffect, useState } from 'react'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


function Clients(props) 
{
    // guarda os clientes
    const [clients, setClients] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal do cliente
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir um cliente
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // cliente do modal
    const [modalClient, setModalClient] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // const location = useLocation()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getClients() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/cliente/'
            const response = await fetch(URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                }
            )
            const data = await response.json();
            
            // definindo o token de autenticação
            // data.access_token && props.setToken(data.access_token)
            
            const list = Object.values(data)
            setClients(list)

            setIsLoading(false)
            }

        getClients()

    }, [props.token])

    function new_client()
    {
        window.location.href = '/novo-cliente'
    }

    function edit_client(event)
    {
        event.preventDefault()
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_client()
    {
        
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_client(client)
    {
        setModalClient(client)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar />

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_client}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Cliente
                </Button>

                <Button bsPrefix='button-client' onClick={edit_client}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Cliente
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_client}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Cliente
                </Button>

            </div>

            
            {isLoading && 
                <div style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <Spinner animation="border" variant='warning'/>
                </div>
            }
            
            {/* tabela de clientes existentes*/}
            { !isLoading && 
                <div className="container">
                    <p className='h2'>CLIENTES CADASTRADOS</p>

                    <Table striped bordered hover responsive variant='warning' className='table-client'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome Completo</th>
                                <th>Nome Fantasia</th>
                                <th>Telefone</th>
                                <th>Limite de Crédito</th>
                                <th>#</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!isLoading && clients.map(client => (
                                    <>
                                        <tr key={client.id}>
                                            <td> {client.id} </td>
                                            <td className='table-name-cell'> {client.nome_completo} </td>
                                            <td className='table-name-cell'> {client.nome_fantasia} </td>
                                            <td className='table-info-cell'> {client.telefone} </td>
                                            <td className='table-info-cell'> {client.limite_credito} </td>

                                            <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_client(client)}>unfold_more</Button> </td>
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>
                        
                </div>
            }

            {modalOpen && <ClientsVisualize client={modalClient} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalId operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Clients