import './styles/Products.css'
import './styles/index.css'
import NavBar from './Navbar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'

function ProductsEdit(props) 
{
    let params = useParams()
    const id = params.id
    const [product, setProduct] = useState()
    const [isLoading, setIsLoading] = useState(true)

    // guardando valores na variavel
    const [new_modelo, setNewModelo] = useState()
    const [new_cor, setNewCor] = useState()
    const [new_sis_operacional, setNewSisOperacional] = useState()
    const [new_avaria, setNewAvaria] = useState()
    const [new_liga, setNewLiga] = useState()
    const [new_carrega, setNewCarrega] = useState()
    const [new_backup, setNewBackup] = useState()
    const [new_acessorio, setNewAcessorio] = useState()
    const [new_obs, setNewObservacao] = useState()

    const [lenA, setLenA] = useState(0)
    const [lenObs, setLenObs] = useState(0)
    const [lenMod, setLenMod] = useState(0)
    const [lenC, setLenC] = useState(0)
    
    useEffect(() => {
        if (new_acessorio != undefined) {
            setLenA(new_acessorio.length)
        }

        if (new_obs != undefined) {
            setLenObs(new_obs.length)
        }

        if (new_modelo != undefined) {
            setLenMod(new_modelo.length)
        }

        if (new_cor != undefined) {
            setLenC(new_cor.length)
        }

    }, [lenA, lenObs, lenMod, lenC, new_acessorio, new_obs, new_modelo, new_cor])

    useEffect(() => {
        async function getProduct()
        {
            const URL = `http://localhost:5000/produto/pesquisar/${id}`
            const resp = await fetch(URL, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            }
            ).then(resp => resp.json())
            setProduct(resp)
            setIsLoading(false)
        }

        getProduct()
    }, [])

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = `http://localhost:5000/produto/editar/${id}`

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
                    modelo_dispositivo: new_modelo,
                    cor_dispositivo: new_cor,
                    sistema_dispositivo: new_sis_operacional,
                    avaria: new_avaria,
                    liga: new_liga,
                    carrega: new_carrega,
                    backup_dispositivo: new_backup,
                    acessorio_dispositivo: new_acessorio,
                    obs_dispositivo: new_obs
                })

        })

        window.location.href = '/produtos'
    }

    return(
        <>
            <NavBar />

        { !isLoading &&

            <div className='container'>

            <div style={{ 'marginBottom': '15px' }}>
                    <p className='h2'>Editando Produto - {product.num_serie}</p>
                    <span style={{ 'color': 'red' }}>* representam campos obrigatórios</span>
            </div>

            <Form className='grid-container-prod' onSubmit={submit}>

                <Form.Group className='grid-child'>
                    <Form.Label>Modelo do Produto</Form.Label>
                    <Form.Control type='text' className='grid-input' style={{ 'width': lenMod + 'ch' }} defaultValue={product.modelo} onChange={(event) => setNewModelo(event.target.value)} />
                </Form.Group>
                
                <Form.Group className='grid-child'>
                    <Form.Label>Cor do Produto</Form.Label>
                    <Form.Control type='text' className='grid-input' style={{ 'width': lenC + 'ch' }} defaultValue={product.cor} onChange={(event) => setNewCor(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child'>
                    <Form.Label>Sistema Operacional do Produto <span style={{ 'color': 'red' }}>*</span></Form.Label>
                    <Form.Select defaultValue={product.sis_operacional} className='grid-input' style={{'gridColumn': 'span 2'}} onChange={(event) => setNewSisOperacional(event.target.value)}>
                        <option disabled value={''}>---Selecione um sistema---</option>
                        <option value={"WIN 11"}>WIN 11</option>
                        <option value={"WIN 10"}>WIN 10</option>
                        <option value={"WIN 8.1"}>WIN 8.1</option>
                        <option value={"WIN 8"}>WIN 8</option>
                        <option value={"WIN 7"}>WIN 7</option>
                        <option value={"LINUX"}>LINUX</option>
                        <option value={"CHROME OS"}>CHROME OS</option>
                        <option value={"OUTRO"}>OUTRO</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className='grid-child' id='grid-text-ace'>
                    <Form.Label>Acessórios</Form.Label>
                    <Form.Control as='textarea' rows={5} style={{ 'width': '100%' }} defaultValue={product.acessorios} onChange={(event) => setNewAcessorio(event.target.value)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-text-obs'>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control as='textarea' rows={5} style={{ 'width': '100%' }} defaultValue={product.obs} onChange={(event) => setNewObservacao(event.target.value)} />
                </Form.Group>
                
                <Form.Group className='grid-child' id='grid-switch-one'>
                    <Form.Label>Possui avarias?</Form.Label>
                    <Form.Check type='switch' defaultChecked={product.avaria} onChange={(event) => setNewAvaria(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-two'>
                    <Form.Label>Está ligando?</Form.Label>
                    <Form.Check type='switch' defaultChecked={product.liga} onChange={(event) => setNewLiga(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-three'>
                    <Form.Label>Está carregando?</Form.Label>
                    <Form.Check type='switch' defaultChecked={product.carrega} onChange={(event) => setNewCarrega(event.target.checked)} />
                </Form.Group>

                <Form.Group className='grid-child' id='grid-switch-four'>
                    <Form.Label>Possui backup?</Form.Label>
                    <Form.Check type='switch' defaultChecked={product.backup} onChange={(event) => setNewBackup(event.target.checked)} />
                </Form.Group>

                <br />
                <Button variant='outline-warning' className='grid-child grid-button-prod' type='submit'>Editar Produto</Button>
            </Form>

            </div>
        }
        </>
    )
}

export default ProductsEdit