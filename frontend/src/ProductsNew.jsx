import './styles/Products.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useState, useEffect } from 'react'

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

    const [lenA, setLenA] = useState(0)
    const [lenObs, setLenObs] = useState(0)
    const [lenNum, setLenNum] = useState(0)
    const [lenMod, setLenMod] = useState(0)
    
    useEffect(() => {
        if (acessorios != undefined) {
            setLenA(acessorios.length)
        }

        if (obs != undefined) {
            setLenObs(obs.length)
        }

        if (num_serie != undefined) {
            setLenNum(num_serie.length)
        }

        if (modelo != undefined) {
            setLenMod(modelo.length)
        }

    }, [lenA, lenObs, lenNum, lenMod, acessorios, obs, num_serie, modelo])
    

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

                <div style={{ 'marginBottom': '15px' }}>
                    <p className='h2'>Cadastro de novo produto</p>
                    <span style={{ 'color': 'red' }}>* representam campos obrigatórios</span>
                </div>

            <Form className='grid-container-prod' onSubmit={submit}>

                <Form.Group className='grid-child'>
                    <Form.Label>ID do Cliente <span style={{ 'color': 'red' }}>*</span></Form.Label>
                    <Form.Control type='number' placeholder='1' className='grid-input' min={0} onChange={(event) => setClienteId(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control type='text' placeholder='M0D3-L0' className='grid-input' style={{ 'width': lenMod + 'ch' }} onChange={(event) => setModelo(event.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Número de Série</Form.Label>
                    <Form.Control type='text' placeholder='S3R14LNUMB3R' className='grid-input' style={{ 'width': lenNum + 'ch' }} onChange={(event) => setNumSerie(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Cor</Form.Label>
                    <Form.Control type='text' placeholder='Azul' className='grid-input' onChange={(event) => setCor(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Sistema Operacional <span style={{ 'color': 'red' }}>*</span></Form.Label>
                    <Form.Select defaultValue={''} className='grid-input' style={{'gridColumn': 'span 2'}} onChange={(event) => setSisOperacional(event.target.value)}>
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
                </Form.Group>

                <Form.Group className='grid-child' id='grid-text-ace'>
                    <Form.Label>Acessórios</Form.Label>
                    <Form.Control as='textarea' rows={5} style={{ 'width': '100%' }} placeholder='- Carregador &#10; - Bolsa alaranjada &#10; ...' onChange={(event) => setAcessorios(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-text-obs'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control as='textarea' rows={5} style={{ 'width': '100%' }} placeholder='- Tela rachada na lateral direita &#10; - Dobradiça direita com defeito &#10; ...' onChange={(event) => setObservacao(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-one'>
                    <Form.Label>Possui Avarias?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setAvaria(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-two'>
                    <Form.Label>Está Ligando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setLiga(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-three'>
                    <Form.Label>Está Carregando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setCarrega(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-four'>
                    <Form.Label>Possui Backup?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setBackup(event.target.checked)} />
                </Form.Group>
                <br />
                <Button className='grid-child grid-button-prod' variant='outline-warning' type='submit'>Cadastrar produto</Button>
            </Form>

            </div>
        </>
    )

}

export default ProductsNew