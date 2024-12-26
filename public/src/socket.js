let somewhere = localStorage.getItem("authToken");
let socket; // 서버 웹소켓 객체
console.log(somewhere);

  socket = io("http://localhost:8080", {
    query: {
      token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
    },
  });

  socket.on('response', (data) => {
    console.log(data);
  });
  
  socket.on('connection', (data) => {
    console.log('connection: ', data);
  
    if(data.message){
      console.log(data.message);
    }
  });

  const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
      token: somewhere,
      handlerId,
      payload,
    });
  };

  export { sendEvent };