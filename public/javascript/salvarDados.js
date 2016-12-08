window.onload = function(){
    var auth = firebase.auth();
    var storageRef = firebase.storage().ref();
    var formCadastro = document.getElementById("form-cadastro");
    var buttonCadastrar = document.getElementById("button-cadastrar");

    formCadastro.onsubmit = function(){
        auth.createUserWithEmailAndPassword(emailUsuario, senhaUsuario).catch(function(error){
            console.log(error);
        }).than(function(){
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    salvarFoto(user.uid);
                    salvarDados(user.uid);
                } else {
                    console.log("nao logado!");
                }
            }).then(function(){
                window.location.assign("usuario.html");
            },function(){
                window.location.assign("entrar.html");
            });
        });
    }
};

function salvarDados(idUsuario){
    var emailUsuario    = document.getElementById("email-usuario").value;
    var senhaUsuario    = document.getElementById("senha-usuario").value;        
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
        'email':emailUsuario,
        'nome':nomeUsuario,
        'nascimento':nascUsuario,
        'camiseta':camisetaUsuario,
        'calca':calcaUsuario,
        'sapato':sapatoUsuario,
        'gosta':gostaUsuario,
        'naoGosta':naoGostaUsuario,
        'sobre':sobreUsuario
    };

    firebase.database().ref('usuarios/' + idUsuario).set(dados);
}

function salvarFoto(idUsuario){
    var fotoUsuario = document.getElementById("foto-usuario").files[0];

    var metaData = {
        'contentType': fotoUsuario.type
    };

    var uploadTask = storageRef.child('usuarios/'+ idUsuario + '/foto').put(fotoUsuario, metaData);
    uploadTask.on('state_changed', null, function(error) {
        console.error('Upload failed:', error);
    }, function() {
        console.log("Upload realizado com sucesso!");
        fotoUsuario = uploadTask.snapshot.metadata.downloadURLs[0];               
    });
}