// 몬스터 데이터 asssets/monster.json 파일에서 가져오기
// 현재 하드코딩 되어 있는 부분들 (이동 속도, 공격력, 체력 등) 변경

export class Monster {
	constructor(path, level, monsterConfig) {
		// 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
		if (!path || path.length <= 0) {
			throw new Error('몬스터가 이동할 경로가 필요합니다.');
		}

		this.monsterNumber = Math.floor(Math.random() * monsterConfig.length); // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)

		// monster.json 데이터 가져오기
		const monsterData = monsterConfig[this.monsterNumber];

		this.id = monsterData.id;
		this.name = monsterData.name;

		this.path = path; // 몬스터가 이동할 경로
		this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
		this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
		this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
		this.width = monsterData.width; // 몬스터 이미지 가로 길이
		this.height = monsterData.height; // 몬스터 이미지 세로 길이
		this.level = level; // 몬스터 레벨

		// monster.json 데이터 기반으로 초기화
		this.maxHp = monsterData.hp + level * 20;
		this.hp = this.maxHp;
		this.attackPower = monsterData.damage + level * 20;
		this.speed = monsterData.speed;
		this.gold = monsterData.gold;
		this.isDead = false; // 몬스터가 죽었는지 여부
		this.isEnd = false; // 몬스터가 기지에 도착했는지 여부

		this.damageTexts = []; // 데미지 텍스트 배열

		// 유니크 ID 생성 (라운드번호_몬스터번호_타임스탬프)
		this.uniqueId = `${level}_${this.monsterNumber}_${Date.now()}`;

		// 생성 시간 기록
		this.createdAt = Date.now();

		// 애니메이션 관련
		this.imageSet = monsterData.imageSet;
		this.currentFrame = 0;
		this.isHit = false;
		this.hitDuration = 0;
		this.animationSpeed = 0.05; // 프레임 전환 속도

		// 방향 상태
		// true면 왼쪽, false면 오른쪽
		this.isFlipped = false;
	}

	move(base) {
		if (this.currentIndex < this.path.length - 1) {
			const nextPoint = this.path[this.currentIndex + 1];
			const deltaX = nextPoint.x - this.x;
			const deltaY = nextPoint.y - this.y;
			// 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); //리겜시 눈에 띄게 작아짐. 3판째부터 2마리씩 겹침.
			console.log("distance",distance);

			// 이동 방향에 따라 이미지 방향 설정
			this.isFlipped = deltaX < 0; // x 좌표가 감소하면 왼쪽으로 이동

			if (distance < this.speed) {
				// 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
				this.currentIndex++;
			} else {
				// 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
				this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
				this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
			}
			return false;
		} else {
			// 이부분에서 몬스터가 베이스에 도착을 했을 때 데미지를 주는 부분 이부분에서 deathSheet에 killBase를 넣어서 확인
			const isDestroyed = base.takeDamage(this.attackPower); // 기지에 도달하면 기지에 데미지를 입힙니다!
			this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
			this.isEnd = true; // 몬스터가 기지에 도착했음을 표시
			return isDestroyed;
		}
	}

	draw(ctx) {
		let currentImage = new Image();

		if (this.isHit && this.hitDuration > 0) {
			// 피격 상태일 때
			currentImage.src = this.imageSet.hit;
			this.hitDuration--;
			if (this.hitDuration <= 0) {
				this.isHit = false;
			}
		} else {
			// 일반 상태일 때 (idle 애니메이션)
			const frameIndex = Math.floor(this.currentFrame) % this.imageSet.idle.length;
			currentImage.src = this.imageSet.idle[frameIndex];
			this.currentFrame += this.animationSpeed;
		}

		// 이미지 반전을 위한 설정
		ctx.save(); // 현재 컨텍스트 상태 저장

		if (this.isFlipped) {
			// 왼쪽을 볼 때 이미지 반전
			ctx.translate(this.x + this.width, this.y);
			ctx.scale(-1, 1);
			ctx.drawImage(currentImage, 0, 0, this.width, this.height);
		} else {
			// 오른쪽을 볼 때 정상 방향
			ctx.drawImage(currentImage, this.x, this.y, this.width, this.height);
		}

		ctx.restore(); // 컨텍스트 상태 복원

		// 배경 그리기
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(this.x - 2, this.y - 20, 100, 20);

		// HP 텍스트 그리기
		ctx.font = '12px Arial';
		ctx.fillStyle = 'white';
		ctx.fillText(
			`Lv. ${this.level} ${Math.floor(this.hp)}/${Math.floor(this.maxHp)}`,
			this.x + 5,
			this.y - 5,
		);

		// 데미지 텍스트 그리기
		const currentTime = performance.now();
		this.damageTexts = this.damageTexts.filter((text) => {
			const elapsed = currentTime - text.createdAt;
			if (elapsed > 2000) return false;

			// 오프셋 위치 업데이트 (위로 올라가는 효과)
			text.offsetY -= 0.5;
			text.opacity = 1 - elapsed / 2000;

			// 몬스터의 현재 위치 + 오프셋으로 실제 표시 위치 계산
			const textX = this.x + text.offsetX;
			const textY = this.y + text.offsetY;

			// 텍스트 그리기
			ctx.font = 'bold 20px Arial';
			ctx.fillStyle = `rgba(255, 0, 0, ${text.opacity})`;
			ctx.fillText(`${text.value}`, textX, textY);

			return true;
		});
	}

	dead() {
		this.isDead = true; // 몬스터를 죽음 상태로 표시
	}

	// 피격 효과를 위한 메서드
	onHit() {
		this.isHit = true;
		this.hitDuration = 50; // 피격 지속 시간 (프레임 수)
	}

	addDamageText(damage) {
		this.onHit();

		this.damageTexts.push({
			value: damage,
			offsetX: this.width / 2 - 15, // 몬스터 중앙에서의 X 오프셋
			offsetY: -20, // 몬스터 위쪽으로의 Y 오프셋
			opacity: 1,
			createdAt: performance.now(),
		});
	}
}
