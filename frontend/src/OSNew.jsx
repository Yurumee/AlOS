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
    // guarda valor da soma
    const [sum, setSum] = useState(0)

    // lista dos itens do orçamento
    const [itemsBudgetList, setItemsBudgetList] = useState([])
    // categorias para exibição na página de busca
    const [categories, setCategories] = useState([])
    // itens da categoria correspondente pesquisados
    const [itemsSearched, setItemsSearched] = useState([])

    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [tipo_ordem, setTipoOrdem] = useState()
    const [prognostico_ordem, setPrognosticoOrdem] = useState()
    const [diagnostico_ordem, setDiagnosticoOrdem] = useState()
    const [estado_ordem, setEstadoOrdem] = useState()
    const [emitir_ordem, setEmitirOrdem] = useState(false)
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
            const list = Object.values(data)
            setCategories(list)
            setIsLoading(false)
        }
    }


    async function tableOrcamento(category) 
    {
        if (category != '')
        {
            // url da api
            const URL_estoque = `http://127.0.0.1:5000/estoque/busca/${category}`
            const response_estoque = await fetch(URL_estoque, {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            })
            const data_estoque = await response_estoque.json();
            const list_estoque = Object.values(data_estoque)

            setItemsSearched(list_estoque)
            
            const URL_servico = `http://127.0.0.1:5000/servico/busca/${category}`
            const response_servico = await fetch(URL_servico, {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            })
            const data_servico = await response_servico.json();
            const list_servico = Object.values(data_servico)
            
            const all_items = list_estoque.concat(list_servico)

            // console.log(list_estoque)

            setItemsSearched(all_items)
            // setItemsSearched(list_estoque)
            setIsLoading(false)
        }
    }

    function addDelItemsBudget(flag, qtd, id, nome, preco, qtd_estoque, tipo) {
        let flag_item_exists = false

        // adicionar no orçamento
        if (flag)
        {   
            // teste cada entrada da lista de orçamento e veja se existe
            itemsBudgetList.forEach(item => {
                // se for o mesmo item, atualize a quantidade
                // teste se o item a ser adicionado é de estoque, se sim, a chave é o codigo de barras
                if (tipo == 'estoque')
                {    
                    if (item.cod_barra_item == id)
                    {
                        
                        let itemindex = itemsBudgetList.findIndex((item) => item.cod_barra_item === id)
                        let newqtd = Object.assign({}, itemsBudgetList[itemindex])
                        
                        if (!(newqtd.quantidade >= qtd_estoque))
                        {
                            newqtd.quantidade = newqtd.quantidade + qtd
                            
                            let newlist = itemsBudgetList.slice()
                            newlist[itemindex] = newqtd
                            
                            setItemsBudgetList(newlist)
                            
                            let soma = sum + (Number(preco) * Number(qtd))
                            setSum(soma)
                        }
                        
                        flag_item_exists = true
                    }
                }

                // teste se o item a ser adicionado é de é servico, se sim, a chave é o id do servico
                else if (tipo == 'servico')
                {
                    if (item.id_item === id)
                    {
                        
                        let itemindex = itemsBudgetList.findIndex((item) => item.id_item === id)
                        let newqtd = Object.assign({}, itemsBudgetList[itemindex])
                        
                        if (!(newqtd.quantidade >= qtd_estoque))
                        {
                            newqtd.quantidade = newqtd.quantidade + qtd
                            
                            let newlist = itemsBudgetList.slice()
                            newlist[itemindex] = newqtd
                            
                            setItemsBudgetList(newlist)
                            
                            let soma = sum + (Number(preco) * Number(qtd))
                            setSum(soma)
                        }
                        
                        flag_item_exists = true
                    }
                }
                
            })
            
            // se não existir o item desejado na lista, insira
            if (!flag_item_exists)
            {
                let newitem
                // teste se é estoque, se sim, a chave é o codigo de barras
                if (tipo == 'estoque')
                {
                    newitem = Object.assign({}, {cod_barra_item: id, quantidade: qtd, nome: nome, preco: preco})
                }

                // teste se é um servico, se sim, a chave é o id
                else if(tipo == 'servico')
                {
                    newitem = Object.assign({}, {id_item: id, quantidade: qtd, nome: nome, preco: preco})
                }
                
                // insira o novo item na lista
                let list_item = itemsBudgetList.slice() 
                list_item.push(newitem)
                setItemsBudgetList(list_item)
                
                let soma = sum + (Number(preco) * Number(qtd))
                setSum(soma)
                return
            }
        }

        // diminuir no orçamento
        else
        {
            let itemindex
            // teste cada entrada da lista do orçamento
            itemsBudgetList.forEach(item => {
                // teste para ver se é um servico ou item de estoque
                // se for o mesmo item, atualize a quantidade
                // se for item de estoque e o cod_barras for igual, pegue o index
                if (tipo == 'estoque')
                {
                    if (item.cod_barra_item === id)
                    {
                        itemindex = itemsBudgetList.findIndex((item) => item.cod_barra_item === id)
                    }
                }
            
                // se for item de servico e o id for igual, pegue o index
                else if (tipo == 'servico')
                {
                    if (item.id_item === id)
                    {
                        itemindex = itemsBudgetList.findIndex((item) => item.id_item === id)
                    }
                }
                // senão, apenas retorne
                else
                {
                    return
                }
                    
                // se a quantidade for maior que 1
                if (item.quantidade > 1)
                {
                    // clona o elemento e atualiza a quantidade
                    let newqtd = Object.assign({}, itemsBudgetList[itemindex])
                    newqtd.quantidade = newqtd.quantidade - qtd

                    // se a quantidade após atualizar for 0
                    if (newqtd.quantidade == 0)
                    {
                        // exclua da lista
                        let newlist = itemsBudgetList.filter((item) => itemsBudgetList.indexOf(item) !== itemindex)
                        setItemsBudgetList(newlist)
                        return
                    }
                    
                    // clona a lista, insere o elemento na posição desejada
                    let newlist = itemsBudgetList.slice()
                    newlist[itemindex] = newqtd
                    // atualiza o valor total
                    // se for negativo, deixe igual a 0
                    let soma = sum - (Number(preco) * Number(qtd))
                    if (soma < 0 )
                    {
                        soma = 0
                    }
                    
                    setSum(soma)
                    setItemsBudgetList(newlist)
                }

                // se não for maior que 1
                else
                {
                    // se tiver exatamente apenas um item
                    // limpe a lista
                    if (itemsBudgetList.length == 1)
                    {
                        setItemsBudgetList([])
                        setSum(0)
                    }
                    // senão, exclua o elemento desejado
                    else
                    {
                        let newlist = itemsBudgetList.filter((item) => itemsBudgetList.indexOf(item) !== itemindex)
                        setItemsBudgetList(newlist)
                    }
                }
            })
        }
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
        
         window.location.href = '/os'
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
                            <Form.Label>Data de Criação da OS <span style={{ 'color': 'red' }}>*</span></Form.Label>
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
                                {(!isLoading && itemsSearched != '') && itemsSearched.map(item => {
                                        
                                        if (item.tipo == 'estoque')
                                        {
                                            return <>
                                                <tr key={item.id}>
                                                    <td className='table-info-cell'> {item.id} </td>
                                                    <td className='table-name-cell'> {item.nome_item} </td>
                                                    <td className='table-info-cell'> {item.quantidade} </td>
                                                    <td className='table-info-cell'> {item.preco_un} </td>
                                                    <td className='table-info-cell'> {item.codigo_barras} </td>

                                                    <td className='table-info-cell table-add-rem-button'> 
                                                        <Button onClick={() => { addDelItemsBudget(true, 1, item.codigo_barras, item.nome_item, item.preco_un, item.quantidade, 'estoque') }} variant="success">Adicionar</Button>
                                                        <Button onClick={() => { addDelItemsBudget(false, 1, item.codigo_barras, item.nome_item, item.preco_un, 0, 'estoque') }} variant="danger">Retirar</Button>
                                                    </td>

                                                </tr>
                                            </>
                                        }
                                        if (item.tipo == 'servico')
                                        {
                                            return <>
                                                <tr key={item.id_servico}>
                                                    <td className='table-info-cell'> {item.id_servico} </td>
                                                    <td className='table-name-cell'> {item.nome_servico} </td>
                                                    <td className='table-info-cell'> --- </td>
                                                    <td className='table-info-cell'> {item.custo} </td>
                                                    <td className='table-info-cell'> --- </td>

                                                    <td className='table-info-cell table-add-rem-button'> 
                                                        <Button onClick={() => { addDelItemsBudget(true, 1, item.id_servico, item.nome_servico, item.custo, 1, 'servico') }} variant="success">Adicionar</Button>
                                                        <Button onClick={() => { addDelItemsBudget(false, 1, item.id_servico, item.nome_servico, item.custo, 0, 'servico') }} variant="danger">Retirar</Button>
                                                    </td>

                                                </tr>
                                            </>
                                        }
                                    }
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