import './styles/index.css'

import NavBar from './Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button'

function BudgetOS(props) {

    let params = useParams()
    const printRef = useRef(null)

    // const navigation = useNavigate()

    const id = params.id
    const mask_cpf = 'xxx.xxx.xxx-xx'
    const mask_cnpj = 'xx.xxx.xxx/xxxx-xx'
    const [isLoading, setIsLoading] = useState(true)
    const [orcamento, setOrcamento] = useState([])
    const [orcamentoServico, setOrcamentoServico] = useState()
    const [orcamentoEstoque, setOrcamentoEstoque] = useState()

    useEffect(() => {
        async function getOrcamento() {
            // url da api
            const URL = `http://127.0.0.1:5000/os/orcamento/${id}`
            const response = await fetch(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.token
                }
            }
            )
            const data = await response.json();

            // guardando o orcamento
            setOrcamento(data)
            setOrcamentoEstoque(Object.values(data.orcamento_item))
            setOrcamentoServico(Object.values(data.orcamento_servico))

            setIsLoading(false)
        }

        getOrcamento()
    }, [])

    async function download() {
        const element = printRef.current
        if (!element) {
            return
        }

        const canvas = await html2canvas(element)
        const data = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        })

        const imgProperties = pdf.getImageProperties(data)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`OS_N${orcamento.id}.pdf`)
    }

    function format_cpf_cnpj(cpf_cnpj, padrao) {
        let i = 0
        return padrao.replace(/x/g, _ => cpf_cnpj[i++])
    }

    function format_cep(cep) {
        let i = 0
        return 'xxxxx-xxx'.replace(/x/g, _ => cep[i++])
    }

    function format_contato(contato) {
        let i = 0
        if (contato.length == 8) {
            return 'xxxx-xxxx'.replace(/x/g, _ => contato[i++])
        }
        else if (contato.length == 9) {
            return 'x xxxx-xxxx'.replace(/x/g, _ => contato[i++])
        }
        else if (contato.length == 11) {
            return '(xx) x xxxx-xxxx'.replace(/x/g, _ => contato[i++])
        }
        else {
            return contato
        }
    }

    function getSubtotalEstoque() {
        let subtotal = 0
        orcamentoEstoque.forEach(item => {
            subtotal = (parseFloat(item.preco) * parseFloat(item.quantidade_orcamento)) + subtotal
        })

        return subtotal.toFixed(2)
    }

    function getSubtotalServico() {
        let subtotal = 0
        orcamentoServico.forEach(servico => {
            subtotal = parseFloat(servico.custo) + subtotal
        })

        return subtotal.toFixed(2)
    }

    return (
        <>
            <NavBar />
            {!isLoading &&
                <>
                    <div className='container' ref={printRef}>
                        <div className='budget-container'>
                            <div className='budget' style={{ 'marginTop': '15px' }}>
                                <div className="budget-header">
                                    <h1>ORDEM DE SERVIÇO N°{orcamento.id}</h1>
                                    <h4>Manutenção {orcamento.tipo}</h4>
                                </div>

                                <div className="budget-grid">
                                    <div className="budget-section" style={{"gridColumn":2}}>
                                        <p className='budget-p'>
                                            CRIADA EM <strong>{orcamento.data_emissao.toUpperCase()}</strong>
                                        </p>
                                    </div>

                                    {orcamento.is_emitida &&
                                        <div className="budget-section">
                                            <p className="budget-p" style={{'color':'green'}}>
                                                EMITIDA E FECHADA EM <strong>{orcamento.data_fechamento.toUpperCase()}</strong>
                                            </p>
                                        </div>
                                    }

                                    {!orcamento.is_emitida &&
                                        <div className="budget-section">
                                            <p className="budget-p" style={{'color':'red'}}>
                                                <strong>NÃO EMITIDA</strong>
                                            </p>
                                        </div>
                                    }

                                    {(orcamentoEstoque.length > 0 || orcamentoServico.length > 0) &&
                                        <div>
                                            <p className='budget-p'>
                                                Orçamento válido até <strong>{orcamento.validade}</strong>
                                            </p>

                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="budget">
                                <div className="budget-header">
                                    DADOS DO TÉCNICO
                                </div>

                                <div className="budget-grid">
                                    <div className="budget-section" style={{"gridColumn":2}}>
                                        <p className="budget-p">
                                            <strong>Nome do Técnico</strong>
                                        </p>
                                        <p className="budget-p">
                                            {orcamento.tecnico_resp.toUpperCase()}
                                        </p>
                                    </div>

                                    <div className="budget-section" style={{"gridColumn":4}}>
                                        <p className="budget-p">
                                            <strong>Contato do Técnico</strong>
                                        </p>
                                        <p className="budget-p">
                                            {format_contato(orcamento.tecnico_contato)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='budget'>
                                <div className='budget-header'>
                                    DADOS DO CLIENTE
                                </div>

                                <div className='budget-grid'>
                                    <div className='budget-section'>
                                        <p className='budget-p'>
                                            <strong>Nome do Cliente</strong>
                                        </p>
                                        <p className='budget-p'>
                                            {orcamento.cliente_nome.toUpperCase()}
                                        </p>
                                    </div>

                                    {orcamento.cliente_pessoa_juridica &&
                                        <div className='budget-section'>
                                            <p className='budget-p'>
                                                <strong>Nome Fantasia</strong>
                                            </p>
                                            <p className='budget-p '>
                                                {orcamento.cliente_fantasia.toUpperCase()}
                                            </p>
                                        </div>
                                    }

                                    <div className='budget-section'>
                                        <p className='budget-p'>
                                            <strong>CPF/CNPJ</strong>
                                        </p>
                                        <p className='budget-p '>
                                            {orcamento.cliente_pessoa_juridica &&
                                                format_cpf_cnpj(orcamento.cliente_cpf_cnpj, mask_cnpj)}

                                            {!orcamento.cliente_pessoa_juridica &&
                                                format_cpf_cnpj(orcamento.cliente_cpf_cnpj, mask_cpf)}
                                        </p>
                                    </div>

                                    <div className='budget-section'>
                                        <p className='budget-p'>
                                            <strong>Contato</strong>
                                        </p>
                                        <p className='budget-p '>
                                            {format_contato(orcamento.cliente_telefone)}
                                        </p>
                                    </div>

                                    <div className='budget-section'>
                                        <p className='budget-p'>
                                            <strong>Endereço</strong>
                                        </p>
                                        <p className='budget-p '>
                                            {orcamento.cliente_endereco}, {orcamento.cliente_bairro}, {orcamento.cliente_cidade}
                                        </p>
                                    </div>

                                    <div className='budget-section'>
                                        <p className='budget-p'>
                                            <strong>CEP</strong>
                                        </p>
                                        <p className='budget-p '>
                                            {format_cep(orcamento.cliente_cep)}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className='budget'>
                                <div className='budget-header'>
                                    DADOS DO EQUIPAMENTO
                                </div>

                                <div className="budget-grid">
                                    <div className="budget-section">
                                        <p className='budget-p'>
                                            <strong>Modelo</strong>
                                        </p>
                                        <p className='budget-p '>
                                            {orcamento.modelo}
                                        </p>
                                    </div>

                                    <div className="budget-section">
                                        <p className="budget-p">
                                            <strong>Número de Série</strong>
                                        </p>
                                        <p className="budget-p ">
                                            {orcamento.num_serie}
                                        </p>
                                    </div>



                                    <div className="budget-section">
                                        <p className="budget-p">
                                            <strong>Cor</strong>
                                        </p>
                                        <p className="budget-p">
                                            {orcamento.cor}
                                            {!orcamento.cor && 'Não informado'}
                                        </p>
                                    </div>

                                    <div className="budget-section">
                                        <p className="budget-p">
                                            <strong>Sistema Operacional</strong>
                                        </p>
                                        <p className="budget-p">
                                            {orcamento.so}
                                        </p>
                                    </div>

                                    <div className="budget-section">
                                        <p className="budget-p">
                                            <strong>Acessórios</strong>
                                        </p>
                                        <p>
                                            {orcamento.acessorios}
                                            {!orcamento.acessorios && 'Não informado'}
                                        </p>
                                    </div>

                                    <div style={{"display":"flex", "justifyContent":"space-evenly"}}>
                                        <fieldset>
                                            <legend className='info-p'>Checagem do Dispositivo</legend>

                                            <div style={{"display":"flex"}} id='div-flex'>
                                                <div className="budget-section">
                                                    <Form.Group className='budget-p '>
                                                        <Form.Label>Com avarias</Form.Label>
                                                        <Form.Check type='checkbox' className='isChecked' checked={orcamento.avaria} disabled></Form.Check>
                                                    </Form.Group>
                                                </div>

                                                <div className="budget-section">
                                                    <Form.Group className='budget-p '>
                                                        <Form.Label>Com backup</Form.Label>
                                                        <Form.Check type='checkbox' className='isChecked' checked={orcamento.backup} disabled></Form.Check>
                                                    </Form.Group>
                                                </div>

                                                <div className="budget-section">
                                                    <Form.Group className='budget-p '>
                                                        <Form.Label>Carregando</Form.Label>
                                                        <Form.Check type='checkbox' className='isChecked' checked={orcamento.carrega} disabled></Form.Check>
                                                    </Form.Group>
                                                </div>

                                                <div className="budget-section">
                                                    <Form.Group className='budget-p '>
                                                        <Form.Label>Ligando</Form.Label>
                                                        <Form.Check type='checkbox' className='isChecked' checked={orcamento.liga} disabled></Form.Check>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </fieldset>

                                    </div>

                                        <div className="budget-section budget-obs">
                                            <p className="budget-p">
                                                <strong>Observações</strong>
                                            </p>
                                            <p className="budget-p">
                                                {orcamento.obs && orcamento.obs.toUpperCase()}
                                                {!orcamento.obs && 'Não informado'}
                                            </p>
                                        </div>

                                </div>

                            </div>


                            <div className='budget-prog-diag'>
                                <div className="budget-header" style={{'borderLeft': '0px', 'borderRight': '0px'}}>
                                    PROGNÓSTICO
                                </div>
                                <div>
                                    <div className="budget-section">
                                        <p className='budget-p'>
                                            {orcamento.prognostico}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='budget-prog-diag'>
                                <div className="budget-header" style={{'borderLeft': '0px', 'borderRight': '0px'}}>
                                    DIAGNÓSTICO
                                </div>
                                <div>
                                    <div className="budget-section">
                                        <p className="budget-p">
                                            {orcamento.diagnostico}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="budget">
                                <div className="budget-header">
                                    ORÇAMENTO
                                </div>

                                <div id="budget-flex">
                                    <div style={{ "display": "flex", "justifyContent": "space-evenly" }}>

                                        <div className="budget-section item-serv">
                                            <strong>Peças utilizadas</strong>
                                            {orcamentoEstoque.length > 0 &&
                                                <>
                                                    {orcamentoEstoque.map(orcado => (
                                                        <>
                                                            <p className='budget-p'>
                                                                COD [{orcado.cod_barras}] {orcado.quantidade_orcamento}x {orcado.nome_item} - Val. Un. R${orcado.preco}
                                                            </p>
                                                        </>
                                                    ))}

                                                    <p className="budget-p">
                                                        <strong>Sub-total</strong>
                                                    </p>
                                                    <p className="budget-p">
                                                        R${getSubtotalEstoque()}
                                                    </p>
                                                </>

                                            }

                                            {orcamentoServico.length <= 0 &&
                                                <>
                                                    <p className='budget-p'>
                                                        <strong>NÃO ORÇADO</strong>
                                                    </p>
                                                </>
                                            }

                                        </div>



                                        <div className="budget-section item-serv">
                                            <strong>Serviços executados</strong>
                                            {orcamentoServico.length > 0 &&
                                                <>
                                                    {orcamentoServico.map(orcado => (
                                                        <>
                                                            <p className='budget-p'>
                                                                {orcado.nome_servico} - R${orcado.custo}
                                                            </p>
                                                        </>
                                                    ))}

                                                    <p className="budget-p">
                                                        <strong>Sub-total</strong>
                                                    </p>
                                                    <p className="budget-p">
                                                        R${getSubtotalServico()}
                                                    </p>

                                                </>
                                            }

                                            {orcamentoEstoque.length <= 0 &&
                                                <>
                                                    <p className='budget-p'>
                                                        <strong>NÃO ORÇADO</strong>
                                                    </p>
                                                </>
                                            }
                                        </div>


                                    </div>

                                    <hr />

                                    <div id='bugdet-total'>
                                        <p className="budget-p">
                                            <strong>Valor Total</strong>
                                        </p>
                                        <p className="budget-p">
                                            R${orcamento.orcamento_total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='budget'>
                                <div className="budget-header">
                                    ASSINATURAS
                                </div>
                                <div className="budget-grid" style={{ "display": "flex", "justifyContent": "space-evenly", "alignItems": "" }}>
                                    <div className="budget-section">

                                        <div style={{ "marginTop": "50px" }}>
                                            <p className='budget-p'>
                                                __________________________________________
                                            </p>
                                            <p className='budget-p'>
                                                Assinatura do Técnico Responsável
                                            </p>
                                        </div>

                                        <div style={{ "marginTop": "50px", "marginBottom": "10px" }}>
                                            <p className='budget-p'>
                                                __________________________________________
                                            </p>
                                            <p className='budget-p'>
                                                Assinatura do Cliente
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {orcamento.anexo_emitido == 'Sim' &&
                                <div className='budget'>
                                    <div className='budget-header'>
                                        ANEXO
                                    </div>

                                    <div className='budget-grid'>
                                        <div className='budget-section'>
                                            <p className='budget-p'>
                                                <strong>Garantia até</strong>
                                            </p>
                                            <p className='budget-p'>
                                                {orcamento.garantia}
                                            </p>
                                        </div>

                                        <div className='budget-section'>
                                            <p className='budget-p'>
                                                <strong>Solução Realizada</strong>
                                            </p>
                                            <p className='budget-p'>
                                                {orcamento.solucao}
                                            </p>
                                        </div>

                                        <div className='budget-section'>
                                            <p className='budget-p'>
                                                <strong>Observações Adicionais</strong>
                                            </p>
                                            <p className='budget-p'>
                                                {orcamento.observacoes}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            }


                        </div>
                    </div>

                    <div className="container" style={{ "marginTop": '10px', "marginBottom": '20px', "textAlign": "center" }}>
                        <Button onClick={download} variant='outline-warning'>Baixar PDF</Button>
                    </div>
                </>
            }
        </>
    )
}

export default BudgetOS