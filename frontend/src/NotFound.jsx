import NavBar from "./NavBar";

function PageNotFound()
{
    return (
        <>
            <NavBar/>
            <h1>Oops...</h1>
            <h3>Parece que um erro ocorreu. Por favor verifique se:</h3>
            <ul>
                <li>O id existe</li>
                <li>O objeto desejado (cliente, produto, item...) existe</li>
                <li>O formulário foi preenchido corretamente</li>
                <li>A URL está digitada corretamente</li>
            </ul>

        </>
    )
}

export default PageNotFound