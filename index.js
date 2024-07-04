// SOCKET.IO EXAMPLE
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const port = 3000

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id)

  // Generate a random nickname
  const nickname = generateRandomNickname()

  // Broadcast the nickname to the connected user
  socket.emit("nickname", `Your nickname: ${nickname}`)

  // Broadcast a message to connected users when someone connects
  socket.broadcast.emit("user connected", `${nickname} has connected`)

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id)

    // Broadcast a message to connected users when someone disconnects
    io.emit("user disconnected", `${nickname} has disconnected`)
  })

  socket.on("chat message", (msg) => {
    console.log("message: " + msg)

    // Send the message to all other connected users along with the nickname
    socket.broadcast.emit("chat message", `${nickname}: ${msg}`)
  })
})

function generateRandomNickname() {
  const adjectives = ["Happy", "Sad", "Funny", "Crazy", "Brave"]
  const nouns = ["Cat", "Dog", "Bird", "Elephant", "Monkey"]

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${randomAdjective} ${randomNoun}`
}
