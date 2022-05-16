const StageMenuPrincipal = require('./estagios/menu_principal');

module.exports = class User {
    apelido;
    nome;
    telefone;
    endereco;
    estagio;

    constructor (nome, telefone, endereco){
        this.apelido = '';
        this.estagio = new StageMenuPrincipal();
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    responder(mensagem = {}) {
        const[respostas, progredir] = this.estagio.responde(mensagem, this);
        this.estagio.progresso += progredir;
        return respostas;
    }

    logar(){
        console.log('entrou no logar');
    }

}