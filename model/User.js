const axios = require('axios');
const StageMenuPrincipal = require('./estagios/MenuPrincipal');

module.exports = class User {
    _id;
    apelido;
    nome;
    telefone;
    endereco;
    estagio;
    lembretes;

    constructor (nome = '', telefone = '', endereco = {}, apelido = '', lembretes = []){
        this.apelido = apelido;
        this.estagio = new StageMenuPrincipal();
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.lembretes = lembretes;
    }

    setId(id){
        this._id = id;
    }

    darApelido(novoValor){
        this.apelido = novoValor;
        this.atualizarUserBanco();
    }

    setEndereco(novoEnd = {}){
        this.endereco = novoEnd;
        this.atualizarUserBanco();
    }

    atualizarUserBanco(){
        axios
        .put(`http://localhost:3000/usuarios/${this._id}`, this)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.error(error);
        });
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