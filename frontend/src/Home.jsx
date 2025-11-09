function Home() {

    function goto_clients() {
        window.location.href = '/cliente'
    }

    return(
        <>
            <div>
                TESTE TELA PRINCIPAL
            </div>

            <button onClick={goto_clients}>Ir para clientes</button>
        </>
    )
}

export default Home