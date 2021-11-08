// Insira o script de cada tela abaixo do comentário com o nome da tela.
class Usuario {
    id; //(automático json-server)
    tipo='';
    nome='';
    dataNascimento='';
    email='';
    senha='';
    primeiroEmprego=false;
    candidaturas = []; // lista de 
    
    constructor(tipo,nome,dataNascimento,email,senha,primeiroEmprego){
        this.tipo=tipo;
        this.nome=nome;
        this.dataNascimento=dataNascimento;
        this.email=email;
        this.senha=senha;
        this.primeiroEmprego=primeiroEmprego;
    }
}


class Candidatura {
    idVaga=0;
    idCandidato=0;
    reprovado=false; // true or false
    constructor(idVaga,idCandidato){
        this.idVaga = idVaga;
        this.idCandidato = idCandidato;
    }

}

class Vaga {
    id; //(automático json-server)
    titulo;
    remuneracao; // (salvar no formato: R$ 3.200,00)
    descricao;
    candidatos = []; // lista de Trabalhadores candidatados na vaga
    constructor(titulo,descricao,remuneracao){
        this.titulo = titulo,
        this.descricao = descricao,
        this.remuneracao = remuneracao
    }
}        



// ---------------------- tela-login ------------------------------


var usuarioLogado = {};
const erroServidor = "Erro de conexão. Contate o administrador do sistema.";
var erroLogin = document.getElementById('erro-login');

async function logar(){
    erroLogin.className = 'd-none';
    let email = document.getElementById('login-email').value;
    let senha = document.getElementById('login-senha').value;
    
    try{
        let response = await axios.get('http://localhost:3000/usuarios');
        let listaUsuarios = response.data;

        let usuario = listaUsuarios.find(u => u.email === email && u.senha===senha);
        if(usuario!==undefined){
            erroLogin.className = 'd-none';
            usuarioLogado = usuario;
            irPara('tela-login','tela-inicial');
            listarVagas();
            selecionarBotoes();
        } 
        else{
            erroLogin.className = 'text-danger';
            erroLogin.innerText = 'Usuário inexistente ou senha inválida.'
        }
          
    }
    catch(error){
        erroLogin.className = 'text-danger';
        erroLogin.innerText = erroServidor;
    }
}
async function esqueceuSenha(){
    erroLogin.className = 'd-none';
    let email = prompt('Insira seu email');
    try {
        let response = await axios.get('http://localhost:3000/usuarios');

        listaUsuarios = response.data;

        let mensagem = 'Não foi encontrado o usuário';

        if(listaUsuarios.length){
            listaUsuarios.forEach(u => {
                if(u.email===email){
                    mensagem = `Senha é: ${u.senha}`
                }
            })
        }

        alert(mensagem);        
    
    } 
    catch(error) {
    erroLogin.className='text-danger';
    erroLogin.innerText= erroServidor;
}    
}


// --------------------- tela-cadastro ----------------------------


const validarEmail = (emailDigitado) => {
    mensagemErro = 'cadastro-email-erro';
   
    let listaCaracteres = emailDigitado.split(''); // [...emailDigitado]
    let emailSplit = emailDigitado.split('@');
    let possuiArroba = emailSplit.length > 1;
    let dominioEmail = possuiArroba ? emailSplit[1] : '';
    let dominioEmailSplit = dominioEmail.split('.');
    let possuiPontosNoDominio = dominioEmailSplit.length > 1;
    let possuiCaracteresEntrePontos = dominioEmailSplit.every( d => d.length > 1 );
    let comecaComLetra = listaCaracteres.length ? listaCaracteres[0].toUpperCase() !== listaCaracteres[0].toLowerCase() : false;
    let ehValido = possuiArroba && possuiPontosNoDominio && possuiCaracteresEntrePontos && comecaComLetra;

    // para setar o texto de erro em vermelho
    let erroEmail = document.getElementById(mensagemErro);
    erroEmail.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

    return ehValido;
}

