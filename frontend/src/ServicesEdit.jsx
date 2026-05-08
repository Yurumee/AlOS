import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function ServicesEdit(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [service, setService] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guarda as categorias do estoque
    const [categories, setCategories] = useState([])
    // guardando valores na variavel
    const [new_service_nome, setNewServiceNome] = useState()
    const [new_categoria, setNewCategoria] = useState()
    const [new_descricao, setNewDescricao] = useState()
    const [new_preco, setNewPreco] = useState()

    useEffect(() => {

        async function getCategories() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/categoria/'
            const response = await fetch(URL + 'service', {
                                                headers: 
                                                {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + props.token
                                                }
                                            })
            const data = await response.json();
            const list = Object.values(data)
            setCategories(list)
        }

        async function getService()
        {   
            const URL = `http://localhost:5000/servico/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            // console.log(resp)
            // const list = Object.values(resp)
            setService(resp)
            setIsLoading(false)
        }

        getCategories()
        getService()

    }, [props.token, id])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()


        // url para backend
        const URL = `http://localhost:5000/servico/editar/${id}`

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
                    nome_servico: new_service_nome,
                    categoria_servico: new_categoria,
                    descicao_servico: new_descricao,
                    valor_servico: new_preco
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

            <h1>Editando Serviço - {service.nome_servico}</h1>

            <Form onSubmit={submit}>
                
                <Form.Group>
                    <Form.Label>Nome do Serviço</Form.Label>
                    <Form.Control type='text' defaultValue={service.nome_servico} placeholder='Manutenção de Notebook' onChange={(event) => setNewServiceNome(event.target.value)} />
                </Form.Group>


                <Form.Group>
                    {/* <Form.Label>Categoria <span style={{'color':'red'}}>*</span></Form.Label> */}
                    <Form.Label>Categoria <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Select defaultValue={service.categoria} onChange={(event) => setNewCategoria(event.target.value)}>
                      <option>---Selecione uma categoria---</option>
                      {!isLoading && categories.map(category => (
                                    <>
                                        <option value={category.id}>{category.titulo}</option>
                                    </>
                                )
                            )}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type='text' defaultValue={service.descricao} placeholder='Check-up geral no aparelho' onChange={(event) => setNewDescricao(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Valor do Serviço</Form.Label>
                    <Form.Control type='number' defaultValue={service.valor} placeholder='19.99' step={0.01} onChange={(event) => setNewPreco(event.target.value)} />
                </Form.Group>

                <br />
                <Button variant='outline-warning' type='submit'>Editar Serviço</Button>
            </Form>

            </div>
            
        }
        
        

        
        </>
    )
}

export default ServicesEdit