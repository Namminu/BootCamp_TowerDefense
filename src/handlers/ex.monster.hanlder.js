import { getStage } from "../models/round.model.js";

//먼저 stage에 접근을 해서 stage마다의 생성 주기에 접근?
export const monsterCreate = (uuid, payload) => {
    const { stages } = getStage();
    //여기서 stage에 접근해서 monster 생성 주기를 가져와야함.
    //monster 생성 주기를 가져와서 monster를 생성하는 함수를 만들어야함.
    //임시 데이터 사용 stages[0].duration
    if(payload.duration === stages[0].duration){
        
    }
}