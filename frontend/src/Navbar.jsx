import './styles/Navbar.css'
import './styles/index.css'

function Navbar() {

    function goto_home() 
    {
        window.location.href = '/'
    }

    function goto_client() 
    {
        window.location.href = '/cliente'
    }
    
    function goto_product() 
    {
        window.location.href = '/produto'
    }

    function goto_storage() 
    {
        window.location.href = '/estoque'
    }
    
    function goto_service() 
    {
        window.location.href = '/servico'
    }

    function goto_os() 
    {
        window.location.href = '/ordem-servico'
    }

    function search()
    {

    }

    return(
        <>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            
            <header>
                <div className='navbar'>

                    <img className='logo' onClick={goto_home} src='/logo-placeholder.png' alt="logo da empresa" />
                    
                    <div className='categories'>
                        <div onClick={goto_os}>
                            Ordens de Serviço
                        </div>

                        <div onClick={goto_client}>
                            Clientes
                        </div>

                        <div onClick={goto_product}>
                            Produtos
                        </div>

                        <div onClick={goto_storage}>
                            Estoque
                        </div>

                        <div onClick={goto_service}>
                            Serviços
                        </div>

                        <input className='searchbar' type="text" />
                        <span className="material-icons md-24 md-primary search-icon" onClick={search}>search</span>
                    </div>

                </div>
            </header>
        </>
    )
}

export default Navbar