import './styles/Categories.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'

function CategoriesDelete(props) {
    let params = useParams()
    const id = params.id
    const [category, setCategory] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    useEffect(() => 
    {
        async function getCategory()
        {
            const URL = `http://localhost:5000/categoria/pesquisar/${id}`
            const resp = await fetch(URL,{
                headers: 
                    {
                        'Authorization': 'Bearer ' + props.token
                    },
            }).then(resp => resp.json())
            setCategory(resp)
            setIsLoading(false)
        }

        getCategory()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/categoria/excluir/${id}`
        await fetch(URL, 
            {
                method: 'DELETE',
                headers: 
                    {
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + props.token
                    },
            })
            .then(res => res.json())
            .then(res => setResponse(res))

        window.location.href = '/categorias'
    }

    function cancel()
    {
        window.location.href = '/categorias'
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

            {!isLoading && category &&
                <>

                <div className="container grid-card mt-3">

                    <Card className='grid-child-card'>
                        <Card.Header>Deseja realmente deletar esta categoria?</Card.Header>
                            <Card.Body>
                                <Card.Title>{category.titulo}</Card.Title>
                                <Card.Text>
                                    <p className='grid-p-card'>Descrição da Categoria</p>
                                    <p>{category.descricao}</p>
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

export default CategoriesDelete