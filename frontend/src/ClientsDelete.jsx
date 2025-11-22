import './styles/Clients.css'
import './styles/index.css'
import NavBar from './NavBar'

import {useParams} from 'react-router-dom'
import { useEffect, useState } from 'react'

function ClientsDelete() {
    let params = useParams()
    const id = params.id
    const [client, setClient] = useState()
    const [clientNome, setClientNome] = useState()
    const [clientFantasia, setClientFantasia] = useState()
    const [clientCpf, setClientCpf] = useState()

    useEffect(() => {
        async function getClient(){
            const URL = `http://localhost:5000/cliente/pesquisar/${id}`
            await fetch(URL).then(resp => resp.json()).then(data => setClient(data)).then(data => console.log( data))
            
            setClientNome(client.nome_completo)
            setClientFantasia(client.nome_fantasia)
            setClientCpf(client.cpf_cnpj)
        }

        getClient()
        console.log(client)
    }, [])

    return (

        <>
            <NavBar />
            

            <h1>Deseja realmente deletar este cliente?</h1>
            <input type="text" value={clientNome} />
            <input type="text" value={clientFantasia} />
            <input type="text" value={clientCpf} />

        </>
    )
}

export default ClientsDelete