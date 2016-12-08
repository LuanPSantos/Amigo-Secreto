window.onload = function(){
    var dados = window.location.search.substring(1);
    console.log(dados);
    console.log(('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'));
}