import React from 'react'

export default props => {

    const rows = props.exercicios.map( exercicio => {
        return (
            <tr key={exercicio.id}>
                <td>{exercicio.nome}</td>
                <td>{exercicio.dica}</td>
                <td>
                    <button type="button" 
                            className="btn btn-primary"
                            onClick={e => props.editar(exercicio)}>
                                Editar
                    </button>
                    <button type="button" 
                            className="btn btn-danger" 
                            onClick={e => props.deletar(exercicio.id)}>
                                Deletar
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Dica</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>

            <tbody>
                {rows}
            </tbody>
        </table>
    )
}