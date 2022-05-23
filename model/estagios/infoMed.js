const util = require('../../repo/Util');
const axios = require('axios');

module.exports = class InfoMed {
    progresso;
    enderecoTemporario;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta,
            this.respostaMenu,
            this.inicioFluxoDisponibilidade,
            this.exibirListaMedicamentos,
            this.consultaDetalhesMedicamento
        ],
        this.enderecoTemporario = {}
    }

    textoMenu = '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior';
    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        return[['*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior'], 1];
    }

    respostaMenu(mensagem, usuario, venomInstance){
        const numerosTranscritos = {
            'um': 1,
            'dois': 2,
            'tres': 3,
            'quatro': 4,
            'cinco': 5,
            'seis': 6,
            'voltar' : 'voltar'
        }
        const msgEscolha = mensagem.body.trim().toLowerCase();
        let escolha = parseInt(msgEscolha);
        if(isNaN(escolha)){
            escolha = numerosTranscritos[msgEscolha];
            if(!escolha) return [['Opção inválida, envie um *número de 1 a 3*'], 2];
        }

        switch(escolha){
            case 1: return [['Opção *1* selecionada.\nPor favor envie o nome do medicamento que deseja consultar a disponibilidade'], 2];
            case 2: this[3](mensagem, usuario, venomInstance); return [[], 1];
            case 3: return [['Opção *3* selecionada.\nPor favor envie o nome do medicamento que deseja consultar os detalhes'], 4];
            case 'voltar': return [['Voltando...'], 'MenuPrincipal'];
            default: return [['Opção inválida, envie um *número de 1 a 3*'], 2];
        }
    }

    inicioFluxoDisponibilidade(mensagem, usuario, venomInstance){
        
        //Capta nome ou código do medicamento e consulta no banco de dados e retorna resposta com medicamento ou não
    }

    
    exibirListaMedicamentos(mensagem, usuario, venomInstance){
        axios.get('http://localhost:3000/remedios')
        .then(res=>{
            debugger;
            const listaMeds = res.data;
            let conteudoMsg = 'Lista de medicamentos subsidiados pelo Governo:\n\n';

            let contMed = 1;
            listaMeds.forEach(med=>{
                conteudoMsg += `${contMed} - *${med.nome.trim()}* - Incluído em: \n`;
                contMed++;
            });

            let resps = [conteudoMsg, '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            debugger;
        })
        //Aqui vai a lista de medicamentos\n\n ${this[3](mensagem, usuario, venomInstance)}`, '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior
        return;
    }

    consultaDetalhesMedicamento(mensagem, usuario, venomInstance){
        //Pegar o nome do medicamento
        const texto = mensagem.body.trim();
        axios.get('http://localhost:3000/remedios?texto=' + texto)
        .then(res=>{
            debugger;
            const listaMeds = res.data;
            if(listaMeds.length < 1){
                venomInstance.sendText(usuario.telefone, 'Me desculpa, eu não encontrei nada com esse nome 😔\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior')
                return;
            }

            let conteudoMsg = 'Isso foi o que eu encontrei:\n\n';

            let contMed = 1;
            listaMeds.forEach(med=>{
                conteudoMsg += `${contMed} - *${med.nome.trim()}*\nDescrição: ${med.descricao.trim()}\n\n`;
                contMed++;
            });

            let resps = [conteudoMsg, '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            debugger;
        })

        return [[], 1];
    }

}