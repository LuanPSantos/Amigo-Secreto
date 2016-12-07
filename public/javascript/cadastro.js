window.onload = function(){
    var auth = firebase.auth();
    var storageRef = firebase.storage().ref();

    var formCadastro = document.getElementById("form-cadastro");
    var buttonCadastrar = document.getElementById("button-cadastrar");

    formCadastro.onsubmit = function(evt){
        evt.preventDefault();
        evt.stopPropagation();

        var emailUsuario    = document.getElementById("email-usuario").value;
        var senhaUsuario    = document.getElementById("senha-usuario").value;
        var fotoUsuario     = document.getElementById("foto-usuario").files[0];
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

        auth.createUserWithEmailAndPassword(emailUsuario, senhaUsuario).catch(function(error){
            console.log(error);
        }).then(function salvarFoto(){
            //Upload foto
            var idUsuario = firebase.auth().currentUser.uid;
            var metaData = {
                'contentType': fotoUsuario.type
            };
            var uploadTask = storageRef.child('usuarios/'+ idUsuario + '/foto').put(fotoUsuario, metaData);
            uploadTask.on('state_changed', null, function(error) {
                console.error('Upload failed:', error);
            }, function() {
                console.log('Uploaded',uploadTask.snapshot.totalBytes,'bytes.');
                console.log(uploadTask.snapshot.metadata);
                fotoUsuario = uploadTask.snapshot.metadata.downloadURLs[0];
                // document.getElementById("preview-foto").src = fotoUsuario;
                console.log('File available at', fotoUsuario);
                window.location.assign("usuario.html");               
            });
        }).then(function salvarDados(){
            var idUsuario = firebase.auth().currentUser.uid;

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
        });
    };
};
