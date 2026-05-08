import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function TechniciansDelete(props) {
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [technician, setTechnician] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    useEffect(() => 
    {
        async function getTechnician()
        {
            const URL = `http://localhost:5000/tecnico/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            const list = Object.values(resp)
            setTechnician(list[0])
            setIsLoading(false)
        }

        getTechnician()
    }, [props.token, id])

    async function confirm()
    {
        const URL = `http://localhost:5000/tecnico/excluir/${id}`
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
        window.location.href = '/tecnicos'
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

            {!isLoading && technician &&
                <>

                <div className="container mt-3">

                    <Card>
                        <Card.Header>Deseja realmente deletar este técnico?</Card.Header>
                            <Card.Body>
                                <Card.Title>{technician.cpf}</Card.Title>
                                <Card.Text>
                                    <p>Nome: {technician.nome_completo}</p>
                                    <p>Usuário: {technician.usuario}</p>
                                    <p>É Administrador: {technician.admin ? 'Sim' : 'Não'}</p>
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

export default TechniciansDelete