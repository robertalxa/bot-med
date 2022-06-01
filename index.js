const venom = require('venom-bot');
const User = require('./model/User');
const axios = require('axios');

const numsPermitidos = [
    '5511941422161@c.us',
    '5511945206557@c.us',
    '5511983252522@c.us',
    '5511985619621@c.us'
]
//'5511999173197@c.us'

let listaUsuarios = [];
let listaUsuariosBanco = [];

function acionaBot(){
    for(user of listaUsuariosBanco){
        let newUser = new User(user.nome, user.telefone, user.endereco, user.apelido, user.lembretes);
        newUser.setId(user._id);
        listaUsuarios.push(newUser);
    }

    venom
        .create({
            session: 'remedinho',
            disableWelcome: true
        })
        .then((client) => iniciaInteracao(client))
        .catch(err=> console.error(err));
}

function iniciaInteracao(clientInstance){
    clientInstance.onMessage(message=>{
        if(numsPermitidos.indexOf(message.from) === -1) return;
        let usuario = verificaExistenciaUser(message, clientInstance);
        responder(clientInstance, message, usuario);
    });
    verificaLembretes(clientInstance);
}

function verificaLembretes(clientInstance){
    //Loop para notificar sobre os lembretes cadastrados
    setInterval(()=>{
        for(let cliente of listaUsuarios){
            for(lembrete of cliente.lembretes){
                const msgLembrete = `🚨 Tenho um lembrete pra você! 🚨\n\n*${lembrete.descricao.toUpperCase()}*\n\n_caso queira desativar esse lembrete, acesse a opção 7 do menu principal_`;
                clientInstance.sendText(cliente.telefone, msgLembrete);
            }
        }
    },15000);
}

async function responder(clientInstance, mensagem, usuario){
    const respostas = usuario.responder(mensagem, clientInstance);
    for(resposta of respostas){
        await clientInstance.sendText(usuario.telefone, resposta);
    }
    
    /*let timeBetween = 1000;
    for(resposta of respostas){
        setTimeout(()=>clientInstance.sendText(usuario.telefone, resposta), timeBetween);
        timeBetween += 1000;
    }
    //Timer não funciona para forçar o atraso entre as mensagens */
}

function verificaExistenciaUser(objMessage = ''){
    const telefone = objMessage.from;
    if(telefone === '') return false;

    let usuarioExistente = listaUsuarios.filter(usuario=> {return usuario.telefone === telefone})[0];
    if(usuarioExistente) return usuarioExistente;

    usuarioExistente = new User(objMessage.sender.name, telefone, {}, '', []);
    salvaUserLocal(usuarioExistente);
    salvaUserBanco(usuarioExistente);
    return usuarioExistente;
}

function buscaListaUsuarios(){
    const axios = require('axios');

    axios
    .get('http://localhost:3000/usuarios')
    .then(res => {
        listaUsuariosBanco = res.data;
        acionaBot();
    })
    .catch(error => {
        console.error(error);
    });
}

function salvaUserLocal(user){
    listaUsuarios.push(user);
}

function salvaUserBanco(user){
    axios
    .post('http://localhost:3000/usuarios', user)
    .then(res => {
        user.setId(res.data._id);
    })
    .catch(error => {
        console.error(error);
    });
}

buscaListaUsuarios();