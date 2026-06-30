import './styles/OS.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function OSDelete(props) {
    let params = useParams()
    const id = params.id
    const [order, setOrder] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getOS() {
            // url da api
            const URL = `http://127.0.0.1:5000/os/pesquisar/${id}`
            const response = await fetch(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            }
            )
            const data = await response.json();
            // console.log(data)
            // guardando o orcamento
            setOrder(data)
            setIsLoading(false)
        }
        getOS()
    }, [])

    async function confirm() {
        const URL = `http://localhost:5000/os/excluir/${id}`
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

            {!isLoading && order &&
                <>

                    <div className="container grid-card mt-3">

                        <Card className='grid-child-card'>
                            <Card.Header>Deseja realmente deletar a ordem de serviço abaixo?</Card.Header>
                            <Card.Body>
                                <Card.Title>ORDEM N°{id}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Nome do Cliente</p>
                                    <p>{order.cliente_os}</p>
                                    
                                    <br />
                                    
                                    <p className='grid-p-card'>Modelo do Produto</p>
                                    <p>{order.produto_os}</p>
                                    
                                    <br />
                                    
                                    <p className='grid-p-card'>Diagnóstico</p>
                                    <p>{order.diagnostico}</p>

                                    <br />

                                    <p className='grid-p-card'>Prognóstico</p>
                                    <p>{order.prognostico}</p>
                                    
                                    <br />
                                    
                                    <p className='grid-p-card'>Data de Emissão</p>
                                    <p>{new Date(order.data_emissao).toISOString().substring(0, 10)} às {new Date(order.data_emissao).toISOString().substring(11, 16)}</p>
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

export default OSDelete