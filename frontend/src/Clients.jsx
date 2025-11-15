import './styles/Clients.css'
import './styles/index.css'
import Navbar from './Navbar'
import { useEffect, useState } from 'react'

function Clients() 
{
    // guarda os clientes
    const [clients, setClients] = useState()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => {
        getClients()
    }, [])
    console.log(clients)

    async function getClients() {
        // url da api
        URL = 'http://127.0.0.1:5000/cliente/'
        // realiza GET na api
        // depois busca apenas o json
        // depois insere os dados do json no setClients
        // setClients vai receber e guardar tudo em clients
        await fetch(URL).then(resp => resp.json()).then(data => setClients(data))
        .catch(e => console.log(e))
        // se tiver erros, mostra no terminal
    }

    function new_client()
    {
        window.location.href = '/novo-cliente'
    }

    function edit_client()
    {

    }

    function delete_client()
    {

    }

    return (
        <>
            <Navbar />

            <div className='buttons'>

                <button className='button-client' onClick={new_client}>
                    <span className="material-icons md-48 md-primary">add_circle_outline</span>
                    Novo Cliente
                </button>

                <button className='button-client' onClick={edit_client}>
                    <span className="material-icons md-48 md-primary">edit</span>
                    Editar Cliente
                </button>

                <button className='button-client' onClick={delete_client}>
                    <span className="material-icons md-48 md-primary">delete_outline</span>
                    Excluir Cliente
                </button>

            </div>

            {/* tabela de clientes existentes*/}
            <div className="clientsCreated">
                <p className='h2'>CLIENTES CADASTRADOS</p>

                <table>
                    <tbody>
                            <tr>
                                
                            </tr>
                    </tbody>
                </table>

                {/* {clients.clientes.map((content, key) => (
                    <tr>
                        
                    </tr>
                ) 
                } */}

                {/* {clients.clientes.map(client => (
                                        <td key={client.cliente_id}> {client.cpf_cnpj} </td>
                                    )
                                )} */}

            </div>
        </>
    )
}

export default Clients