import Alert from 'react-bootstrap/Alert';
import AlertHeading from 'react-bootstrap/AlertHeading'
import './styles/AlertPopUp.css'

// import { useState } from 'react';

function AlertPopUp(props){

    return(
        <>
            { props.status == 'error' &&
            
                <Alert className='alert' variant='danger' onClose={props.close} dismissible>
                    <AlertHeading> ERRO! </AlertHeading>
                    {props.msg}
                </Alert>
            }
            
            { props.status == 'success' &&
                <Alert className='alert' variant='success' onClose={props.close} dismissible>
                    <AlertHeading> SUCESSO! </AlertHeading>
                    {props.msg}
                </Alert>
            }
        </>
        
    )
}

export default AlertPopUp