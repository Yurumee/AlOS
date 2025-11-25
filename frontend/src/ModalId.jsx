import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useState } from 'react'

function ModalId(props) {
    const [idCliente, setIdCliente] = useState()
    const flag_operation = props.operation

    function redirect()
    {
        if(flag_operation == 'edit') 
        {
            window.location.href = `/editar-cliente/${idCliente}`
        }

        if(flag_operation == 'delete') 
        {
            window.location.href = `/deletar-cliente/${idCliente}`    
        }
    }

    function go_back()
    {
        window.location.href = '/clientes'
    }

    return (
        <div className="modal show" style={{ display: 'block'}}>
            <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Insira o ID do cliente desejado</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <FloatingLabel label="ID" className="mb-3">
                        <Form.Control type="number" required placeholder="ID" onChange={(event) => setIdCliente(event.target.value)} />
                    </FloatingLabel>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={redirect} variant="warning">Continuar</Button>
                    {!props.show && <Button onClick={go_back} variant="secondary">Voltar</Button>}
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default ModalId