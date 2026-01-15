import './styles/index.css'
// import './styles/ClientsVisualize.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function ServicesVisualize(props) {
    const service = props.service

    function edit_current() {
        window.location.href = `/editar-servico/${service.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-servico/${service.id}`
    }

    return (
        <div className="modal show" style={{ display: 'block' }}>
                <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>{service.nome_servico} - ID {service.id}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID do Servico: {service.id}</p>
                    <p>Nome do Serviço: {service.nome_servico}</p>
                    <p>Descrição: {service.descricao}</p>
                    <p>Preço: {service.valor}</p>
                    <p>Categoria do Serviço: {service.categoria}</p>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Serviço</Button>
                    <Button onClick={edit_current} variant="warning">Editar Serviço</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default ServicesVisualize