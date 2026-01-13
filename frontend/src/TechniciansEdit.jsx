import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'
import AlertPopUp from './AlertPopUp'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'

function TechniciansEdit(props) 
{
    let params = useParams()
    const navigation  = useNavigate()
    const id = params.id
    const [technician, setTechnician] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState({status:'', msg:''})

    // guardando valores na variavel
    const [new_tecnico_nome, setNewTecnicoNome] = useState()
    const [new_tecnico_tel, setNewTecnicoTel] = useState()
    const [new_tecnico_endereco, setNewTecnicoEndereco] = useState()
    const [new_tecnico_admin, setNewTecnicoAdmin] = useState()

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
        const URL = `http://localhost:5000/tecnico/editar/${id}`

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
                    nome_tecnico: new_tecnico_nome,
                    contato_tecnico: new_tecnico_tel,
                    endereco_tecnico: new_tecnico_endereco,
                    admin: new_tecnico_admin,
                    
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

            <h1>Editando Técnico - {technician.cpf}</h1>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>Nome do Ciente</Form.Label>
                    <Form.Control type='text' defaultValue={technician.nome_completo} placeholder='João Maria' onChange={(event) => setNewTecnicoNome(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type='number' defaultValue={technician.telefone} placeholder='84912345678' onChange={(event) => setNewTecnicoTel(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type='text' defaultValue={technician.endereco} placeholder='Rua Exemplo, 001' onChange={(event) => setNewTecnicoEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Permissões de Administrador</Form.Label>
                    <Form.Check type='switch' defaultChecked={technician.admin} onChange={(event) => setNewTecnicoAdmin(event.target.checked)} />
                </Form.Group>

                <br />
                <Button variant='outline-warning' type='submit'>Editar Técnico</Button>
            </Form>

            {/* CHECA O ALERTA A SER MOSTRADO */}
            { (response.status != '' && response.status == 'success') && 
                navigation("/tecnicos", {state: {'status':response.status, 'msg':response.msg}})
                ||
                (response.status != '' && response.status == 'error') &&
                <AlertPopUp status={response.status} msg={response.msg} close={() => {setResponse({status:'', msg:''})}}/>
            }

            </div>
            
        }
        
        

        
        </>
    )
}

export default TechniciansEdit