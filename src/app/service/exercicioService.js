import ApiService from '../apiservice'

export default class ExercicioService extends ApiService {

    constructor() {
        super('/api/exercicios')
    }

    buscarTodos() {
        return this.get('')
    }

    salvar(exercicioDTO) {
        return this.post('', exercicioDTO)
    }

    consultarPorGrupoMuscular(grupoMuscular) {
        return this.get(`/${grupoMuscular}/grupoMuscular`)
    }

    consultarPorTreino(treino) {
        return this.get(`/${treino}/treino`)
    }

    deletar(id) {
        return this.delete(`/${id}`)
    }
}