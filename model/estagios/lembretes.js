module.exports = class Lembretes {
    progresso;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta,
            this.opcaoLembretes,
            this.opcaoAdicionarIntervalo,
            this.opcaoAdicionarDescricao,
            this.remocaoLembrete,
            this.captaLembreteEscolhido,
            this.removeLembreteCliente
        ]
    }

    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        let constroiMsg = '';

        if(usuario.lembretes.length > 0){
            constroiMsg += 'Esses são seus lembretes atuais:\n\n';
            let contLembrete = 1;
            for(let l of usuario.lembretes){
                constroiMsg += `${contLembrete} - *${l.descricao}* no intervalo de ${l.intervalo} horas\n`;
                contLembrete++;
            }
            constroiMsg += '\nEscolha uma opção:\n*CRIAR* para adiconar um novo lembrete\n*EXCLUIR* para remover um lembrete existente\n*VOLTAR* para voltar ao menu anterior';
        }else{
            constroiMsg += 'Você ainda não tem lembretes, deseja criar um agora?\n\n*CRIAR* para adiconar um novo lembrete\n*VOLTAR* para voltar ao menu anterior';
        }


        return [[constroiMsg], 1];
    }

    opcaoLembretes(mensagem, usuario, venomInstance){
        const escolha = mensagem.body.trim().toLowerCase();

        if(escolha === 'criar'){
            return[['Ok, vou adicionar um novo lembrete pra você!\nEnvie em quanto tempo você deseja ser notificado (_em horas, ex: *6*_)'],2];
        }

        if(escolha === 'excluir' && usuario.lembretes.length > 0){
            return[this[4](mensagem, usuario, venomInstance)[0],5];
        }

        if(escolha === 'voltar'){
            return [[], 'MenuPrincipal'];
        }

        return [['⚠️ Opção inválida!\nEscolha uma das opções apresentadas anteriormente!'], 1];
    }

    opcaoAdicionarIntervalo(mensagem, usuario, venomInstance){
        const escolha = parseInt(mensagem.body.trim().toLowerCase());
        if(!isNaN(escolha)){
            this.lembrete = {};
            this.lembrete.intervalo = escolha;
            return [['Certo, agora me envie a descrição do lembrete\n_ex: Tomar 1 comprimido de dipirona_'], 3];
        }

        return [['Desculpe, não consegui te entender 😔\nPor favor, envie o número de horas que deseja ser notificado'], 2];
    }

    opcaoAdicionarDescricao(mensagem, usuario, venomInstance){
        const escolha = mensagem.body.trim().toLowerCase();
        this.lembrete.descricao = escolha;
        usuario.lembretes.push(this.lembrete);
        return [[`😃 Perfeito! Vou te lembrar sobre *${this.lembrete.descricao}* de *${this.lembrete.intervalo} em ${this.lembrete.intervalo} horas*\n\n${this[0](mensagem, usuario, venomInstance)[0]}`], 1];
        //return [['Desculpe, não consegui de entender 😔.\nPor favor, tente novamente'], 2];
    }

    remocaoLembrete(mensagem, usuario, venomInstance){
        let mensagemRetorno = '⚠️ Envie o *número* do lembrete que deseja excluir de acordo com a lista acima ☝️\nOu *VOLTAR* para voltar ao menu anterior';
        return[[mensagemRetorno], 5];
    }

    captaLembreteEscolhido(mensagem, usuario, venomInstance){
        let escolha = parseInt(mensagem.body.trim().toLowerCase()) - 1;

        if(!isNaN(escolha) && escolha >= 0 && usuario.lembretes[escolha]){
            this.posLembreteExclusao = escolha;
            const lembrete = usuario.lembretes[escolha];
            return [[`Tem certeza que deseja excluir o lembrete *${lembrete.descricao}*?\nEnvie:\n*SIM* para confirmar\nOu *NÃO* para cancelar a operação`], 6];
        }

        if(mensagem.body.trim().toLowerCase() === 'voltar'){
            return [[this[0](mensagem, usuario, venomInstance)[0]], 1];
        }

        return [['⚠️Opção inválida!\nEnvie o *número* do lembrete que deseja excluir de acordo com a lista acima ☝️\nOu *VOLTAR* para voltar ao menu anterior'], 5];
    }

    removeLembreteCliente(mensagem, usuario, venomInstance){
        const escolha = mensagem.body.trim().toLowerCase();
        if(escolha === 'sim'){
            usuario.lembretes.splice(this.posLembreteExclusao, 1);
            return [[`Lembrete excluído com sucesso!\n\n${this[0](mensagem, usuario, venomInstance)[0]}`], 1];
        }
        if(escolha === 'não' || escolha === 'nao'){
            return [[`Tudo bem, operação cancelada!\n\n${this[0](mensagem, usuario, venomInstance)[0]}`], 1];
        }
        return [['⚠️Opção inválida! Envie:\n*SIM* ou *NÃO*'],6];
    }

}