import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function ClientsDelete(props) {
    let params = useParams()
    const navigation = useNavigate()
    const id = params.id
    const [client, setClient] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({ status: '', msg: '' })

    useEffect(() => {
        async function getClient() {
            const URL = `http://localhost:5000/cliente/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            const list = Object.values(resp)
            setClient(list[0])
            setIsLoading(false)
        }

        getClient()
    }, [])

    async function confirm() {
        const URL = `http://localhost:5000/cliente/excluir/${id}`
        await fetch(URL,
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                },
            })
            .then(res => res.json())
            .then(res => setResponse(res))

        // window.location.href = '/clientes'
    }

    function cancel() {
        window.location.href = '/clientes'
    }

    return (

        <>
            {/* CHECA O ALERTA A SER MOSTRADO */}
            {(response.status != '' && response.status == 'success') &&
                navigation("/clientes", { state: { 'status': response.status, 'msg': response.msg } })
                ||
                (response.status != '' && response.status == 'error') &&
                <AlertPopUp status={response.status} msg={response.msg} />
            }

            <NavBar />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <div>
                {isLoading &&
                    <p>CARREGANDO...</p>
                }
            </div>

            {!isLoading && client &&
                <>

                    <div className="container grid-card mt-3">

                        <Card className='grid-child-card'>
                            <Card.Header>Deseja realmente deletar este cliente?</Card.Header>
                            <Card.Body>
                                <Card.Title>{client.cpf_cnpj}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Nome</p>
                                    <p>{client.nome_completo}</p>
                                    <br />
                                    <p className='grid-p-card'>Nome Fantasia</p>
                                    <p>{client.nome_fantasia}</p>
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

export default ClientsDelete