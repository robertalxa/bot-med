const fs = require('fs');
const textoArqCeps = fs.readFileSync(__dirname + '\\ceps.txt', 'utf-8');
const linhasArqCeps = textoArqCeps.split('\n');

function validaCEP(cep){
    const myReg = /\d{5}(-)?\d{3}/g;
    if(myReg.exec(cep)) return true;
    return false;
}

function validaRespostaPositiva(texto){
    texto = texto.toLowerCase();
    const regexPositiva = /'sim'|'s'|'ok'|'ss'/g;
    if(regexPositiva.match(texto)) return true;
    return false;
}

function buscaCepNoTxt(cep){
    endereco = undefined;
    cep = cep.replace('-','');
    for(linha of linhasArqCeps){
        const dadosLinha = linha.split('\t');
        if(dadosLinha[0] === cep){
            endereco = {
                cep: cep,
                rua: dadosLinha[3],
                bairro: dadosLinha[2],
                cidadeEstado: dadosLinha[1]
            };
            return endereco;
        }
    }
}

module.exports = {
    validaCEP: validaCEP,
    buscaCepNoTxt: buscaCepNoTxt
}