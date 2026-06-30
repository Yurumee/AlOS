import './styles/Tech.css'
import './styles/index.css'
import NavBar from './Navbar'
import TechniciansVisualize from './TechniciansVisualize'
import ModalTech from './ModalTech'

import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'


function Technicians(props) 
{
    // guarda os tecnicos
    const [technicians, setTechnicians] = useState([])
    // carregamento
    const [isLoading, setIsLoading] = useState(true)
    // esconde ou mostra modal do tecnico
    const [modalOpen, setModalOpen] = useState(false)
    // esconde ou mostra modal para editar ou excluir um tecnico
    const [modalOperationOpen, setModalOperationOpen] = useState(false)
    // tecnico do modal
    const [modalTechnician, setModalTechnician] = useState({})
    // operação realizada
    const [operation, setOperation] = useState('')

    // const location = useLocation()

    // realiza a chama da função apenas uma vez, quando a pagina é carregada
    useEffect(() => 
    {
            async function getTechnicians() {
            setIsLoading(true)

            // url da api
            const URL = 'http://127.0.0.1:5000/tecnico/'
            const response = await fetch(URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                    }
                }
            )
            const data = await response.json();
            
            const list = Object.values(data)
            setTechnicians(list)

            setIsLoading(false)
            }

        getTechnicians()

    }, [props.token])

    function new_tech()
    {
        window.location.href = '/novo-tecnico'
    }

    function edit_tech(event)
    {
        event.preventDefault()
        setOperation('edit')
        setModalOperationOpen(!modalOperationOpen)
    }

    function delete_tech()
    {
        
        setOperation('delete')
        setModalOperationOpen(!modalOperationOpen)
    }

    function visualize_tech(technician)
    {
        setModalTechnician(technician)
        setModalOpen(!modalOpen)
    }

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            
            <NavBar/>

            <div className='buttons'>

                <Button bsPrefix='button-tech' variant='warning' onClick={new_tech}>
                    <span className="material-icons md-24 md-primary">add_circle_outline</span>
                    Novo Técnico
                </Button>

                <Button bsPrefix='button-tech' onClick={edit_tech}>
                    <span className="material-icons md-24 md-primary">edit</span>
                    Editar Técnico
                </Button>
                
                <Button bsPrefix='button-tech' onClick={delete_tech}>
                    <span className="material-icons md-24 md-primary">delete_outline</span>
                    Excluir Técnico
                </Button>

            </div>

            
            {isLoading && 
                <div style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <Spinner animation="border" variant='warning'/>
                </div>
            }
            
            {/* tabela de tecnicos existentes*/}
            { !isLoading && 
                <div className="TechsCreated container">
                    <p className='h2'>TÉCNICOS CADASTRADOS</p>

                    <Table striped bordered hover responsive variant='warning'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome Completo</th>
                                <th>Telefone</th>
                                <th>Endereço</th>
                                <th>#</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!isLoading && technicians.map(tech => (
                                    <>
                                        <tr key={tech.id}>
                                            <td> {tech.id} </td>
                                            <td> {tech.nome_completo} </td>
                                            <td> {tech.telefone} </td>
                                            <td> {tech.endereco} </td>

                                            <td> <Button className="material-icons md-16" style={{color: '#fff3b7'}} variant='warning' onClick={() => visualize_tech(tech)}>unfold_more</Button> </td> 
                                        </tr>
                                    </>
                                )
                            )}
                        </tbody>
                    </Table>

                        
                </div>
            }

            {modalOpen && <TechniciansVisualize technician={modalTechnician} show={modalOpen} close={() => setModalOpen(false)}/>}
            {modalOperationOpen && <ModalTech operation={operation} show={modalOperationOpen} close={() => setModalOperationOpen(false)}/>}
        </div>
    )
}

export default Technicians