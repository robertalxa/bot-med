const venom = require('venom-bot');
const User = require('./User');

const numsPermitidos = [
    '5511941422161@c.us',
    '5511945206557@c.us',
    '5511983252522@c.us'
];

let jaChamou = [];

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
        if(jaChamou.indexOf(message.from) > -1) return;

        jaChamou.push(message.from);
        let usuario = new User(message.sender.name, message.from, {});
        listenerUsuario(usuario, clientInstance);
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

function listenerUsuario(usuario, objCliente){
    objCliente.onMessage(message=>{
        if(message.from !== usuario.telefone) return;
        
        const respostas = usuario.responder(message);
        for(resposta of respostas){
            clientInstance.sendText(usuario.telefone, resposta);
        }
    })
}

function iniciaInteracao__old(clientInstance){
    clientInstance.onMessage(message=>{
        if(numsPermitidos.indexOf(message.from) === -1) return;
        const usuario = verificaExistenciaUser(message, clientInstance);
        responder(clientInstance, message, usuario);
    });
}

function verificaExistenciaUser__old(objMessage = ''){
    const telefone = objMessage.from;
    if(telefone === '') return false;

    let usuarioExistente = listaUsuarios.filter(usuario=> {return usuario.telefone === telefone})[0];
    if(usuarioExistente) return usuarioExistente;

    usuarioExistente = new User(objMessage.sender.name, telefone, {});
    listaUsuarios.push(usuarioExistente);
    return usuarioExistente;
}