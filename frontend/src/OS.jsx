import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import OSVisualize from './OSVisualize'
import ModalOS from './ModalOS'

import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


function OS(props) 
{
    // guarda as ordens de serviço
    const [orders, setOrders] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal da os
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir uma os
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // ordem de serviço do modal
    const [modalOrder, setModalOrder] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // const location = useLocation()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getOS() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/os/'
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
            setOrders(list)

            setIsLoading(false)
            }

        getOS()

    }, [props.token])

    function new_order()
    {
        window.location.href = '/nova-os'
    }

    function edit_order(event)
    {
        event.preventDefault()
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_order()
    {
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_order(order)
    {
        setModalOrder(order)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar search='http://127.0.0.1:5000/os/pesquisar/' search_str/>

            {/* ALERTA */}

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_order}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Nova OS
                </Button>

                <Button bsPrefix='button-client' onClick={edit_order}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar OS
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_order}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir OS
                </Button>

            </div>

            
            {isLoading && 
                <div style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <Spinner animation="border" variant='warning'/>
                </div>
            }
            
            {/* tabela de ordens de serviço existentes*/}
            { !isLoading && 
                <div className="clientsCreated container">
                    <p className='h2'>ORDENS DE SERVIÇO CADASTRADAS</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Técnico Responsável</th>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Estado</th>
                                <th>Data de Criação</th>
                                <th>Emitida</th>
                                <th></th>
                            </tr>
                        </thead>

                            {/* {!isLoading && <ClientRows clients={clients} />} */}

                        <tbody>
                            {!isLoading && orders.map(order => (
                                    <>
                                        <tr key={order.id}>
                                            <td> {order.id} </td>
                                            <td> {order.tipo_ordem} </td>
                                            <td> {order.tecnico_resp} </td>
                                            <td> {order.cliente_nome} </td>
                                            <td> {order.produto_num_serie} </td>
                                            <td> {order.estado} </td>
                                            <td> {order.data_emissao} </td>
                                            <td> {order.emitida} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_order(order)}>unfold_more</Button> </td> 
                                                {/* <button onClick={() => visualize_client(client)}>unfold_more</button> </td> */}
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>

                        
                </div>
            }

            {modalOpen && <OSVisualize service={modalOrder} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalOS operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default OS