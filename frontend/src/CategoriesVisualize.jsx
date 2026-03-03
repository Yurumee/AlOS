import './styles/index.css'
// import './styles/ClientsVisualize.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function CategoriesVisualize(props) {
    const category = props.category

    function edit_current() {
        window.location.href = `/editar-categoria/${category.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-categoria/${category.id}`
    }

    return (
        <div className="modal show" style={{ display: 'block' }}>
                <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Sobre a Categoria {category.titulo} - ID {category.id}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID da categoria: {category.id}</p>
                    <p>Tipo da categoria: {category.tipo}</p>
                    <p>Descrição: {category.descricao}</p>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Categoria</Button>
                    <Button onClick={edit_current} variant="warning">Editar Categoria</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default CategoriesVisualize