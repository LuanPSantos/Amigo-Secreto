function salvarFoto(){
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
} 
function salvarDados(){
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
}