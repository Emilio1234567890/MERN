const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config();
connectDB();
const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send("API is runnig suces ")
})

app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(5000, console.log(`Server is listen on PORT ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {

    console.log('connect to socket io');
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log('user joined room: ' + room);
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

    });
})