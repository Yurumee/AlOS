import { Alert } from "react-bootstrap/Alert";
import AlertHeading from 'react-bootstrap/AlertHeading'
// import Alert from '@mui/material/Alert';

function AlertPopUp(props){

    return(
        <>
            {/* caso seja erro */}
            <Alert varianty='danger'>
                <AlertHeading> ERRO </AlertHeading>
                {/* ex: Ocorreu um erro ao criar um(a) cliente */}
                {/* criar, editar, deletar */}
                {/* cliente, produto */}
                Ocorreu um erro ao {props.action} um(a) {props.object}.
            </Alert>

            {/* caso seja um aviso */}
            <Alert varianty='warning'>
                <AlertHeading> ATENÇÃO </AlertHeading>
                {/* ex: Campos não preenchidos ao criar um(a) cliente */}
                Campos não preenchidos ao {props.action} um(a) {props.object}.
            </Alert>
            
            {/* caso seja criado corretamente */}
            <Alert varianty='success'>
                <AlertHeading> SUCESSO </AlertHeading>
                {/* ex: Sucesso ao criar um(a) cliente!  */}
                Sucesso ao {props.action} um(a) {props.object}!
            </Alert>
        </>
        
    )
}

export default AlertPopUp