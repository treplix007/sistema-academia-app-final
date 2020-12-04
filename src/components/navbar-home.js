import React from 'react'

import NavbarItem from './navbarItem'

function NavbarHome() {

    return (
        <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
            <div className="container">
                <a href="#/home" className="navbar-brand">Minha Academia</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav">
                        <NavbarItem href="#/home" label="Home" />
                        <NavbarItem href="#/cadastro-alunos" label="Alunos" />
                        <NavbarItem href="#/cadastro-instrutores" label="Instrutores" />
                        <NavbarItem href="#/cadastro-avaliacoes" label="Avaliação Física" />
                        <NavbarItem href="#/cadastro-treinos" label="Treinos" />
                        <NavbarItem href="#/login" label="Logout" />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavbarHome