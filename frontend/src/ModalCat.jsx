import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { useState } from 'react'

function ModalCat(props) {
    const [IdCategory, setIdCategory] = useState()
    const flag_operation = props.operation

    function redirect()
    {
        if(flag_operation == 'edit') 
        {
            if(IdCategory != undefined) 
            {
                window.location.href = `/editar-categoria/${IdCategory}`
            }
            else
            {
                window.location.href = '*'
            }
        }

        if(flag_operation == 'delete') 
        {
            if(IdCategory != undefined) 
            {
                window.location.href = `/deletar-categoria/${IdCategory}`    
            }
            else
            {
                window.location.href = '*'
            }
        }
    }

    function go_back()
    {
        window.location.href = '/categorias'
    }

    return (
        <div style={{ display: 'block'}}>
            <Modal show={props.show} onHide={props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Buscar categoria desejada</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <FloatingLabel label="ID" className="mb-3">
                        <Form.Control type="number" required placeholder="ID da categoria" onChange={(event) => setIdCategory(event.target.value)} />
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

export default ModalCat