const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);

const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
    port : 587,
    host : 'smtp.gmail.com',
    auth : {
        user:'rajvardhansingh523@gamil.com'
        pass : 'dcfwvwteuagvmxfs'
},
    secure:true 
})
app.post('/send-mail',(req,res)=>{
    const to = req.body.to;
    const url = req.body.url;
    const mailData= {
        from:'rajvardhansingh523@gmail.com',
        to:to,
        subject:'Join video chat now...'
        html:`<p> Hi,come join me for video chat here-${url} </p>`
    }
    
})
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        io.to(roomId).emit('USER-CONNECTED',userId)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

server.listen(3030);
