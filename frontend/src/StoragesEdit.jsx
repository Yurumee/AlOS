import './styles/Storage.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function StoragesEdit(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [item, setItem] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guarda as categorias do estoque
    const [categories, setCategories] = useState([])
    // guardando valores na variavel
    const [new_item_nome, setNewItemNome] = useState()
    const [new_categoria, setNewCategoria] = useState()
    const [new_descricao, setNewDescricao] = useState()
    const [new_quantidade, setNewQuantidade] = useState()
    const [new_preco, setNewPreco] = useState()
    const [new_cod_barra, setNewCodBarra] = useState()

    const [lenN, setLenN] = useState(0)
    const [lenD, setLenD] = useState(0)

    useEffect(() => {
        if (new_item_nome != undefined) {
            setLenN(new_item_nome.length)
        }

        if (new_descricao != undefined) {
            setLenD(new_descricao.length)
        }

    }, [lenN, lenD, new_item_nome, new_descricao])

    useEffect(() => {

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
        }

        async function getItem()
        {   
            const URL = `http://localhost:5000/estoque/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            // console.log(resp)
            // const list = Object.values(resp)
            setItem(resp)
            setIsLoading(false)
        }

        getCategories()
        getItem()

    }, [props.token, id])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()


        // url para backend
        const URL = `http://localhost:5000/estoque/editar/${id}`

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
                    nome_item: new_item_nome,
                    categoria_item: new_categoria,
                    descicao_item: new_descricao,
                    quantidade: new_quantidade,
                    valor_un: new_preco,
                    codigo_barras: new_cod_barra
                    
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

            <div style={{ 'marginBottom': '15px' }}>
                        <p className='h2'>Editando Item - {item.codigo_barras}</p>
            </div>

            <Form className='grid-container-storage' onSubmit={submit}>
                <Form.Group className='grid-child'>
                    <Form.Label>Código de Barras <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' className='grid-input' defaultValue={item.codigo_barras} placeholder='84912345678' onChange={(event) => setNewCodBarra(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Item <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' className='grid-input' style={{ 'width': lenN + 'ch' }} defaultValue={item.nome_item} placeholder='SSD 240GB' onChange={(event) => setNewItemNome(event.target.value)} />
                </Form.Group>


                <Form.Group className='grid-child'>
                    <Form.Label>Categoria</Form.Label>
                    <Form.Select defaultValue={item.categoria} className='grid-input' onChange={(event) => setNewCategoria(event.target.value)}>
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
                    <Form.Control as='textarea' rows={3} className='grid-input' style={{ 'width': lenD + 'ch' }} defaultValue={item.descricao} placeholder='SSD DA MARCA X 240GB NOVO' onChange={(event) => setNewDescricao(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control type='number' className='grid-input' defaultValue={item.quantidade} placeholder='5' onChange={(event) => setNewQuantidade(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Valor Unitário</Form.Label>
                    <Form.Control type='number' className='grid-input' defaultValue={item.valor_un} placeholder='9.99' step={0.01} onChange={(event) => setNewPreco(event.target.value)} />
                </Form.Group>


                <br />
                <Button variant='outline-warning' className='grid-button-sto grid-child' type='submit'>Editar Item</Button>
            </Form>

            </div>
            
        }
        
        

        
        </>
    )
}

export default StoragesEdit