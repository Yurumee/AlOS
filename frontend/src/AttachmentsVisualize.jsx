import './styles/index.css'
import './styles/Attachment.css'

import NavBar from './NavBar'
import Button from 'react-bootstrap/Button'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'

function AttachmentsVisualize(props) {

    let params = useParams()

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

            console.log(data)
            // guardando o orcamento
            setAttachment(data)

            setIsLoading(false)
        }

        getAnexo()
    }, [])

    return (
        <>
            <NavBar />
            {!isLoading &&
            <>
                <div className='container'>
                    <div className='budget-container'>
                        <div className='budget' style={{'marginTop':'15px'}}>
                            <div className="budget-header">
                                <h1>ANEXO DA ORDEM DE SERVIÇO N°{attachment.id}</h1>
                                
                                {attachment.is_emitida &&
                                    <div>
                                        <h3 className="budget-p">
                                            <strong>Anexo emitido</strong>
                                        </h3>
                                    </div>
                                }

                                {!attachment.is_emitida &&
                                    <div>
                                        <h3 className="budget-p">
                                            <strong>Anexo não emitido</strong>
                                        </h3>
                                    </div>
                                }

                            </div>
                            <div className="budget-grid">
                                <div className="budget-section">
                                    <h5 className='budget-p'>
                                        Garantia até <strong>{attachment.garantia}</strong>
                                    </h5>
                                </div>

                            </div>
                        </div>
                        
                        
                        <div className='budget-prog-diag'>
                            <div className="budget-header">
                                SOLUÇÃO REALIZADA 
                            </div>
                            <div className="budget-grid">
                                <div className="budget-section">
                                    <p className='budget-p'>
                                        {attachment.solucao}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='budget-prog-diag'>
                            <div className="budget-header">
                                OBSERVAÇÕES
                            </div>
                            <div className="budget-grid">
                                <div className="budget-section">
                                    <p className="budget-p">
                                        {attachment.observacoes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        

                    </div>
                </div>
                
                <div className="container" style={{"marginTop":'10px', "marginBottom":'20px', "textAlign":"center"}}>
                    <Button onClick={() => {window.location.href = '/os'}} variant='outline-warning'>Voltar</Button>
                </div>
            </>
            }
        </>
    )
}

export default AttachmentsVisualize