const validarSenha = (senhaDigitada) => {
    let mensagemErro = 'cadastro-senha-erro';
    let listaCaracteres = senhaDigitada.split('');

    let letras = listaCaracteres.filter( char => char.toLowerCase() !== char.toUpperCase() );

    let possuiLetraMaiuscula = letras.some( l => l.toUpperCase() === l ); // "A".toUppercase() === "A"
    let possuiLetraMinuscula = letras.some( l => l.toLowerCase() === l );

    let possuiCharEspecial = listaCaracteres.some( char => char.toLowerCase() === char.toUpperCase() && isNaN(parseInt(char)) );
    let possuiNumero = listaCaracteres.some( char => char.toLowerCase() === char.toUpperCase() && !isNaN(parseInt(char)) );

    let possuiOitoCaracteres = senhaDigitada.length >= 8;

    let naoPossuiEspacos = !senhaDigitada.includes(' ');

    let ehValido = possuiOitoCaracteres && possuiLetraMaiuscula && possuiLetraMinuscula && 
        possuiCharEspecial && possuiNumero && naoPossuiEspacos;

    // para setar o texto de erro em vermelho
    let erroSenha = document.getElementById(mensagemErro);
    erroSenha.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

    return ehValido;
}

const validarNome = (nomeDigitado) => {
    let mensagemErro = 'cadastro-nome-erro';
    let nomeSemEspaco = nomeDigitado.replaceAll(' ','');
    let ehValido = [...nomeSemEspaco].every(char => (char.toUpperCase() !==char.toLowerCase())===true);
   
    let erroNome = document.getElementById(mensagemErro);
    erroNome.setAttribute('class', ehValido ? 'd-none' : 'text-danger');
    
    return ehValido;

}

const validarData = (dataDigitada) => { 
    let inputData = document.getElementById('dataNascimento');
    //let dataDigitada = inputData.value;
    let mensagemErro = 'cadastro-data-erro';
   
    adicionarMascaraData(inputData, dataDigitada);

    let dataConvertida = moment(dataDigitada, 'DDMMYYYY');
    let dezoitoAnosAtras = moment().diff(dataConvertida, 'years') >= 18;

    // comparações de data - date1.isBefore(date2)  /  date1.isAfter(date2)  /  date1.isSameOrBefore(date2)  /  date1.isSameOrAfter(date2)
    let dataAnteriorHoje = dataConvertida.isBefore(moment());

    let ehValido = dataConvertida.isValid() && dataAnteriorHoje && dezoitoAnosAtras && dataDigitada.length === 10; // 10/05/2001

    // para setar o texto de erro em vermelho
    let erroData = document.getElementById(mensagemErro);
    erroData.setAttribute('class', ehValido ? 'd-none' : 'text-danger');

    return ehValido;
}

const adicionarMascaraData = (input, data) => {
    let listaCaracteres = [...data];
    // [ '1', '0', '0', '5' ]
    
    if(listaCaracteres && listaCaracteres.length) {
        let dataDigitada = listaCaracteres.filter(c => !isNaN(parseInt(c))).reduce((a, b) => a + b);
        // 10052
        const { length } = dataDigitada;

        switch(length) { 
            case 0: case 1: case 2:
                input.value = dataDigitada; 
                break;
            case 3: case 4:
                input.value = `${dataDigitada.substr(0, 2)}/${dataDigitada.substr(2, 2)}`; // 10/05
                break;
            default:
                input.value = `${dataDigitada.substr(0, 2)}/${dataDigitada.substr(2, 2)}/${dataDigitada.substr(4, 4)}`;
        }
    }
}

const validarTipo = () =>{
    let selectUsuario = document.getElementById('tipoUsuario');
	let tipo = selectUsuario.options[selectUsuario.selectedIndex].value;
    if(tipo.length) return true;
    return false;
}

const verificarCadastroUsuario = () => {
    let selectUsuario = document.getElementById('tipoUsuario');
	let tipo = selectUsuario.options[selectUsuario.selectedIndex].value;
	console.log('select é: ',tipo);

    let nome = document.getElementById('nomeCompleto').value;
    let dataNascimento = document.getElementById('dataNascimento').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    let feedback = document.getElementById('cadastro-usuario-feedback');
    feedback.className='d-none';

    let primeiroEmprego = document.getElementById('primeiroEmprego').checked;
    console.log('primeiro emprego',primeiroEmprego)

    if(validarTipo(tipo) && validarNome(nome)&& validarData(dataNascimento) && validarEmail(email) && validarSenha(senha)){
        console.log('cadastro usário correto');
        cadastrarUsuario(new Usuario(tipo,nome,dataNascimento,email,senha,primeiroEmprego));
    }
    else{
        feedback.innerText = 'Não foi possível cadastrar este usuário. Verifique os campos acima.';
        feedback.className = 'text-danger text-center';
    }

}

