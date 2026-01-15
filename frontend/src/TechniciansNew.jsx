import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import Technicians from './Technicians'

function TechniciansNew(props)
{

    // guardando valores na variavel
    const [cpf, setCpf] = useState()
    const [flag_admin, setFlagAdmin] = useState(false)
    const [tecnico_nome, setTecnicoNome] = useState()
    const [tecnico_endereco, setTecnicoEndereco] = useState()
    const [tecnico_usuario, setTecnicoUsuario] = useState()
    const [tecnico_senha, setTecnicoSenha] = useState()
    const [tecnico_senha_conf, setTecnicoSenhaConf] = useState()
    const [tecnico_tel, setTecnicoTel] = useState()

    const [response, setResponse] = useState({status:'', msg:''})
    const navigation  = useNavigate()


    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/tecnico/novo'

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
                    cpf_tecnico: cpf,
                    flag_cnpj: flag_admin,
                    user: tecnico_usuario,
                    nome_tecnico: tecnico_nome,
                    senha_tecnico: tecnico_senha,
                    senha_confirma: tecnico_senha_conf,
                    contato_tecnico: tecnico_tel,
                    endereco_tecnico: tecnico_endereco,
                    admin: flag_admin,
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
                    <p className='h2'>Cadastro de novo técnico</p> 
                    <span style={{'color':'red'}}>* representam campos obrigatórios</span>
                </div>

            <Form onSubmit={submit}>
                <Form.Group>
                    <Form.Label>CPF <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' placeholder='00000000000' onChange={(event) => setCpf(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Nome do Técnico <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' placeholder='João Maria' onChange={(event) => setTecnicoNome(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>É administrador</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setFlagAdmin(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Telefone <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='number' placeholder='84912345678' onChange={(event) => setTecnicoTel(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Endereço <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' placeholder='Rua Exemplo, 001' onChange={(event) => setTecnicoEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Usuário para login <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='text' placeholder='Joao01' onChange={(event) => setTecnicoUsuario(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Senha <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='password' placeholder='Insira sua senha' onChange={(event) => setTecnicoSenha(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Confirmação de senha <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control type='password' placeholder='Insira sua senha' onChange={(event) => setTecnicoSenhaConf(event.target.value)} />
                </Form.Group>
                
                <Button variant='outline-primary' type='submit'>Cadastrar técnico</Button>
            </Form>

                {/* CHECA O ALERTA A SER MOSTRADO */}
                { (response.status != '' && response.status == 'success') && 
                    navigation("/tecnicos", {state: {'status':response.status, 'msg':response.msg}})
                    ||
                    (response.status != '' && response.status == 'error') &&
                    <AlertPopUp status={response.status} msg={response.msg} />
                }
            </div>
        </>
    )

}

export default TechniciansNew