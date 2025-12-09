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

            <h1>Editando Produto - {product.cpf_cnpj}</h1>

            <Form onSubmit={submit}>

                <Form.Group>
                    <Form.Label>Modelo do Produto</Form.Label>
                    <Form.Control type='text' defaultValue={product.nome_completo} placeholder='João Maria' required onChange={(event) => setNewClienteNome(event.target.value)} />
                </Form.Group>

                {
                    client.flag_cnpj && <Form.Group>
                                            <Form.Label>Nome Fantasia</Form.Label>
                                            <Form.Control type='text' defaultValue={client.nome_fantasia} placeholder='Empresa Fulana' onChange={(event) => setNewEmpresaNome(event.target.value)} />
                                        </Form.Group>
                }

                <Form.Group>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type='number' defaultValue={product.telefone} placeholder='84912345678' required onChange={(event) => setNewClienteTel(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Limite de Crédito</Form.Label>
                    <Form.Control type='number' defaultValue={product.limite_credito} placeholder='99.99' step={0.01} required onChange={(event) => setNewClienteCredito(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type='text' defaultValue={client.endereco} placeholder='Rua Exemplo, 001' required onChange={(event) => setNewClienteEndereco(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control type='text' defaultValue={product.bairro} placeholder='Centro' required onChange={(event) => setNewClienteBairro(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control type='text' defaultValue={product.cidade} placeholder='Campos Neutrais' required onChange={(event) => setNewClienteCidade(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type='number' defaultValue={product.cep} placeholder='12345000' onChange={(event) => setNewClienteCep(event.target.value)} />
                </Form.Group>
                <br />
                <Button variant='outline-warning' type='submit'>Editar cliente</Button>
            </Form>

            </div>
        }
        </>
    )
}

export default ProductsEdit