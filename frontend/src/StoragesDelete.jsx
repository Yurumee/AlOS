import './styles/Storage.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function StoragesDelete(props) {
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [item, setItem] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    useEffect(() => 
    {
        async function getItem()
        {
            const URL = `http://localhost:5000/estoque/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            setItem(resp)
            setIsLoading(false)
        }

        getItem()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/estoque/excluir/${id}`
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

        window.location.href = '/estoque'
    }

    function cancel()
    {
        window.location.href = '/estoque'
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

            {!isLoading && item &&
                <>

                <div className="container grid-card mt-3">

                    <Card className='grid-child-card'>
                        <Card.Header>Deseja realmente deletar este item?</Card.Header>
                            <Card.Body>
                                <Card.Title>{item.nome_item} - COD BARRAS {item.codigo_barras}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Nome do Item</p>
                                    <p>{item.nome_item}</p>

                                    <p className='grid-p-card'>Descrição do Item</p>
                                    <p>{item.descricao}</p>

                                    <p className='grid-p-card'>Quantidade em Estoque</p>
                                    <p>{item.quantidade}</p>
                                    
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

export default StoragesDelete