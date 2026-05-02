import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function AttachmentsDelete(props) {
    let params = useParams()
    const id = params.id
    const [attachment, setAttachment] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getAnexo() {
            // url da api
            const URL = `http://127.0.0.1:5000/anexo/${id}`
            const response = await fetch(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            }
            )
            const data = await response.json();
            console.log(data)
            // guardando o orcamento
            setAttachment(data)
            setIsLoading(false)
        }
        getAnexo()
    }, [])

    async function confirm() {
        const URL = `http://localhost:5000/anexo/excluir/${id}`
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

            window.location.href = '/os'
    }

    function cancel() {
        window.location.href = '/os'
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

            {!isLoading && attachment &&
                <>

                    <div className="container grid-card mt-3">

                        <Card className='grid-child-card'>
                            <Card.Header>Deseja realmente deletar o anexo abaixo?</Card.Header>
                            <Card.Body>
                                <Card.Title>ANEXO DA ORDEM N°{id}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Solução realizada</p>
                                    <p>{attachment.solucao}</p>
                                    <br />
                                    <p className='grid-p-card'>Observações</p>
                                    <p>{attachment.observacoes}</p>
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

export default AttachmentsDelete