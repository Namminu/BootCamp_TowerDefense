export class Base {
	constructor(x, y, maxHp,  baseImages) {
		// 생성자 안에서 기지의 속성을 정의한다고 생각하시면 됩니다!
		this.x = x; // 기지 이미지 x 좌표
		this.y = y; // 기지 이미지 y 좌표
		this.width = 220; // 기지 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
		this.height = 225; // 기지 이미지 세로 길이
		this.hp = maxHp; // 기지의 현재 HP
		this.maxHp = maxHp; // 기지의 최대 HP
		this.lastHealTime = 0; // 기지 자동 회복 주기 설정
		this.baseImages = baseImages;
	}

	getCurrentImage() {
		const hpRatio = this.hp / this.maxHp; // 체력 비율 계산

		if (hpRatio > 0.75) return this.baseImages[0]; // 75% 이상
		else if (hpRatio > 0.5) return this.baseImages[1]; // 50% ~ 75%
		else if (hpRatio > 0.25) return this.baseImages[2]; // 25% ~ 50%
		else return this.baseImages[3]; // 25% 이하
	}

	draw(ctx) {

		const baseImage = this.getCurrentImage();

		ctx.drawImage(
			baseImage,
			this.x - this.width / 4,
			this.y - this.height / 2,
			this.width,
			this.height,
		);

		ctx.font = '16px Arial';
		ctx.fillStyle = 'white';
		ctx.fillText(
			`HP: ${this.hp}/${this.maxHp}`,
			this.x - this.width / 4,
			this.y - this.height / 2 - 10,
		);
	}

	takeDamage(amount) {
		// 기지가 데미지를 입는 메소드입니다.
		// 몬스터가 기지의 HP를 감소시키고, HP가 0 이하가 되면 게임 오버 처리를 해요!
		this.hp -= amount;
		return this.hp <= 0; // 기지의 HP가 0 이하이면 true, 아니면 false
	}

	selfHeal(currentTime) {
		// 1초마다 로직 실행
		if (currentTime - this.lastHealTime < 1000) return;
		this.lastHealTime = currentTime; // 현재 시간을 저장

		if (this.hp >= this.maxHp) return;
		this.hp = Math.floor(this.hp + this.maxHp * 0.02);
		if (this.hp >= this.maxHp) this.hp = this.maxHp;
	}

	getCurrentHp() {
		return this.hp;
	}
}
