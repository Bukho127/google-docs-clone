
const io = require('socket.io')(3001, {
   cors:{
      origin: '*',
      methods:['GET', 'POST']
   }
})

console.log("Socket.IO server running on port 3001")

io.engine.on('connection_error', err => {
    console.log('connection error:', err.message)
})

io.on('connection', socket =>{
    console.log("connected")

    socket.on("send-changes", delta=>{
        socket.broadcast.emit("receive-changes", delta)
    })
})
