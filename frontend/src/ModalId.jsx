import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function ModalId(props) {
    // const client = props.client

    // function edit_current() {
    //     window.location.href = `/editar-cliente/${client.id}`
    // }

    // function delete_current() {
    //     window.location.href = `/deletar-cliente/${client.id}`
    // }

    return (
        <div className="modal show" style={{ display: 'block'}}>
            <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Dados do Cliente - {client.cpf_cnpj}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID do Cliente: {client.id}</p>
                    <p>Nome Completo: {client.nome_completo}</p>
                    <p>Nome Fantasia: {client.nome_fantasia}</p>
                    <p>Telefone: {client.telefone}</p>
                    <p>Limite de Crédito: {client.limite_credito}</p>
                    <p>Endereço: {client.endereco}</p>
                    <p>Bairro: {client.bairro}</p>
                    <p>Cidade: {client.cidade}</p>
                    <p>CEP: {client.cep}</p>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Cliente</Button>
                    <Button onClick={edit_current} variant="warning">Editar Cliente</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default ClientsVisualize