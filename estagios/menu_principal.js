module.exports = class StageMenu {
    progresso;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta1,
            this.resposta2,
            this.resposta3
        ]
    }

    responde(mensagem, usuario){
        return this.listaFuncoes[this.progresso](mensagem, usuario);
    }

    resposta1(mensagem, usuario){
        if(usuario.apelido === ''){
            return [['Oi! Diz pra mim por favor como você prefere que eu te chame'], 1];
        }
        return [[`Fala ${usuario.apelido}!`, this.resposta2(mensagem, usuario)[0]], 1];
    }

    resposta2(mensagem, usuario){
        if(usuario.endereco === {}){
            return [[`${usuario.apelido}, nós ainda não sabemos em que região você está. Por favor nos envie o CEP do seu local`], 2];
        }

        return [[`Mensagem de confirmacao do endereço`], 3];
    }

    resposta3(mensagem, usuario){
        //capta o cep vindo da msg
        //após captar o CEP faz a requisicao para o viacep e salva o obj do endereco no endereco do usuario
        return [[`Mensagem de confirmacao do endereço`], 3];
    }

    resposta4(mensagem, usuario){
        //aguarda confirmacao do CEP
        //verifica se a pessoa confirmou ou nao
    }

}