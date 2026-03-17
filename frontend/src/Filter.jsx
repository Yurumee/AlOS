import Form from 'react-bootstrap/Form'

function Filter (props) {
    return (
        
        <Form.Group className='grid-child'>
                {/* <Form.Label>Teste de filtragem</Form.Label> */}
                <Form.Select onChange={props.handleFilter}>
                  <option value={'all'}>Todos</option>
                  {props.options.map(categoria => (
                    <>
                        <option value={categoria}>{categoria}</option>
                    </>
                  ))}
                </Form.Select>
            </Form.Group>
    )
}

export default Filter