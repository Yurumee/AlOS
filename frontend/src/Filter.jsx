import Form from 'react-bootstrap/Form'

function Filter (props) {
    return (
        
        <Form.Group className='grid-child'>
                <Form.Label>Teste de filtragem</Form.Label>
                <Form.Select onChange={props.handleFilter}>
                  <option value={'all'} >Todos</option>
                  <option value={'storage'}>Itens de Estoque</option>
                  <option value={'service'}>Serviços</option>
                </Form.Select>
            </Form.Group>
    )
}

export default Filter