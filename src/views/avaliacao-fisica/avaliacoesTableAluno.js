import React from 'react'
import { Chart } from "react-google-charts"

export default props => {

    const data = [
        [
            { type: 'number', label: 'id' },
            { type: 'number', label: 'peso' },
            { type: 'number', label: 'gordura corporal' }
        ],
    ];

    var i = 1

    const rows = props.avaliacoes.map( avaliacao => {

        data.push([i, avaliacao.desempenho.peso, avaliacao.desempenho.gorduraCorporal])
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
            chartType="AreaChart"
            loader={<div>Carregando gráfico</div>}
            data={data}
            options={{
            title:
            'Comparação Peso x Gordura',
            intervals: { style: 'sticks' },
            legend: 'none',
            hAxis: { title: 'Meses', titleTextStyle: { color: '#333' } },
            vAxis: { title: 'Pesos', titleTextStyle: { color: '#333' } },
            }}
        />
        </>
    )
}