import './styles/index.css'
import './styles/ClientsVisualize.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function StoragesVisualize(props) {
    const item = props.item

    function edit_current() {
        window.location.href = `/editar-item/${item.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-item/${item.id}`
    }

    return (
        <div className="modal show" style={{ display: 'block' }}>
                <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Informações do Item - {item.codigo_barras}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID do item: {item.id}</p>
                    <p>Nome do Item: {item.nome_item}</p>
                    <p>Categoria: {item.categoria}</p>
                    <p>Codigo de Barras: {item.codigo_barras}</p>
                    <p>Descrição: {item.descricao}</p>
                    <p>Quantidade em estoque: {item.quantidade}</p>
                    <p>Valor Unitário: {item.preco_un}</p>
                 </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Item</Button>
                    <Button onClick={edit_current} variant="warning">Editar Item</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default StoragesVisualize