const str = new Storage({
    balance: 500,
    levels: [1]
});

const vC = new ViewController(licenseView);
// const vC = new ViewController(gameView);

str.data.balance = 500;

accceptLiense.onclick = () => vC.setView(menuView);

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

        this.rowsWrapper.innerHTML = '';
        this.staircasesWrapper.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            this.rowsWrapper.insertAdjacentHTML(`beforeEnd`, `<div class="row row_${i}">${this.generateRow(i, difficulty + 4 - i - 1, difficulty)}</div>`);
        }

        const game = this;

        dqsa('.land-piece').addEventListener('click', function (e) {
            const row = +this.getAttribute('data-row');
            const column = +this.getAttribute('data-column');
            const fired = +this.getAttribute('data-fired');

            if (row !== game.currentRow) { return; }

            if (game.locked) { return; }


            game.locked = true;

            game.moveGirl(column, () => {
                this.activate();
                if (!fired) {
                    game.addStaircase(row, column);
                    game.upGirl(row);
                    game.currentRow--;
                    game.locked = false;
                } else {
                }
            });

        })
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

const game = new Game();

dqsa('[data-level]').addEventListener('click', function()  {
    if (!this.classList.contains('active')) { return; }
    const defficulty = +this.getAttribute('data-level');
    game.generatLevel([0, 3, 5, 6][defficulty]);
    vC.setView(gameView);
})