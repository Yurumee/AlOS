import './styles/Clients.css'
import '/index.html?url'


function Clients() {

    function goto_home() {
        window.location.href = '/'
    }

    return(
        <>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" 
rel="stylesheet"/>            
            <header>
                <div>
                    <img onClick={goto_home} src='/logo-placeholder.png' alt="logo da empresa" />
                    
                    <input type="text" />

                </div>
            </header>

            <div>
                {/* <span class="material-symbols-outlined">add_circle</span> */}



<span class="material-icons">add_circle</span>

                <span></span>
            </div>

            {/* tabela de clientes existentes*/}
            <div className="clientsCreated">
                <p className='header2'>CLIENTES CADASTRADOS</p>
            </div>
        </>
    )
}

export default Clients