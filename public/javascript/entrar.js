window.onload = function(){

    var formEntrar   = document.getElementById("form-entrar");
    var buttonEntrar = document.getElementById("button-entrar");

    formEntrar.onsubmit = function(evt){
        evt.preventDefault();
        evt.stopPropagation();

        var emailUsuario = document.getElementById("email-usuario").value;
        var senhaUsuario = document.getElementById("senha-usuario").value;

        firebase.auth().signInWithEmailAndPassword(emailUsuario, senhaUsuario).catch(function(error) {
            
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Codigo: " + errorCode + " - Mensagem: " + errorMessage);
        }).then(function(){
            window.location.assign("usuario.html");
        });
    };
};