import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import AlunosTables from './alunosTable'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import NavbarInstrutor from '../../components/navbar-instrutor'

import AlunoService from '../../app/service/alunoService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

class ConsultaAlunos extends React.Component {

    state = {
        alunos : [],
        professores : [],
        professor: '',
        showConfirmDialog: false,
        showConfirmDados: false,
        alunoDeletar: {},
        alunoSelecionado: '',
        idAluno: '',
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        endereco: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
        objetivo: '',
        profissao: '',
        estadoCivil: '',
        idade: '',
        debito: '',
        dataCadastro: '',
        matriculado: ''
    }

    constructor() {
        super();
        this.service = new AlunoService()
    }

    componentDidMount() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        if (usuarioLogado == null) {
            messages.mensagemAlerta('Por favor logar para acessar o sistema.')
            this.props.history.push('/login')
        } else if(usuarioLogado.tipoUsuario === 1) {
            messages.mensagemAlerta('Você não tem permissão para acessar essa tela.')
            this.props.history.push('/home')
        } else {
            this.buscarTodos()
        }          
    }

    cadastrarNovo = () => {
        this.props.history.push('/cadastro-alunos')
    }

    imprimirPdf = () => {
        this.props.history.push('/alunos-pdf')
    }

    buscarTodos = () => {
        this.service
            .buscarTodos()
            .then( resposta => {
                this.setState({ alunos: resposta.data})
                this.setState({ professores: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    buscarPorIdUsuario = () => {
        this.service
            .buscarPorIdUsuario(this.state.professor)
            .then( resposta => {
                this.setState({ alunos: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    editar = (aluno) => {
        this.setState({
            idAluno: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            cpf: aluno.cpf,
            rg: aluno.rg,
            endereco: aluno.endereco,
            bairro: aluno.bairro,
            cep: aluno.cep,
            cidade: aluno.cidade,
            profissao: aluno.profissao,
            idade: aluno.idade,
            debito: aluno.debito,
            matriculado: aluno.matriculado
        })
        this.setState({ showConfirmDados: true, alunoSelecionado: aluno })
    }

    abrirConfirmacao = (aluno) => {
        this.setState({ showConfirmDialog: true, alunoDeletar: aluno })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, alunoDeletar: {} })
    }

    cancelarDialogDados = () => {
        this.setState({ showConfirmDados: false, avaliacaoDeletar: {} })
    }

    deletar = () => {
        this.service
            .deletar(this.state.alunoDeletar.id)
            .then( response => {
                const alunos = this.state.alunos
                const index = alunos.indexOf(this.state.alunoDeletar)
                alunos.splice(index, 1)
                this.setState({ alunos: alunos, showConfirmDialog: false })
                messages.mensagemSucesso('Aluno deletado com sucesso.')
            }).catch( error => {
                messages.mensagemErro('Erro ao tentar deletar o Aluno.')
            })
    }

    cadastrar = () => {
        const msgs = this.validar();

        if(msgs && msgs.length > 0) {
            msgs.forEach( (msg, index) => {
                messages.mensagemErro(msg)
            });
            return false;
        }

        const alunoDTO = {
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha,
            cpf: this.state.cpf,
            rg: this.state.rg,
            dataNascimento: this.state.dataNascimento,
            endereco: this.state.endereco,
            bairro: this.state.bairro,
            cep: this.state.cep,
            cidade: this.state.cidade,
            uf: this.state.uf,
            objetivo: this.state.objetivo,
            profissao: this.state.profissao,
            estadoCivil: this.state.estadoCivil,
            idade: this.state.idade,
            debito: this.state.debito,
            dataCadastro: this.state.dataCadastro,
            matriculado: this.state.matriculado
        }

        console.log(alunoDTO);

        this.service
            .editar(this.state.idAluno, alunoDTO)
            .then( response => {
                window.location.reload(false);
                messages.mensagemSucesso('Aluno editado com sucesso!')
                this.setState({ showConfirmDados: false, alunoSelecionado: '' })
            }).catch( error => {
                messages.mensagemErro(error.response.data)
            });
    }

    validar() {
        const msgs = []

        if(!this.state.nome) {
            msgs.push('O campo Nome é obrigatório.')
        }

        if(!this.state.email) {
            msgs.push('O campo Email é obrigatório.')
        } else if (!this.state.email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]/)) {
            msgs.push('Informe um Email válido.')
        }

        if(!this.state.senha || !this.state.senhaRepeticao) {
            msgs.push('Digite a senha 2x.')
        } else if (this.state.senha !== this.state.senhaRepeticao) {
            msgs.push('As senhas não são iguais.')
        }

        if(!this.state.cpf) {
            msgs.push('O campo CPF é obrigatório.')
        }

        if(this.state.cpf.length > 11) {
            msgs.push('O campo CPF deve conter no máximo 11 números.')
        }

        if(!this.state.rg) {
            msgs.push('O campo RG é obrigatório.')
        }

        if(this.state.rg.length > 7) {
            msgs.push('O campo RG deve conter no máximo 7 números.')
        }

        if(!this.state.nome) {
            msgs.push('O campo Nome é obrigatório.')
        }

        if(!this.state.dataNascimento) {
            msgs.push('O campo Data Nascimento é obrigatório.')
        }

        if(!this.state.endereco) {
            msgs.push('O campo Endereço é obrigatório.')
        }

        if(!this.state.bairro) {
            msgs.push('O campo Bairro é obrigatório.')
        }

        if(!this.state.cep) {
            msgs.push('O campo CEP é obrigatório.')
        }

        if(this.state.cep.length > 8) {
            msgs.push('O campo CEP deve conter no máximo 8 números.')
        }

        if(!this.state.cidade) {
            msgs.push('O campo Cidade é obrigatório.')
        }

        if(!this.state.uf) {
            msgs.push('O campo UF é obrigatório.')
        } else if (this.state.uf.length > 2) {
            msgs.push('O campo UF deve conter 2 caracteres apenas.')
        }

        if(!this.state.objetivo) {
            msgs.push('O campo Objetivo é obrigatório.')
        }

        if(!this.state.profissao) {
            msgs.push('O campo Profissão é obrigatório.')
        }

        if(!this.state.estadoCivil) {
            msgs.push('O campo Estado Civil é obrigatório.')
        }

        if(!this.state.idade) {
            msgs.push('O campo Idade é obrigatório.')
        }

        if(!this.state.dataCadastro) {
            msgs.push('O campo Data Cadastro é obrigatório.')
        }

        return msgs
    }

    render() {

        const professores = [
            { label: 'Selecione...', value: '' }
        ]

        const uf = [
            { label: 'Selecione...', value: '' },
            { label: 'Acre', value: 'AC' },
            { label: 'Alagoas', value: 'AL' },
            { label: 'Amapá', value: 'AP' },
            { label: 'Amazonas', value: 'AM' },
            { label: 'Bahia', value: 'BA' },
            { label: 'Ceará', value: 'CE' },
            { label: 'Distrito Federal', value: 'DF' },
            { label: 'Espírito Santo', value: 'ES' },
            { label: 'Goiás', value: 'GO' },
            { label: 'Maranhão', value: 'MA' },
            { label: 'Mato Grosso', value: 'MT' },
            { label: 'Mato Grosso do Sul', value: 'MS' },
            { label: 'Minas Gerais', value: 'MG' },
            { label: 'Pará', value: 'PA' },
            { label: 'Paraíba', value: 'PB' },
            { label: 'Paraná', value: 'PN' },
            { label: 'Pernambuco', value: 'PE' },
            { label: 'Piauí', value: 'PI' },
            { label: 'Rio de Janeiro', value: 'RJ' },
            { label: 'Rio Grande do Norte', value: 'RN' },
            { label: 'Rio Grande do Sul', value: 'RS' },
            { label: 'Rondônia', value: 'RO' },
            { label: 'Roraima', value: 'RR' },
            { label: 'Santa Catarina', value: 'SC' },
            { label: 'São Paulo', value: 'SP' },
            { label: 'Sergipe', value: 'SE' },
            { label: 'Tocantins', value: 'TO' }
        ]

        const estadoCivil = [
            { label: 'Selecione...', value: '' },
            { label: 'Solteiro(a)', value: 'Solteiro' },
            { label: 'Casado(a)', value: 'Casado' },
            { label: 'Divorsiado(a)', value: 'Divorsiado' },
            { label: 'Viúvo(a)', value: 'Viuvo' }
        ]

        const objetivo = [
            { label: 'Selecione...', value: '' },
            { label: 'Ganho de Massa Muscular', value: 'Ganho de Massa Muscular' },
            { label: 'Emagrecimento', value: 'Emagrecimento' },
            { label: 'Definição Muscular', value: 'Definicao Muscular' },
            { label: 'Qualidade de Vida', value: 'Qualidade de Vida' }
        ]

        const matriculado = [
            { label: 'Selecione...', value: '' },
            { label: 'Matriculado', value: 'true' },
            { label: 'Não matriculado', value: 'false' }
        ]

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        const confirmDadosFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.cadastrar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDialogDados} />
            </div>
        );

        this.state.professores.map( professor => {
            return (
                professores.push({ label: professor.nome, value: professor.id })
            )
        });

        return (
            <>
            <NavbarInstrutor />
            <Card title="Consulta Alunos">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <button onClick={this.cadastrarNovo} type="button" className="btn btn-primary">Cadastrar Novo</button>

                            <br />
                            <br />
                            <AlunosTables alunos={this.state.alunos} 
                                          deletar={this.abrirConfirmacao}
                                          editar={this.editar} />
                        </div>
                    </div>
                </div>

                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfirmDialog}
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter}
                            closeOnEscape={true}
                            modal={true}
                            closable={false}
                            onHide={() => this.setState({visible: false})}>
                        Confirma a exclusão do Aluno?
                    </Dialog>
                </div>

                <div>
                    <Dialog
                            visible={this.state.showConfirmDados}
                            style={{width: '50vw'}}
                            modal={true}
                            closable={false}
                            closeOnEscape={true}
                            footer={confirmDadosFooter}
                            onHide={() => this.setState({visible: false})}>
                        <div>
                        <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text" 
                                        id="inputNome"
                                        className="form-control" 
                                        name="nome"
                                        value={this.state.nome}
                                        onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input type="email" 
                                        id="inputEmail" 
                                        className="form-control" 
                                        name="email" 
                                        value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input type="password" 
                                        id="inputSenha" 
                                        className="form-control" 
                                        name="senha" 
                                        placeholder="Digite uma senha" 
                                        onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Repita a Senha: *" htmlFor="inputRepitaSenha">
                                <input type="password" 
                                        id="inputRepitaSenha" 
                                        className="form-control" 
                                        name="senha" 
                                        placeholder="Repita a senha" 
                                        onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="CPF: *" htmlFor="inputCPF">
                                <input type="number" 
                                        id="inputCPF" 
                                        className="form-control"
                                        name="cpf" 
                                        value={this.state.cpf}
                                        onChange={e => this.setState({cpf: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="RG: *" htmlFor="inputRG">
                                <input type="number" 
                                        id="inputRG" 
                                        className="form-control" 
                                        name="rg" 
                                        value={this.state.rg}
                                        onChange={e => this.setState({rg: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Data de Nascimento: *" htmlFor="inputDataNascimento">
                                <input type="date" 
                                        id="inputDataNascimento" 
                                        className="form-control" 
                                        name="dataNascimento" 
                                        value={this.state.dataNascimento}
                                        onChange={e => this.setState({dataNascimento: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Endereço: *" htmlFor="inputEndereço">
                                <input type="text" 
                                        id="inputEndereco" 
                                        className="form-control" 
                                        name="endereco" 
                                        value={this.state.endereco}
                                        onChange={e => this.setState({endereco: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Bairro: *" htmlFor="inputBairro">
                                <input type="text" 
                                        id="inputBairro" 
                                        className="form-control"
                                        name="bairro" 
                                        value={this.state.bairro}
                                        onChange={e => this.setState({bairro: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="CEP: *" htmlFor="inputCEP">
                                <input type="text" 
                                        id="inputCEP" 
                                        className="form-control" 
                                        name="cep" 
                                        value={this.state.cep} 
                                        onChange={e => this.setState({cep: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Cidade: *" htmlFor="inputCidade">
                                <input type="text" 
                                        id="inputCidade" 
                                        className="form-control" 
                                        name="cidade" 
                                        value={this.state.cidade}
                                        onChange={e => this.setState({cidade: e.target.value})} />
                            </FormGroup>
                            
                            <FormGroup htmlFor="inputUF" label="UF: ">
                                <SelectMenu id="inputUF" className="form-control" lista={uf} onChange={e => this.setState({uf: e.target.value})} />
                            </FormGroup>

                            <FormGroup htmlFor="inputObjetivo" label="Objetivo: *">
                                <SelectMenu id="inputObjetivo" className="form-control" lista={objetivo} onChange={e => this.setState({objetivo: e.target.value})} />
                            </FormGroup>
                            
                            <FormGroup label="Profissão: *" htmlFor="inputProfissao">
                                <input type="text" 
                                        id="inputProfissao" 
                                        className="form-control" 
                                        name="profissao" 
                                        value={this.state.profissao} 
                                        onChange={e => this.setState({profissao: e.target.value})} />
                            </FormGroup>

                            <FormGroup htmlFor="inputEstadoCivil" label="Estado Civil: *">
                                <SelectMenu id="inputEstadoCivil" className="form-control" lista={estadoCivil} onChange={e => this.setState({estadoCivil: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Idade: *" htmlFor="inputIdade">
                                <input type="number" 
                                        id="inputIdade" 
                                        className="form-control" 
                                        name="idade" 
                                        value={this.state.idade}
                                        onChange={e => this.setState({idade: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Débito: *" htmlFor="inputDebito">
                                <input type="number" 
                                        id="inputDebito" 
                                        className="form-control" 
                                        name="debito" 
                                        value={this.state.debito} 
                                        onChange={e => this.setState({debito: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Data de Cadastro: *" htmlFor="inputDataCadastro">
                                <input type="date" 
                                        id="inputDataCadastro" 
                                        className="form-control" 
                                        name="dataCadastro" 
                                        value={this.state.dataCadastro}
                                        onChange={e => this.setState({dataCadastro: e.target.value})} />
                            </FormGroup>

                            <FormGroup htmlFor="inputMatriculado" label="Matriculado: ">
                                <SelectMenu id="inputMatriculado" className="form-control" lista={matriculado} onChange={e => this.setState({matriculado: e.target.value})} />
                            </FormGroup>
                        </div>
                    </Dialog>
                </div>
            </Card>
            </>
        )
    }
}

export default withRouter( ConsultaAlunos )