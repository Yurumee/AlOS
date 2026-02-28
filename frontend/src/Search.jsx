import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Search (props) {
    return (
        
        <>
            <Form.Group className='grid-child'>
                <Form.Label>Teste de busca</Form.Label>
                <Form.Control type='text' value={props.search} placeholder='Sua busca aqui...' onChange={(event) => props.handleSearch(event.target.value)}></Form.Control>
            </Form.Group>
            <Button onClick={props.results}>
                    Pesquisar
            </Button>
        </>
    )
}

export default Search