const socket = io("http://localhost:3000");

let userId = null;
socket.on("connection", (data) => {
  console.log("connection", data);
  userId = data.userId;
});

socket.on("response", (data) => {
  console.log("response", data);
});

const sendEvent = (handlerId, payload) => {
  socket.emit("event", { userId, handlerId, payload });
};

export { sendEvent };
