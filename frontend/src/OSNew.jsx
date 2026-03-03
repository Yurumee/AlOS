import './styles/OS.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

function OSNew(props) {

    // guarda os clientes
    const [clients, setClients] = useState([])
    // guarda os produtos do cliente especificado
    const [products, setProducts] = useState([])

    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [tipo_ordem, setTipoOrdem] = useState()
    const [prognostico_ordem, setPrognosticoOrdem] = useState()
    const [diagnostico_ordem, setDiagnosticoOrdem] = useState()
    // const [orcamento_ordem, setOrcamentoOrdem] = useState()
    const [estado_ordem, setEstadoOrdem] = useState()
    const [emitir_ordem, setEmitirOrdem] = useState()
    const [criacao_ordem, setCriacaoOrdem] = useState()
    const [fechamento_ordem, setFechamentoOrdem] = useState()
    const [validade_ordem, setValidadeOrdem] = useState()

    const [cliente_ordem, setClienteOrdem] = useState()
    const [produto_ordem, setProdutoOrdem] = useState()

    const [orcamentoNomeCategoria, setOrcamentoNomeCategoria] = useState()
    // const [categoryBudget, setCategoryBudget] = useState('')
    const [categories, setCategories] = useState([])
    const [itemsSearched, setItemsSearched] = useState([])

    const [response, setResponse] = useState({ status: '', msg: '' })
    const navigation = useNavigate()


    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => {
        async function getClients() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/cliente/'
            const response = await fetch(URL, {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            })
            const data = await response.json();
            const list = Object.values(data)
            setClients(list)

            setIsLoading(false)
        }

        getClients()
    }, [props.token])

    async function searchProduct(id) {
        if (cliente_ordem != 0) {
            // url da api
            const URL = `http://127.0.0.1:5000/produto/cliente/${id}`
            const response = await fetch(URL, {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            })
            const data = await response.json();
            const list = Object.values(data)
            setProducts(list)
        }
    }

    async function searchCategory(search_str)
    {
        if (search_str != '')
        {
            if (search_str === 'estoque')
            {
                // url da api
                const URL = `http://127.0.0.1:5000/categoria/busca/${search_str}`
                const response = await fetch(URL, {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                })
                const data = await response.json();
                // console.log(data)
                const list = Object.values(data)
                // console.log(list)
                setCategories(list)

                setIsLoading(false)
            }

            else if (search_str === 'servico')
            {
                // url da api
                const URL = `http://127.0.0.1:5000/categoria/busca/${search_str}`
                const response = await fetch(URL, {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                })
                const data = await response.json();
                // console.log(data)
                const list = Object.values(data)
                // console.log(list)
                setCategories(list)

                setIsLoading(false)
            }

            else if (search_str === 'geral')
            {
                // url da api
                const URL = `http://127.0.0.1:5000/categoria/busca/${search_str}`
                const response = await fetch(URL, {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                })
                const data = await response.json();
                // console.log(data)
                const list = Object.values(data)
                // console.log(list)
                setCategories(list)

                setIsLoading(false)
            }

            else
            {
                setCategories([])
            }
            
        }
    }

    async function tableOrcamento(category) 
    {
        // console.log(category)
        // url da api
        const URL = `http://127.0.0.1:5000/estoque/busca/${category}`
        const response = await fetch(URL, {
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            }
        })
        const data = await response.json();
        console.log(data)
        const list = Object.values(data)
        console.log(list)
        setItemsSearched(list)
        setIsLoading(false)
    }


    async function submit(event) {
        // previne de ir vazio
        event.preventDefault()
        // url para backend
        const URL = 'http://localhost:5000/os/novo'
        await fetch(URL,
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                },
                // transformando variaveis do forms em json
                body: JSON.stringify({
                    cliente_id: cliente_ordem,
                    produto_id: produto_ordem,
                    tipo_os: tipo_ordem,
                    prognostico: prognostico_ordem,
                    diagnostico: diagnostico_ordem,
                    // orcamento: orcamento_ordem,
                    estado: estado_ordem,
                    emitir: emitir_ordem,
                    hora_emissao: criacao_ordem,
                    hora_fechamento: fechamento_ordem,
                    data_validade: validade_ordem
                })
            })
            .then(res => res.json())
            .then(res => setResponse(res))
            .catch(error => console.log(error))
        // window.location.href = '/clientes'
    }

        return (
            <>

                <NavBar />

                <div className='container'>

                    <div style={{ 'marginBottom': '15px' }}>
                        <p className='h2'>Cadastro de nova Ordem de Serviço</p>
                        <span style={{ 'color': 'red' }}>* representam campos obrigatórios</span>
                    </div>

                    <Form className='grid-container' onSubmit={submit}>

                        <Form.Group className='grid-child'>
                            {/* <Form.Label>Categoria <span style={{'color':'red'}}>*</span></Form.Label> */}
                            <Form.Label>Cliente <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Select defaultValue={''} onChange={(event) => { setClienteOrdem(event.target.value); searchProduct(event.target.value) }}>
                                <option value={''} disabled>---Selecione um cliente---</option>
                                {!isLoading && clients.map(client => (
                                    <>
                                        <option value={client.id}>{client.nome_completo}</option>
                                    </>
                                )
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='grid-child'>
                            <Form.Label>Produto <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Select defaultValue={''} onChange={(event) => { setProdutoOrdem(event.target.value); }}>
                                <option value={''} disabled>---Selecione um produto---</option>
                                {!isLoading && products.map(product => (
                                    <>
                                        <option value={product.id}>{product.num_serie}</option>
                                    </>
                                )
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='grid-child'>
                            <Form.Label>Tipo da OS <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Select defaultValue={''} onChange={(event) => setTipoOrdem(event.target.value)}>
                                <option value={''} disabled>---Selecione um tipo válido---</option>
                                <option value={'Preventiva'}>Manutenção Preventiva</option>
                                <option value={'Corretiva'}>Manutenção Corretiva</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='grid-child'>
                            <Form.Label>Estado da OS <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Select defaultValue={''} onChange={(event) => setEstadoOrdem(event.target.value)}>
                                <option value={''} disabled>---Selecione um estado---</option>
                                <option value={'Criada'}>Criada</option>
                                <option value={'Em análise'}>Em análise</option>
                                <option value={'Autorizada'}>Autorizada</option>
                                <option value={'Não autorizada'}>Não autorizada</option>
                                <option value={'Cancelada'}>Cancelada</option>
                                <option value={'Finalizada'}>Finalizada</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-date-create'>
                            <Form.Label>Data de Criação da OS</Form.Label>
                            <Form.Control type='datetime-local' onChange={(event) => setCriacaoOrdem(event.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-date-expiration'>
                            <Form.Label>Validade do Orçamento <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control type='datetime-local' onChange={(event) => setValidadeOrdem(event.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-date-close'>
                            <Form.Label>Data do Fechamento da OS</Form.Label>
                            <Form.Control type='datetime-local' onChange={(event) => setFechamentoOrdem(event.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-prognostic'>
                            <Form.Label>Prognóstico <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control as='textarea' rows='10' placeholder='Apresenta comportamento indesejado...' onChange={(event) => setPrognosticoOrdem(event.target.value)} />
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-diagnostic'>
                            <Form.Label>Diagnóstico</Form.Label>
                            <Form.Control as='textarea' rows='10' style={{ 'width': '100%' }} placeholder='O problema encontrado trata-se de...' onChange={(event) => setDiagnosticoOrdem(event.target.value)} />
                        </Form.Group>

                        <Form.Group className='grid-child grid-procedure' id='grid-budget'>
                            <Form.Label>Orçamento</Form.Label>

                            <Form.Group className='grid-child'>
                                <Form.Label>Tipo da Categoria</Form.Label>
                                <Form.Select defaultValue={''} onChange={(event) => { searchCategory(event.target.value)}}>
                                    <option value={''} disabled>---Selecione um categoria---</option>
                                    <option value={'geral'}>Geral</option>
                                    <option value={'estoque'}>Estoque</option>
                                    <option value={'servico'}>Serviço</option>
                                </Form.Select>


                                <Form.Label>Título da Categoria</Form.Label>
                                <Form.Select defaultValue={''} onChange={(event) => { setOrcamentoNomeCategoria(event.target.value); tableOrcamento(event.target.value) }}>
                                    <option value={''} disabled>---Selecione uma especificação---</option>
                                    {!isLoading && categories.map(category => (
                                        <>
                                            <option value={category.id}>{category.titulo}</option>
                                        </>
                                    )
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <ul>

                            </ul>

                        </Form.Group>

                        <Table striped bordered hover responsive variant='warning' className='table-storage'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Quantidade</th>
                                    <th>Valor Unitário</th>
                                    <th>Cod. Barras</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {(!isLoading && itemsSearched != '') && itemsSearched.map(item => (
                                        <>
                                            <tr key={item.id}>
                                                <td className='table-info-cell'> {item.id} </td>
                                                <td className='table-name-cell'> {item.nome_item} </td>
                                                <td className='table-info-cell'> {item.quantidade} </td>
                                                <td className='table-info-cell'> {item.preco_un} </td>
                                                <td className='table-info-cell'> {item.codigo_barras} </td>

                                                <td className='table-info-cell'> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning'><Button onClick={(event) => { props.reposition(event, true, quantidade, item.id) }} variant="success">Repor esta quantidade</Button>
                    <Button onClick={(event) => { props.reposition(event, false, quantidade, item.id) }} variant="danger">Retirar esta quantidade</Button></Button> </td>
                                            </tr>
                                        </>
                                    )
                                )}
                            </tbody>
                        </Table>

                        <br />

                        <Form.Group className='grid-child grid-switch'>
                            <Form.Label>Emitir OS</Form.Label>
                            <Form.Check type='switch' onChange={(event) => setEmitirOrdem(event.target.checked)} />
                        </Form.Group>

                        <Button className='grid-child grid-button' variant='outline-primary' type='submit'>Cadastrar OS</Button>
                    </Form>

                    {/* CHECA O ALERTA A SER MOSTRADO */}
                    {(response.status != '' && response.status == 'success') &&
                        navigation("/servicos", { state: { 'status': response.status, 'msg': response.msg } })
                        ||
                        (response.status != '' && response.status == 'error') &&
                        <AlertPopUp status={response.status} msg={response.msg} />
                    }

                </div>
            </>
        )

    }

export default OSNew