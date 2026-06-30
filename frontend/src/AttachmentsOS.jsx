import './styles/index.css'
import './styles/Attachment.css'

import NavBar from './Navbar'
import Button from 'react-bootstrap/Button'

import { useEffect, useState, useRef } from 'react'

import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'

function AttachmentsOS(props) {

    let params = useParams()
    const printRef = useRef(null)

    const id = params.id
    const [isLoading, setIsLoading] = useState(true)
    const [attachment, setAttachment] = useState([])

    useEffect(() => {
        async function getAnexo() {
            // url da api
            const URL = `http://127.0.0.1:5000/anexo/${id}`
            const response = await fetch(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            }
            )
            const data = await response.json();
            
            // guardando o orcamento
            setAttachment(data)

            setIsLoading(false)
        }

        getAnexo()
    }, [])

    
    async function download() {
        const element = printRef.current
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
        pdf.save(`ANEXO_OS_N${attachment.id}.pdf`)
    }

    return (
        <>
            <NavBar />
            {!isLoading &&
            <>
                <div className='container' ref={printRef}>
                    <div className='attachment-container'>
                        <div className='attachment' style={{'marginTop':'15px'}}>
                            <div className="attachment-header">
                                <h1>ANEXO DA ORDEM DE SERVIÇO N°{attachment.id}</h1>
                                
                                {attachment.is_emitida &&
                                    <div>
                                        <h3 className="attachment-p">
                                            <strong>Anexo emitido</strong>
                                        </h3>
                                    </div>
                                }

                                {!attachment.is_emitida &&
                                    <div>
                                        <h3 className="attachment-p">
                                            <strong>Anexo não emitido</strong>
                                        </h3>
                                    </div>
                                }

                            </div>
                                <div className="attachment-grid">
                                    <div className="attachment-section">
                                        <h5 className='attachment-p'>
                                            Garantia até <strong>{attachment.garantia}</strong>
                                        </h5>
                                    </div>
                                </div>
                        </div>
                        
                        
                        <div className='attachment-sol-obs'>
                            <div className="attachment-header" style={{'borderLeft':'0px', 'borderRight':'0px'}}>
                                SOLUÇÃO REALIZADA 
                            </div>
                            <div>
                                <div className="attachment-section">
                                    <p className='attachment-p'>
                                        {attachment.solucao}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='attachment-sol-obs'>
                            <div className="attachment-header" style={{'borderLeft':'0px', 'borderRight':'0px'}}>
                                OBSERVAÇÕES
                            </div>
                            <div>
                                <div className="attachment-section">
                                    <p className="attachment-p">
                                        {attachment.observacoes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        

                    </div>
                </div>
                
                <div className="container" style={{"marginTop":'10px', "marginBottom":'20px', "textAlign":"center"}}>
                    <Button onClick={download} variant='outline-warning'>Baixar PDF</Button>
                </div>
            </>
            }
        </>
    )
}

export default AttachmentsOS