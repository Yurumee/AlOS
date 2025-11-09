import './styles/Clients.css'
import '/index.html?url'
import './styles/index.css'


function Clients() {

    function goto_home() {
        window.location.href = '/'
    }

    return (
        <>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

            <header>
                <div>

                    <img className='logo' onClick={goto_home} src='/logo-placeholder.png' alt="logo da empresa" />

                    <div className='search'>
                        <input className='searchbar' type="text" />
                        <span className="material-icons md-24 md-primary">search</span>
                    </div>
                </div>
            </header>

            <div className='buttons'>

                <button className='button-client'>
                    <span className="material-icons md-48 md-primary">add_circle_outline</span>
                    Novo Cliente
                </button>

                <button className='button-client'>
                    <span className="material-icons md-48 md-primary">edit</span>
                    Editar Cliente
                </button>

                <button className='button-client'>
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