import './styles/Storage.css'
import './styles/index.css'
import NavBar from './Navbar'
import StoragesVisualize from './StoragesVisualize'
import ModalItem from './ModalItem'
import ManageItem from './ManageItem'
import Filter from './Filter'
import Search from './Search'

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
    // esconde ou mostra modal para gerenciar um item
    const [modalManageOpen, setModalManageOpen] = useState(false)
    // item do modal
    const [modalItem, setModalItem] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    const [category, setCategory] = useState([])
    const [groupSelected, setGroupSelected] = useState('all')
    const [search, setSearch] = useState('')
    const [itemsSearched, setItemsSearched] = useState([])

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
        const itemsResult = items.filter((items) => {
            if (groupSelected == 'all') 
            {
                return true
            }

            return items.categoria === groupSelected
        })
        .filter(items => items.nome_item.toLowerCase().includes(search.toLowerCase()))

        setItemsSearched(itemsResult)
    }

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
            
            // separando as categorias dos itens
            let all_categorias = []
            list.forEach(items => all_categorias.push(items.categoria))
            setCategory([...new Set(all_categorias)])

            setIsLoading(false)
            }

        getItems()

    }, [props.token])

    

    async function reposition_item(event, flag, quantidade, id)
    {
        event.preventDefault()
        
        const URL = `http://localhost:5000/estoque/gerenciamento/${id}`
        await fetch (URL, 
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                },
                body: JSON.stringify({
                    quantidade: quantidade,
                    isRepo: flag
                })
            }
        )

        setModalManageOpen(!modalManageOpen)

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
    }

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

    function manage_item(item)
    {
        setModalItem(item)
        setModalManageOpen(!modalManageOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar />

            <div className='buttons'>
                <Button bsPrefix='button-storage' variant='warning' onClick={new_item}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Item de Estoque
                </Button>

                <Button bsPrefix='button-storage' onClick={edit_item}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Item do Estoque
                </Button>
                
                <Button bsPrefix='button-storage' onClick={delete_item}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Item do Estoque
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
            
            {/* tabela de itens existentes*/}
            { !isLoading &&
                
                <div className="container">
                    <p className='h2'>ITENS EM ESTOQUE</p>

                    <Table striped bordered hover responsive variant='warning' className='table-storage'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                <th>Cod. Barras</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {(!isLoading && itemsSearched == '') && items.map(item => (
                                    <>
                                        <tr key={item.id}>
                                            <td className='table-info-cell'> {item.id} </td>
                                            <td className='table-name-cell'> {item.nome_item} </td>
                                            <td className='table-info-cell'> {item.quantidade} </td>
                                            <td className='table-info-cell'> {item.preco_un} </td>
                                            <td className='table-info-cell'> {item.codigo_barras} </td>

                                            <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => manage_item(item)}>inventory_2</Button> </td> 
                                            
                                            <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_item(item)}>unfold_more</Button> </td>
                                        </tr>
                                    </>
                                )
                            )}

                            {(!isLoading && itemsSearched != '') && itemsSearched.map(item => (
                                    <>
                                        <tr key={item.id}>
                                            <td className='table-info-cell'> {item.id} </td>
                                            <td className='table-name-cell'> {item.nome_item} </td>
                                            <td className='table-info-cell'> {item.quantidade} </td>
                                            <td className='table-info-cell'> {item.preco_un} </td>
                                            <td className='table-info-cell'> {item.codigo_barras} </td>

                                            <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => manage_item(item)}>inventory_2</Button> </td> 
                                            
                                            <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_item(item)}>unfold_more</Button> </td>
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
            }

            {modalOpen && <StoragesVisualize item={modalItem} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalItem operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
            {modalManageOpen && <ManageItem item={modalItem} token={props.token} show={modalManageOpen} reposition={(event, flag, quantidade, id)=> reposition_item(event, flag, quantidade, id)} close={() => setModalManageOpen(false)}/>}    
        </div>
    )
}

export default Storages