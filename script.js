window.addEventListener("load", function (e) {
	class SetAnimateDecorItems {
		constructor() {
			this.config = {
				decorBody: null,
				items: [],
				posItemsX: [],
				posItemsY: [],
				speedDecorX: [],
				speedDecorY: [],

				init: true,

				classess: {
					body: '[data-decor-body]',
					items: '[data-decor-item]',
					init: 'init'
				}
			};
			this.setAnimate = this.setAnimate.bind(this);
			this.config.init ? this.initAnim() : null;
		}
		getRandomNum = negative => negative ? Math.round(Math.random() * (-2 - -1) + -1) : Math.round(Math.random() * (2 - 1) + 1);

		initAnim() {
			this.setConfigValue();
		}

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
		setAnimate() {
			this.config.items.forEach((item, i) => {
				let valueX = Number.parseInt(window.getComputedStyle(item).left),
					valueY = Number.parseInt(window.getComputedStyle(item).top);

				if (!this.config.posItemsX[i]) {
					if (valueX >= (document.documentElement.clientWidth - item.getBoundingClientRect().width)) {
						this.config.posItemsX.splice(i, 1, true);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum('negative'))
					} else {
						item.style.cssText += `left: ${Number.parseInt(window.getComputedStyle(item).left) + this.config.speedDecorX[i]}px;`;
					}
				} else if (this.config.posItemsX[i]) {
					if (valueX <= 0) {
						this.config.posItemsX.splice(i, 1, false);
						this.config.speedDecorX.splice(i, 1, this.getRandomNum())
					} else {
						item.style.cssText += `left: ${Number.parseInt(window.getComputedStyle(item).left) + this.config.speedDecorX[i]}px;`;
					}
				}
				if (!this.config.posItemsY[i]) {
					if (valueY >= (this.config.decorBody.clientHeight - item.offsetHeight)) {
						this.config.posItemsY.splice(i, 1, true);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum('negative'))
					} else {
						item.style.cssText += `top: ${Number.parseInt(window.getComputedStyle(item).top) + this.config.speedDecorY[i]}px;`;
					}
				} else if (this.config.posItemsY[i]) {
					if (valueY <= 0) {
						this.config.posItemsY.splice(i, 1, false);
						this.config.speedDecorY.splice(i, 1, this.getRandomNum())
					} else {
						item.style.cssText += `top: ${Number.parseInt(window.getComputedStyle(item).top) + this.config.speedDecorY[i]}px;`;
					}
				}

			})
			requestAnimationFrame(this.setAnimate);
		}
	}
	const BodyDecorItems = document.querySelectorAll('[data-decor-body]');
	if (BodyDecorItems.length) {
		for (let i = 0; i < BodyDecorItems.length; i++) {
			if (BodyDecorItems[i].dataset.decorBody === '') {
				new SetAnimateDecorItems();
			}
		};
	}
});