import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { use, useState } from 'react'

function ModalProd(props) {
    const [idProduct, setIdProduct] = useState()
    const [option, setOption] = useState(false)
    const flag_operation = props.operation

    function redirect()
    {
        if(flag_operation == 'edit') 
        {
            window.location.href = `/editar-produto/${idProduct}`
        }

        if(flag_operation == 'delete') 
        {
            window.location.href = `/deletar-produto/${idProduct}`    
        }
    }

    function go_back()
    {
        window.location.href = '/produtos'
    }

    return (
        <div className="modal show" style={{ display: 'block'}}>
            <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>Buscar produto desejado</Modal.Title>
                </Modal.Header>
    
                <Modal.Body>
                    <FloatingLabel label="ID ou Nº Série" className="mb-3">
                        <Form.Control type="text" required placeholder="ID" onChange={(event) => setIdProduct(event.target.value)} />
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

export default ModalProd