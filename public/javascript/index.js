window.onload = function(){

    var formPesquisar = document.getElementById("form-pesquisa");
    var resultado = [];

    formPesquisar.onsubmit = function(e){
        e.preventDefault();
        e.stopPropagation();

        var busca = document.getElementById("input-pesquisa").value;
        var busca = busca.toLowerCase();
        firebase.database().ref('/usuarios').once('value', function(snapshot){
            var usuarios = snapshot.val();

            for(var i in usuarios){
                var u = usuarios[i].nome.toString().toLowerCase();
                if(u.search(busca) != -1){
                    resultado.push(usuarios[i]);
                }else{
                    console.log("deu ruim");
                }
            }

            exibirResultados(resultado);
        });
    };
};

function exibirResultados(resultado){
    for(var i = 0; i < resultado.length; i++){
        var url = "perfil.html?" + $.param(resultado[i]);
        console.log(url);
        var html = 
        '<div class="resultado row">'+
            '<article class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1  box-shadow-personalizado">'+
            '<h3><a href="'+ url +'">'+ resultado[i].nome +'</a></h3>'+
            '</article>'+
        '</div>';
        $('#resultado').append(html);
    }
}