async function cadastrarUsuario(usuario){
    let feedback = document.getElementById('cadastro-usuario-feedback');
    feedback.className = 'd-none';
    try {
        await axios.post('http://localhost:3000/usuarios',usuario)
        feedback.innerText = 'Usuário cadastrado com sucesso';
        feedback.className = 'text-success text-center';
        await setTimeout(()=>{
            feedback.className = 'd-none';
            let inputNome = document.getElementById('nomeCompleto');
            let inputData = document.getElementById('dataNascimento');
            let inputEmail = document.getElementById('email');
            let inputSenha = document.getElementById('senha');

            document.getElementById('primeiroEmprego').checked=false;
            document.getElementById('tipoUsuario').querySelector('option').selected=true;
            resetarCampos(inputNome,inputData,inputEmail,inputSenha);
            
        },1000)
    } 
    catch(error) {
    feedback.className = 'text-danger';
    feedback.innerText = erroServidor;
}    
}

const resetarCampos = (...campos) => {
    console.log('campos são',campos)
    campos.forEach(c => c.value = '');
}
// ---------------------tela-inicial --------------------

const irPara = (origem, destino) => {
    let elementoOrigem = document.getElementById(origem);
    let elementoDestino = document.getElementById(destino);
    elementoDestino.className = elementoDestino.className.replace('d-none', 'd-flex');
    elementoOrigem.className = elementoOrigem.className.replace('d-flex', 'd-none');
}




let listaVagas=[];

const listarVagas = async () => {
    
    let vagas = document.getElementById('lista-vagas'); 
    while (vagas.firstChild) {
        vagas.removeChild(vagas.lastChild);
      };

    try {
        let response = await axios.get('http://localhost:3000/vagas');
        if(response.data.length){
            listaVagas = response.data;
        }
        else{
            listaVagas[0] = response.data
        }
        
    }
    catch(error) {
        console.log(error);
    }    

    if(listaVagas.length){
        let ul = document.getElementById('lista-vagas');
        listaVagas.forEach(v => {
           ul.appendChild(criarElementoVaga(v));

        })
    }   
}

function criarElementoVaga(vaga){
    let li = document.createElement('li');
    li.className = 'd-flex justify-content-between p-2 border border-2 border-dark mb-3';
    li.id =`vaga-${vaga.id}`;

    let divTitulo = document.createElement('div');
    divTitulo.className = 'd-flex mr-5';
    let spanTitulo1 = document.createElement('span');
    spanTitulo1.className = 'font-weight-bold pr-1';
    spanTitulo1.innerText='Título:';
    let spanTitulo2 = document.createElement('span');
    spanTitulo2.innerText = vaga.titulo;
    divTitulo.appendChild(spanTitulo1);
    divTitulo.appendChild(spanTitulo2);


    let divRemuneracao = document.createElement('div');
    divRemuneracao.className = 'd-flex ms-auto';
    let spanRemuneracao1 = document.createElement('span');
    spanRemuneracao1.className = 'font-weight-bold pr-1';
    spanRemuneracao1.innerText="Remuneração:"
    let spanRemuneracao2 = document.createElement('span');
    spanRemuneracao2.innerText=vaga.remuneracao;
    divRemuneracao.appendChild(spanRemuneracao1);
    divRemuneracao.appendChild(spanRemuneracao2);

    li.appendChild(divTitulo);
    li.appendChild(divRemuneracao);
    li.addEventListener('click',chamarDetalhamentoDeVaga)
   

    return li;   
}

