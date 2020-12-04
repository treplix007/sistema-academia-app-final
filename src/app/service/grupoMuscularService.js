import ApiService from '../apiservice'

export default class GrupoMuscularService extends ApiService {

    constructor() {
        super('/api/grupoMuscular')
    }

    buscarTodos() {
        return this.get('')
    }
}