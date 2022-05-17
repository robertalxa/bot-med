const util = require('../../repo/Util');

module.exports = class InfoMed {
    progresso;
    enderecoTemporario;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta,
            this.resposta1
        ],
        this.enderecoTemporario = {}
    }

    responde(mensagem, usuario){
        return this.listaFuncoes[this.progresso](mensagem, usuario);
    }

    resposta(mensagem, usuario){
        return[['Bem Vindo ao estágio de infoMed'], 1];
    }

    resposta1(mensagem, usuario){
        return[['Bem Vindo ao estágio de infoMed resposta1'], 1];
    }
}