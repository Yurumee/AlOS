import './styles/Products.css'
import './styles/index.css'
import NavBar from './NavBar'

import {useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function ProductsDelete(props) {
    let params = useParams()
    const id = params.id
    const [product, setProduct] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => 
    {
        async function getProduct()
        {
            const URL = `http://localhost:5000/produto/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: {
                                                'Authorization': 'Bearer ' + props.token
                                            }
            }).then(resp => resp.json())
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
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + props.token
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

                <div className="container grid-card mt-3">

                    <Card className='grid-child-card'>
                        <Card.Header>Deseja realmente deletar este produto?</Card.Header>
                            <Card.Body>
                                <Card.Title>{product.num_serie}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Modelo</p>
                                    <p>{product.modelo}</p>
                                    <br />
                                    <p className='grid-p-card'>Pertencente a</p>
                                    <p>{product.cliente_nome}</p>
                                
                                </Card.Text>
                            <Button className='material-symbols-outlined grid-button-card' variant="success" onClick={confirm}>check_circle</Button>
                            <div className="divider"></div>
                            <Button className='material-symbols-outlined grid-button-card' variant="danger" onClick={cancel}>cancel</Button>
                            </Card.Body>
                    </Card>

                </div>  
                    
                </>
            }

        </>
    )
}

export default ProductsDelete