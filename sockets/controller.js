const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl()



const socketController = (socket) => {
    
 
    // Se disparan cuando un nuevo cliente se conecta 

    socket.emit('ultimo-ticket', ticketControl.ultimo )
    socket.emit( 'estado-actual', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.tickets.length)




    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        // const id = 123456789;
        // callback( id );

        // socket.broadcast.emit('enviar-mensaje', payload );

        const siguiente = ticketControl.siguiente()
        callback( siguiente )
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
         

    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if ( !escritorio ){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket( escritorio )
        // TODO: Notificar cambio en los ultimos4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)


        if ( !ticket ){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket
            })
        }

    })

}



module.exports = {
    socketController
}

