const axios = require('axios');

module.exports = class InfoDoc {
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
        const texto = mensagem.body.trim().toUpperCase();
        axios.get('http://localhost:3000/categorias')
        .then(res=>{
            const listaCats = res.data;

            let conteudoMsg = 'Os medicamentos são categorizados em três classes: *básicos*, *estratégicos* e *especializados*.\n\n';
            for(let cat of listaCats) conteudoMsg += `*${cat.nome}*:\n${cat.documentacao}\n\n`;
            
            conteudoMsg += '_Você pode saber mais sobre cada categoria acessando o menu 1 "Informações sobre medicamentos"_';

            let resps = [conteudoMsg];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 'MenuPrincipal'];
    }

}