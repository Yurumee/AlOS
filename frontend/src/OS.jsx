import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import OSVisualize from './OSVisualize'
import ModalOS from './ModalOS'
import Filter from './Filter'
import Search from './Search'

import { useEffect, useState } from 'react'

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

    const [category, setCategory] = useState([])
    const [groupSelected, setGroupSelected] = useState('all')
    const [search, setSearch] = useState('')
    const [osSearched, setOsSearched] = useState([])

    // filtro
    function handleFilter(event) 
    {
        setGroupSelected(event.target.value)
    }

    // busca
    function handleSearch(newSearch) 
    {
        setSearch(newSearch)
    }

    // resultados da busca
    function results ()
    {
        var OSResult = orders.filter((order) => {
            if (groupSelected == 'all') 
            {
                return true
            }

            return order.estado === groupSelected
        })
        .filter(order => order.tecnico_resp.toLowerCase().includes(search.toLowerCase()))

        if (OSResult.length == 0)
        {
            OSResult = orders.filter((order) => {
                if (groupSelected == 'all') 
                {
                    return true
                }

                return order.estado === groupSelected
            })
            .filter(order => order.cliente_nome.toLowerCase().includes(search.toLowerCase()))
        }

        if (OSResult.length == 0)
        {
            OSResult = orders.filter((order) => {
                if (groupSelected == 'all') 
                {
                    return true
                }

                return order.estado === groupSelected
            })
            .filter(order => order.produto_num_serie.toLowerCase().includes(search.toLowerCase()))
        }

        setOsSearched(OSResult)
    }

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
            const list = Object.values(data)

            // separando as categorias dos itens
            let all_categorias = []
            list.forEach(os => all_categorias.push(os.estado))
            
            setCategory([...new Set(all_categorias)])
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
                    Nova Ordem de Serviço
                </Button>

                <Button bsPrefix='button-client' onClick={edit_order}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Ordem de Serviço
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_order}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Ordem de Serviço
                </Button>

                <div className="search-bar">
                    <Search className='grid-child' search={search} handleSearch={handleSearch}/>        
                    <Filter className='grid-child' handleFilter={handleFilter} options={category}/>
                    <Button className='grid-child button-search' onClick={results}>
                        Pesquisar
                    </Button>
                </div>

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
                            {(!isLoading && osSearched == '') && orders.map(order => (
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
                                        </tr>
                                    </>
                                )
                            )}

                            {(!isLoading && osSearched != '') && osSearched.map(order => (
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
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>

                        
                </div>
            }

            {modalOpen && <OSVisualize order={modalOrder} token={props.token} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalOS operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default OS