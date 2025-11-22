import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import { useState } from 'react'

function ClientsEdit() 
{
    // guardando valores na variavel
    const [cpf_cnpj, setCpfCnpj] = useState()
    const [flag_cnpj, setFlagCnpj] = useState()
    const [cliente_nome, setClienteNome] = useState()
    const [empresa_nome, setEmpresaNome] = useState()
    const [cliente_endereco, setClienteEndereco] = useState()
    const [cliente_bairro, setClienteBairro] = useState()
    const [cliente_cidade, setClienteCidade] = useState()
    const [cliente_cep, setClienteCep] = useState()
    const [cliente_tel, setClienteTel] = useState()
    const [cliente_credito, setClienteCredito] = useState()

    async function submit(event) 
    {
        // previne de ir vazio
        event.preventDefault()

        // url para backend
        const URL = 'http://localhost:5000/cliente/novo'

        await fetch (URL, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            // transformando variaveis do forms em json
            body: JSON.stringify({
                    cpf_cnpj_cliente: cpf_cnpj,
                    flag_cnpj: flag_cnpj,
                    nome_cliente: cliente_nome,
                    empresa_cliente: empresa_nome,
                    endereco_cliente: cliente_endereco,
                    bairro_cliente: cliente_bairro,
                    cidade_cliente: cliente_cidade,
                    cep_cliente: cliente_cep,
                    telefone_cliente: cliente_tel,
                    limite_credito: cliente_credito
                })

        })

        window.location.href = '/clientes'
    }

    return(
        <>
            <NavBar />

            <div className='forms'>
                <form onSubmit={submit}>
                    <span>CPF/CNPJ</span>
                    <input type='number' placeholder='CPF/CNPJ' required onChange={(event) => setCpfCnpj(event.target.value)} />
                    
                    <span>É Pessoa Jurídica?</span>
                    <input type="checkbox" onChange={(event) => setFlagCnpj(event.target.checked)} />
                    
                    <span>Nome do Cliente</span>
                    <input type="text" placeholder='Nome' required onChange={(event) => setClienteNome(event.target.value)} />
                    
                    <span>Nome Fantasia</span>
                    <input type="text" placeholder='Nome Fantasia' onChange={(event) => setEmpresaNome(event.target.value)} />
                    
                    <span>Endereço</span>
                    <input type="text" placeholder='Endereço, Número' required onChange={(event) => setClienteEndereco(event.target.value)} />
                    
                    <span>Bairro</span>
                    <input type="text" placeholder='Bairro' required onChange={(event) => setClienteBairro(event.target.value)} />
                    
                    <span>Cidade</span>
                    <input type="text" placeholder='Cidade' required onChange={(event) => setClienteCidade(event.target.value)} />
                    
                    <span>CEP</span>
                    <input type="number" placeholder='CEP' onChange={(event) => setClienteCep(event.target.value)} />
                    
                    <span>Telefone</span>
                    <input type="tel" placeholder='Telefone' required onChange={(event) => setClienteTel(event.target.value)} />
                    
                    <span>Limite de Crédito</span>
                    <input type='number' step={0.01} placeholder='Limite de Crédito' required onChange={(event) => setClienteCredito(event.target.value)} />

                    <button type='submit'>Cadastrar Cliente</button>
                </form>
            </div>
        </>
    )
}

export default ClientsEdit