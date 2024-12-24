//먼저 stage에 접근을 해서 stage마다의 생성 주기에 접근?
export const monsterCreate = (payload) => {
  const { interval, timestamp } = payload;
  const now = Date.now();
  const timeSinceLastSpawn = now - timestamp;

  // 다음 몬스터 생성까지 남은 시간 계산
  const nextSpawnIn = Math.max(0, interval - timeSinceLastSpawn);

  setTimeout(() => {
    socket.emit("spawnMonster", { message: "몬스터 생성하세요!" });
  }, nextSpawnIn);

  // 이후 주기적으로 몬스터 생성 이벤트 전송
  setInterval(() => {
    socket.emit("spawnMonster", { message: "몬스터 생성하세요!" });
  }, interval);
};
