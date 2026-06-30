import './styles/Services.css'
import './styles/index.css'
import NavBar from './Navbar'

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

    const [lenN, setLenN] = useState(0)
    const [lenD, setLenD] = useState(0)

    useEffect(() => {
        if (new_service_nome != undefined) {
            setLenN(new_service_nome.length)
        }

        if (new_descricao != undefined) {
            setLenD(new_descricao.length)
        }

    }, [lenN, lenD, new_service_nome, new_descricao])

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
        
        window.location.href = '/servicos'
    }

    return(
        <>
            <NavBar />

        { !isLoading &&

            <div className='container'>

                <div style={{ 'marginBottom': '15px' }}>
                    <p className='h2'>Editando Serviço - {service.nome_servico}</p>
                </div>

            <Form className='grid-container-serv' onSubmit={submit}>
                
                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Serviço</Form.Label>
                    <Form.Control type='text' style={{ 'width': lenN + 'ch' }} className='grid-input' defaultValue={service.nome_servico} placeholder='Manutenção de Notebook' onChange={(event) => setNewServiceNome(event.target.value)} />
                </Form.Group>


                <Form.Group className='grid-child'>
                    <Form.Label>Categoria <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Select className='grid-input' defaultValue={service.categoria} onChange={(event) => setNewCategoria(event.target.value)}>
                      <option>---Selecione uma categoria---</option>
                      {!isLoading && categories.map(category => (
                                    <>
                                        <option value={category.id}>{category.titulo}</option>
                                    </>
                                )
                            )}
                    </Form.Select>
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as='textarea' style={{ 'width': lenD + 'ch' }} className='grid-input' rows={3} defaultValue={service.descricao} placeholder='Check-up geral no aparelho' onChange={(event) => setNewDescricao(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Valor do Serviço</Form.Label>
                    <Form.Control type='number' className='grid-input' defaultValue={service.valor} placeholder='19.99' step={0.01} onChange={(event) => setNewPreco(event.target.value)} />
                </Form.Group>

                <br />
                <Button className='grid-button-serv grid-child' variant='outline-warning' type='submit'>Editar Serviço</Button>
            </Form>

            </div>
            
        }
        
        

        
        </>
    )
}

export default ServicesEdit