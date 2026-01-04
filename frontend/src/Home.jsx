import './styles/Home.css'
import './styles/index.css'
import Navbar from './NavBar'
import Button from 'react-bootstrap/Button'

function Home(props) {

    async function logout(){
        const URL = 'http://localhost:5000/tecnico/logout'
        await fetch(URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => {props.token()})
        .catch((error) => console.log(error))
    }

    return(
        <>
        <Navbar/>
            <div>
                Esta é a tela principal da aplicação
                <br />
                <Button onClick={logout}>Sair</Button>
            </div>
        </>
    )
}

export default Home