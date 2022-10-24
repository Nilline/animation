window.addEventListener("load", () => {
	// Модуь работы с рандомной анимацией блоков (Модуль работает на базе requestAnimationFrame)=======================================================================================================================================================================================================================
	/*
	data-decor-body - Для родителя внутри которого нужно анимировать блоки декора.
	data-decor-item - Пишем для елементов которые нужно анимировать внутри родителя с атрибутом data-decor-body.
	data-decor-min-speed="" - Устанавливает минимальное значение анимации в пикселях (можно дробные значения). Добавлять для блока с аттрибутом data-decor-body (Не обязательный атрибут, по умолчанию будет значение 0.6).
	data-decor-max-speed="" - Устанавливает максимальное значение анимации в пикселях (можно дробные значения). Добавлять для блока с аттрибутом data-decor-body (Не обязательный атрибут, по умолчанию будет значение 1).
	*/
	class SetAnimateDecorItems {
		constructor(...props) {
			// Основное хранилище информации, не трогать!!! заполняется автоматически и изменяется в процессе работы!
			this.config = {
				decorBody: null,
				items: [],
				posItemsX: [],
				posItemsY: [],
				speedDecorX: [],
				speedDecorY: [],
				transformPosX: [],
				transformPosY: [],
				minSpeed: props[0] && props[0] <= props[1] ? props[0] : 0.6,
				maxSpeed: props[1] && props[1] >= props[0] ? props[1] : 1,
				delayRemoveClassTruck: props[2] ? props[2] : 200,

				// Нужно ли инициировать анимацию
				init: true,
				// Нужно ли добавлять класс при касании к стенкам
				/*
				Классы которые добавляются при касании к разным краям блока:
				_truck-y-bottom, _truck-y-top, _truck-x-left, _truck-x-right
				*/
				onAddClassTruckItem: true,

				classess: {
					body: '[data-decor-body]',
					items: '[data-decor-item]',
					init: 'init'
				}
			};
			this.setAnimate = this.setAnimate.bind(this);
			this.config.init ? this.initAnim() : null;
		}
		// Получение рандомного числа для скорости анимации элемента
		getRandomNum = negative => {
			const min = this.config.minSpeed,
				max = this.config.maxSpeed;
			return negative ? +(Math.random() * (-max - -min) + -min).toFixed(2) : +(Math.random() * (max - min) + min).toFixed(2);
		}

		// Функция инициализации
		initAnim() {
			this.setConfigValue();
		}

		// Настройка перед стартом
		setConfigValue() {
			const decorBodyArr = document.querySelectorAll(this.config.classess.body);
			if (decorBodyArr.length) {
				for (let i = 0; i < decorBodyArr.length; i++) {
					if (decorBodyArr[i].dataset.decorBody === '') {
						decorBodyArr[i].dataset.decorBody = this.config.classess.init;
						this.config.decorBody = decorBodyArr[i];
						const decorItems = this.config.decorBody.querySelectorAll(this.config.classess.items);

						if (decorItems.length) {
							decorItems.forEach(item => this.config.items.push(item));
						}
						break;
					}
					continue;
				}
			}
			if (this.config.items) {
				for (let i = 0; i < (this.config.items.length * 2); i++) {
					if (i < this.config.items.length) {
						if (Math.round(Math.random())) {
							this.config.posItemsX.push(true);
							this.config.speedDecorX.push(this.getRandomNum('negative'));
						} else {
							this.config.posItemsX.push(false);
							this.config.speedDecorX.push(this.getRandomNum());
						}
						this.config.transformPosX.push(0);
						this.config.transformPosY.push(0);
					} else {
						if (Math.round(Math.random())) {
							this.config.posItemsY.push(true);
							this.config.speedDecorY.push(this.getRandomNum('negative'));
						} else {
							this.config.posItemsY.push(false);
							this.config.speedDecorY.push(this.getRandomNum());
						}
					}
				}
			}
			this.config.items.length ? this.setAnimate() : null;
		}

		// Функция добавления класса при касании (можно отключать в настройках скрипта в конструкторе)
		itemTruck(item, side) {
			if (side === 'x-left' || side === 'x-right') {
				item.classList.add(side === 'x-left' ? '_truck-x-left' : '_truck-x-right');
				setTimeout(() => {
					item.classList.remove('_truck-x-left', '_truck-x-right');
				}, this.config.delayRemoveClassTruck);
			} else if (side === 'y-bottom' || side === 'y-top') {
				item.classList.add(side === 'y-bottom' ? '_truck-y-bottom' : '_truck-y-top');
				setTimeout(() => {
					item.classList.remove('_truck-y-bottom', '_truck-y-top');
				}, this.config.delayRemoveClassTruck);
			}
		}

		// Функция анимации (Запуск после настройки функцией setConfigValue)
		setAnimate() {
			this.config.items.forEach((item, i) => {
				const valueX = Number.parseInt(window.getComputedStyle(item).left) + this.config.transformPosX[i],
					valueY = Number.parseInt(window.getComputedStyle(item).top) + this.config.transformPosY[i];

				if (!this.config.posItemsX[i]) {
					if (valueX >= (this.config.decorBody.clientWidth - item.getBoundingClientRect().width)) {
						this.config.posItemsX.splice(i, 1, true);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum('negative'))
						this.config.onAddClassTruckItem ? this.itemTruck(item, 'x-right') : '';
					}
					this.config.transformPosX.splice(i, 1, this.config.transformPosX[i] + this.config.speedDecorX[i]);
				} else if (this.config.posItemsX[i]) {
					if (valueX <= 0) {
						this.config.posItemsX.splice(i, 1, false);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum())
						this.config.onAddClassTruckItem ? this.itemTruck(item, 'x-left') : '';
					}
					this.config.transformPosX.splice(i, 1, this.config.transformPosX[i] + this.config.speedDecorX[i]);
				}
				if (!this.config.posItemsY[i]) {
					if (valueY >= (this.config.decorBody.clientHeight - item.offsetHeight)) {
						this.config.posItemsY.splice(i, 1, true);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum('negative'))
						this.config.onAddClassTruckItem ? this.itemTruck(item, 'y-bottom') : '';
					}
					this.config.transformPosY.splice(i, 1, this.config.transformPosY[i] + this.config.speedDecorY[i]);
				} else if (this.config.posItemsY[i]) {
					if (valueY <= 0) {
						this.config.posItemsY.splice(i, 1, false);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum())
						this.config.onAddClassTruckItem ? this.itemTruck(item, 'y-top') : '';
					}
					this.config.transformPosY.splice(i, 1, this.config.transformPosY[i] + this.config.speedDecorY[i]);
				}
				item.style.cssText += `transform: translate3d(${this.config.transformPosX[i]}px, ${this.config.transformPosY[i]}px, 0);`;
			})
			requestAnimationFrame(this.setAnimate);
		}
	}

	// Проверка есть ли на странице елементи для анамации. Если есть создать новый экземпляр для каждого элемента data-decor-body. 
	const bodyDecorItems = document.querySelectorAll('[data-decor-body]');
	if (bodyDecorItems.length) {
		for (let i = 0; i < bodyDecorItems.length; i++) {
			if (bodyDecorItems[i].dataset.decorBody === '') {
				const minSpeed = !isNaN(+bodyDecorItems[i].dataset.decorMinSpeed) && +bodyDecorItems[i].dataset.decorMinSpeed ? +bodyDecorItems[i].dataset.decorMinSpeed : null;
				const maxSpeed = !isNaN(+bodyDecorItems[i].dataset.decorMaxSpeed) && +bodyDecorItems[i].dataset.decorMaxSpeed ? +bodyDecorItems[i].dataset.decorMaxSpeed : null;
				const truckDelay = !isNaN(+bodyDecorItems[i].dataset.decorTruckDelay) && +bodyDecorItems[i].dataset.decorTruckDelay ? +bodyDecorItems[i].dataset.decorTruckDelay : null;
				new SetAnimateDecorItems(minSpeed, maxSpeed, truckDelay);
			}
		};
	}
});