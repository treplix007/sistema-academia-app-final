import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import AvaliacoesTables from './avaliacoesTable'
import AvaliacoesTablesAluno from './avaliacoesTableAluno'
import NavbarInstrutor from '../../components/navbar-instrutor'
import NavbarAluno from '../../components/navbar-aluno'

import AvaliacaoService from '../../app/service/avaliacaoService'
import AlunoService from '../../app/service/alunoService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

class ConsultaAvaliacoes extends React.Component {

    state = {
        alunos : [],
        aluno: '',
        showConfirmDialog: false,
        showConfirmDados: false,
        avaliacaoDeletar: {},
        avaliacaoSelecionada: '',
        avaliacoes : [],
        altura: '',
        abdomen: '',
        frequenciaCardiaca: '',
        gorduraCorporal: '',
        panturrilha: '',
        peso: '',
        pressao: '',
        quadril: '',
        torax: ''
    }

    constructor() {
        super();
        this.avaliacaoService = new AvaliacaoService()
        this.alunoService = new AlunoService()
    }

    componentDidMount() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        if (usuarioLogado == null) {
            messages.mensagemAlerta('Por favor logar para acessar o sistema.')
            this.props.history.push('/login')
        } else if(usuarioLogado.tipoUsuario === 1) {
            this.consultarAlunoLogado(usuarioLogado.id)
            console.log(this.consultarAlunoLogado(usuarioLogado.id))
        }  else {
            this.buscarTodosAlunos()
        }        
    }

    buscarTodosAlunos = () => {
        this.alunoService
            .buscarTodos()
            .then( resposta => {
                this.setState({ alunos: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    buscar = () => {
        if(!this.state.aluno) {
            messages.mensagemErro('O preenchimento do campo Aluno é obrigatório.')
            return false;
        }

        this.avaliacaoService
            .consultarPorAluno(this.state.aluno)
            .then( resposta => {
                this.setState({ avaliacoes: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    visualizar = (avaliacao) => {
        this.setState({
            avaliador: avaliacao.avaliador,
            altura: avaliacao.desempenho.altura,
            abdomen: avaliacao.desempenho.abdomen,
            frequenciaCardiaca: avaliacao.desempenho.frequenciaCardiaca,
            gorduraCorporal: avaliacao.desempenho.gorduraCorporal,
            panturrilha: avaliacao.desempenho.panturrilha,
            peso: avaliacao.desempenho.peso,
            pressao: avaliacao.desempenho.pressao,
            quadril: avaliacao.desempenho.quadril,
            torax: avaliacao.desempenho.torax
        })
        this.setState({ showConfirmDados: true, avaliacaoSelecionada: avaliacao })
    }

    abrirConfirmacao = (avaliacao) => {
        this.setState({ showConfirmDialog: true, avaliacaoDeletar: avaliacao })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, avaliacaoDeletar: {} })
    }

    cancelarDialogDados = () => {
        this.setState({ showConfirmDados: false, avaliacaoDeletar: {} })
    }

    cadastrar = () => {
        this.props.history.push('/cadastro-avaliacoes')
    }

    deletar = () => {
        this.avaliacaoService
            .deletar(this.state.avaliacaoDeletar)
            .then( response => {
                const avaliacoes = this.state.avaliacoes
                const index = avaliacoes.indexOf(this.state.avaliacaoDeletar)
                avaliacoes.splice(index, 1)
                this.setState({ avaliacoes: avaliacoes, showConfirmDialog: false })
                messages.mensagemSucesso('Avaliação deletada com sucesso.')
            }).catch( error => {
                messages.mensagemErro('Erro ao tentar deletar a Avaliação.')
            })
    }

    consultarAlunoLogado = (id) => {
        this.alunoService
            .buscarPorIdUsuario(id)
            .then( resposta => {
                 this.avaliacaoService
                     .consultarPorAluno(resposta.data[0].id)
                     .then( resposta => {
                         this.setState({ avaliacoes: resposta.data})
                     }).catch( error => {
                         console.log(error)
                     })
            }).catch( error => {
                console.log(error)
            })
    }

    render() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        const confirmDadosFooter = (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDialogDados} />
            </div>
        );

        const alunos = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.alunos.map( aluno => {
            return (
                alunos.push({ label: aluno.nome + ' - ' + aluno.cpf, value: aluno.id })
            )
        });

        if (usuarioLogado !== null) {
            if (usuarioLogado.tipoUsuario === 1) {
                return (
                    <>
                    <NavbarAluno />
                    <Card title="Consulta Avaliações Físicas">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="bs-component">
                                    <AvaliacoesTablesAluno avaliacoes={this.state.avaliacoes} 
                                                       visualizar={this.visualizar} />
                                </div>
                            </div>
                        </div>
        
                        <div>
                            <Dialog header="Confirmação"
                                    visible={this.state.showConfirmDialog}
                                    style={{width: '50vw'}}
                                    footer={confirmDialogFooter}
                                    modal={true}
                                    onHide={() => this.setState({visible: false})}>
                                Confirma a exclusão da Avaliação Física?
                            </Dialog>
                        </div>

                        <div>
                            <Dialog header="Dados"
                                    visible={this.state.showConfirmDados}
                                    style={{width: '50vw'}}
                                    modal={true}
                                    footer={confirmDadosFooter}
                                    onHide={() => this.setState({visible: false})}>
                                <div>
                                    <h2 id="simple-modal-title">Dados da Avaliação Física:</h2>
                                    <p id="simple-modal-description">
                                        avaliacaoSelecionada.avaliacador
                                    </p>
                                </div>
                            </Dialog>
                        </div>

                        <div>
                            <Dialog header="Dados da Avaliação Física:"
                                    visible={this.state.showConfirmDados}
                                    style={{width: '50vw'}}
                                    modal={true}
                                    closable={false}
                                    closeOnEscape={true}
                                    footer={confirmDadosFooter}
                                    onHide={() => this.setState({visible: false})}>
                                <div>
                                    <h4 id="simple-modal-title">
                                        Avaliador: {this.state.avaliador}
                                    </h4>
                                    <h4>
                                        Altura: {this.state.altura}
                                    </h4>
                                    <h4>
                                        Abdomen: {this.state.abdomen}
                                    </h4>
                                    <h4>
                                        Frequência Cardiaca: {this.state.frequenciaCardiaca}
                                    </h4>
                                    <h4>
                                        Gordura Corporal: {this.state.gorduraCorporal}
                                    </h4>
                                    <h4>
                                        Panturrilha: {this.state.panturrilha}
                                    </h4>
                                    <h4>
                                        Peso: {this.state.peso}
                                    </h4>
                                    <h4>
                                        Pressão: {this.state.pressao}
                                    </h4>
                                    <h4>
                                        Quadril: {this.state.quadril}
                                    </h4>
                                </div>
                            </Dialog>
                        </div>
                    </Card>
                    </>
                )
            }

        }
        
        return (
            <>
            <NavbarInstrutor />
            <Card title="Consulta Avaliações Físicas">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAlunos" label="Alunos: *">
                                <SelectMenu id="inputAlunos" className="form-control" lista={alunos} onChange={e => this.setState({aluno: e.target.value})} />
                            </FormGroup>

                            <button onClick={this.buscar} type="button" className="btn btn-secondary">Buscar</button>
                            <button onClick={this.cadastrar} type="button" className="btn btn-primary">Cadastrar</button>
                        </div>
                    </div>
                </div>

                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <AvaliacoesTables avaliacoes={this.state.avaliacoes} 
                                               deletar={this.abrirConfirmacao}
                                               visualizar={this.visualizar} />
                        </div>
                    </div>
                </div>

                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfirmDialog}
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter}
                            modal={true}
                            onHide={() => this.setState({visible: false})}>
                        Confirma a exclusão da Avaliação Física?
                    </Dialog>
                </div>

                <div>
                    <Dialog header="Dados da Avaliação Física:"
                            visible={this.state.showConfirmDados}
                            style={{width: '50vw'}}
                            modal={true}
                            closable={false}
                            closeOnEscape={true}
                            footer={confirmDadosFooter}
                            onHide={() => this.setState({visible: false})}>
                        <div>
                            <h4 id="simple-modal-title">
                                Avaliador: {this.state.avaliador}
                            </h4>
                            <h4>
                                Altura: {this.state.altura}
                            </h4>
                            <h4>
                                Abdomen: {this.state.abdomen}
                            </h4>
                            <h4>
                                Frequência Cardiaca: {this.state.frequenciaCardiaca}
                            </h4>
                            <h4>
                                Gordura Corporal: {this.state.gorduraCorporal}
                            </h4>
                            <h4>
                                Panturrilha: {this.state.panturrilha}
                            </h4>
                            <h4>
                                Peso: {this.state.peso}
                            </h4>
                            <h4>
                                Pressão: {this.state.pressao}
                            </h4>
                            <h4>
                                Quadril: {this.state.quadril}
                            </h4>
                        </div>
                    </Dialog>
                </div>
            </Card>
            </>
        )
    }
}

export default withRouter( ConsultaAvaliacoes )