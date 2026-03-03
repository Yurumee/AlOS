import './styles/index.css'
// import './styles/ClientsVisualize.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function TechniciansVisualize(props) {
    const technician = props.technician
    console.log(props)

    function edit_current() {
        window.location.href = `/editar-tecnico/${technician.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-tecnico/${technician.id}`
    }

    return (
        <div className="modal show" style={{ display: 'block' }}>
                <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Dados do Técnico - {technician.cpf}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID do Técnico: {technician.id}</p>
                    <p>Nome do Técnico: {technician.nome_completo}</p>
                    <p>Endereço: {technician.endereco}</p>
                    <p>Usuário: {technician.usuario}</p>
                    <p>Telefone: {technician.telefone}</p>
                    <p>É Administrador: {technician.admin}</p>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Técnico</Button>
                    <Button onClick={edit_current} variant="warning">Editar Técnico</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default TechniciansVisualize