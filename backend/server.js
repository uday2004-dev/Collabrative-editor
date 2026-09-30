import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
// import {YsockerIO} from "y-socket.io/dist/server"
import {  YSocketIO } from "y-socket.io/dist/server";


const app=express()

const httpServer=createServer(app)

const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

const ySocketIO=new YSocketIO(io)

ySocketIO.initialize()

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Hello world"
    })
})


httpServer.listen(3000,()=>{
    console.log("Server is running")
})