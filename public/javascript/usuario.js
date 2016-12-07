function start(){
    var user = firebase.auth().currentUser;

    var foto;
    firebase.storage().ref().child('usuarios/' + user.uid + '/foto').getDownloadURL().then(function(url){
        foto = url;
        document.getElementById("preview-foto").src = foto;
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
            console.log("Impossivel excluir arquivos.");
        });

        user.delete().then(function() {
            window.location.assign("index.html");
        }, function(error) {
            console.log("Não foi possivel deletar o usuário.");
        });
    };

    formUsuario.onsubmit = function(evt){
        
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
    };
};