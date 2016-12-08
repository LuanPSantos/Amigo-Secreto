window.onload = function(){
    var auth = firebase.auth();
    
    var fotoUsuario = document.getElementById("foto-usuario");
    var formCadastro = document.getElementById("form-cadastro");

    formCadastro.onsubmit = function(e){
        e.preventDefault();
        e.stopPropagation();

        var emailUsuario = document.getElementById("email-usuario").value;
        var senhaUsuario = document.getElementById("senha-usuario").value; 

        auth.createUserWithEmailAndPassword(emailUsuario, senhaUsuario).catch(function(error){
            console.log(error);
        }).then(function(){
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    console.log("logado! " + user.uid);
                    salvarDados(user.uid);
                } else {
                    console.log("nao logado!");
                    window.location.assign("entrar.html");
                }
            });
        });
    }
};

function salvarDados(idUsuario){       
    var nomeUsuario     = document.getElementById("nome-usuario").value;
    var nascUsuario     = document.getElementById("nascimento-usuario").value;
    var camisetaUsuario = document.getElementById("camiseta-usuario").value;
    var calcaUsuario    = document.getElementById("calca-usuario").value;
    var sapatoUsuario   = document.getElementById("sapato-usuario").value;
    var sobreUsuario    = document.getElementById("sobre-usuario").value;
    var gostaUsuario    = [];    
    var naoGostaUsuario = []; 

    for(var i = 0; i < 3; i++){
        gostaUsuario[i]     = document.getElementsByClassName("gosta-usuario")[i].value;
        naoGostaUsuario[i]  = document.getElementsByClassName("nao-gosta-usuario")[i].value;
    }

    var dados = {
        'nome':nomeUsuario,
        'nascimento':nascUsuario,
        'camiseta':camisetaUsuario,
        'calca':calcaUsuario,
        'sapato':sapatoUsuario,
        'gosta':gostaUsuario,
        'naoGosta':naoGostaUsuario,
        'sobre':sobreUsuario
    };
    
    firebase.database().ref('usuarios/' + idUsuario).set(dados).then(function(){
          window.location.assign("usuario.html");     
    });
}
