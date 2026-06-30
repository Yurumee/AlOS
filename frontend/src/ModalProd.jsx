import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useState } from 'react'

function ModalProd(props) {
    const [idProduct, setIdProduct] = useState()
    const flag_operation = props.operation

    function redirect()
    {
        if(flag_operation == 'edit') 
        {
            if(idProduct != undefined) 
            {
                window.location.href = `/editar-produto/${idProduct}`
            }
            else
            {
                window.location.href = '*'
            }
        }

        if(flag_operation == 'delete') 
        {
            if(idProduct != undefined) 
            {
                window.location.href = `/deletar-produto/${idProduct}`    
            }
            else
            {
                window.location.href = '*'
            }
        }
    }

    function go_back()
    {
        window.location.href = '/produtos'
    }

    return (
        <div style={{ display: 'block'}}>
            <Modal show={props.show} onHide={props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Buscar produto desejado</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <FloatingLabel label="ID " className="mb-3">
                        <Form.Control type="number" required placeholder="ID" onChange={(event) => setIdProduct(event.target.value)} />
                    </FloatingLabel>
                </Modal.Body>
    
                <Modal.Footer>
                    <Button onClick={redirect} variant="warning">Continuar</Button>
                    {!props.show && <Button onClick={go_back} variant="secondary">Voltar</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalProd