import './styles/Attachment.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useNavigate, useParams } from 'react-router-dom'

function AttachmentsEdit(props) {

    let params = useParams()
    const id = params.id
    
    const [attachment, setAttachment] = useState([])

    // carregamento
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [new_garantia_anexo, setNewGarantiaAnexo] = useState()
    const [new_solucao_anexo, setNewSolucaoAnexo] = useState()
    const [new_obs_anexo, setNewObsAnexo] = useState()
    const [new_emitir_anexo, setNewEmitirAnexo] = useState(false)

    useEffect(() => {
        async function getAttachment() {
            // url da api
            const URL = `http://127.0.0.1:5000/anexo/${id}`
            const response = await fetch(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            }
            )
            const data = await response.json();

            // guardando o orcamento
            setAttachment(data)

            setIsLoading(false)
        }

        getAttachment()
    }, [])
    
    async function submit(event) {
        // previne de ir vazio
        event.preventDefault()
        // url para backend
        const URL = `http://localhost:5000/anexo/editar/${id}`
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
                    garantia: new_garantia_anexo,
                    solucao: new_solucao_anexo,
                    observacao: new_obs_anexo,
                    emitido: new_emitir_anexo
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
                        <p className='h2'>Edição do Anexo para a Ordem N°{id}</p>
                        <span style={{ 'color': 'red' }}>* representam campos obrigatórios</span>
                    </div>

                    <Form className='grid-container-att' onSubmit={submit}>

                        <Form.Group className='grid-child' id='grid-date-create-att'>
                            <Form.Label>Garantia <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control className='grid-input' type='datetime-local' defaultValue={attachment.garantia} onChange={(event) => setNewGarantiaAnexo(event.target.value)} ></Form.Control>
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-solution-att'>
                            <Form.Label>Solução realizada <span style={{ 'color': 'red' }}>*</span></Form.Label>
                            <Form.Control as='textarea' rows='10' defaultValue={attachment.solucao} placeholder='A solução realizada foi...' onChange={(event) => setNewSolucaoAnexo(event.target.value)} />
                        </Form.Group>

                        <Form.Group className='grid-child' id='grid-obs-att'>
                            <Form.Label>Observação</Form.Label>
                            <Form.Control as='textarea' rows='10' defaultValue={attachment.observacoes} style={{ 'width': '100%' }} placeholder='Considerações adicionais...' onChange={(event) => setNewObsAnexo(event.target.value)} />
                        </Form.Group>

                        <br />

                        <Form.Group className='grid-child grid-switch'>
                            <Form.Label>Emitir Anexo</Form.Label>
                            <Form.Check type='switch' onChange={(event) => setNewEmitirAnexo(event.target.checked)} />
                        </Form.Group>

                        <Button className='grid-child grid-button-att' variant='outline-warning' type='submit'>Editar Anexo</Button>
                    </Form>

                </div>
            </>
        )

    }

export default AttachmentsEdit