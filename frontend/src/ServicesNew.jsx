import './styles/Services.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

function ServicesNew(props)
{

    // guarda as categorias do servico
    const [categories, setCategories] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [nome_servico, setNomeServico] = useState()
    const [categoria_servico, setCategoriaServico] = useState()
    const [descricao_servico, setDescricaoServico] = useState()
    const [valor, setValor] = useState()
    
    const [lenN, setLenN] = useState(0)
    const [lenD, setLenD] = useState(0)

    useEffect(() => {
        if (nome_servico != undefined) {
            setLenN(nome_servico.length)
        }

        if (descricao_servico != undefined) {
            setLenD(descricao_servico.length)
        }

    }, [lenN, lenD, nome_servico, descricao_servico])

     // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getCategories() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/categoria/'
            // URL.search = new URLSearchParams({'category-type':'service'})
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

            setIsLoading(false)
            }

        getCategories()
    }, [props.token])


    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/servico/novo'
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
                    nome_servico: nome_servico,
                    categoria_servico: categoria_servico,
                    descricao_servico: descricao_servico,
                    custo_servico: valor            
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))

        window.location.href = '/servicos'
    }

    return(
        <>
                
            <NavBar/>

            <div className='container'>

                <div style={{'marginBottom':'15px'}}>
                    <p className='h2'>Cadastro de novo serviço</p> 
                    <span style={{'color':'red'}}>* representam campos obrigatórios</span>
                </div>

            <Form className='grid-container-serv' onSubmit={submit}>
                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Serviço <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' className='grid-input' style={{ 'width': lenN + 'ch' }} placeholder='Formatação' onChange={(event) => setNomeServico(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Categoria</Form.Label>
                    <Form.Select onChange={(event) => setCategoriaServico(event.target.value)}>
                      <option disabled selected>---Selecione uma categoria---</option>
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
                    <Form.Control as='textarea' rows={3} className='grid-input' id='description' style={{ 'width': lenD + 'ch' }} placeholder='Formatação e instalação de aplicativos' onChange={(event) => setDescricaoServico(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Valor do Serviço Prestado <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' min={0} placeholder='49.99' step={0.01} onChange={(event) => setValor(event.target.value)} />
                </Form.Group>

                <Button className='grid-button-serv grid-child' variant='outline-warning' type='submit'>Cadastrar Serviço</Button>
            </Form>

            </div>
        </>
    )

}

export default ServicesNew