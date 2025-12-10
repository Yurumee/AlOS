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
    const [client, setClient] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => 
    {
        async function getClient()
        {
            const URL = `http://localhost:5000/cliente/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            const list = Object.values(resp)
            setClient(list[0])
            setIsLoading(false)
        }

        getClient()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/cliente/excluir/${id}`
        await fetch(URL, 
            {
                method: 'POST',
                headers: 
                    {
                        'Content-Type':'application/json'
                    },
            })

        window.location.href = '/clientes'
    }

    function cancel()
    {
        window.location.href = '/clientes'
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

            {!isLoading && client &&
                <>

                <div className="container mt-3">

                    <Card>
                        <Card.Header>Deseja realmente deletar este cliente?</Card.Header>
                            <Card.Body>
                                <Card.Title>{client.cpf_cnpj}</Card.Title>
                                <Card.Text>
                                    <p>Nome: {client.nome_completo}</p>
                                    <br />
                                    <p>Nome Fantasia: {client.nome_fantasia}</p>
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