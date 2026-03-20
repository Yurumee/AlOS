import './styles/index.css'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import html2canvas from 'html2canvas'
import { useRef } from 'react'
import { jsPDF } from 'jspdf'

function OSVisualize(props) {
    const order = props.order
    const printRef = useRef(null)

    function edit_current() {
        window.location.href = `/editar-os/${order.id}`
    }

    function delete_current() {
        window.location.href = `/deletar-os/${order.id}`
    }

    function create_appendix() {
        window.location.href = `/cadastrar-apendice-os/${order.id}`
    }

    async function download_pdf() {
        const element = printRef.current
        // console.log(element)
        if (!element)
        {
            return
        }

        const canvas = await html2canvas(element)
        const data = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
                                orientation: 'portrait',
                                unit: 'px',
                                format: 'a4'
                            })

        const imgProperties = pdf.getImageProperties(data)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width
        
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`OS_N${order.id}.pdf`)
    }

    return (
        <div className="teste modal show" style={{ display: 'block' }}>
            <Modal.Dialog ref={printRef}>
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
                    {(order.emitida == 'Sim') &&
                        <>
                            <Button onClick={download_pdf} variant='outline-warning'>Baixar PDF</Button>
                            <Button onClick={create_appendix} variant="outline-info">Adicionar Anexo</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

export default OSVisualize