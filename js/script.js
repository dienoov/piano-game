import Piano from './piano/piano.js';

const canvas = document.getElementById('game');

const timeElapsed = document.getElementById('time-elapsed');
const timerCallback = function () {
    timeElapsed.innerText = (this.currentTime / 1000).toFixed(2);
};

const scorePercentage = document.getElementById('score-percentage');
const scoreCallback = function () {
    scorePercentage.innerText = (this.percentage).toFixed(2);
};

const end = document.getElementById('end');
const endResult = end.querySelector('.result');
const endScore = end.querySelector('.score');
const endCallback = function () {
    end.classList.remove('hide');

    endResult.innerText = this.percentage < 50 ? 'You Failed :(' : 'Congratulations';
    endScore.innerText = (this.percentage).toFixed(2);
};

const highscoreButton = end.querySelector('.highscore');
const highscore = document.getElementById('highscore');

const instruction = document.getElementById('instruction');
const playForm = document.getElementById('play-form');

const pause = document.getElementById('pause');
const resume = pause.querySelector('.continue');
const pauseCallback = function () {
    if (this.paused)
        return pause.classList.remove('hide');

    pause.classList.add('hide');
};

const volumeSlider = document.getElementById('volume-slider');

const piano = new Piano({canvas, timerCallback, endCallback, scoreCallback, pauseCallback});

volumeSlider.oninput = () => piano.volume = volumeSlider.value / 100;

resume.onclick = () => piano.pause();

highscoreButton.onclick = () => {
    end.classList.add('hide');
    highscore.classList.remove('hide');
    piano.highscore.render(highscore.querySelector('.table'));
};

playForm.onsubmit = (ev) => {
    ev.preventDefault();
    instruction.classList.add('hide');
    piano.start();
};