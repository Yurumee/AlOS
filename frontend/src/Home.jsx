// import './styles/Home.css'
import './styles/index.css'
import Navbar from './NavBar'
import Button from 'react-bootstrap/Button'

function Home() {

    function goto_category()
    {
        window.location.href = '/categorias'
    }

    return(
        <>
        <Navbar/>
            <div>
                Esta é a tela principal da aplicação
                <br />

                <Button bsPrefix='button-client' variant='warning' onClick={goto_category}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Ir para Categorias
                </Button>
            </div>
        </>
    )
}

export default Home