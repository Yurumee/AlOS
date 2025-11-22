import './styles/index.css'
import './styles/ClientsVisualize.css'
// import { useEffect } from 'react'

function ClientsVisualize(props)
{   
    const client = props.client

    function delete_current()
    {
        window.location.href = `/deletar-cliente/${client.id}`
    }

    return (     
        <dialog open>
            <button onClick={props.close}>X</button>
            <button>Editar</button>
            <button onClick={delete_current}>Excluir</button>

            <br />

            <strong>ID</strong>
            <span>{client.id}</span>
            <br />

            <strong>Nome Completo</strong>
            <span>{client.nome_completo}</span>
            <br />            

            <strong>Nome Fantasia</strong>
            <span>{client.nome_fantasia}</span>
            <br />

            <strong>Telefone</strong>
            <span>{client.telefone}</span>
            <br />

            <strong>Limite de Crédito</strong>
            <span>{client.limite_credito}</span>
            <br />

            <strong>Endereço</strong>
            <span>{client.endereco}</span>
            <br />

            <strong>Bairro</strong>
            <span>{client.bairro}</span>
            <br />

            <strong>Cidade</strong>
            <span>{client.cidade}</span>
            <br />

            <strong>CEP</strong>
            <span>{client.cep}</span>
        </dialog>
    )
}

export default ClientsVisualize