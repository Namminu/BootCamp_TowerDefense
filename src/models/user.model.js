const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (socketId) => { 
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {//-1이면 없는거니까 뭐..
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};
