const axios = require('axios');

module.exports = class ProgramasGov {
    progresso;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta,
            this.buscaPerguntaEscolhida
        ]
    }

    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        const texto = mensagem.body.trim().toUpperCase();
        axios.get('http://localhost:3000/perguntas')
        .then(res=>{
            const listaPgs = res.data;
            const numEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '6️⃣'];

            let cont = 0;
            let conteudoMsg = 'Escolha uma opção enviando o seu *número*:\n\n';
            for(let pg of listaPgs){
                conteudoMsg += `${numEmoji[cont]} - *${pg.titulo}*\n`;
                cont++;
            }

            conteudoMsg += 'ou *VOLTAR* para voltar ao menu anterior';

            let resps = [conteudoMsg];
            setTimeout(()=>{
                resps.forEach(async (resp)=>{
                    await venomInstance.sendText(usuario.telefone, resp);
                });
            },2000);
        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 1];
    }

    buscaPerguntaEscolhida(mensagem, usuario, venomInstance){
        const texto = mensagem.body.trim().toUpperCase();
        if(texto === 'VOLTAR') return [[], 'MenuPrincipal'];

        const numerosTranscritos = {
            'um': 1,
            'dois': 2,
            'tres': 3
        };
        let escolha = parseInt(texto);
        if(isNaN(escolha)){
            escolha = numerosTranscritos[texto];
            if(!escolha) return [['⚠️ Opção inválida! Envie um número de 1 a 3'], 1];
        }

        axios.get('http://localhost:3000/perguntas')
        .then(async (res)=>{
            const listaPgs = res.data;

            escolha -= 1;
            if(listaPgs[escolha]){
                const escolhida = listaPgs[escolha];
                let conteudoMsg = `*${escolhida.titulo}*\n\n`;
                for(let duvida of escolhida.duvidas) conteudoMsg += `*${duvida.titulo.trim()}*\n${duvida.descricao.trim()}\n\n`;
                let resps = [conteudoMsg, this[0](mensagem, usuario, venomInstance)[0][0]];
                resps.forEach(async (resp)=>{
                    if(resp) await venomInstance.sendText(usuario.telefone, resp);
                });
            }else{
                let resps = ['⚠️ Opção inválida! Envie um número de 1 a 3', this[0](mensagem, usuario, venomInstance)[0][0]];
                resps.forEach(async (resp)=>{
                    if(resp) await venomInstance.sendText(usuario.telefone, resp);
                });
            }

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 1];
    }

}