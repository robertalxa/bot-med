const util = require('../../repo/Util');

module.exports = class MenuPrincipal {
    progresso;
    enderecoTemporario;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta,
            this.resposta1,
            this.resposta2,
            this.resposta3,
            this.exibeMenu
        ],
        this.enderecoTemporario = {}
    }

    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        if(usuario.apelido === ''){
            return [['🤖 Olá eu sou o Remedinho 🤖\n\nMe diz por favor como você prefere que eu te chame.\n(_Responda somente com o nome_)'], 1];
        }
        const resultadoEndereco = this[1](mensagem, usuario, venomInstance);
        return [[`Olá eu sou o Remedinho 🤖\nBem vindo(a) novamente ${usuario.apelido}!\n\n${resultadoEndereco[0][0]}`], resultadoEndereco[1]];
    }

    resposta1(mensagem, usuario, venomInstance){
        if(usuario.apelido === '') usuario.darApelido(mensagem.body.trim());
        return this[3](mensagem, usuario, venomInstance);

        /*if(JSON.stringify(usuario.endereco) === '{}'){
            return [[`${usuario.apelido}, para prosseguir, por favor nos *envie o CEP* de onde se encontra.\n\n_Fique tranquilo, só utilizamos essa informação para poder te mostrar quais medicamentos estão disponíveis em sua região_`], 2];
        }
        
        const endereco = usuario.endereco;
        this.enderecoTemporario = endereco;
        const textoEndereco = `O seu endereço ainda é *${endereco.rua}, ${endereco.bairro} - ${endereco.cidadeEstado}*?\nResponda com: *Sim* ou *Não*`;
        return [[textoEndereco], 3];*/
    }

    resposta2(mensagem, usuario, venomInstance){
        const cepDigitado = mensagem.body.trim();
        const endereco = {};
        if(util.validaCEP(cepDigitado)){
            const enderecoRetornado = util.buscaCepNoTxt(cepDigitado);
            if(enderecoRetornado) {
                this.enderecoTemporario = enderecoRetornado;
                return [[`O seu endereço é *${this.enderecoTemporario.rua}, ${this.enderecoTemporario.bairro} - ${this.enderecoTemporario.cidadeEstado}*?`, `Responda com: *Sim* ou *Não*`], 3];
            }
            return [[`O cep digitado não foi encontrado, por favor, tente novamente!`], 2];
        }
        return [[`O cep que você digitou é inválido, por favor, tente novamente`], 2];
    }

    resposta3(mensagem, usuario, venomInstance){
        const textoMenu = 'Escolha uma opção do menu digitando o seu *número*:\n1️⃣ - Informações sobre *medicamentos* 💊\n2️⃣ - Quais *documentos* são necessários para a retirada de medicamentos  🪪\n3️⃣ - *Programas* (de distribuição) do governo ⛑️\n4️⃣ - *Top 10 perguntas* mais frequentes 🤔\n5️⃣ - Agendar *horário* em uma farmácia pública 🏥\n6️⃣ - Saber mais sobre o *Remedinho* 🤖\n7️⃣ - Meus *lembretes* ⏰';
        return [[`${textoMenu}`], 4];
        /*const msg = mensagem.body.toLowerCase().trim();
        if(msg === 'sim'){
            usuario.setEndereco(this.enderecoTemporario);
            return [[`Endereço confirmado!\n\n${textoMenu}`], 4];
        }else if(msg === 'nao'){
            return [['Por favor, digite novamente seu CEP.'], 2];
        }

        return [['Desculpe não entendi, responda com *Sim* ou *Não*'], 3];*/
    }

    exibeMenu(mensagem, usuario, venomInstance){
        const numerosTranscritos = {
            'um': 1,
            'dois': 2,
            'tres': 3,
            'quatro': 4,
            'cinco': 5,
            'seis': 6,
            'sete': 7
        }
        const msgEscolha = mensagem.body.trim().toLowerCase();
        let escolha = parseInt(msgEscolha);
        if(isNaN(escolha)){
            escolha = numerosTranscritos[msgEscolha];
            if(!escolha) return [['⚠️ Opção inválida! Envie um número de 1 a 7'], 4];
        }

        switch(escolha){
            case 1: return[['*Informações sobre medicamentos 💊*'], 'infoMed'];
            case 2: return[['*Quais documentos são necessários para a retirada de medicamentos  🪪*'], 'infoDoc'];
            case 3: return[['*Programas (de distribuição) do governo ⛑️*'], 'programasGov'];
            case 4: return[['*Top 10 perguntas mais frequentes 🤔*'], 'topPerguntas'];
            case 5: return[['*Marcar horário em uma farmácia pública 🏥*'], 'appGoverno'];
            case 6: return[['*Saber mais sobre o Remedinho 🤖*'], 'saberRemedinho'];
            case 7: return[['*Meus lembretes ⏰*'], 'lembretes'];
            default: return [['⚠️ Opção inválida! Envie um número de 1 a 7'], 4];
        }
    }

    retornaTextoMenu(){
        return `
        Escolha uma opção do menu:
        1 - Informações sobre medicamentos
        2 - Informações sobre documentação
        3 - Programas (de distribuição) do governo
        4 - Meus lembretes
        5 - Outras questões escritas (ou audio)
        `;
    }
}