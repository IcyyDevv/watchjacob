console.clear();

const EffectConfetti = (() => {
	function EffectConfetti(config) {
		this.config = Object.assign({}, C.DefaultConfig, config);
	}
	const C = EffectConfetti, P = Object.assign(C.prototype, {constructor: C});
	C.DefaultConfig = {
		colors: ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'],
		anims: ['slow', 'medium', 'fast'],
		size: 10,
		interval: 16, timeout: 3000,
		posJitter: 0, angJitter: 0, distJitter: 0, sizeJitter: 0,
	};
	C.getJitter = jitter => Math.round((Math.random() - 0.5) * jitter);
	C.getAngDist = ([x0, y0], [x1, y1]) => {
		let dx = x0 - x1, dy = y0 - y1;
		return [
			Math.atan2(dy, dx) * 180 / Math.PI + 90,
			Math.round(Math.sqrt(dx * dx + dy * dy))
		];
	};
	P.fireConfetti = function(from, to) {
		const {parent, colors, anims, timeout, posJitter, angJitter, distJitter, size, sizeJitter} = this.config;
		let x = from[0] + C.getJitter(posJitter), y = from[1] + C.getJitter(posJitter),
				dx = x - to[0], dy = y - to[1],
				anim = anims[Math.floor(Math.random() * anims.length)],
				color = colors[Math.floor(Math.random() * colors.length)],
				[ang, dist] = C.getAngDist(from, to),
				confSize = size + C.getJitter(sizeJitter);
		ang += C.getJitter(angJitter);
		dist += C.getJitter(distJitter);
		let elem = document.createElement('div');
		elem.classList.add(`confetti`, `confetti--animation-${anim}`);
		Object.assign(elem.style, {width: `${dist}px`, height: `${size}px`, left: `${x}px`, top: `${y}px`, transform: `rotate(${ang}deg)`});
		elem.style.setProperty('--confetti-color', color);
		setTimeout(() => elem.remove(), timeout);
		parent.appendChild(elem);
		return elem;
	};	
	P.blastConfetti = function(from, to, duration = 500) {
		console.log('EffectConfetti.blastConfetti(from, to, duration);', from, to, duration);
		const {interval} = this.config;
		let intervalId = setInterval(this.fireConfetti.bind(this, from, to), interval);
		setTimeout(() => clearInterval(intervalId), duration);
	};
	P.startConfettiGun = function(from, to) {
		console.log('EffectConfetti.startConfettiGun(from, to);', from, to);
		const {interval} = this.config;
		clearInterval(this.confettiGunId);
		this.confettiGunId = setInterval(this.fireConfetti.bind(this, from, to), interval);
	};
	P.stopConfettiGun = function() {
		clearInterval(this.confettiGunId);
		delete this.confettiGunId;
	};
	return C;
})();

(async () => {
	
	const parent = document.querySelector('.confetti-container');
	let fxConfetti = new EffectConfetti({
		parent,
		size: 10,
		posJitter: 20, angJitter: 15, distJitter: 50, sizeJitter: 10
	});
	
	const mp = [parent.clientWidth * 0.5, parent.clientHeight * 0.5];
	function handleMousemove(event) {
		mp[0] = event.clientX;
		mp[1] = event.clientY;
	}
	function handleMousedown(event) {
		let from = [event.clientX, event.clientY];
		fxConfetti.startConfettiGun(from, mp);
	}
	function handleMouseup(event) {
		fxConfetti.stopConfettiGun()
	}
	function handleRandomConfettiBlast() {
		let w = parent.clientWidth, h = parent.clientHeight,
				from = [Math.round((0.15 + 0.7 * Math.random()) * w), Math.round((0.15 + 0.7 * Math.random()) * h)],
				to =   [Math.round((0.25 + 0.5 * Math.random()) * w), Math.round((0.25 + 0.5 * Math.random()) * h)];
		fxConfetti.blastConfetti(from, to, 500);
	}
	
	document.body.addEventListener('mousemove', handleMousemove);
	document.body.addEventListener('mousedown', handleMousedown);
	document.body.addEventListener('mouseup', handleMouseup);
	setInterval(handleRandomConfettiBlast, 1000);
	handleRandomConfettiBlast();
	
	setInterval(() => console.log('Confetti count:', parent.children.length), 1000);
})();
