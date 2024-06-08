const {divide, bingoNumbersObject, suffleArray} = require('./bingoNumbers')
const {tracks} = require('./playlist.json')

const io = require('socket.io')(3000,{
    cors:{
        origin:["http://localhost:5173", "https://music-bingo.vercel.app/"],
        credentials: true
    }
})
// console.log(bingoNumbers(2,3,))
io.use((socket,next)=>{
    const token = socket.handshake.auth.token
    if(token==="authtoken"){
        socket.username = "user1"
        next()
    }else{
        next(new Error("please send token"))
    }
})


io.on("connection",socket=>{
    console.log((socket.id));

    socket.on('score',(data,room)=>{
        console.log(data,room)
        if(room!=='' ){
            io.in(room).emit('win',data,room)
        }
    })
    socket.on('join-room',room=>{
        // if(Array.from(io.sockets.sockets.keys()).includes(room)){
        if(room!==''){
            socket.join(room)
            console.log(`${socket.id} joined room:${room}`)
        }
    })
    socket.on('init-game',(room)=>{
        let game = {numbers:{},tracks:{initial:[],tracklist:[],played:[]},score:{line:null,bingo:null}}
        
        const players = socket.adapter.rooms.get(room)
        for (const p of players) {
            const numbersForPlayer = bingoNumbersObject(1,3)
            game.numbers[p] = numbersForPlayer
        }

        let id=0
        game.tracks.initial = tracks.map(t=>{
            id++
            return{id,...t.track, played:false}
        })
        game.tracks.tracklist = game.tracks.initial
        

        io.in(room).emit('game-initialized',game,room)

    })
    socket.on('next-song',(game,room)=>{
        console.log('next song', game)
        const nextSong = suffleArray(game.tracks.tracklist).pop()
        game.tracks.played.push(nextSong)
        io.in(room).emit('update-songs',game,nextSong)
    })
})
