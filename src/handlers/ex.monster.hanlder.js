let spawnTimer = null;
let spawnInterval = null;

//먼저 stage에 접근을 해서 stage마다의 생성 주기에 접근?
export const monsterCreate = (socket, userId, payload) => {
  console.log("getMonsterCreateHandler", payload);

  const { duration, timestamp } = payload;
  const now = Date.now();
  const timeSinceLastSpawn = now - timestamp;

   // 기존 타이머가 있을 경우 제거
   if (spawnTimer) clearTimeout(spawnTimer);
   if (spawnInterval) clearInterval(spawnInterval);

  // 다음 몬스터 생성까지 남은 시간 계산
  const nextSpawnIn = Math.max(0, duration - timeSinceLastSpawn);

  //확인을 위한 setTimeout과 setInterval 사용중 확인이 끝나면 함수 변경예정
  setTimeout(() => {
    socket.emit("spawnMonster", { message: "몬스터 생성하세요!" });
  }, nextSpawnIn);

  // 이후 주기적으로 몬스터 생성 이벤트 전송
  setInterval(() => {
    socket.emit("spawnMonster", { message: "몬스터 생성하세요!" });
  }, duration);

  return { status: 'success', message: `monster Create`};
};
