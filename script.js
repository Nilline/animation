window.addEventListener("load", () => {
	// Модуь работы с рандомной анимацией блоков (Модуль работает на базе requestAnimationFrame)=======================================================================================================================================================================================================================
	/*
	data-decor-body - Для родителя внутри которого нужно анимировать блоки декора.
	data-decor-item - Пишем для елементов которые нужно анимировать внутри родителя с атрибутом data-decor-body.
	data-decor-min-speed="" - Устанавливает минимальное значение анимации в пикселях (можно дробные значения). Добавлять для блока с аттрибутом data-decor-body (Не обязательный атрибут, по умолчанию будет значение 0.6).
	data-decor-max-speed="" - Устанавливает максимальное значение анимации в пикселях (можно дробные значения). Добавлять для блока с аттрибутом data-decor-body (Не обязательный атрибут, по умолчанию будет значение 1).
	data-decor-truck-delay="" - Устанавливает значение задержки исчезновения класса после касания елемента к краю экрана (Указывать в милисекундах). Добавлять для блока с аттрибутом data-decor-body (Не обязательный атрибут, по умолчанию будет значение 200).
	*/
	class SetAnimateDecorItems {
		constructor(...props) {
			this.config = {
				// Основные настройки
				settings: {
					// Нужно ли инициировать анимацию
					init: true,

					// Включение события взаимодействия с мышкой
					mouseInit: true,
					// Скорость замедления
					speedReduction: 0.5,
					// Задержка замедления
					delayReduction: 300,
					// Минимальная скорость ускорения
					minValueAcceleration: 3,
					// Максимальная скорость ускорения
					maxValueAcceleration: 10,

					/*
					Нужно ли добавлять класс при касании к стенкам
					Классы которые добавляются при касании к разным краям блока:
					_truck-bottom, _truck-top, _truck-left, _truck-right
					*/
					onAddClassTruckItem: true,
				},

				// Основное хранилище информации, не трогать!!! заполняется автоматически и изменяется в процессе работы!
				decorBody: null,
				items: [],
				posItemsX: [],
				posItemsY: [],
				speedDecorX: [],
				speedDecorY: [],
				transformPosX: [],
				transformPosY: [],
				speedModifierX: [],
				speedModifierY: [],
				intervalActive: {
					x: false,
					y: false
				},
				minSpeed: props[0] && props[0] <= props[1] ? props[0] : 0.6,
				maxSpeed: props[1] && props[1] >= props[0] ? props[1] : 1,
				delayRemoveClassTruck: props[2] ? props[2] : 200,


				classess: {
					body: '[data-decor-body]',
					items: '[data-decor-item]',
					init: 'init'
				}
			};
			this.setAnimate = this.setAnimate.bind(this);
			this.mouseEvent = this.mouseEvent.bind(this);
			this.config.settings.init ? this.initAnim() : null;
		}
		// Получение рандомного числа для скорости анимации элемента
		getRandomNum = negative => {
			const min = this.config.minSpeed,
				max = this.config.maxSpeed;
			return negative ? (Math.round((Math.random() * (-max - -min) + -min) * 100) / 100) : Math.round((Math.random() * (max - min) + min) * 100) / 100;
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
							decorItems.forEach((item, i) => {
								this.config.items.push(item);
								item.dataset.decorIndex = i;
								if (this.config.settings.mouseInit) {
									this.config.speedModifierX.push(1);
									this.config.speedModifierY.push(1);
								}
							});
							this.config.settings.mouseInit ? decorBodyArr[i].addEventListener("mousemove", this.mouseEvent) : '';
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

		reductionNumber() {
			if (!this.config.intervalActive.x) {
				this.config.intervalActive.x = true;
				const arrX = this.config.speedModifierX;
				let timer = setInterval(() => {
					arrX.forEach((num, i) => {
						if (num > 1) {
							arrX.splice(i, 1, num - this.config.settings.speedReduction);
						}
					})
					if (!this.config.speedModifierX.filter(item => item > 1).length) {
						clearInterval(timer);
						this.config.intervalActive.x = false;
					}
				}, this.config.settings.delayReduction);
			}
			if (!this.config.intervalActive.y) {
				this.config.intervalActive.y = true;
				const arrY = this.config.speedModifierY;
				let timer = setInterval(() => {
					arrY.forEach((num, i) => {
						if (num > 1) {
							arrY.splice(i, 1, num - this.config.settings.speedReduction);
						}
					})
					if (!this.config.speedModifierY.filter(item => item > 1).length) {
						clearInterval(timer);
						this.config.intervalActive.y = false;
					}
				}, this.config.settings.delayReduction);
			}
		}

		mouseEvent(e) {
			if (this.config.items.length) {
				if (e.target.closest(this.config.classess.items)) {
					const target = e.target.closest(this.config.classess.items),
						left = +(target.getBoundingClientRect().left).toFixed(0),
						right = +(target.getBoundingClientRect().left + target.clientWidth).toFixed(0),
						top = +(target.getBoundingClientRect().top).toFixed(0),
						bottom = +(target.getBoundingClientRect().top + target.offsetHeight).toFixed(0),
						width = right - left,
						height = bottom - top,
						i = target.dataset.decorIndex,
						minValueAcceleration = this.config.settings.minValueAcceleration,
						maxValueAcceleration = this.config.settings.maxValueAcceleration;

					if ((left + width / 2) > e.x) {
						this.config.posItemsX.splice(i, 1, false);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum());
						this.config.speedModifierX.splice(i, 1, +(Math.random() * (maxValueAcceleration - minValueAcceleration) + minValueAcceleration).toFixed(0));
						this.reductionNumber();
					}
					if ((right - width / 2) < e.x) {
						this.config.posItemsX.splice(i, 1, true);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum('negative'));
						this.config.speedModifierX.splice(i, 1, +(Math.random() * (maxValueAcceleration - minValueAcceleration) + minValueAcceleration).toFixed(0));
						this.reductionNumber();
					}
					if ((top + height / 2) > e.y) {
						this.config.posItemsY.splice(i, 1, false);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum());
						this.config.speedModifierY.splice(i, 1, +(Math.random() * (maxValueAcceleration - minValueAcceleration) + minValueAcceleration).toFixed(0));
						this.reductionNumber();
					}
					if ((bottom - height / 2) < e.y) {
						this.config.posItemsY.splice(i, 1, true);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum('negative'));
						this.config.speedModifierY.splice(i, 1, +(Math.random() * (10 - 3) + 3).toFixed(0));
						this.reductionNumber();
					}
				}
			}

		}

		// Функция добавления класса при касании (можно отключать в настройках скрипта в конструкторе)
		itemTruck(item, side) {
			if (side === 'x-left' || side === 'x-right') {
				item.classList.add(side === 'x-left' ? '_truck-left' : '_truck-right');
				setTimeout(() => {
					item.classList.remove('_truck-left', '_truck-right');
				}, this.config.delayRemoveClassTruck);
			} else if (side === 'y-bottom' || side === 'y-top') {
				item.classList.add(side === 'y-bottom' ? '_truck-bottom' : '_truck-top');
				setTimeout(() => {
					item.classList.remove('_truck-bottom', '_truck-top');
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
						this.config.speedDecorX.splice(i, 1, this.getRandomNum('negative'));
						this.config.settings.onAddClassTruckItem ? this.itemTruck(item, 'x-right') : '';
					}
					this.config.transformPosX.splice(i, 1, +((Math.round(this.config.transformPosX[i] * 100) / 100) + (this.config.speedDecorX[i] * this.config.speedModifierX[i])).toFixed(2));
				} else if (this.config.posItemsX[i]) {
					if (valueX <= 0) {
						this.config.posItemsX.splice(i, 1, false);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum());
						this.config.settings.onAddClassTruckItem ? this.itemTruck(item, 'x-left') : '';
					}
					this.config.transformPosX.splice(i, 1, +((Math.round(this.config.transformPosX[i] * 100) / 100) + this.config.speedDecorX[i] * this.config.speedModifierX[i]).toFixed(2));
				}
				if (!this.config.posItemsY[i]) {
					if (valueY >= (this.config.decorBody.clientHeight - item.offsetHeight)) {
						this.config.posItemsY.splice(i, 1, true);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum('negative'));
						this.config.settings.onAddClassTruckItem ? this.itemTruck(item, 'y-bottom') : '';
					}
					this.config.transformPosY.splice(i, 1, +((Math.round(this.config.transformPosY[i] * 100) / 100) + (this.config.speedDecorY[i] * this.config.speedModifierY[i])).toFixed(2));
				} else if (this.config.posItemsY[i]) {
					if (valueY <= 0) {
						this.config.posItemsY.splice(i, 1, false);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum());
						this.config.settings.onAddClassTruckItem ? this.itemTruck(item, 'y-top') : '';
					}
					this.config.transformPosY.splice(i, 1, +((Math.round(this.config.transformPosY[i] * 100) / 100) + (this.config.speedDecorY[i] * this.config.speedModifierY[i])).toFixed(2));
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