/**
 * @fileoverview Script para lanzar el servidor de nodejs con node_pcap y usando como medio socket.io
 *
 * @author Gosh_
 * @version 0.1
 */

/**
 * Nota importante: para la ejecución del script es necesario que se ejecute con privilegios de root, ya que
 * la libreria node_pcap necesita poner la tarjeta en modo promiscuo.
 */


/* Inicializacion de variables de entorno */
var pcap = require("pcap");
var util = require('util');
var pcap_session = pcap.createSession("", "tcp");
var dns_cache    = pcap.dns_cache;
var tcp_tracker  = new pcap.TCP_tracker();
var matcher = /safari/i;
var app = require('http').createServer();
var io = require('socket.io')(app);
var inspect = require('sys').inspect;

console.log("Escuchando interfaz: " + pcap_session.device_name);

/* Definido el puerto 7777 por default para la transmision. */
app.listen(7777);

/* Inicio de la comunicacion con socket.io */
io.on('connection', function (socket) {
    socket.emit('conexion', { estado: 'conectado' });
    socket.on('inicio_servicios', function (data) {
        console.log(data);
    });

    tcp_tracker.on('start', function (session) {
        socket.emit('tcp', { datos: "Inicio de sesion TCP entre " + session.src_name + " y " + session.dst_name });
    });

    tcp_tracker.on('end', function (session) {
        socket.emit('tcp', { datos: "Fin de sesion TCP entre " + session.src_name + " y " + session.dst_name });
    });

    pcap_session.on('packet', function (raw_packet) {
        var packet = pcap.decode.packet(raw_packet),
            data = packet.link.ip.tcp.data,
            ips = packet.link.ip.saddr+'>'+packet.link.ip.daddr;

        tcp_tracker.track_packet(packet);

        socket.emit('sistema', { datos: packet });
        socket.emit('ips', { datos: ips });

        if (data && matcher.test(data.toString())) {
            socket.emit('http', { datos: data.toString() });
        }
        socket.emit('paquete', { datos: pcap.print.packet(packet) });

    });

});