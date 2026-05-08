import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

function CategoriesNew(props)
{

    // guardando valores na variavel
    const [titulo, setTitulo] = useState()
    const [tipo, setTipo] = useState()
    const [descricao, setDescricao] = useState()

    const [response, setResponse] = useState({status:'', msg:''})
    const navigation  = useNavigate()


    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/categoria/novo'

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
                    nome_categoria: titulo,
                    tipo_categoria: tipo,
                    descicao_categoria: descricao
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))

        window.location.href = '/categorias'
    }

    return(
        <>
                
            <NavBar/>

            <div className='container'>

                <div style={{'marginBottom':'15px'}}>
                    <p className='h2'>Cadastro de nova categoria</p> 
                    <span style={{'color':'red'}}>* representam campos obrigatórios</span>
                </div>

            <Form onSubmit={submit}>
                <Form.Group>
                    <Form.Label>Título <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' placeholder='Formatação' onChange={(event) => setTitulo(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tipo da categoria</Form.Label>
                    <Form.Select defaultValue={''} onChange={(event) => setTipo(event.target.value)}>
                        <option disabled value={''}>---Selecione um tipo---</option>
                        <option value={"Servico"}>Serviço</option>
                        <option value={"Estoque"}>Estoque</option>
                        <option value={"Geral"}>Geral</option>
                    </Form.Select>
                    {/* <Form.Control type='text' placeholder='Serviço' onChange={(event) => setTipo(event.target.value)}></Form.Control> */}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type='text' placeholder='Formatação completa realizada por um técnico' onChange={(event) => setDescricao(event.target.value)} />
                </Form.Group>

                <Button variant='outline-primary' type='submit'>Cadastrar categoria</Button>
            </Form>

            </div>
        </>
    )

}

export default CategoriesNew