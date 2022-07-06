let canPlayMsuic = false;
const str = new Storage({
    balance: 5000,
    levels: 1,
    bet: 50,
    music: true
}, {
    bet: (value) => {
        betEl.innerHTML = value;
    },
    balance: (value) => {
        dqsa('.balance').setInnerHTML(value);
    },
    levels: (value) => {
        for (let i = 1; i <= value; i++) {
            dqsa(`[data-level="${i}"]`).activate();
        }
    },
    music: (value) => {

    }
});

const vC = new ViewController(licenseView);
// const vC = new ViewController(menuView);

accceptLiense.onclick = () => {
    if (str.data.music) { mPlay(); } else { mPause() }
    canPlayMsuic = true;
    vC.setView(menuView)
};

class Game {
    constructor() {
        this.rowsWrapper = document.querySelector('.game-field__rows');
        this.girl = document.querySelector('.game-girl');
        this.staircasesWrapper = document.querySelector('.staircases');

        this.currentColumn = 0;
        this.currentRow = 3;
        this.girlDirection = true;
    }

    generatLevel(difficulty) {
        this.difficulty = difficulty;
        this.rowsWrapper.innerHTML = '';
        this.staircasesWrapper.innerHTML = '';
        this.currentColumn = 0;
        this.currentRow = 3;

        this.moveGirl(0, () => {
            this.upGirl(4);
            this.girlDirection = true;
            this.updateGirlDirection();
        })

        for (let i = 0; i < 4; i++) {
            this.rowsWrapper.insertAdjacentHTML(`beforeEnd`, `<div class="row row_${i}">${this.generateRow(i, this.getWinCoef(i), difficulty)}</div>`);
        }

        const game = this;

        dqsa('.land-piece').addEventListener('click', function (e) {
            const row = +this.getAttribute('data-row');
            const column = +this.getAttribute('data-column');
            const fired = +this.getAttribute('data-fired');

            if (row !== game.currentRow) { return; }
            if (game.locked) {
                const start = document.querySelector('.game-start');
                if (!start.classList.contains('game-start_active')) {
                    start.dispatchEvent(new Event('click'))
                } else {
                    return;
                }

            }

            game.locked = true;

            game.moveGirl(column, () => {
                this.activate();
                if (!fired) {
                    game.addStaircase(row, column);
                    game.upGirl(row);

                    game.currentRow--;

                    if (game.currentRow === -1) {
                        setTimeout(() => {
                            game.moveGirl(16, () => {
                                game.locked = false;
                                game.endRound();
                                str.data.levels++;
                            });
                        }, 350);
                    } else {
                        game.locked = false;
                    }
                } else {
                    game.endRound();

                }
            });

        })
    }

    endRound() {
        winEl.activate();
        winValEl.innerHTML = game.getWinSum();
        betsEl.classList.add('disabled');
        str.data.balance = str.data.balance + game.getWinSum();
        if (str.data.balance < 50) {
            str.data.balance = 500;
        }
    }

    getWinCoef(row) {
        if (row === 4) { return 0; }
        return this.difficulty + (3 - row);
    }

    getWinSum() {
        console.log(this.currentRow + 1);
        return this.getWinCoef(this.currentRow + 1) * str.data.bet;
    }

    addStaircase(row, column) {
        const staircaseEl = document.createElement('img');
        staircaseEl.setAttribute('src', './img/staircase.png');
        staircaseEl.classList.add('game-staircase');
        staircaseEl.classList.add(`game-staircase_${row}`);
        staircaseEl.style.left = `calc(${column} * calc(100% / 18))`;
        this.staircasesWrapper.appendChild(staircaseEl);

    }

    upGirl(row) {
        this.girl.style.bottom = `${(4 - row) * 25}%`;
    }

    moveGirl(column, clbk) {
        const moveTime = Math.abs(this.currentColumn - column) * 200;
        this.girl.classList.add('game-girl_steps');
        this.girl.style.left = `calc(${column} * calc(100% / 18))`;
        this.girl.style.transition = `left ${moveTime}ms linear, bottom 400ms linear`;
        setTimeout(() => {
            this.girl.classList.remove('game-girl_steps');
            clbk();
        }, moveTime);
        this.girlDirection = column > this.currentColumn;
        this.updateGirlDirection();

        this.currentColumn = column;
    }

    updateGirlDirection() {
        if (this.girlDirection) {
            this.girl.setAttribute('src', './img/girl.png');
        } else {
            this.girl.setAttribute('src', './img/girl_r.png');
        }
    }

    generateRow(rowIndex, coef, firesCount) {
        const fires = new Set();

        while (fires.size < firesCount) {
            fires.add(random(17))
        }

        let html = ``;
        for (let i = 0; i < 17; i++) {
            html += `<div class="land-piece land-piece" data-row="${rowIndex}" data-column="${i}" data-fired="${fires.has(i) ? 1 : 0}">
            ${fires.has(i) ? '<img class="game-fire" src="./img/fire.svg">' : ''}
            <img src="./img/land-piece.png"></div>`;
        }

        html += `<div class="row-coef">
            <img src="./img/level_btn.png">
            <span>x${coef}</span>
        </div>`

        return html;
    }
}

var game = new Game();

game.locked = true;

dqsa('[data-level]').addEventListener('click', function () {
    if (!game.locked) { return; }
    if (!this.classList.contains('active')) { return; }
    const difficulty = +this.getAttribute('data-level');
    game.generatLevel([0, 3, 5, 6][difficulty]);

    dqsa('.game-level-section .level').forEach(el => {
        el.classList.add('grey');
    });

    dqsa(`[data-level="${difficulty}"]`).forEach(el => {
        el.classList.remove('grey');
    })

    vC.setView(gameView);
})

dqsa('.arr_l').addEventListener('click', () => {
    if (!game.locked) { return; }
    if (str.data.bet > 50) { str.data.bet -= 50; }
})
dqsa('.arr_r').addEventListener('click', () => {
    if (!game.locked) { return; }
    if (str.data.bet + 50 > str.data.balance) { return; }
    str.data.bet += 50;
})

dqsa('.game-start').addEventListener('click', function () {
    if (!game.locked) { return; }
    str.data.balance -= str.data.bet;
    game.locked = false;
    this.classList.add('game-start_active');
})

retryEl.onclick = () => {
    game.locked = true;
    game.generatLevel(game.difficulty);
    document.querySelector('.game-start').classList.remove('game-start_active');
    betsEl.classList.remove('disabled');
    winEl.deactivate();
}


dqsa('.home').addEventListener('click', () => {
    vC.setView(menuView);
})


function mPlay() {
    musicEl.play();
    str.data.music = true;
    playEl.style.display = 'none';
    pauseEl.style.display = 'block';
}

function mPause() {
    musicEl.pause();
    str.data.music = false;
    playEl.style.display = 'block';
    pauseEl.style.display = 'none';
}