import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'

function ProductsEdit() 
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

    useEffect(() => {
        async function getProduct()
        {
            const URL = `http://localhost:5000/produto/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            const list = Object.values(resp)
            setProduct(list[0])
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
                'Content-Type': 'application/json'
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

            <h1>Editando Produto - {product.num_serie}</h1>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>Modelo do Produto</Form.Label>
                    <Form.Control type='text' defaultValue={product.modelo} onChange={(event) => setNewModelo(event.target.value)} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Cor do Produto</Form.Label>
                    <Form.Control type='text' defaultValue={product.cor} onChange={(event) => setNewCor(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Sistema Operacional do Produto</Form.Label>
                    <Form.Control type='text' defaultValue={product.sis_operacional} onChange={(event) => setNewSisOperacional(event.target.value)} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Possui avarias?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setNewAvaria(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Está ligando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setNewLiga(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Está carregando?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setNewCarrega(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Possui backup?</Form.Label>
                    <Form.Check type='switch' onChange={(event) => setNewBackup(event.target.checked)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Acessórios</Form.Label>
                    <Form.Control type='textarea' defaultValue={product.acessorios} onChange={(event) => setNewAcessorio(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Observações</Form.Label>
                    <Form.Control type='textarea' defaultValue={product.obs} onChange={(event) => setNewObservacao(event.target.value)} />
                </Form.Group>
                <br />
                <Button variant='outline-warning' type='submit'>Editar Produto</Button>
            </Form>

            </div>
        }
        </>
    )
}

export default ProductsEdit