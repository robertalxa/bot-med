module.exports = class SaberRemedinho {
    progresso;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta
        ]
    }

    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        const msgRetorno = `O *Remedinho* 🤖 é um bot do whatsapp criado com muito amor para o projeto principal da matéria de Laboratório de Software e Projetos\n\nPara saber mais acesse: https://remedmais.netlify.app/`;
        venomInstance.sendText(usuario.telefone, msgRetorno);
        return [[], 'MenuPrincipal'];
    }

}