import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function ClientsEdit(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [client, setClient] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guardando valores na variavel
    const [new_cliente_nome, setNewClienteNome] = useState()
    const [new_empresa_nome, setNewEmpresaNome] = useState()
    const [new_cliente_endereco, setNewClienteEndereco] = useState()
    const [new_cliente_bairro, setNewClienteBairro] = useState()
    const [new_cliente_cidade, setNewClienteCidade] = useState()
    const [new_cliente_cep, setNewClienteCep] = useState()
    const [new_cliente_tel, setNewClienteTel] = useState()
    const [new_cliente_credito, setNewClienteCredito] = useState()

    useEffect(() => {
        async function getClient()
        {   
            const URL = `http://localhost:5000/cliente/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            console.log(resp)
            const list = Object.values(resp)
            setClient(list[0])
            setIsLoading(false)
        }

        getClient()
    }, [])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()


        // url para backend
        const URL = `http://localhost:5000/cliente/editar/${id}`

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
                    nome_cliente: new_cliente_nome,
                    empresa_cliente: new_empresa_nome,
                    endereco_cliente: new_cliente_endereco,
                    bairro_cliente: new_cliente_bairro,
                    cidade_cliente: new_cliente_cidade,
                    cep_cliente: new_cliente_cep,
                    telefone_cliente: new_cliente_tel,
                    limite_credito: new_cliente_credito
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

            <h1>Editando Cliente - {client.cpf_cnpj}</h1>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>Nome do Ciente</Form.Label>
                    <Form.Control type='text' defaultValue={client.nome_completo} placeholder='João Maria' onChange={(event) => setNewClienteNome(event.target.value)} />
                </Form.Group>

                {
                    client.pessoa_juridica && <Form.Group>
                                            <Form.Label>Nome Fantasia</Form.Label>
                                            <Form.Control type='text' defaultValue={client.nome_fantasia} placeholder='Empresa Fulana' onChange={(event) => setNewEmpresaNome(event.target.value)} />
                                        </Form.Group>
                }

                <Form.Group>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type='number' defaultValue={client.telefone} placeholder='84912345678' onChange={(event) => setNewClienteTel(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Limite de Crédito</Form.Label>
                    <Form.Control type='number' defaultValue={client.limite_credito} placeholder='99.99' step={0.01} onChange={(event) => setNewClienteCredito(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type='text' defaultValue={client.endereco} placeholder='Rua Exemplo, 001' onChange={(event) => setNewClienteEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control type='text' defaultValue={client.bairro} placeholder='Centro' onChange={(event) => setNewClienteBairro(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control type='text' defaultValue={client.cidade} placeholder='Campos Neutrais' onChange={(event) => setNewClienteCidade(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type='number' defaultValue={client.cep} placeholder='12345000' onChange={(event) => setNewClienteCep(event.target.value)} />
                </Form.Group>
                <br />
                <Button variant='outline-warning' type='submit'>Editar cliente</Button>
            </Form>

            {/* CHECA O ALERTA A SER MOSTRADO */}
            { (response.status != '' && response.status == 'success') && 
                navigation("/clientes", {state: {'status':response.status, 'msg':response.msg}})
                ||
                (response.status != '' && response.status == 'error') &&
                <AlertPopUp status={response.status} msg={response.msg} close={() => {setResponse({status:'', msg:''})}}/>
            }

            </div>
            
        }
        
        

        
        </>
    )
}

export default ClientsEdit