function chamarDetalhamentoDeVaga(){
    let id = arguments[0].srcElement.id;
    if(!id.length){
        id=arguments[0].srcElement.parentElement.parentElement.id;
    }

    id = id.split('-')[1];
    if(usuarioLogado.tipo==='trabalhador'){
        irPara('tela-inicial','tela-detalhe-vaga-trabalhador');
        colocarElementosDetalheVagaTrabalhador(id);
    }
    else{
        irPara('tela-inicial','tela-detalhe-vaga-recrutador');
        colocarElementosDetalheVagaRecrutador(id);
    }
    
}


let classeTrabalhador = document.getElementById('btn-trabalhador');
let classeRecrutador = document.getElementById('btn-recrutador');

function selecionarBotoes(){

    if(usuarioLogado.tipo==='trabalhador'){
        // tela trabalhador
        classeTrabalhador.className = classeTrabalhador.className.replace('d-none','d-flex');
        classeRecrutador.className = classeRecrutador.className.replace('d-flex','d-none');
    
    }
    else{
        // tela recrutador
        classeTrabalhador.className = classeTrabalhador.className.replace('d-flex','d-none');
        classeRecrutador.className = classeRecrutador.className.replace('d-none','d-flex');
    
    }
}


//-------------tela-cadastro-vaga---------------
let erroTitulo = document.getElementById('titulo-error');
let erroDescricaco = document.getElementById('descricao-error');
let erroRemuneracao = document.getElementById('remuneracao-error');

function inserirRemuneracao(valor){
    let remuneracaoValida = false;
    if(validarRemuneracao(valor)){
        remuneracaoValida=true;
    }
    
   erroRemuneracao.setAttribute('class', remuneracaoValida ? 'd-none' : 'text-danger');
   return remuneracaoValida;
}

function validarRemuneracao(string){
    let apenasNumeros = [...string].every( char => char.toLowerCase() === char.toUpperCase() && !isNaN(parseInt(char)));
    if(!apenasNumeros) return apenasNumeros;

    let maiorQueZero = parseInt(string) > 0;
    return maiorQueZero;
}

function inserirTitulo(valor){
    let tituloValido = false;
    if(valor.length && valor!==' ') tituloValido = true;
    
    erroTitulo.setAttribute('class', tituloValido ? 'd-none' : 'text-danger');
   return tituloValido;  
}

function inserirDescricao(valor){
    let descricaoValida = false;
    if(valor.length && valor!==' ') descricaoValida = true;
    
    erroDescricaco.setAttribute('class', descricaoValida ? 'd-none' : 'text-danger');
   return descricaoValida;

}

function verificarCadastroVaga(){
    let titulo = document.getElementById('cadastro-vaga-input-titulo').value;
    let descricao = document.getElementById('cadastro-vaga-input-descricao').value;
    let remuneracao = document.getElementById('cadastro-vaga-input-remuneracao').value;

    let feedback = document.getElementById('cadastro-vaga-feedback');
    feedback.className='d-none';
       
        
    
    if(inserirTitulo(titulo)&& inserirDescricao(descricao) && inserirRemuneracao(remuneracao)){
        console.log('cadastro apto');
        cadastrarVaga(new Vaga(titulo,descricao,formatarRemuneracao(remuneracao)));
    }
    else{
        feedback.innerText = 'Não foi possível cadastrar esta vaga. Verifique os campos acima.';
        feedback.className = 'text-danger text-center';
    }
}

function formatarRemuneracao(numero){
   // numero tem que ser recebido como string
    numero = [...numero].map(n => n = parseInt(n,10));
    numero.reverse();
    let novoArray = [];
    for(i=numero.length-1; i>=0;i--){
        novoArray.push(numero[i]);
        if(i>0 && i%3===0){
            novoArray.push('.');
        }
    }

    return `R$ ${novoArray.join('')},00`

}

async function cadastrarVaga(vaga){
    let feedback = document.getElementById('cadastro-vaga-feedback');
    await axios.post('http://localhost:3000/vagas',vaga)
   try {
        await axios.get('http://localhost:3000/vagas',vaga);
        feedback.innerText = 'Vaga cadastrada com sucesso';
        feedback.className = 'text-success text-center';
        await setTimeout(()=>{
            feedback.className = 'd-none';
           
            irPara('tela-cadastro-vaga','tela-inicial');
            listarVagas();
        },1000)
    } 
    catch(error) {
    feedback.className = 'text-danger';
    feedback.innerText = erroServidor;
}    
}
// ------------------------tela-detalhe-vaga-recrutador --------------------

