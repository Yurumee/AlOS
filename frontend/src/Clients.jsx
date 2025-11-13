import './styles/Clients.css'
import './styles/index.css'
import Navbar from './Navbar'

function Clients() 
{

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
            </div>
        </>
    )
}

export default Clients