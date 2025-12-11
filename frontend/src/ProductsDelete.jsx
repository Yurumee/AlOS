import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import {useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function ProductsDelete() {
    let params = useParams()
    const id = params.id
    const [product, setProduct] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => 
    {
        async function getProduct()
        {
            const URL = `http://localhost:5000/produto/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            setProduct(resp)
            setIsLoading(false)
        }

        getProduct()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/produto/excluir/${id}`
        await fetch(URL, 
            {
                method: 'POST',
                headers: 
                    {
                        'Content-Type':'application/json'
                    },
            })

        window.location.href = '/produtos'
    }

    function cancel()
    {
        window.location.href = '/produtos'
    }

    return (

        <>
            <NavBar />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <div>
                {isLoading && 
                    <p>CARREGANDO...</p>
                }
            </div>

            {!isLoading && product &&
                <>

                <div className="container mt-3">

                    <Card>
                        <Card.Header>Deseja realmente deletar este produto?</Card.Header>
                            <Card.Body>
                                <Card.Title>{product.num_serie}</Card.Title>
                                <Card.Text>
                                    <p>Modelo: {product.modelo}</p>
                                    <p>Pertencente a: {product.cliente_nome}</p>
                                </Card.Text>
                            <Button className='material-symbols-outlined' variant="success" onClick={confirm}>check_circle</Button>

                            <Button className='material-symbols-outlined' variant="danger" onClick={cancel}>cancel</Button>
                            </Card.Body>
                    </Card>

                </div>  
                    
                </>
            }

        </>
    )
}

export default ProductsDelete