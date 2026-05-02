import './styles/index.css'

import BudgetOS from './BudgetOS'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'

function OSVisualize(props) {
    const order = props.order
    console.log(order)

    function edit_current() {
        window.location.href = `/editar-os/${order.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-os/${order.id}`
    }

    function create_appendix() {
        window.location.href = `/cadastrar-anexo-os/${order.id}`
    }

    function show_appendix() {
        window.location.href = `/exibir-anexo-os/${order.id}`
    }

    function edit_appendix() {
        window.location.href = `/editar-anexo-os/${order.id}`
    }

    function delete_appendix() {
        window.location.href = `/deletar-anexo-os/${order.id}`
    }

    function print_budget(id) {
        window.location.href = `/orcamento-os/${id}`
    }

    function print_attachment(id) {
        window.location.href = `/anexo-os/${id}`
    }

    return (
        <div className="teste modal show" style={{ display: 'block' }}>

            <Modal.Dialog>
                <Modal.Header closeButton onClick={props.close}>
                    <Modal.Title>OS Nº{order.id}</Modal.Title>
                </Modal.Header>

                <Modal.Body className='modal-os'>
                    <p>
                        <strong>Tipo da OS</strong> 
                        <br /> 
                        {order.tipo_ordem}
                    </p>
                    
                    <p>
                        <strong>Estado da OS</strong> <br /> {order.estado}</p>
                    <p>
                        <strong>Já emitida?</strong> 
                        <br /> 
                        {order.emitida}
                    </p>
                    
                    <p>
                        <strong>Data de criação</strong> 
                        <br /> 
                        {order.data_emissao}
                    </p>
                    
                    <p>
                        <strong>Validade</strong> 
                        <br /> 
                        {order.validade}
                    </p>
                    
                    <p>
                        <strong>Técnico Responsável</strong> 
                        <br /> 
                        {order.tecnico_resp}
                    </p>
                    
                    <p>
                        <strong>Cliente</strong> 
                        <br /> 
                        {order.cliente_nome}
                    </p>
                    
                    <p>
                        <strong>Dispositivo</strong> 
                        <br /> 
                        {order.produto_num_serie}
                    </p>
                    
                    <p>
                        <strong>Prognóstico</strong> 
                        <br /> 
                        {order.prognostico}
                    </p>
                    
                    <p>
                        <strong>Diagnóstico</strong> 
                        <br /> 
                        {order.diagnostico}
                    </p>
                    
                    <p>
                        <strong>Valor orçamento</strong> 
                        <br /> 
                        {order.orcamento}
                    </p>
                    
                    <p>
                        <strong>Última atualização</strong> 
                        <br /> 
                        {order.ult_atualizacao}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    {(order.emitida == 'Não') &&
                        <>
                            <Button onClick={delete_current} variant="danger">Excluir Ordem de Serviço</Button>
                            <Button onClick={edit_current} variant="warning">Editar Ordem de Serviço</Button>
                        </>
                    }
                    {(order.emitida == 'Sim' && order.anexo_exists == 'Não') &&
                        <>
                            <Button onClick={create_appendix} variant="outline-info">Adicionar Anexo</Button>
                        </>
                    }
                    {(order.emitida == 'Sim' && order.anexo_exists == 'Sim' && order.anexo_emitido == 'Não') &&
                        <>
                            <Button onClick={show_appendix} variant="outline-success">Exibir Anexo</Button>
                            <Button onClick={edit_appendix} variant="outline-warning">Editar Anexo</Button>
                            <Button onClick={delete_appendix} variant="outline-danger">Excluir Anexo</Button>
                        </>
                    }

                    {(order.emitida == 'Sim' && order.anexo_exists == 'Sim' && order.anexo_emitido == 'Sim') &&
                        <>
                            <Button onClick={() => print_attachment(order.id)} variant="outline-warning">Baixar Anexo</Button>
                        </>
                    }
                    
                    <Button onClick={() => print_budget(order.id)} variant="outline-info">Exibir Orçamento</Button>
                </Modal.Footer>
            </Modal.Dialog>
            
        </div>
    )
}

export default OSVisualize