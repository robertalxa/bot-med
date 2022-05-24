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
            this.consultaDetalhesMedicamento,
            this.exibirListaCategorias
        ],
        this.enderecoTemporario = {}
    }

    textoMenu = '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior';
    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        return[['*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior'], 1];
    }

    respostaMenu(mensagem, usuario, venomInstance){
        const numerosTranscritos = {
            'um': 1,
            'dois': 2,
            'tres': 3,
            'quatro': 4,
            'voltar' : 'voltar'
        }
        const msgEscolha = mensagem.body.trim().toLowerCase();
        let escolha = parseInt(msgEscolha);
        if(isNaN(escolha)){
            escolha = numerosTranscritos[msgEscolha];
            if(!escolha) return [['Opção inválida, envie um *número de 1 a 4*'], 1];
        }

        switch(escolha){
            case 1: return [['Opção *1* selecionada.\nPor favor envie o nome do medicamento que deseja consultar a disponibilidade'], 2];
            case 2: this[3](mensagem, usuario, venomInstance); return [[], 1];
            case 3: return [['Opção *3* selecionada.\nPor favor envie o nome do medicamento que deseja consultar os detalhes'], 4];
            case 4: this[5](mensagem, usuario, venomInstance); return [[], 1];
            case 'voltar': return [['Voltando...'], 'MenuPrincipal'];
            default: return [['Opção inválida, envie um *número de 1 a 4*'], 1];
        }
    }

    inicioFluxoDisponibilidade(mensagem, usuario, venomInstance){
        const texto = mensagem.body.trim().toUpperCase();
        axios.get('http://localhost:3000/remedios/' + texto)
        .then(res=>{
            const listaMeds = res.data;
            if(listaMeds.length < 1){
                venomInstance.sendText(usuario.telefone, 'Me desculpa, eu não encontrei nada com esse nome 😔\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior')
                return;
            }

            let conteudoMsg = 'Isso foi o que eu encontrei:\n\n';

            let contMed = 1;
            listaMeds.forEach(med=>{
                let estadosMed = '';
                for(let est of med.estados){
                    estadosMed += ` - ${est.nome}`;
                }
                
                let descFarmacias = '*Farmácias onde está disponível*:';
                let contFarm = 1;
                for(let farm of med.farmacias){
                    descFarmacias += `${contFarm} - ${farm.nome} ${farm.endereco}\n`;
                    contFarm++;
                }
                conteudoMsg += `${contMed} - *${med.nome.trim()}*\n*Categoria*: ${med.categorias.nome}\n*Disponível nos estados*: ${estadosMed}\n${contFarm > 1 ? `${descFarmacias}` : '\n😔*Infelizmente este medicamento não está disponível em nenhuma drogaria cadastrada em nosso sistema*' }\n\n`;
                contMed++;
            });

            let resps = [conteudoMsg + '\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 1];
    }
    
    exibirListaMedicamentos(mensagem, usuario, venomInstance){
        axios.get('http://localhost:3000/remedios')
        .then(res=>{
            const listaMeds = res.data;
            let conteudoMsg = 'Lista de medicamentos subsidiados pelo Governo:\n\n';

            let contMed = 1;
            listaMeds.forEach(med=>{
                let estadosMed = '';
                for(let est of med.estados){
                    estadosMed += ` - ${est.nome}`;
                }
                conteudoMsg += `${contMed} - *${med.nome.trim()}*\nGrupo: ${med.categorias.nome.trim()}\nDisponível nos estados ${estadosMed}\n\n`;
                contMed++;
            });

            let resps = [conteudoMsg + '\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })
        //Aqui vai a lista de medicamentos\n\n ${this[3](mensagem, usuario, venomInstance)}`, '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior
        return;
    }

    consultaDetalhesMedicamento(mensagem, usuario, venomInstance){
        //Pegar o nome do medicamento
        const texto = mensagem.body.trim().toUpperCase();
        axios.get('http://localhost:3000/remedios/' + texto)
        .then(res=>{
            const listaMeds = res.data;
            if(listaMeds.length < 1){
                venomInstance.sendText(usuario.telefone, 'Me desculpa, eu não encontrei nada com esse nome 😔\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior')
                return;
            }

            let conteudoMsg = 'Isso foi o que eu encontrei:\n\n';

            let contMed = 1;
            listaMeds.forEach(med=>{
                let estadosMed = '';
                for(let est of med.estados){
                    estadosMed += ` - ${est.nome}`;
                }
                conteudoMsg += `${contMed} - *${med.nome.trim()}*\n*Categoria*: ${med.categorias.nome}\n*Descrição*: ${med.descricao.trim()}\n*Dosagem*: ${med.dosagem}\n*Disponível nos estados*: ${estadosMed}\n\n`;
                contMed++;
            });

            let resps = [conteudoMsg + '\n\n*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 1];
    }

    exibirListaCategorias(mensagem, usuario, venomInstance){
        const texto = mensagem.body.trim().toUpperCase();
        axios.get('http://localhost:3000/categorias')
        .then(res=>{
            const listaCats = res.data;

            let conteudoMsg = '';
            for(let cat of listaCats) conteudoMsg += `*${cat.nome}*:\n${cat.descricao}\n\n`;

            let resps = [conteudoMsg + '*INFORMAÇÕES SOBRE MEDICAMENTOS* 💊\n\nEscolha uma opção enviando o seu *número*:\n1️⃣ - Verificar disponibilidade de medicamento\n2️⃣ - Ver lista de medicamentos que o governo disponibiliza\n3️⃣ - Ver detalhes de um medicamento (descrição, categoria etc.)\n4️⃣ - Consultar tipos de medicamento\nou *VOLTAR* para voltar ao menu anterior'];
            resps.forEach(async (resp)=>{
                await venomInstance.sendText(usuario.telefone, resp);
            });

        })
        .catch(err=>{
            venomInstance.sendText(usuario.telefone, '😥 Ocorreu um erro no processamento da sua resposta 😖');
        })

        return [[], 1];
    }

}