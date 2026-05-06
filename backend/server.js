const mongoose = require('mongoose')
require('dotenv').config()
const Document = require('./document')

const io = require('socket.io')(3001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const defaultValue = " "

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err))

console.log("Socket.IO server running on port 3001")

io.engine.on('connection_error', err => {
    console.log('connection error:', err.message)
})

io.on('connection', socket => {
    console.log("connected", socket.id)

    socket.on("get-document", async documentId => {
        const document = await findOrCreate(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on('save-document', async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})


const findOrCreate = async (id) => {
    if (id === null) return

    const document = await Document.findById(id)

    if (document) return document

    return await Document.create({ _id: id, data: defaultValue })
}
