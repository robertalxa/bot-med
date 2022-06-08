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
        const msgRetorno = `O *Remedinho* 🤖 é um bot do WhatsApp criado com a finalidade de auxiliar pessoas a encontrar informações sobre programas de distribuição, medicamentos subsidiados pelo governo e documentação necessária para sua retirada.\n\nPara saber mais sobre o projeto, acesse: https://remedmais.netlify.app/`;
        venomInstance.sendText(usuario.telefone, msgRetorno);
        return [[], 'MenuPrincipal'];
    }

}