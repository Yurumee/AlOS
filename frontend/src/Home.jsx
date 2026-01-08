import './styles/Home.css'
import './styles/index.css'
import Navbar from './NavBar'
import Button from 'react-bootstrap/Button'

function Home() {

    return(
        <>
        <Navbar/>
            <div>
                Esta é a tela principal da aplicação
                <br />
            </div>
        </>
    )
}

export default Home