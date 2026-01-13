import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import ItemsVisualize from './StoragesVisualize'
// import ModalProd from './ModalProd'

import { useEffect, useState } from 'react'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

function Storages(props) 
{
    // guarda os items do estoque
    const [items, setItems] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal do item
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir um item
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // item do modal
    const [modalItem, setModalItem] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getItems() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/estoque/'
            const response = await fetch(URL, {
                                                headers: 
                                                {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + props.token
                                                }
                                            })
            const data = await response.json();
            const list = Object.values(data)
            setItems(list)

            setIsLoading(false)
            }

        getItems()
    }, [props.token])

    function new_item()
    {
        window.location.href = '/novo-item'
    }

    function edit_item()
    {
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_item()
    { 
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_item(item)
    {
        setModalItem(item)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar />

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_item}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Item de Estoque
                </Button>

                <Button bsPrefix='button-client' onClick={edit_item}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Item do Estoque
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_item}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Item do Estoque
                </Button>

            </div>

            
            {isLoading && 
                <div style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <Spinner animation="border" variant='warning'/>
                </div>
            }
            
            {/* tabela de produtos existentes*/}
            { !isLoading && 
                
                <div className="clientsCreated container">
                    <p className='h2'>ITEMS EM ESTOQUE</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                {/* <th>Descrição</th> */}
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                {/* <th>Categoria</th> */}
                                <th>Cod. Barras</th>
                                <th>#</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!isLoading && items.map(item => (
                                    <>
                                        <tr key={item.id}>
                                            <td> {item.id} </td>
                                            <td> {item.nome_item} </td>
                                            <td> {item.quantidade} </td>
                                            <td> {item.preco_un} </td>
                                            <td> {item.codigo_barras} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_item(item)}>unfold_more</Button> </td> 
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
            }

            {modalOpen && <ItemsVisualize product={modalItem} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <modalItem operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Storages