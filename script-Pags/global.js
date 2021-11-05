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
    candidatos = []; // lista de Trabalhadores candidatados na vaga
}        

axios.get('http://localhost:3000/usuarios/1')
.then(response => console.log(response))

// ---------------------- tela-login ------------------------------





// --------------------- tela-cadastro ----------------------------




// ---------------------tela-inicial --------------------





// ------------------------tela-detalhe-vaga-recrutador --------------------




//------------------------tela-detalhe-vaga-trabalhador-candidatado---------------




// -----------------------tela-detalhe-vaga-trabalhador-nao-candidatado ------------------