const  colocarElementosDetalheVagaTrabalhador = (id) => {
    
    let titulo = document.getElementById('titulo-detalhe-vaga2');
    let descricao = document.getElementById('descricao-detalhe-vaga2');
    let remuneracao = document.getElementById('remuneracao-detalhe-vaga2');
    let idDaDiv = Number.parseInt(id);
    let botaoCandidatar = document.getElementById('candidatar');
    let botaoCancelarCandidatura = document.getElementById('cancelarCandidatura');
    let ehCandidato = usuarioLogado.candidaturas.find(candidaturas => candidaturas.idVaga===Number(id))!==undefined;
    
    if(ehCandidato){
        botaoCandidatar.className = 'd-none';
        botaoCancelarCandidatura.className = 'btn btn-dark';
        let candidaturas = usuarioLogado.candidaturas.find(c => c.idVaga===Number(id))
        if(candidaturas.reprovado){
            botaoCancelarCandidatura.setAttribute('disabled','disabled');
            // fazer função para colocar nome em vermelho;

        }
    }
    else{
        botaoCandidatar.className = 'btn btn-dark';
        botaoCancelarCandidatura.className = 'd-none';
    }

   

    let ulAMudarTrabalhador = document.getElementById('ulCandidatos2');

    listaVagas.forEach(e => {
        if(idDaDiv === e.id){
            document.getElementById('vaga-trabalhador').querySelector('div').id=`vaga-${id}`;
            titulo.innerText = e.titulo;
            descricao.innerText = e.descricao;
            remuneracao.innerText = e.remuneracao;
            e.candidatos.forEach(e => {
                criarElementoCandidato(e, ulAMudarTrabalhador);
            })
        }
    });
}

