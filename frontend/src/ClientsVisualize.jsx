import './styles/index.css'
import './styles/ClientsVisualize.css'
import { useEffect } from 'react'

function ClientsVisualize(props)
{   
    const client = props.client


    return (     
        <dialog open>
            <button onClick={props.close}>X</button>
            <button>Editar</button>
            <button>Excluir</button>

            <h4>Nome Completo</h4>
            <p>{client.nome_completo}</p>
            
            <h4>Nome Fantasia</h4>
            <p>{client.nome_fantasia}</p>
            
            <h4>Telefone</h4>
            <p>{client.telefone}</p>
            
            <h4>Limite de Crédito</h4>
            <p>{client.limite_credito}</p>
            
            <h4>Endereço</h4>
            <p>{client.endereco}</p>
            
            <h4>Bairro</h4>
            <p>{client.bairro}</p>
            
            <h4>Cidade</h4>
            <p>{client.cidade}</p>

            <h4>CEP</h4>
            <p>{client.cep}</p>
        </dialog>
    )
}

export default ClientsVisualize