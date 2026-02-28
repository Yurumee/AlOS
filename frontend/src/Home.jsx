//  
import './styles/index.css'
// import './styles/Clients.css'
// import ImageUpload from './ImageUpload'

import { useState } from 'react'

import Navbar from './NavBar'
import Button from 'react-bootstrap/Button'

function Home(props) {

    const [modalOpen, setModalOpen] = useState(false)
    // const [imgLogo, setImgLogo] = useState(null)

    function goto_category() {
        window.location.href = '/categorias'
    }

    function visualize_img() {
        setModalOpen(!modalOpen)
    }

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            <Navbar />
            <div>
                Esta é a tela principal da aplicação
                <br />

                <Button bsPrefix='button-client' variant='warning' onClick={goto_category}>
                    <span className="material-icons md-24 md-primary">label_important</span>
                    Ir para Categorias
                </Button>

                <Button bsPrefix='button-client' variant='warning' onClick={visualize_img}>
                    <span className="material-icons md-24 md-primary" >image_arrow_up</span>
                    Adicionar logo
                </Button>

                {/* {modalOpen && <ImageUpload submit={props.new_logo} show={modalOpen} close={() => setModalOpen(false)} />} */}
            </div>
        </>
    )
}

export default Home