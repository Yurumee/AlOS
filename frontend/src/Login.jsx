import './styles/index.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useState } from "react";

function Login(props){
    const [loginCPF, setLoginCPF] = useState()
    const [loginSenha, setLoginSenha] = useState()

    async function loginTech(event){
        // previne de ir vazio
        event.preventDefault()

        // URL backend
        const URL = 'http://127.0.0.1:5000/tecnico/login'

        // realiza a tentativa de login
        await fetch (URL, {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cpf: loginCPF,
                    senha: loginSenha
                })
            }
        )
        .then(res => res.json())
        .then((res) => {props.setToken(res.access_token)}) // se bem sucedida, guarda o token
        .catch((error) => console.log(error))

        setLoginCPF('')
        setLoginSenha('')
    }

    return (
        <div className="container">

            <h1>ENTRE COMO UM TÉCNICO CADASTRADO</h1>

            <Form onSubmit={loginTech}>
                <Form.Group>
                    <Form.Label>CPF</Form.Label>
                    <Form.Control type='number' placeholder='Insira seu CPF' maxLength={14} required onChange={(event) => setLoginCPF(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type='password' placeholder='Insira sua senha' required onChange={(event) => setLoginSenha(event.target.value)}></Form.Control>
                </Form.Group>

                <Button variant='outline-primary' type='submit'>Login</Button>

            </Form>

        </div>
    )
}

export default Login