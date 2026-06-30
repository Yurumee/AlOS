import './styles/Storage.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function ItemsNew(props)
{

    // guarda as categorias do estoque
    const [categories, setCategories] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [nome_item, setNomeItem] = useState()
    const [categoria_item, setCategoriaItem] = useState()
    const [descricao_item, setDescricaoItem] = useState()
    const [quantidade, setQuantidade] = useState()
    const [valor_un, setValorUn] = useState()
    const [codigo_barras, setCodigoBarras] = useState()
    
    const [response, setResponse] = useState({status:'', msg:''})
    
    const [lenN, setLenN] = useState(0)
    const [lenD, setLenD] = useState(0)

    useEffect(() => {
        if (nome_item != undefined) {
            setLenN(nome_item.length)
        }

        if (descricao_item != undefined) {
            setLenD(descricao_item.length)
        }

    }, [lenN, lenD, nome_item,descricao_item])

     // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getCategories() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/categoria/'
            const response = await fetch(URL + 'storage', {
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
        const URL = 'http://localhost:5000/estoque/novo'
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
                    nome_item: nome_item,
                    categoria_item: categoria_item,
                    descricao_item: descricao_item,
                    quantidade: quantidade,
                    valor_un: valor_un,
                    codigo_barras: codigo_barras                
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))

        window.location.href = '/estoque'
    }

    return(
        <>
                
            <NavBar/>

            <div className='container'>

                <div style={{'marginBottom':'15px'}}>
                    <p className='h2'>Cadastro de novo item</p> 
                    <span style={{'color':'red'}}>* representam campos obrigatórios</span>
                </div>

            <Form className='grid-container-storage' onSubmit={submit}>
                <Form.Group className='grid-child'>
                    <Form.Label>Código de Barras <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='number'min={0} placeholder='01234567890123' onChange={(event) => setCodigoBarras(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Item <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' style={{ 'width': lenN + 'ch' }} className='grid-input' placeholder='SSD 240GB' onChange={(event) => setNomeItem(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Categoria</Form.Label>
                    <Form.Select className='grid-input' onChange={(event) => setCategoriaItem(event.target.value)}>
                      <option disabled selected>---Selecione uma categoria---</option>
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
                    <Form.Control as='textarea' className='grid-input' rows={3} placeholder='SSD da marca X' style={{ 'width': lenD + 'ch' }} onChange={(event) => setDescricaoItem(event.target.value)} />
                    
                </Form.Group>

                <Form.Group>
                    <Form.Label>Quantidade <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' className='grid-input' min={0} placeholder='5' onChange={(event) => setQuantidade(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Valor Unitário <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' className='grid-input' min={0} placeholder='49.99' step={0.01} onChange={(event) => setValorUn(event.target.value)} />
                </Form.Group>

                <Button className='grid-button-sto grid-child' variant='outline-warning' type='submit'>Cadastrar item no estoque</Button>
            </Form>

            </div>
        </>
    )

}

export default ItemsNew