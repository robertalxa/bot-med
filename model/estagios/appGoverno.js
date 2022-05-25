module.exports = class AppGoverno {
    progresso;

    constructor (usuario){
        this.progresso = 0;
        this.listaFuncoes = [
            this.resposta
        ];
    }

    responde(mensagem, usuario, venomInstance){
        return this.listaFuncoes[this.progresso](mensagem, usuario, venomInstance);
    }

    resposta(mensagem, usuario, venomInstance){
        const msgRetorno = `Você já conhece o aplicativo *Remédio Agora* do Governo do Estado do São Paulo?\n\nDisponível nas plataformas:\nGoogle Play (Android): https://play.google.com/store/apps/details?id=br.com.duosystem.remedioagora\nApp Store (iPhone): https://apps.apple.com/br/app/remedio-agora/id1494969030\n\nCom ele você consegue agendar o melhor dia e horário para a sua retirada (respeitando as regras do Estado), gerando comodidade e diminuição do tempo de espera dentro da farmácia.\n\nSe tiver um imprevisto, com o aplicativo também é possível cancelar o agendamento, em apenas alguns "cliques".\n\nAo chegar na Farmácia no dia e horário de agendamento, basta informar a sua chegada pelo aplicativo, ou pelo Totem, que você receberá a sua senha e será direcionado para o setor correspondente.\n\nPara aproveitar as facilidades do “Remédio Agora”, é preciso ter um Recibo de Dispensação, além de seus dados pessoais.\n\nPara mais informações acesse: http://solucoes.prodesp.sp.gov.br/remedio-agora/.`;
        venomInstance.sendText(usuario.telefone, msgRetorno);
        return [[], 'MenuPrincipal'];
    }

}