import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import {useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'

function ClientsDelete() {
    let params = useParams()
    const id = params.id
    const [client, setClient] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => 
    {
        async function getClient(){
            const URL = `http://localhost:5000/cliente/pesquisar/${id}`
            const resp = await fetch(URL).then(resp => resp.json())
            const list = Object.values(resp)
            setClient(list[0])
            setIsLoading(false)
        }

        getClient()
    }, [])

    async function confirm()
    {
        const URL = `http://localhost:5000/cliente/excluir/${id}`
        await fetch(URL, 
            {
                method: 'POST',
                headers: 
                    {
                        'Content-Type':'application/json'
                    },
            })

        window.location.href = '/clientes'
    }

    function cancel()
    {
        window.location.href = '/clientes'
    }

    return (

        <>
            <NavBar />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <div>
                {isLoading && 
                    <p>CARREGANDO...</p>
                }
            </div>

            {!isLoading && client &&
                <>
                    <h1>Deseja realmente deletar este cliente?</h1>
                    
                    <span>{client.nome_completo}</span>
                    <span>{client.nome_fantasia}</span>
                    <span>{client.cpf_cnpj}</span>
                
                    <br />
                    
                    <button onClick={confirm}>
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                    
                    <button onClick={cancel}>
                        <span className="material-symbols-outlined">cancel</span>
                    </button>
                        
                    
                </>
            }

        </>
    )
}

export default ClientsDelete