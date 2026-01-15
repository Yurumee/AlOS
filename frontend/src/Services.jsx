import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import ServicesVisualize from './ServicesVisualize'
import ModalServ from './ModalServ'

import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


function Services(props) 
{
    // guarda os servicos
    const [services, setServices] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal do servico
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir um servico
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // servico do modal
    const [modalService, setModalService] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // const location = useLocation()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getServices() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/servico/'
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
            setServices(list)

            setIsLoading(false)
            }

        getServices()

    }, [props.token])

    function new_service()
    {
        window.location.href = '/novo-servico'
    }

    function edit_service(event)
    {
        event.preventDefault()
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_service()
    {
        
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_service(client)
    {
        setModalService(client)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar search='http://127.0.0.1:5000/servico/pesquisar/' search_str/>

            {/* ALERTA */}

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_service}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Serviço
                </Button>

                <Button bsPrefix='button-client' onClick={edit_service}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Serviço
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_service}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Serviço
                </Button>

            </div>

            
            {isLoading && 
                <div style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <Spinner animation="border" variant='warning'/>
                </div>
            }
            
            {/* tabela de clientes existentes*/}
            { !isLoading && 
                <div className="clientsCreated container">
                    <p className='h2'>SERVIÇOS CADASTRADOS</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Serviço</th>
                                <th>Descrição</th>
                                <th>Preço</th>
                                <th></th>
                            </tr>
                        </thead>

                            {/* {!isLoading && <ClientRows clients={clients} />} */}

                        <tbody>
                            {!isLoading && services.map(service => (
                                    <>
                                        <tr key={service.id}>
                                            <td> {service.id} </td>
                                            <td> {service.nome_servico} </td>
                                            <td> {service.descricao} </td>
                                            <td> {service.valor} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_service(service)}>unfold_more</Button> </td> 
                                                {/* <button onClick={() => visualize_client(client)}>unfold_more</button> </td> */}
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>

                        
                </div>
            }

            {modalOpen && <ServicesVisualize service={modalService} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalServ operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Services