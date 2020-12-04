import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import NavbarAluno from '../../components/navbar-aluno'
import ExerciciosTable from './exerciciosTable'

import TreinoService from '../../app/service/treinoService'
import ExercicioService from '../../app/service/exercicioService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'
import NavbarInstrutor from '../../components/navbar-instrutor'
import ExerciciosTableInstrutor from './exerciciosTableInstrutor'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import ExercicioTreinoService from '../../app/service/exercicioTreinoService'
import GrupoMuscularService from '../../app/service/grupoMuscularService'

class ConsultaExercicios extends React.Component {

    state = {
        exercicios: [],
        treinosAluno: [],
        treinoAluno: '',
        treinosInstrutor: [],
        treinoInstrutor: '',
        showConfirmDialog: false,
        exercicioDeletar: {},
        grupoMuscular: '',
        grupoMuscularAluno: '',
        gruposMusculares: []
    }

    constructor() {
        super();
        this.treinoService = new TreinoService()
        this.exercicioService = new ExercicioService()
        this.exercicioTreinoService = new ExercicioTreinoService()
        this.grupoMuscularService = new GrupoMuscularService()
    }

    componentDidMount() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        if (usuarioLogado == null) {
            messages.mensagemAlerta('Por favor logar para acessar o sistema.')
            this.props.history.push('/login')
        } else if (usuarioLogado.tipoUsuario === 1) {
            // this.buscarTodosExerciciosPorAluno(usuarioLogado.id)
            this.buscarTodosExerciciosPorUsuario(usuarioLogado.id)
            this.buscarTodosGruposMusculares()
        } else if (usuarioLogado.tipoUsuario === 2) {
            this.buscarTodosExercicios()
            this.buscarTodosGruposMusculares()
        }       
    }

    cadastrarNovo = () => {
        this.props.history.push('/cadastro-exercicios')
    }

    buscarTodosExerciciosPorAluno = (usuario) => {
        this.treinoService
            .consultarPorAluno(usuario)
            .then( resposta => {
                this.setState({ treinosAluno: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    buscarTodosExerciciosPorUsuario = (aluno) => {
        this.treinoService
            .consultarPorUsuario(aluno)
            .then( resposta => {
                this.setState({ treinosAluno: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    buscarTodosExercicios = () => {
        this.exercicioService
            .buscarTodos()
            .then( resposta => {
                console.log(resposta.data)
                this.setState({ exercicios: resposta.data}) 
            }).catch( error => {
                console.log(error)
            })
    }

    buscarTodosGruposMusculares = () => {
        this.grupoMuscularService
            .buscarTodos()
            .then( resposta => {
                this.setState({ gruposMusculares: resposta.data}) 
            }).catch( error => {
                console.log(error)
            })
    }

    // buscarPorGrupoMuscular = () => {
    //     if(!this.state.grupoMuscularAluno) {
    //         messages.mensagemErro('O campo Grupo Muscular é obrigatório.')
    //     } else {
    //         this.exercicioTreinoService
    //         .consultarPorExercicio(this.state.grupoMuscularAluno)
    //         .then( resposta => {
    //             this.setState({ exercicios: resposta.data}) 
    //         }).catch( error => {
    //             console.log(error)
    //         })
    //     }
    // }

    buscarPorGrupoMuscular = () => {
        if(!this.state.grupoMuscularAluno) {
            messages.mensagemErro('O campo Grupo Muscular é obrigatório.')
        } else {
            this.exercicioService
            .consultarPorGrupoMuscular(this.state.grupoMuscularAluno)
            .then( resposta => {
                this.setState({ exercicios: resposta.data}) 
            }).catch( error => {
                console.log(error)
            })
        }
    }

    buscarPorTreino = () => {
        if(!this.state.treinoAluno) {
            messages.mensagemErro('O campo Treino é obrigatório.')
        } else {
            this.exercicioTreinoService
            .consultarPorTreino(this.state.treinoAluno)
            .then( resposta => {
                this.setState({ exercicios: resposta.data}) 
            }).catch( error => {
                console.log(error)
            })
        }
    }

    editar = (id) => {
        console.log(id)
    }

    // abrirConfirmacao = (treino) => {
    //     this.setState({ showConfirmDialog: true, treinoDeletar: treino })
    // }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, treinoDeletar: {} })
    }

    deletar = () => {
        this.exercicioService
            .deletar(this.state.exercicioDeletar)
            .then( response => {
                const exercicios = this.state.exercicios
                const index = exercicios.indexOf(this.state.exercicioDeletar)
                exercicios.splice(index, 1)
                this.setState({ exercicios: exercicios, showConfirmDialog: false })
                messages.mensagemSucesso('Exercício deletado com sucesso.')
            }).catch( error => {
                messages.mensagemErro('Erro ao tentar deletar o Exercício.')
            })
    }

    buscar = () => {
        if(!this.state.treinoAluno) {
            messages.mensagemErro('O preenchimento do campo Treino é obrigatório.')
            return false;
        }

        this.exercicioTreinoService
            .consultarPorTreino(this.state.treinoAluno)
            .then( resposta => {
                this.setState({ exercicios: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    abrirConfirmacao = (exercicio) => {
        this.setState({ showConfirmDialog: true, exercicioDeletar: exercicio })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, exercicioDeletar: {} })
    }

    editar = (exercicio) => {
        console.log(exercicio)
    }

    cadastrarNovo = () => {
        this.props.history.push('/cadastro-exercicios')
    }

    render() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        const treinos = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.treinosAluno.map( treino => {
            return (
                treinos.push({ label: treino.nome, value: treino.id })
            )
        });

        const gruposMuscular = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.gruposMusculares.map( grupoMuscular => {
            return (
                gruposMuscular.push({ label: grupoMuscular.nome, value: grupoMuscular.id })
            )
        });

        if (usuarioLogado !== null) {
            if (usuarioLogado.tipoUsuario === 2) {
                return (
                    <>
                    <NavbarInstrutor />
                    <Card title="Consulta Exercícios">
                            <div className="row">
                            <div className="col-md-12">
                                <div className="bs-component">
                                    <button onClick={this.cadastrarNovo} type="button" className="btn btn-primary">Cadastrar Novo</button>

                                    <br />
                                    <br />
                                    <FormGroup htmlFor="inputAlunos" label="Grupos Musculares: *">
                                        <SelectMenu id="inputAlunos" className="form-control" lista={gruposMuscular} onChange={e => this.setState({grupoMuscularAluno: e.target.value})} />
                                    </FormGroup>

                                    <button onClick={this.buscarPorGrupoMuscular} type="button" className="btn btn-secondary">Buscar</button>
                                    <button onClick={this.buscarTodosExercicios} type="button" className="btn btn-primary">Buscar Todos</button>
                                </div>
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="bs-component">
                                    <ExerciciosTableInstrutor exercicios={this.state.exercicios} 
                                                              editar={this.editar}
                                                              deletar={this.abrirConfirmacao} />
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
                                Confirma a exclusão do Exercício?
                            </Dialog>
                        </div>
                    </Card>
                    </>
                )
            } else {
                return (
                    <>
                    <NavbarAluno />
                    <Card title="Consulta Treinos/Exercícios">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="bs-component">
                                    <FormGroup htmlFor="inputTreinos" label="Treinos: *">
                                        <SelectMenu id="inputTreinos" className="form-control" lista={treinos} onChange={e => this.setState({treinoAluno: e.target.value})} />
                                    </FormGroup>
        
                                    <button onClick={this.buscarPorTreino} type="button" className="btn btn-success">Buscar</button>
                                </div>
                            </div>
                        </div>
        
                        <br />
                        <br />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="bs-component">
                                    <ExerciciosTable exercicios={this.state.exercicios} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    </>
                )
            }
        }

    }
}

export default withRouter( ConsultaExercicios )