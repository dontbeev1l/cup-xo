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
    }
);
