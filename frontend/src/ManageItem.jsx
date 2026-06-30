import './styles/index.css'


import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { useState } from 'react'

function ManageItem(props) {
    const item = props.item
    const [quantidade, setQuantidade] = useState()

    return (
        <div style={{ display: 'block' }}>
            <Modal show={props.show} onHide={props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Estoque do Item - {item.codigo_barras}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Nome do Item: {item.nome_item}</p>
                    <p>Descrição: {item.descricao}</p>
                    <p>Quantidade em estoque atualmente: {item.quantidade}</p>
                    <p>Valor Unitário: {item.preco_un}</p>

                    <Form.Group>
                        <Form.Label>Quantidade desejada <span style={{ 'color': 'red' }}>*</span></Form.Label>
                        <Form.Control type='number' min={0} placeholder='5' onChange={(event) => setQuantidade(event.target.value)} />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={(event) => { props.reposition(event, true, quantidade, item.id) }} variant="success">Repor esta quantidade</Button>
                    <Button onClick={(event) => { props.reposition(event, false, quantidade, item.id) }} variant="danger">Retirar esta quantidade</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ManageItem