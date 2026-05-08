import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function ServicesDelete(props) {
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [service, setService] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    useEffect(() => 
    {
        async function getServico()
        {
            const URL = `http://localhost:5000/servico/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            // const list = Object.values(resp)
            setService(resp)
            setIsLoading(false)
        }

        getServico()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/servico/excluir/${id}`
        await fetch(URL, 
            {
                method: 'POST',
                headers: 
                    {
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + props.token
                    },
            })
            .then(res => res.json())
            .then(res => setResponse(res))

        // window.location.href = '/clientes'
    }

    function cancel()
    {
        window.location.href = '/servicos'
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

            {!isLoading && service &&
                <>

                <div className="container mt-3">

                    <Card>
                        <Card.Header>Deseja realmente deletar este serviço?</Card.Header>
                            <Card.Body>
                                <Card.Title>{service.nome_servico} - ID {service.id}</Card.Title>
                                <Card.Text>
                                    <p>Nome: {service.nome_servico}</p>
                                    <p>Descrição: {service.descricao}</p>
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

export default ServicesDelete