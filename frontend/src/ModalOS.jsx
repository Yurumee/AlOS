import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useState } from 'react'

function ModalOS(props) {
    const [idService, setIdService] = useState()
    const flag_operation = props.operation

    function redirect()
    {
        if(flag_operation == 'edit') 
        {
            if(idService != undefined) 
            {
                window.location.href = `/editar-os/${idService}`
            }
            else
            {
                window.location.href = '*'
            }
        }

        if(flag_operation == 'delete') 
        {
            if(idService != undefined) 
            {
                window.location.href = `/deletar-os/${idService}`    
            }
            else
            {
                window.location.href = '*'
            }
        }
    }

    function go_back()
    {
        window.location.href = '/os'
    }

    return (
        <div className="modal show" style={{ display: 'block'}}>
            <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Buscar serviço desejado</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <FloatingLabel label="ID " className="mb-3">
                        <Form.Control type="text" required placeholder="ID" onChange={(event) => setIdService(event.target.value)} />
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

export default ModalOS