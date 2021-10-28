import Key from './key.js';
import Border from './border.js';
import Music from './music.js';
import map from './songs/unforgiving/map.js';
import Highscore from './highscore.js';

class Piano {
    constructor({canvas, timerCallback, endCallback, scoreCallback, pauseCallback}) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 400;
        this.canvas.height = 600;

        this.FPS = 40;

        const keyArgs = {canvas, ctx: this.ctx, width: 100, height: 120, color: '#3e8db1', hover: '#66cfff'};

        this.keys = [
            new Key({...keyArgs, position: 1, keycode: 'D'}),
            new Key({...keyArgs, position: 2, keycode: 'F'}),
            new Key({...keyArgs, position: 3, keycode: 'J'}),
            new Key({...keyArgs, position: 4, keycode: 'K'}),
        ];

        this.border = new Border({
            canvas,
            ctx: this.ctx,
            height: 20,
            color: '#222',
            y: canvas.height - keyArgs.height - 20,
        });

        this.unforgiving = 'js/piano/songs/unforgiving/audio.mp3';
        const audio = new Audio();
        audio.src = this.unforgiving;
        audio.preload = 'auto';
        // audio.loop = false;

        this.music = new Music({
            canvas,
            audio,
            map,
            ctx: this.ctx,
            keys: this.keys,
            timerCallback,
            endCallback,
            scoreCallback,
        });

        this.paused = false;
        this.pausedTime = 0;
        this.pauseCallback = pauseCallback;

        this.isCounting = false;

        this.highscore = new Highscore();

        document.addEventListener('keydown', this.eventPause.bind(this));
    }

    get volume() {
        return this.music.audio.volume;
    }

    set volume(volume) {
        this.music.audio.volume = volume;
    }

    eventPause(ev) {
        if (ev.code !== 'Escape' || this.isCounting || this.music.audio.currentTime === 0)
            return;

        this.pause();
    }

    pause() {
        if (this.paused) {
            this.paused = false;
            this.start();
        } else {
            this.paused = true;
            this.pausedTime = this.music.audio.currentTime;
            this.music.audio.pause();
            this.music.audio.src = '';
        }

        this.pauseCallback();
    }

    start() {
        this.clear();
        this.isCounting = true;

        const x = this.canvas.width / 2 - 20;
        const y = this.canvas.height / 2;

        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '72px sans-serif';

        this.ctx.fillText('3', x, y);

        setTimeout(() => {
            this.clear();
            this.ctx.fillText('2', x, y);

            setTimeout(() => {
                this.clear();
                this.ctx.fillText('1', x, y);
                this.ctx.closePath();

                setTimeout(() => {
                    this.isCounting = false;

                    if (this.pausedTime) {
                        this.music.audio.src = this.unforgiving;
                        this.music.audio.currentTime = this.pausedTime;
                    }

                    this.play();
                }, 1000);
            }, 1000);
        }, 1000);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    play() {
        this.clear();

        this.music.audio.play();
        this.music.draw();

        this.border.draw();

        this.keys.forEach((key) => key.draw());

        if (!this.music.end && !this.paused)
            setTimeout(this.play.bind(this), 1000 / this.FPS);

        if (this.music.end)
            this.highscore.insert({
                song: 'unforgiving',
                score: (this.music.percentage).toFixed(2),
            });
    }
}

export default Piano;