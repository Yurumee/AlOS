import './styles/Tech.css'
import './styles/index.css'
import NavBar from './Navbar'
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

    const [lenNC, setLenNC] = useState(0)
    const [lenT, setLenT] = useState(0)
    const [lenEN, setLenEN] = useState(0)

    useEffect(() => {
        if (new_tecnico_nome != undefined) {
            setLenNC(new_tecnico_nome.length)
        }

        if (new_tecnico_tel != undefined) {
            setLenT(new_tecnico_tel.length)
        }

        if (new_tecnico_endereco != undefined) {
            setLenEN(new_tecnico_endereco.length)
        }

    }, [lenNC, lenT, lenEN, new_tecnico_nome, new_tecnico_tel, new_tecnico_endereco])


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
        
        window.location.href = '/tecnicos'
    }

    return(
        <>
            <NavBar />

        { !isLoading &&

            <div className='container' >

            <h1>Editando Técnico - {technician.cpf}</h1>

            <Form className='grid-container-tech' onSubmit={submit}>

                <Form.Group className='grid-child'>
                    <Form.Label>Nome do Técnico</Form.Label>
                    <Form.Control className='grid-input' type='text' defaultValue={technician.nome_completo} placeholder='João Maria' style={{ 'width': lenNC + 'ch' }} onChange={(event) => setNewTecnicoNome(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control className='grid-input' type='number' defaultValue={technician.telefone} style={{ 'width': lenT + 'ch' }} placeholder='84912345678' onChange={(event) => setNewTecnicoTel(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type='text' className='grid-input' defaultValue={technician.endereco} style={{ 'width': lenEN + 'ch' }} placeholder='Rua Exemplo, 001' onChange={(event) => setNewTecnicoEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child' style={{'gridColumn': '1 / span 2', 'gridRow': '3'}}>
                    <Form.Label>Permissões de Administrador</Form.Label>
                    <Form.Check type='switch' defaultChecked={technician.admin} onChange={(event) => setNewTecnicoAdmin(event.target.checked)} />
                </Form.Group>

                <br />
                <Button className='grid-child grid-button-edit' variant='outline-warning' style={{'gridColumn': '2 / span 2', 'gridRow': '3'}} type='submit'>Editar Técnico</Button>
            </Form>

            </div>
            
        }
        
        

        
        </>
    )
}

export default TechniciansEdit