import React from 'react'

import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import NavbarInstrutor from '../../components/navbar-instrutor'

import ExercicioService from '../../app/service/exercicioService'
import LocalStorageService from '../../app/service/localStorageService'

import { mensagemSucesso, mensagemErro, mensagemAlerta } from '../../components/toastr'
import TreinoService from '../../app/service/treinoService'
import ExercicioTreinoService from '../../app/service/exercicioTreinoService'

class CadastroExerciciosTreino extends React.Component {

    state = {
        exercicios: [],
        exercicio: '',
        treinos: [],
        treino: '',
        repeticoes: '',
        carga: '',
        series: ''
    }

    constructor() {
        super()
        this.treinoService = new TreinoService()
        this.exercicioService = new ExercicioService()
        this.exercicioTreinoService = new ExercicioTreinoService()
    }

    componentDidMount() {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        if (usuarioLogado == null) {
            mensagemAlerta('Por favor logar para acessar o sistema.')
            this.props.history.push('/login')
        } else if(usuarioLogado.tipoUsuario === 1) {
            mensagemAlerta('Você não tem permissão para acessar essa tela.')
            this.props.history.push('/home')
        } else {
            this.buscarTodosExercicios()
            this.buscarTodosTreinos()
        }     
    }

    buscarTodosExercicios = () => {
        this.exercicioService
            .buscarTodos()
            .then( resposta => {
                this.setState({ exercicios: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    buscarTodosTreinos = () => {
        this.treinoService
            .buscarTodos()
            .then( resposta => {
                this.setState({ treinos: resposta.data})
            }).catch( error => {
                console.log(error)
            })
    }

    validar() {
        const msgs = []

        if(!this.state.exercicio) {
            msgs.push('O campo Exercício é obrigatório.')
        }

        if(!this.state.treino) {
            msgs.push('O campo Treino é obrigatório.')
        }

        if(!this.state.repeticoes) {
            msgs.push('O campo Repetições é obrigatório.')
        }

        if(!this.state.carga) {
            msgs.push('O campo Carga é obrigatório.')
        }

        if(!this.state.series) {
            msgs.push('O campo Séries é obrigatório.')
        }

        return msgs
    }

    cadastrar = () => {
        const msgs = this.validar();

        if(msgs && msgs.length > 0) {
            msgs.forEach( (msg, index) => {
                mensagemErro(msg)
            });
            return false;
        }

        const exercicioDTO = {
            exercicio: this.state.exercicio,
            treino: this.state.treino,
            carga: this.state.carga,
            series: this.state.series,
            repeticoes: this.state.repeticoes
        }

        this.exercicioTreinoService.salvar(exercicioDTO)
            .then( response => {
                window.location.reload(false);
                mensagemSucesso('Exercício Treino cadastrado com sucesso!')
            }).catch( error => {
                mensagemErro(error.response.data)
            });
    }

    cancelar = () => {
        this.props.history.push('/home')
    }

    consultarExercicios = () => {
        this.props.history.push('/consulta-exercicios')
    }

    consultarTreinos = () => {
        this.props.history.push('/consulta-treinos')
    }

    render() {

        const exercicios = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.exercicios.map( exercicio => {
            return (
                exercicios.push({ label: exercicio.nome, value: exercicio.id })
            )
        });

        const treinos = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.treinos.map( treino => {
            return (
                treinos.push({ label: treino.nome, value: treino.id })
            )
        });

        return (
            <>
            <NavbarInstrutor />
            <Card title="Cadastro Plano de Treino">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputTreinos" label="Treinos: *">
                                <SelectMenu id="inputTreinos" className="form-control" lista={treinos} onChange={e => this.setState({treino: e.target.value})} />
                            </FormGroup>

                            <FormGroup htmlFor="inputExercicios" label="Exercícios: *">
                                <SelectMenu id="inputExercicios" className="form-control" lista={exercicios} onChange={e => this.setState({exercicio: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Repetições: *" htmlFor="inputRepeticoes">
                                <input type="text" 
                                        id="inputRepeticoes"
                                        className="form-control" 
                                        name="repeticoes"
                                        onChange={e => this.setState({repeticoes: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Carga: *" htmlFor="inputCarga">
                                <input type="text" 
                                        id="inputCarga"
                                        className="form-control" 
                                        name="carga"
                                        onChange={e => this.setState({carga: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Séries: *" htmlFor="inputSeries">
                                <input type="text" 
                                        id="inputSeries"
                                        className="form-control" 
                                        name="series"
                                        onChange={e => this.setState({series: e.target.value})} />
                            </FormGroup>

                            <button onClick={this.cadastrar} type="button" className="btn btn-success">Salvar</button>
                            <button onClick={this.cancelar} type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </div>
                </div>
            </Card>
            </>
        );
    }
}

export default withRouter( CadastroExerciciosTreino )