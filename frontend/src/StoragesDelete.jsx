import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

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
            // const list = Object.values(resp)
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

        // window.location.href = '/clientes'
    }

    function cancel()
    {
        window.location.href = '/estoque'
    }

    return (

        <>
                {/* CHECA O ALERTA A SER MOSTRADO */}
                { (response.status != '' && response.status == 'success') && 
                    navigation("/tecnicos", {state: {'status':response.status, 'msg':response.msg}})
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

            {!isLoading && item &&
                <>

                <div className="container mt-3">

                    <Card>
                        <Card.Header>Deseja realmente deletar este item?</Card.Header>
                            <Card.Body>
                                <Card.Title>{item.nome_item} - COD BARRAS {item.codigo_barras}</Card.Title>
                                <Card.Text>
                                    <p>Nome: {item.nome_item}</p>
                                    <p>Descrição: {item.descricao}</p>
                                    <p>Quantidade em estoque: {item.quantidade}</p>
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

export default StoragesDelete