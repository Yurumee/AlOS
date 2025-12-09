import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import ProductsVisualize from './ProductsVisualize'
import ModalProd from './ModalProd'

import { useEffect, useState } from 'react'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

function Products() 
{
    // guarda os clientes
    const [products, setProducts] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal do produto
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir um produto
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // produto do modal
    const [modalProduct, setModalProduct] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getProducts() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/produto/'
            const response = await fetch(URL)
            const data = await response.json();
            const list = Object.values(data)
            setProducts(list)

            setIsLoading(false)
            }

        getProducts()
    }, [])

    function new_product()
    {
        window.location.href = '/novo-produto'
    }

    function edit_product()
    {
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_product()
    { 
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_product(product)
    {
        setModalProduct(product)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar />

            <div className='buttons'>

                <Button bsPrefix='button-client' variant='warning' onClick={new_product}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Produto
                </Button>

                <Button bsPrefix='button-client' onClick={edit_product}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Produto
                </Button>
                
                <Button bsPrefix='button-client' onClick={delete_product}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Produto
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
                    <p className='h2'>PRODUTOS CADASTRADOS</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Modelo</th>
                                <th>N° Série</th>
                                <th>Acessorios</th>
                                <th>Cliente</th>
                                <th>#</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!isLoading && products.map(product => (
                                    <>
                                        <tr key={product.id}>
                                            <td> {product.id} </td>
                                            <td> {product.modelo} </td>
                                            <td> {product.num_serie} </td>
                                            <td> {product.acessorios} </td>
                                            <td> {product.cliente_nome} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_product(product)}>unfold_more</Button> </td> 
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
            }

            {modalOpen && <ProductsVisualize product={modalProduct} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalProd operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Products