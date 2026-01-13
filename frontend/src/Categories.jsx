import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import CategoriesVisualize from './CategoriesVisualize.jsx'
import ModalCat from './ModalCat.jsx'

import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


function Categories(props) 
{
    // guarda as categorias
    const [categories, setCategories] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal de categoria
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir uma categoria
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // categoria do modal
    const [modalCategory, setModalCategory] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // const location = useLocation()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getCategories() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/categoria/'
            const response = await fetch(URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                }
            )
            const data = await response.json();
            
            const list = Object.values(data)
            setCategories(list)

            setIsLoading(false)
            }

        getCategories()

    }, [props.token])

    function new_category()
    {
        window.location.href = '/nova-categoria'
    }

    function edit_category()
    {
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_category()
    {
        
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_category(category)
    {
        setModalCategory(category)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar search='http://127.0.0.1:5000/categoria/pesquisar/' search_str/>

            {/* ALERTA */}

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_category}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Nova Categoria
                </Button>

                <Button bsPrefix='button-client' onClick={edit_category}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Categoria
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_category}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Categoria
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
                    <p className='h2'>CATEGORIAS CADASTRADAS</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Descrição</th>
                                <th>Tipo</th>
                                <th>#</th>
                            </tr>
                        </thead>

                            {/* {!isLoading && <ClientRows Categories={Categories} />} */}

                        <tbody>
                            {!isLoading && categories.map(category => (
                                    <>
                                        <tr key={category.id}>
                                            <td> {category.id} </td>
                                            <td> {category.titulo} </td>
                                            <td> {category.descricao} </td>
                                            <td> {category.tipo} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_category(category)}>unfold_more</Button> </td> 
                                                {/* <button onClick={() => visualize_client(client)}>unfold_more</button> </td> */}
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>

                        
                </div>
            }

            {modalOpen && <CategoriesVisualize client={modalCategory} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalCat operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Categories