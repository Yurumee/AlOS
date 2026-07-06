import './styles/Tech.css'
import './styles/index.css'
import NavBar from './Navbar'
import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function TechniciansPass(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [technician, setTechnician] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guardando valores na variavel
    const [senha_nova, setSenhaNova] = useState()
    const [senha_nova_conf, setSenhaNovaConf] = useState()

    useEffect(() => {
        async function getTechnician()
        {   
            const URL = `http://localhost:5000/tecnico/pesquisar/${id}`
            const resp = await fetch(URL, {
                                            headers: 
                                            {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + props.token
                                            }
                                        }).then(resp => resp.json())
            // console.log(resp)
            const list = Object.values(resp)
            setTechnician(list[0])
            setIsLoading(false)
        }

        getTechnician()
    }, [])


    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = `http://localhost:5000/tecnico/senha/${id}`

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
                    nova_senha: senha_nova,
                    nova_senha_conf: senha_nova_conf,                    
                })

        })
        .then(res => res.json())
        .then(res => setResponse(res))
        .catch(error => console.log(error))
        
        window.location.href = '/tecnicos'
    }

    return(
        <>
            <NavBar />

        { !isLoading &&

            <div className='container'>

            <h1>Nova Senha - Usuário {technician.usuario}</h1>

            <Form className='grid-container-tech' onSubmit={submit}>

                <Form.Group className='grid-child' style={{'gridColumn': '1', 'gridRow': '1', 'justifySelf': "left"}}>
                    <Form.Label>Senha <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='password' placeholder='Insira a nova senha' onChange={(event) => setSenhaNova(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child' style={{'gridColumn': '1', 'gridRow': '2', 'justifySelf': "left"}}>
                    <Form.Label>Confirmação de senha <span style={{'color':'red'}}>*</span></Form.Label>
                    <Form.Control className='grid-input' type='password' placeholder='Insira a nova senha' onChange={(event) => setSenhaNovaConf(event.target.value)} />
                </Form.Group>

                <br />
                <Button className='grid-child grid-button-edit' variant='outline-warning' style={{'gridColumn': '1', 'gridRow': '3', 'justifySelf': "left"}} type='submit'>Alterar Senha</Button>
            </Form>

            </div>
            
        }
        
        

        
        </>
    )
}

export default TechniciansPass