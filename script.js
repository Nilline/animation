window.addEventListener("load", function (e) {
	function setAnimateDecorItems() {
		const decorMainscreen = document.querySelector('[data-decor-body]'),
			items = decorMainscreen ? decorMainscreen.querySelectorAll('[data-decor-item]') : [],
			posItemsX = [], posItemsY = [];
		if (items.length) {
			for (let i = 0; i < (items.length * 2); i++) {
				if (i < items.length) {
					if (Math.round(Math.random())) {
						posItemsX.push(true);
					} else {
						posItemsX.push(false);
					}
				} else {
					if (Math.round(Math.random())) {
						posItemsY.push(true);
					} else {
						posItemsY.push(false);
					}
				}
			}
		}
		const getNum = switchh => switchh ? -1 : 1;

		function setAnimate() {
			items.forEach((item, i) => {
				let valueX = Number.parseInt(window.getComputedStyle(item).left),
					valueY = Number.parseInt(window.getComputedStyle(item).top);

				if (!posItemsX[i]) {
					if (valueX >= (window.innerWidth - item.getBoundingClientRect().width)) {
						posItemsX[i] = true;
					} else {
						item.style.cssText += `left: ${Number.parseInt(window.getComputedStyle(item).left) + getNum()}px;`;
					}
				} else if (posItemsX[i]) {
					if (valueX <= 0) {
						posItemsX[i] = false;
					} else {
						item.style.cssText += `left: ${Number.parseInt(window.getComputedStyle(item).left) + getNum(true)}px;`;
					}
				}
				if (!posItemsY[i]) {
					if (valueY >= (decorMainscreen.clientHeight - item.offsetHeight)) {
						posItemsY[i] = true;
					} else {
						item.style.cssText += `top: ${Number.parseInt(window.getComputedStyle(item).top) + getNum()}px;`;
					}
				} else if (posItemsY[i]) {
					if (valueY <= 0) {
						posItemsY[i] = false;
					} else {
						item.style.cssText += `top: ${Number.parseInt(window.getComputedStyle(item).top) + getNum(true)}px;`;
					}
				}

			})
			requestAnimationFrame(setAnimate);
		}
		items.length ? setAnimate() : false;
	}
	setAnimateDecorItems();
});