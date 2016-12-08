window.onload = function(){
    var dados = window.location.search.substring(1);
    console.log(dados);

    var search = window.location.search.substring(1);
    console.log(('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'));
}