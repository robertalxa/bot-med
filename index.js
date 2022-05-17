const venom = require('venom-bot');
const User = require('./model/User');

const numsPermitidos = [
    '5511941422161@c.us',
    '5511945206557@c.us',
    '5511983252522@c.us',
    '5511985619621@c.us'
]
//'5511999173197@c.us'

let listaUsuarios = [];

venom
    .create({
        session: 'remedinho',
        disableWelcome: true
    })
    .then((client) => iniciaInteracao(client))
    .catch(err=> console.error(err));

function iniciaInteracao(clientInstance){
    clientInstance.onMessage(message=>{
        if(numsPermitidos.indexOf(message.from) === -1) return;
        let usuario = verificaExistenciaUser(message, clientInstance);
        responder(clientInstance, message, usuario);
    });
}

function responder(clientInstance, mensagem, usuario){
    const respostas = usuario.responder(mensagem);
    for(resposta of respostas){
        clientInstance.sendText(usuario.telefone, resposta);
    }
}

function verificaExistenciaUser(objMessage = ''){
    const telefone = objMessage.from;
    if(telefone === '') return false;

    let usuarioExistente = listaUsuarios.filter(usuario=> {return usuario.telefone === telefone})[0];
    if(usuarioExistente) return usuarioExistente;

    usuarioExistente = new User(objMessage.sender.name, telefone, {});
    listaUsuarios.push(usuarioExistente);
    return usuarioExistente;
}