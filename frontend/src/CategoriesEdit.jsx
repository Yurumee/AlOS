import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function CategoriesEdit(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [category, setCategory] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guardando valores na variavel
    const [new_category_titulo, setNewCategoryTitulo] = useState()
    const [new_tipo, setNewTipo] = useState()
    const [new_descricao, setNewDescricao] = useState()

    useEffect(() => {
        async function getCategory()
        {   
            const URL = `http://localhost:5000/categoria/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers:{
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }
                                    ).then(resp => resp.json())
            console.log(resp)
            // const list = Object.values(resp)
            setCategory(resp)
            setIsLoading(false)
        }

        getCategory()
    }, [props.token, id])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()


        // url para backend
        const URL = `http://localhost:5000/categoria/editar/${id}`

        await fetch (URL, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            // transformando variaveis do forms em json
            body: JSON.stringify({
                    nome_categoria: new_category_titulo,
                    tipo_categoria: new_tipo,
                    descicao_categoria: new_descricao,
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))
        // .then(data => console.log(`STATUS: ${data.status} | MSG: ${data.msg}`))
        
        // window.location.href = '/clientes'
    }

    return(
        <>
            <NavBar />

        { !isLoading &&

            <div className='container' >

            <h1>Editando Categoria - {category.id}</h1>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>Título da Categoria</Form.Label>
                    <Form.Control type='text' defaultValue={category.titulo} placeholder='Formatação' onChange={(event) => setNewCategoryTitulo(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tipo da categoria</Form.Label>
                    <Form.Select defaultValue={category.tipo} onChange={(event) => setNewTipo(event.target.value)}>
                        <option disabled value={''}>---Selecione um tipo---</option>
                        <option value={"Serviço"}>Serviço</option>
                        <option value={"Estoque"}>Estoque</option>
                        <option value={"Geral"}>Geral</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type='text' defaultValue={category.descricao} placeholder='Formatação completa realizada por um técnico' onChange={(event) => setNewDescricao(event.target.value)} />
                </Form.Group>

                <br />
                <Button variant='outline-warning' type='submit'>Editar categoria</Button>
            </Form>

            </div>
            
        }

        </>
    )
}

export default CategoriesEdit