const licenseView = new View('license',
    () => {
        backgrounds.setActive('main');
        staircase.activate();
        land.activate();
    },
    () => {
        staircase.deactivate();
        land.deactivate();
    }
);

const menuView = new View('menu',
    () => {
        backgrounds.setActive('main');
        staircase.activate();
        land.activate();
    },
    () => {
        staircase.deactivate();
        land.deactivate();
    }
);


const gameView = new View('game',
    () => {
        backgrounds.setActive('main');
        land.activate();
    },
    () => {
        game.locked = true;
        game.generatLevel(game.difficulty);
        document.querySelector('.game-start').classList.remove('game-start_active');
        betsEl.classList.remove('disabled');
        winEl.deactivate();
    }
);
