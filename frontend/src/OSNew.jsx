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

    const valorInicialOrcamento = {
        quantidade: 0,
        id: 0,
        nome: '',
        preco: 0.0
    }

    // guarda os clientes
    const [clients, setClients] = useState([])
    // guarda os produtos do cliente especificado
    const [products, setProducts] = useState([])
    // guarda valor da soma
    const [sum, setSum] = useState(0)

    // lista dos itens do orçamento
    const [itemsBudgetList, setItemsBudgetList] = useState([])
    // categorias para exibição na página de busca
    const [categories, setCategories] = useState([])
    // itens da categoria correspondente pesquisados
    const [itemsSearched, setItemsSearched] = useState([])
    // guarda a quantidade do item desejado
    const [quantityItem, setQuantityItem] = useState(0)

    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [tipo_ordem, setTipoOrdem] = useState()
    const [prognostico_ordem, setPrognosticoOrdem] = useState()
    const [diagnostico_ordem, setDiagnosticoOrdem] = useState()
    const [estado_ordem, setEstadoOrdem] = useState()
    const [emitir_ordem, setEmitirOrdem] = useState()
    const [criacao_ordem, setCriacaoOrdem] = useState()
    const [fechamento_ordem, setFechamentoOrdem] = useState()
    const [validade_ordem, setValidadeOrdem] = useState()

    const [cliente_ordem, setClienteOrdem] = useState()
    const [produto_ordem, setProdutoOrdem] = useState()

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
        if (category != '')
        {
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
            const list = Object.values(data)
            setItemsSearched(list)
            setIsLoading(false)
        }
    }

    async function addDelItemsBudget(flag, qtd, id, nome, preco) {
        let flag_item_exists = false
        // console.log(event)

        // adicionar no orçamento
        if (flag)
        {   
            itemsBudgetList.forEach(item => {
                // se for o mesmo item, atualize a quantidade
                if (item.id_item === id)
                {
                    
                    let itemindex = itemsBudgetList.findIndex((item) => item.id_item === id)
                    let newqtd = Object.assign({}, itemsBudgetList[itemindex])
                    newqtd.quantidade = newqtd.quantidade + qtd
                    
                    let newlist = itemsBudgetList.slice()
                    newlist[itemindex] = newqtd
                    
                    flag_item_exists = true
                    setItemsBudgetList(newlist)
                }
            })
            
            if (!flag_item_exists)
            {
                const newitem = Object.assign({}, {id_item: id, quantidade: qtd, nome: nome, preco: preco})
                let list_item = itemsBudgetList.slice() 
                list_item.push(newitem)
                setItemsBudgetList(list_item)
            }

            let soma = sum + (Number(preco) * Number(qtd))
            setSum(soma)

        }

        // diminuir no orçamento
        else
        {
            itemsBudgetList.forEach(item => {
                // se for o mesmo item, atualize a quantidade
                if (item.id_item === id)
                {
                    let itemindex = itemsBudgetList.findIndex((item) => item.id_item === id)

                    if (item.quantidade > 1)
                    {
                        let newqtd = Object.assign({}, itemsBudgetList[itemindex])
                        newqtd.quantidade = newqtd.quantidade - qtd

                        if (newqtd.quantidade - 1 ==  -1)
                        {
                            let newlist = itemsBudgetList.filter((item) => itemsBudgetList.indexOf(item) !== itemindex)
                            setItemsBudgetList(newlist)
                            return
                        }

                        let newlist = itemsBudgetList.slice()
                        newlist[itemindex] = newqtd

                        let soma = sum - (Number(preco) * Number(qtd))
                        if (soma < 0 )
                        {
                            soma = 0
                        }
                        setSum(soma)
                        setItemsBudgetList(newlist)
                    }

                    else
                    {
                        if (itemsBudgetList.length == 1)
                        {
                            setItemsBudgetList([])
                            setSum(0)
                        }
                        else
                        {
                            let newlist = itemsBudgetList.filter((item) => itemsBudgetList.indexOf(item) !== itemindex)
                            setItemsBudgetList(newlist)
                        }
                    }
                }
            })
        }

        console.log(`Flag: ${flag} | qtd: ${qtd} | id: ${id}`)
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
                    orcamento: itemsBudgetList,
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

                {console.log(`DEPOIS: ${JSON.stringify(itemsBudgetList)}`)}

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

                        <Form.Group className='grid-child grid-budget'>
                            <Form.Label>Orçamento</Form.Label>

                            <div id='flex-budget'>
                            <Form.Group>
                                <Form.Label>Tipo da Categoria</Form.Label>
                                <Form.Select defaultValue={''} onChange={(event) => { searchCategory(event.target.value)}}>
                                    <option value={''} disabled>---Selecione um categoria---</option>
                                    <option value={'geral'}>Geral</option>
                                    <option value={'estoque'}>Estoque</option>
                                    <option value={'servico'}>Serviço</option>
                                </Form.Select>


                                <Form.Label>Título da Categoria</Form.Label>
                                <Form.Select defaultValue={''} onClick={(event) => { tableOrcamento(event.target.value)} }>
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
                                {!isLoading && itemsBudgetList.map(item => (
                                    <>
                                            <li>{item.quantidade}x {item.nome} | Preço: R${parseFloat(item.quantidade * item.preco).toFixed(2)}</li>
                                        </>
                                    )
                                )
                            }
                                <br/>
                                <p >Valor total: R${parseFloat(sum).toFixed(2)}</p>
                            </ul>

                        </div>

                        </Form.Group>

                        <Table striped bordered hover variant='warning' id='table-budget'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Em Estoque</th>
                                    <th>Valor Unitário</th>
                                    <th>Cod. Barras</th>
                                    <th>Quantidade desejada</th>
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

                                                <td className='table-info-cell table-add-rem-button'> 
                                                    <Form.Control type='number' min={0} max={item.quantidade} onChange={(event) => {setQuantityItem(event.target.value)}} /> 
                                                {/* </td>

                                                <td className='table-info-cell'>  */}
                                                    <Button onClick={() => { addDelItemsBudget(true, Number(quantityItem), item.id, item.nome_item, item.preco_un) }} variant="success">Adicionar</Button>
                                                {/* </td> */}

                                                {/* <td className='table-info-cell'> */}
                                                    <Button onClick={() => { addDelItemsBudget(false, Number(quantityItem), item.id, item.nome_item, item.preco_un) }} variant="danger">Retirar</Button>
                                                </td>

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