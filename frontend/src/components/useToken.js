import { useState } from "react";

function useToken() {
    
    function getToken(){
        const techToken = localStorage.getItem('token')
        
        return techToken && techToken
    }

    const [token, setToken] = useState(getToken())

    function saveToken(techToken) {
        localStorage.setItem('token', techToken)
        setToken(techToken)
    }

    function removeToken() {
        localStorage.removeItem('token')
        setToken(null)
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }

}

export default useToken