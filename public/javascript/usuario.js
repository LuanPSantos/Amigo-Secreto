window.onload = function(){
    setTimeout(start,1000);

    var buttonExcluir = document.getElementById("button-excluir");
    var buttonSair = document.getElementById("button-sair");
    var formUsuario = document.getElementById("form-usuario");

    buttonSair.onclick = function(){
        firebase.auth().signOut();
        window.location.assign("index.html");
    };

    buttonExcluir.onclick = function(){
        var user = firebase.auth().currentUser;

        firebase.database().ref('usuarios/' + user.uid).remove();

        firebase.storage().ref().child('usuarios/' + user.uid + '/foto').delete().then(function(){
            console.log("Excluindo arquivos...");
        }).catch(function(error){
            console.log("Impossivel excluir arquivos." + error);
        });

        user.delete().then(function() {
            window.location.assign("index.html");
        }, function(error) {
            console.log("Não foi possivel deletar o usuário." + error);
        });
    };

    formUsuario.onsubmit = function(evt){
        evt.preventDefault();
        evt.stopPropagation();

        var emailUsuario    = document.getElementById("email-usuario").value;
        var senhaUsuario    = document.getElementById("senha-usuario").value;
        var nomeUsuario     = document.getElementById("nome-usuario").value;
        var fotoUsuario     = document.getElementById("preview-foto").src;
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

        var user = firebase.auth().currentUser;
        if(senhaUsuario.toString().length >= 6){
            user.updatePassword(senhaUsuario).then(function() {
            }, function(error) {
                console.log(error);
            }).then(function(){
                var credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, 
                    senhaUsuario
                );

                user.reauthenticate(credential).then(function() {
                    window.location.assign("usuario.html"); 
                }, function(error) {
                    console.log(error);
                });
            });
        }

        user.updateEmail(emailUsuario).then(function() {
        }, function(error) {
            console.log(error);
        });

        var dados = {
            'nome':nomeUsuario,
            'nascimento':nascUsuario,
            'camiseta':camisetaUsuario,
            'calca':calcaUsuario,
            'sapato':sapatoUsuario,
            'gosta':gostaUsuario,
            'naoGosta':naoGostaUsuario,
            'sobre':sobreUsuario,
            'foto':fotoUsuario
        };

        firebase.database().ref('usuarios/' + user.uid).set(dados);
    };

    document.getElementById("foto-usuario").addEventListener("change", salvarFoto, false);
};

function start(){
    var user = firebase.auth().currentUser;

    if(!user)
        window.location.assign("entrar.html");

    firebase.storage().ref().child('usuarios/' + user.uid + '/foto').getDownloadURL().then(function(url){
        //console.log("url " + url);
        document.getElementById("preview-foto").src = url;
    }).catch(function(error){
        document.getElementById("preview-foto").src = 'https://firebasestorage.googleapis.com/v0/b/amigo-secreto-1b91d.appspot.com/o/foto-padrao.png?alt=media&token=59b325d0-0cda-4e5c-8e6c-f4129ba92597';      
    });
    
    
    firebase.database().ref('usuarios/' + user.uid).once('value', function(snapshot){
        var dados = snapshot.val();

        document.getElementById("nome-usuario").value = dados.nome;
        document.getElementById("nascimento-usuario").value = dados.nascimento;
        document.getElementById("camiseta-usuario").value = dados.camiseta;
        document.getElementById("calca-usuario").value = dados.calca;
        document.getElementById("sapato-usuario").value = dados.sapato;
        document.getElementById("sobre-usuario").value = dados.sobre;
        document.getElementById("email-usuario").value = user.email;

        for(var i in dados.gosta){
            var t = document.getElementsByClassName("gosta-usuario")[i].value = dados.gosta[i];
        }
        for(var i in dados.naoGosta){
            var t = document.getElementsByClassName("nao-gosta-usuario")[i].value = dados.naoGosta[i];
        }            
    });
}

function salvarFoto(e){
    e.stopPropagation();
    e.preventDefault();

    var fotoUsuario = e.target.files[0];
    var idUsuario = firebase.auth().currentUser.uid;
    var storageRef = firebase.storage().ref();
    document.getElementById("button-salvar-alteracoes").disabled = true;
    document.getElementById("foto-usuario").disabled = true;

    var metaData = {
        'contentType': fotoUsuario.type
    };

    var uploadTask = storageRef.child('usuarios/'+ idUsuario + '/foto').put(fotoUsuario, metaData);
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        document.getElementById("barra-de-load").style.width = 'calc(' + progress + '% - 30px)';
    }, function(error) {
        console.error('Upload failed:', error);
    }, function() {
        document.getElementById("button-salvar-alteracoes").disabled = false;
        document.getElementById("foto-usuario").disabled = false;
        fotoUsuario = uploadTask.snapshot.metadata.downloadURLs[0];
        document.getElementById("preview-foto").src = fotoUsuario;            
    });
}