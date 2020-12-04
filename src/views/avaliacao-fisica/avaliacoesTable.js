import React from 'react'
import { Chart } from "react-google-charts"
import Modal from '@material-ui/core/Modal'

export default props => {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const data = [
        ['dia', 'peso', 'gordura'],
        [0, 0, 0]
    ]

    var i = 1

    const rows = props.avaliacoes.map( avaliacao => {

        data.push([avaliacao.dataAvaliacao[2], parseInt(avaliacao.desempenho.peso), parseInt(avaliacao.desempenho.gorduraCorporal)])
        i = i + 1

        return (
            <tr key={avaliacao.id}>
                <td>{avaliacao.aluno.nome}</td>
                <td>{avaliacao.avaliador}</td>
                <td>{avaliacao.desempenho.altura}</td>
                <td>{avaliacao.desempenho.peso}</td>
                <td>{avaliacao.desempenho.gorduraCorporal}</td>
                <td>{avaliacao.dataAvaliacao[2]}/{avaliacao.dataAvaliacao[1]}/{avaliacao.dataAvaliacao[0]}</td>         
                <td>
                    <button type="button" 
                            className="btn btn-primary"
                            onClick={e => props.visualizar(avaliacao)}>
                                Visualizar
                    </button>
                    <button type="button" 
                            className="btn btn-danger" 
                            onClick={e => props.deletar(avaliacao.id)}>
                                Deletar
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Avaliador</th>
                    <th scope="col">Altura</th>
                    <th scope="col">Peso</th>
                    <th scope="col">Gordura Corporal</th>
                    <th scope="col">Data Avaliação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>

            <tbody>
                {rows}
            </tbody>
        </table>

        <Chart
        width="100%"
        height="600px"
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
            hAxis: {
                title: 'Gordura',
            },
            vAxis: {
                title: 'Peso',
            },
            series: {
                1: { curveType: 'function' },
            },
        }}
        rootProps={{ 'data-testid': '2' }}
        />
        </>
    )
}