$(document).ready(function(){
    var socket = io('http://localhost:7777');
    socket.on('conexion', function (data) {
        console.log(data);
    });
    socket.on('http', function(data){
        var cadena = data.datos.split("\n");
        var host = cadena[1];
        host.replace('Host: ',"");
        if (!$('.host:contains("'+host+'")').length){
            $('.panel-host .cont-info').prepend("<div class='host'>"+host+"</div>");
        }
        $('.panel-http .cont-info').prepend("<p>"+cadena[0]+"</p>");
    });
    socket.on('tcp', function(data){
        $('.panel-tcp .cont-info').prepend("<p>"+data.datos+"</p>");
    });
    socket.on('paquete', function(data){
        $('.panel-paquetes .cont-info').prepend("<p>"+data.datos+"</p>");
    });
    socket.on('ips', function(data){
        $('.panel-ips .cont-info').prepend("<p>"+data.datos+"</p>");
    });
    socket.on('sistema', function(data){
    });
    socket.on('disconnect', function(){
        console.log("Me he desconectado.");
    });
    socket.on('error', function(){
        console.log("No puedo conectarme.");
    });
});