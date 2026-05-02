import './styles/OS.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useNavigate, useParams } from 'react-router-dom'

function AttachmentsNew(props) {

    let params = useParams()
    const id = params.id
    
    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [garantia_anexo, setGarantiaAnexo] = useState()
    const [solucao_anexo, setSolucaoAnexo] = useState()
    const [obs_anexo, setObsAnexo] = useState()
    const [emitir_anexo, setEmitirAnexo] = useState(false)
    
    async function submit(event) {
        // previne de ir vazio
        event.preventDefault()
        // url para backend
        const URL = `http://localhost:5000/anexo/criar/${id}`
        await fetch(URL,
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                },
                // transformando variaveis do forms em json
                body: JSON.stringify({
                    garantia: garantia_anexo,
                    solucao: solucao_anexo,
                    observacao: obs_anexo,
                    emitido: emitir_anexo
                })
            })
            .then(res => res.json())
            .then(res => setResponse(res))
            .catch(error => console.log(error))
        
         window.location.href = '/os'
    }

        return (
            <>

                <NavBar />

                <div className='container'>

                    <div style={{ 'marginBottom': '15px' }}>
                        <p className='h2'>Cadastro do Anexo para a Ordem N°{id}</p>
                        <span style={{ 'color': 'red' }}>* representam campos obrigatórios</span>
                    </div>

                    <Form className='grid-container' onSubmit={submit}>

                        <Form.Group className='grid-child' id='grid-date-create'>
                            <Form.Label>Garantia <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control type='datetime-local' onChange={(event) => setGarantiaAnexo(event.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-prognostic'>
                            <Form.Label>Solução realizada <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control as='textarea' rows='10' placeholder='Apresenta comportamento indesejado...' onChange={(event) => setSolucaoAnexo(event.target.value)} />
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-diagnostic'>
                            <Form.Label>Observação</Form.Label>
                            <Form.Control as='textarea' rows='10' style={{ 'width': '100%' }} placeholder='O problema encontrado trata-se de...' onChange={(event) => setObsAnexo(event.target.value)} />
                        </Form.Group>

                        <br />

                        <Form.Group className='grid-child grid-switch'>
                            <Form.Label>Emitir Anexo</Form.Label>
                            <Form.Check type='switch' onChange={(event) => setEmitirAnexo(event.target.checked)} />
                        </Form.Group>

                        <Button className='grid-child grid-button' variant='outline-primary' type='submit'>Cadastrar Anexo</Button>
                    </Form>

                </div>
            </>
        )

    }

export default AttachmentsNew