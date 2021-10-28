class Music {
    constructor({canvas, ctx, audio, map, keys, timerCallback, endCallback, scoreCallback}) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audio = audio;
        this.map = map;
        this.keys = keys;
        this.timerCallback = timerCallback;
        this.endCallback = endCallback;
        this.scoreCallback = scoreCallback;

        this.hit = [];
        this.passed = [];

        this.end = false;

        this.speedChanged = false;

        audio.addEventListener('ended', this.ended.bind(this));

        document.addEventListener('keydown', this.speed.bind(this));
    }

    speed(ev) {
        if (!ev.ctrlKey)
            return;

        if (ev.code === 'Equal' && this.audio.playbackRate < 2) {
            this.audio.playbackRate *= 2;
        }

        if (ev.code === 'Minus' && this.audio.playbackRate > .5) {
            this.audio.playbackRate /= 2;
        }

        this.speedChanged = true;

        setTimeout(() => {
            this.speedChanged = false;
        }, 3000);
    }

    ended() {
        this.end = true;
        this.audio.src = '';
        this.endCallback();
    }

    get currentTime() {
        return Math.floor(this.audio.currentTime * 1000);
    }

    get percentage() {
        return this.passed.length === 0 ? 0 : this.hit.length / this.passed.length * 100;
    }

    draw() {
        if (this.speedChanged) {
            let text;
            if (this.audio.playbackRate === .5)
                text = 'Slower';
            else if (this.audio.playbackRate === 1)
                text = 'Normal';
            else if (this.audio.playbackRate === 2)
                text = 'Faster';

            this.ctx.beginPath();
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText(text, this.canvas.width / 2 - 30, 20);
            this.ctx.closePath();
        }

        this.map.hitObjects.forEach((map, index) => {
            const key = this.keys[map.position - 1];
            const y = this.currentTime + this.canvas.height - map.hitAt;

            if (this.currentTime >= map.hitAt && !this.passed.includes(index))
                this.passed.push(index);

            if (key.pressed && this.currentTime > map.hitAt - 50 && this.currentTime < map.hitAt + 50 && !this.hit.includes(index))
                this.hit.push(index);

            this.ctx.beginPath();
            this.ctx.fillStyle = key.color;
            this.ctx.rect(key.x, y, key.width, 20);
            this.ctx.fill();
            this.ctx.closePath();
        });

        this.timerCallback();
        this.scoreCallback();
    }
}

export default Music;