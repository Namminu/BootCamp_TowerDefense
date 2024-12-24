import { getStage, setStage } from "../models/stage.model.js"

/*라운드 이동시. 라운드 생성하고,
 저장. 여기엔 시작시간, 시작라운드, 유저아이디, 
 현재골드(시작골드), 몬스터 잡은수 등 점수 검증이 필요할 거 같은게 추가된다.*/
 
 // sendEvent(11, payload : { currentRound, timestamp })
 export const moveRoundHandler = (userId, payload) => {
    // 라운드 검증. 유저의 현재 라운드와 currentRound 비교
    if(payload.currentRound){
        const currentRound = 0;
        if(currentRound!==payload.currentRound){
            return { status: 'fail', message: 'currnetStage mismatch'}
        }
    }else return { status: 'fail', message: 'no currnetStage for moveRound'}

    // 진행행시간 검증. 해당 라운드의 진행시간과 실제 진행시간의 오차 계산
    if(payload.timestamp){
        const roundStartTime = 0;
        const roundClearTime = payload.timestamp;
        const elapsedTime = (roundClearTime - roundStartTime)/1000;
        const roundTime = 0;
        if(elapsedTime<roundTime-10 || elapsedTime>roundTime+10){
            return { status: 'fail', message: 'currnetStage mismatch'};
        }
    }else return { status: 'fail', message: 'no timestamp for moveRound'}

    // 다음 라운드
    const nextRound = payload.currentRound + 1;
  
    // 다음 라운드드 정보를 담은 객체 생성
    let nextRoundInfo = {
        roundNum : nextRound,
        spawnTimer : 9-(nextRound/10),    // 소환 주기
        spawnCount : 9+nextRound,        // 소환될 몬스터 수
        timer : 100-nextRound,          // 라운드 진행시간
    }

    // 유저의 현재 라운드 정보 업데이트
    // setRound(); ### 선행작업 : round.model.js에 어떻게 저장할지
 
     // monster.json 에셋에서 다음 라운드에 해금되는 id인 몬스터들 저장 ### 선행작업 : monster_unlock.json 로드 먼저
     const { monsters } = getGameAssets();
     const unlockMonsters = monsters.data.find(mon => mon.round = nextRound); //[{ id:2 }];
     
    // 유저의 다음 라운드 정보 업데이트 + 다음 라운드 몬스터 해제
    //setRound(userId, nextRound, Date.now());
    return {
        handlerId: 11,
        status: 'success',
        nextRoundInfo,
        unlockMonsters,
    };
 };
 