import './styles/index.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AlertPopUp from './AlertPopUp';

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';

function Login(props){
    const navigation  = useNavigate()
    const [response, setResponse] = useState({status:'', msg:''})
    const [loginUser, setLoginUser] = useState()
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
                    usuario: loginUser,
                    senha: loginSenha
                })
            }
        )
        .then(res => res.json())
        .then((res) => {props.setToken(res.access_token); setResponse(res.status, res.msg);}) // se bem sucedida, guarda o token
        .catch((error) => console.log(error))
        
        if(response.status == 'success')
        {
            navigation("/", {state: {'status':response.status, 'msg':response.msg}})
            setLoginUser('')
            setLoginSenha('')
        }


    }

    return (
        <div className="container">

            <h1>ENTRE COMO UM TÉCNICO CADASTRADO</h1>

            <Form onSubmit={loginTech}>
                <Form.Group>
                    <FloatingLabel label='Usuário' className='mb-3'>
                        <Form.Control type='text' placeholder='Insira o nome de usuário' onChange={(event) => setLoginUser(event.target.value)}></Form.Control>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group>
                    <FloatingLabel label='Senha' className='mb-3'>
                        <Form.Control type='password' placeholder='Insira sua senha' onChange={(event) => setLoginSenha(event.target.value)}></Form.Control>
                    </FloatingLabel>
                </Form.Group>
                
                <Button variant='outline-primary' type='submit'>Login</Button>

            </Form>

            {/* CHECA O ALERTA A SER MOSTRADO */}
            { 
                // (response.status != '' && response.status == 'success') && 
                // navigation("/clientes", {state: {'status':response.status, 'msg':response.msg}})
                // ||
                (response.status != '' && response.status == 'error') &&
                <AlertPopUp status={response.status} msg={response.msg} close={() => {setResponse({status:'', msg:''})}}/>
            }

        </div>
    )
}

export default Login