async function candidatar(){
    let id = document.getElementById('vaga-trabalhador').querySelector('div').id.split('-')[1];
    let candidatura = new Candidatura(Number(id),usuarioLogado.id);

    try{
        let responseGetUsuario = await axios.get(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
        let dadosGetUsuario = responseGetUsuario.data;
        dadosGetUsuario.candidaturas.push(candidatura);
        await axios.put(`http://localhost:3000/usuarios/${usuarioLogado.id}`,dadosGetUsuario);

        let responseGetVaga = await axios.get(`http://localhost:3000/vagas/${id}`);
        let dadosGetVaga = responseGetVaga.data;
        dadosGetVaga.candidatos.push(usuarioLogado);
        console.log('dadosGetVaga',dadosGetVaga);
        console.log('id da vaga é',id)
        await axios.put(`http://localhost:3000/vagas/${id}`,dadosGetVaga);
       
        irPara('tela-detalhe-vaga-trabalhador','tela-inicial');
        listarVagas();
    }
    catch(error){
        console.log('erro: ',error)
    }
}

async function cancelarCandidatura(){
    let id = document.getElementById('vaga-trabalhador').querySelector('div').id.split('-')[1];
    // retirar candidatura do objeto usuarioLogado
    usuarioLogado.candidaturas = usuarioLogado.candidaturas.filter(c => c.idVaga !==id);
    await axios.put(`http://localhost:3000/usuarios/${usuarioLogado.id}`,usuarioLogado);

    let responseGetVaga = await axios.get(`http://localhost:3000/vagas/${id}`);
    let dadosGetVagas = responseGetVaga.data;
    dadosGetVagas.candidatos = dadosGetVagas.candidatos.filter(c => c.id !== usuarioLogado.id);

    await axios.put(`http://localhost:3000/vagas/${id}`,dadosGetVagas);
    irPara('tela-detalhe-vaga-trabalhador','tela-inicial');
    listarVagas();
}

const colocarElementosDetalheVagaRecrutador = (id) => {
    let titulo = document.getElementById('titulo-detalhe-vaga');
    let descricao = document.getElementById('descricao-detalhe-vaga');
    let remuneracao = document.getElementById('remuneracao-detalhe-vaga');
    let idDaDiv = Number.parseInt(id);

    let colaboradores = document.getElementById('ulCandidatos') 
    while (colaboradores.firstChild) {
        colaboradores.removeChild(colaboradores.lastChild);
      };

    let ulAMudarRecrutador = document.getElementById('ulCandidatos');

    listaVagas.forEach(e => {
        if(idDaDiv === e.id){
            document.getElementById('vaga-id').querySelector('div').id=`vaga-${e.id}`;
            titulo.innerText = e.titulo;
            descricao.innerText = e.descricao;
            remuneracao.innerText = e.remuneracao;
            e.candidatos.forEach(e => {
                criarElementoCandidato(e, ulAMudarRecrutador);
            })
        }
    });
}

const excluirVaga = () => {
    let id =  document.getElementById('vaga-id').querySelector('div').id.split('-')[1];
    //console.log('id para excluir vaga é: ', id)
    try{
        axios.delete(`http://localhost:3000/vagas/${id}`);
        irPara('tela-detalhe-vaga-recrutador','tela-inicial');
        listarVagas();
    }
    catch(error){
        console.log('erro ao deletar vaga:',error);
    }

}

const criarElementoCandidato = (candidato, ulAMudar) => {
    let idDaVaga = Number(document.getElementById('vaga-id').querySelector('div').id.split('-')[1]);
    console.log('id da vaga é: ',idDaVaga)
    let liElemento = document.createElement('li');
    liElemento.className = "list-group-item";
    liElemento.id = `candidato-${candidato.id}`;

    let divRow = document.createElement('div');
    divRow.className = 'row d-flex align-items-center';
    let divCol1 = document.createElement('div');
    divCol1.className = "col-6";
    let divCol2 = document.createElement('div');
    divCol2.className = "col-6 d-flex justify-content-between align-items-center";
    
    let spanNome = document.createElement('span');
    spanNome.innerText = candidato.nome;
    
    liElemento.id = `candidato-${candidato.id}`;
 
    let spanDataNascimento = document.createElement('span');
    spanDataNascimento.innerText = candidato.dataNascimento;
    
    let button = document.createElement('button');
    button.className = "btn btn-dark bg-danger border-0";
    button.name = "btn-reprovar";
    button.id = `candidato-${candidato.id}`;

    let reprovado = candidato.candidaturas.find(c => c.idVaga === idDaVaga);
    console.log('reprovado é:' ,reprovado)
    if(reprovado!==undefined && reprovado.reprovado){
        button.setAttribute('disabled','disabled');
        button.className = 'btn btn-secondary';
    }
    else{
        button.innerText = 'Reprovar';
        button.addEventListener('click',()=> reprovar(button.id,button));
    }
    
   
    
    ulAMudar.appendChild(liElemento);
    liElemento.appendChild(divRow);
    divRow.appendChild(divCol1);
    divRow.appendChild(divCol2);
    divCol1.appendChild(spanNome);
    divCol2.appendChild(spanDataNascimento);
    divCol2.appendChild(button);

}

const reprovar = async (id,button)=>{
    console.log('clicado no reprovar',id);
    id = id.split('-')[1];
    let idDaVaga = Number(document.getElementById('vaga-id').querySelector('div').id.split('-')[1]);
    console.log('idDaVaga',idDaVaga);

    // alterar no usuário candidaturas -- Inserir o try

    let responseGetUsuario = await axios.get(`http://localhost:3000/usuarios/${id}`);
    let getUsuarioDados = responseGetUsuario.data;
    let candidaturaAReprovar = getUsuarioDados.candidaturas.find(c => c.idVaga===idDaVaga);
    candidaturaAReprovar.reprovado = true;
    await axios.put(`http://localhost:3000/usuarios/${id}`,getUsuarioDados);
    button.setAttribute('disabled','disabled');
    button.className = 'btn btn-secondary';

}

//------------------------tela-detalhe-vaga-trabalhador-candidatado---------------




// -----------------------tela-detalhe-vaga-trabalhador-nao-candidatado ------------------


// Fazer função para remover os botoes da lista de candidados de cada vaga, dependendo do tipo de 
// usuario (usuario.tipo), se ele for trabalhador dai vc removerar os botoes. as 3 ultimas paginas do
// figma mostra oq tem que acontecer.

