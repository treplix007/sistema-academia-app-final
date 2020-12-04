import React from 'react'

import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import NavbarInstrutor from '../../components/navbar-instrutor'

import ExercicioService from '../../app/service/exercicioService'
import LocalStorageService from '../../app/service/localStorageService'

import { mensagemSucesso, mensagemErro, mensagemAlerta } from '../../components/toastr'
import GrupoMuscularService from '../../app/service/grupoMuscularService'

class CadastroExercicios extends React.Component {

    state = {
        gruposMusculares: [],
        grupoMuscular: '',
        nome: '',
        dica: ''
    }

    constructor() {
        super()
        this.grupoMuscularService = new GrupoMuscularService()
        this.exercicioService = new ExercicioService()
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
            this.buscarTodosGruposMusculares()
        }     
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

    validar() {
        const msgs = []

        if(!this.state.grupoMuscular) {
            msgs.push('O campo Grupo Muscular é obrigatório.')
        }

        if(!this.state.nome) {
            msgs.push('O campo Nome é obrigatório.')
        }

        if(!this.state.dica) {
            msgs.push('O campo Dica é obrigatório.')
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
            nome: this.state.nome,
            dica: this.state.dica,
            grupoMuscular: this.state.grupoMuscular
        }

        this.exercicioService.salvar(exercicioDTO)
            .then( response => {
                mensagemSucesso('Exercício cadastrado com sucesso!')
                this.props.history.push('/cadastro-exercicios')
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

    render() {

        const gruposMusculares = [
            { label: 'Selecione...', value: '' }
        ]

        this.state.gruposMusculares.map( grupoMuscular => {
            return (
                gruposMusculares.push({ label: grupoMuscular.nome, value: grupoMuscular.id })
            )
        });

        return (
            <>
            <NavbarInstrutor />
            <Card title="Cadastro de Exercícios">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <button onClick={this.consultarExercicios} type="button" className="btn btn-primary">Consultar Exercícios</button>

                            <br />
                            <br />
                            <FormGroup htmlFor="inputGruposMusculares" label="Grupos Musculares: *">
                                <SelectMenu id="inputGruposMusculares" className="form-control" lista={gruposMusculares} onChange={e => this.setState({grupoMuscular: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text" 
                                        id="inputNome"
                                        className="form-control" 
                                        name="nome"
                                        placeholder="Ex.: Exercício Teste" 
                                        onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Dica: *" htmlFor="inputDica">
                                <input type="text" 
                                        id="inputDica" 
                                        className="form-control" 
                                        name="dica" 
                                        placeholder="Ex.: Descer até angulo de 90º" 
                                        onChange={e => this.setState({dica: e.target.value})} />
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

export default withRouter( CadastroExercicios )