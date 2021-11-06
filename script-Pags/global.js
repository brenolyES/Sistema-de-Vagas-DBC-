// Insira o script de cada tela abaixo do comentário com o nome da tela.
class Usuario {
    id; //(automático json-server)
    tipo;
    nome;
    dataNascimento;
    email;
    senha;
    primeiroEmprego;
    candidaturas = []; // lista de Candidatura
}


class Candidatura {
    idVaga;
    idCandidato;
    reprovado; // true or false
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





// --------------------- tela-cadastro ----------------------------




// ---------------------tela-inicial --------------------

const irPara = (origem, destino) => {
    let elementoOrigem = document.getElementById(origem);
    let elementoDestino = document.getElementById(destino);
    elementoDestino.className = elementoDestino.className.replace('d-none', 'd-flex');
    elementoOrigem.className = elementoOrigem.className.replace('d-flex', 'd-none');
}


var usuario = 'trabalhador';

let listaVagas=[];

const listarVagas = async () => {
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
    if(usuario==='trabalhador'){
        irPara('tela-cadastro-vaga','tela-detalhe-vaga-trabalhador');
        detalharVaga(id);

    }
    else{
        irPara('tela-cadastro-vaga','tela-detalhe-vaga-recrutador');
        detalharVaga(id);
    }
    
}

listarVagas();
if(usuario==='trabalhador'){
    // tela trabalhador
}
else{
    // tela recrutador
}


function detalharVaga(id){
    console.log("chamada detalhar vaga",id)
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
    console.log('valor na descrição',valor)
    let descricaoValida = false;
    if(valor.length && valor!==' ') descricaoValida = true;
    
    erroDescricaco.setAttribute('class', descricaoValida ? 'd-none' : 'text-danger');
   return descricaoValida;

}

function verificarCadastroVaga(){
    let titulo = document.getElementById('cadastro-vaga-input-titulo').value;
    let descricao = document.getElementById('cadastro-vaga-input-descricao').value;
    let remuneracao = document.getElementById('cadastro-vaga-input-remuneracao').value;

    if(inserirTitulo(titulo)&& inserirDescricao(descricao) && inserirRemuneracao(remuneracao)){
        console.log('cadastro apto')
        cadastrarVaga(new Vaga(titulo,descricao,remuneracao))
    }
    else{
        console.log('cadastro inapto')
    }
}

async function cadastrarVaga(vaga){
   await axios.post('http://localhost:3000/vagas',vaga)
   try {
    let response = await axios.get('http://localhost:3000/vagas',vaga);
        console.log('inserido',response)
    } 
    catch(error) {
    console.log(error);
}    
}
// ------------------------tela-detalhe-vaga-recrutador --------------------




//------------------------tela-detalhe-vaga-trabalhador-candidatado---------------




// -----------------------tela-detalhe-vaga-trabalhador-nao-candidatado ------------------