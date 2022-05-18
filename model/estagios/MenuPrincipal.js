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

    responde(mensagem, usuario){
        return this.listaFuncoes[this.progresso](mensagem, usuario);
    }

    resposta(mensagem, usuario){
        if(usuario.apelido === ''){
            return [['Oi! Diz pra mim por favor como você prefere que eu te chame'], 1];
        }
        const resultadoEndereco = this[1](mensagem, usuario);
        return [[`Olá ${usuario.apelido}!\n\n${resultadoEndereco[0][0]}`], resultadoEndereco[1]];
    }

    resposta1(mensagem, usuario){
        usuario.darApelido(mensagem.body.trim());
        if(JSON.stringify(usuario.endereco) === '{}'){
            return [[`${usuario.apelido}, para prosseguir, por favor nos envie o CEP de onde se encontra`], 2];
        }

        const endereco = `O seu endereço ainda é *${endereco.rua}, ${endereco.rua}*\n? Responda com: *Sim* ou *Não*`;
        return [[endereco], 3];
    }

    resposta2(mensagem, usuario){
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

    resposta3(mensagem, usuario){
        const textoMenu = `
        Escolha uma opção do menu:
        1 - Informações sobre medicamentos
        2 - Informações sobre documentação
        3 - Programas (de distribuição) do governo
        4 - Meus lembretes
        5 - Outras questões escritas (ou audio)
        `;
        const msg = mensagem.body.toLowerCase().trim();
        if(msg === 'sim'){
            usuario.setEndereco(this.enderecoTemporario);
            return [[`Endereço confirmado!\n\n${textoMenu}`], 4];
        }else if(msg === 'nao'){
            return [['Dgite novamente seu CEP.'], 2];
        }

        return [['Desculpe não entendi, responda com *Sim* ou *Não*'], 3];
    }

    exibeMenu(mensagem, usuario){
        let escolha = mensagem.body.trim();
        try{
            escolha = parseInt(escolha);
        }catch(ex){
            return [['Opção inválida, envie um número de 1 a 5'], 4];
        }

        switch(escolha){
            case 1: return[['Opção escolhida: *Informações sobre medicamentos*'], 'infoMed'];
            case 2: return[['Opção escolhida: *Informações sobre documentação*'], 'infoDoc'];
            case 3: return[['Opção escolhida: *Programas (de distribuição) do governo*'], 'programasGov'];
            case 4: return[['Opção escolhida: *Meus lembretes*'], 'lembretes'];
            case 5: return[['Opção escolhida: *Outras questões escritas (ou audio)*'], 'outrasQuest'];
            default: return [['Opção inválida, envie um número de 1 a 5'], 4];
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