import { useState } from "react";

function Filtro({grupo}) 
{
    const [grupoSelecionado, setGrupoSelecionado] = useState('todos')

    function seletor(event)
    {
        console.log(event.target.value)
    }
}

export default Filtro