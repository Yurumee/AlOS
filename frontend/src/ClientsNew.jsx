import './styles/Clients.css'
import './styles/index.css'
import NavBar from './Navbar'
import AlertPopUp from './AlertPopUp'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

function ClientsNew(props)
{

    // guardando valores na variavel
    const [cpf_cnpj, setCpfCnpj] = useState()
    const [flag_cnpj, setFlagCnpj] = useState(false)
    const [cliente_nome, setClienteNome] = useState()
    const [empresa_nome, setEmpresaNome] = useState()
    const [cliente_endereco, setClienteEndereco] = useState()
    const [cliente_bairro, setClienteBairro] = useState()
    const [cliente_cidade, setClienteCidade] = useState()
    const [cliente_cep, setClienteCep] = useState()
    const [cliente_tel, setClienteTel] = useState()
    const [cliente_credito, setClienteCredito] = useState()

    const [response, setResponse] = useState({status:'', msg:''})
    const navigation  = useNavigate()

    const [lenC, setLenC] = useState(0)
    const [lenF, setLenF] = useState(0)
    const [lenEN, setLenEN] = useState(0)
    const [lenB, setLenB] = useState(0)
    const [lenCI, setLenCI] = useState(0)

    useEffect(() => {
        if (cliente_nome != undefined)
        {
            setLenC(cliente_nome.length)
        }

        if (empresa_nome != undefined)
        {
            setLenF(empresa_nome.length)
        }

        if (cliente_endereco != undefined)
        {
            setLenEN(cliente_endereco.length)
        }

        if (cliente_bairro != undefined)
        {
            setLenB(cliente_bairro.length)
        }

        if (cliente_cidade != undefined)
        {
            setLenCI(cliente_cidade.length)
        }

    }, [lenC, lenF, lenEN, lenB, lenCI, cliente_nome, empresa_nome, cliente_endereco, cliente_bairro, cliente_cidade])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/cliente/novo'

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
                    cpf_cnpj_cliente: cpf_cnpj,
                    flag_cnpj: flag_cnpj,
                    nome_cliente: cliente_nome,
                    empresa_cliente: empresa_nome,
                    endereco_cliente: cliente_endereco,
                    bairro_cliente: cliente_bairro,
                    cidade_cliente: cliente_cidade,
                    cep_cliente: cliente_cep,
                    telefone_cliente: cliente_tel,
                    limite_credito: cliente_credito
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))

        // window.location.href = '/clientes'
    }

    return(
        <>
                
            <NavBar/>

            <div className='container'>

                <div style={{'marginBottom':'15px'}}>
                    <p className='h2'>Cadastro de novo cliente</p> 
                    <span style={{'color':'red'}}>* representam campos obrigatórios</span>
                </div>

            <Form className='grid-container' onSubmit={submit}>
                <Form.Group className='grid-child'>
                    <Form.Label>CPF/CNPJ <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='number' placeholder='00000000000' onChange={(event) => setCpfCnpj(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Ciente <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' style={{'width': lenC+'ch'}} type='text' placeholder='João Maria' onChange={(event) => setClienteNome(event.target.value)} />
                </Form.Group>


                {flag_cnpj && 
                    <Form.Group className='grid-child'>
                        <Form.Label>Nome Fantasia <span style={{'color':'red'}}>*</span></Form.Label>
                        <Form.Control className='grid-input' style={{'width': lenF+'ch'}} type='text' placeholder='Empresa Fulana' onChange={(event) => setEmpresaNome(event.target.value)} />
                    </Form.Group>
                }

                <Form.Group className='grid-child'>
                    <Form.Label>Endereço <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' style={{'width': lenEN+'ch'}} type='text' placeholder='Rua Exemplo, 001' onChange={(event) => setClienteEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Bairro <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' style={{'width': lenB+'ch'}} type='text' placeholder='Centro' onChange={(event) => setClienteBairro(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Cidade <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' style={{'width': lenCI+'ch'}} type='text' placeholder='Campos Neutrais' onChange={(event) => setClienteCidade(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>CEP <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='number' placeholder='12345000' onChange={(event) => setClienteCep(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Telefone <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='number' placeholder='84912345678' onChange={(event) => setClienteTel(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Limite de Crédito</Form.Label>
                    <Form.Control className='grid-input' type='number' placeholder='99.99' step={0.01} onChange={(event) => setClienteCredito(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child grid-switch'>
                    <Form.Label>Pessoa Jurídica</Form.Label>
                    <Form.Check style={{'justifySelf':'center'}} type='switch' onChange={(event) => setFlagCnpj(event.target.checked)} />
                </Form.Group>

                <br />
                <Button  className='grid-button grid-child' variant='outline-primary' type='submit'>Cadastrar cliente</Button>
            </Form>

                {/* CHECA O ALERTA A SER MOSTRADO */}
                { (response.status != '' && response.status == 'success') && 
                    navigation("/clientes", {state: {'status':response.status, 'msg':response.msg}})
                    ||
                    (response.status != '' && response.status == 'error') &&
                    <AlertPopUp status={response.status} msg={response.msg} />
                }
            </div>
        </>
    )

}

export default ClientsNew