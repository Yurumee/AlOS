import './styles/index.css'
// import './styles/ClientsVisualize.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function ProductsVisualize(props) {
    const product = props.product

    function edit_current() {
        window.location.href = `/editar-produto/${product.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-produto/${product.id}`
    }

    return (
        <div className="modal show" style={{ display: 'block' }}>
                <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Dados do Produto - {product.num_serie}</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <p>ID do Produto: {product.id}</p>
                    <p>Nome do Cliente: {product.cliente_nome}</p>
                    <p>Modelo: {product.modelo}</p>
                    <p>N° Série: {product.num_serie}</p>
                    <p>Cor: {product.cor}</p>
                    <p>Sistema Operacional: {product.sis_operacional}</p>
                    <p>Com avarias: {product.avaria}</p>
                    <p>Ligando: {product.liga}</p>
                    <p>Carregando: {product.carrega}</p>
                    <p>Com backup: {product.backup}</p>
                    <p>Acessórios: {product.acessorios}</p>
                    <p>Observações: {product.obs}</p>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={delete_current} variant="danger">Excluir Produto</Button>
                    <Button onClick={edit_current} variant="warning">Editar Produto</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default ProductsVisualize