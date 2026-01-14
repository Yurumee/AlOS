import './styles/Clients.css'
import './styles/index.css'
import './styles/ClientsNew.css'
import NavBar from './NavBar'

import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function ProductsNew(props)
{

    // guardando valores na variavel
    const [cliente_id, setClienteId] = useState()
    const [modelo, setModelo] = useState()
    const [num_serie, setNumSerie] = useState()
    const [cor, setCor] = useState()
    const [sis_operacional, setSisOperacional] = useState()
    const [avaria, setAvaria] = useState(false)
    const [liga, setLiga] = useState(false)
    const [carrega, setCarrega] = useState(false)
    const [backup, setBackup] = useState(false)
    const [acessorios, setAcessorios] = useState()
    const [obs, setObservacao] = useState()


    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/produto/novo'

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
                    cliente_id: cliente_id,
                    modelo: modelo,
                    num_serie: num_serie,
                    cor: cor,
                    sis_operacional: sis_operacional,
                    avaria: avaria,
                    liga: liga,
                    carrega: carrega,
                    backup: backup,
                    acessorios: acessorios,
                    obs: obs,
                })
        })

        window.location.href = '/produtos'
    }

    return(
        <>
            <NavBar/>

            <div className='container'>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>ID do Cliente</Form.Label>
                    <Form.Control type='number' placeholder='1' onChange={(event) => setClienteId(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control type='text' placeholder='M0D3-L0' onChange={(event) => setModelo(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Número de Série</Form.Label>
                    <Form.Control type='text' placeholder='S3R14LNUMB3R' onChange={(event) => setNumSerie(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Cor</Form.Label>
                    <Form.Control type='text' placeholder='Azul' onChange={(event) => setCor(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Sistema Operacional</Form.Label>
                    <Form.Select defaultValue={''} onChange={(event) => setSisOperacional(event.target.value)}>
                        <option disabled value={''}>---Selecione um sistema---</option>
                        <option value={"WIN 11"}>WIN 11</option>
                        <option value={"WIN 10"}>WIN 10</option>
                        <option value={"WIN 8.5"}>WIN 8.5</option>
                        <option value={"WIN 8"}>WIN 8</option>
                        <option value={"WIN 7"}>WIN 7</option>
                        <option value={"LINUX"}>LINUX</option>
                        <option value={"CHROME OS"}>CHROME OS</option>
                        <option value={"OUTRO"}>OUTRO</option>
                    </Form.Select>
                    {/* <Form.Control type='text' placeholder='Win 10' onChange={(event) => setSisOperacional(event.target.value)} /> */}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Possui Avarias?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setAvaria(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Está Ligando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setLiga(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Está Carregando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setCarrega(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Possui Backup?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setBackup(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Acessórios</Form.Label>
                    <Form.Control as='textarea' placeholder='- Carregador &#10; - Bolsa alaranjada &#10; ...' onChange={(event) => setAcessorios(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control as='textarea' placeholder='- Tela rachada na lateral direita &#10; - Dobradiça direita com defeito &#10; ...' onChange={(event) => setObservacao(event.target.value)} />
                </Form.Group>
                <br />
                <Button variant='outline-primary' type='submit'>Cadastrar produto</Button>
            </Form>

            </div>
        </>
    )

}

export default ProductsNew