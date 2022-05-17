const StageMenuPrincipal = require('./estagios/MenuPrincipal');

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

    set apelido(novoValor){
        this.apelido = novoValor;
    }

    responder(mensagem = {}) {
        let[respostas, progredir] = this.estagio.responde(mensagem, this);
        if(typeof progredir === 'string') {
            //Trocando a pessoa de estágio
            this.estagio = new require(`./estagios/${progredir}`);
            this.responder(mensagem);
        }
        else this.estagio.progresso = progredir;
        return respostas;
    }

    logar(){
        console.log('entrou no logar');
    }

}