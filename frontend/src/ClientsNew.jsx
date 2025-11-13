import './styles/Clients.css'
import './styles/index.css'
import './styles/ClientsNew.css'
import Navbar from './Navbar'

function ClientsNew()
{

    function submit() {
        
    }

    return(
        <>
            <Navbar/>

            <div className='forms'>
                <form action="POST" method="POST">
                    <span>CPF/CNPJ</span>
                    <input type='number' placeholder='CPF/CNPJ' name='cpf-cnpj-cliente'/>
                    
                    <span>É Pessoa Jurídica?</span>
                    <input type="checkbox" name="flag-cnpj" id="flag-cnpj" />
                    
                    <span>Nome do Cliente</span>
                    <input type="text" placeholder='Nome' name='nome-cliente'/>
                    
                    <span>Nome Fantasia</span>
                    <input type="text" placeholder='Nome Fantasia' name='empresa-cliente'/>
                    
                    <span>Endereço</span>
                    <input type="text" placeholder='Endereço, Número' name='endereco-cliente'/>
                    
                    <span>Bairro</span>
                    <input type="text" placeholder='Bairro' name='bairro-cliente'/>
                    
                    <span>Cidade</span>
                    <input type="text" placeholder='Cidade' name='cidade-cliente'/>
                    
                    <span>CEP</span>
                    <input type="number" placeholder='CEP' name='cep-cliente'/>
                    
                    <span>Telefone</span>
                    <input type="tel" placeholder='Telefone' name='telefone-cliente'/>
                    
                    <span>Limite de Crédito</span>
                    <input type='' placeholder='Limite de Crédito' name='limite-credito'/>

                    <button type='submit' onClick={submit}>Cadastrar Cliente</button>
                </form>
            </div>
        </>
    )

}

export default ClientsNew