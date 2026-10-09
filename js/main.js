console.log("PIT STOP JS Loaded!");

const btnStart = document.querySelector("#start-race");
const btnPush = document.querySelector("#btn-push");
const btnNormal = document.querySelector("#btn-normal");
const btnConserve = document.querySelector("#btn-conserve");
const btnPit = document.querySelector("#btn-pit");
const btnWetTyres = document.querySelector("#btn-wet");
const btnSoftTyres = document.querySelector("#btn-soft");
const btnMediumTyres = document.querySelector("#btn-medium");
const btnHardTyres = document.querySelector("#btn-hard");
const btnRefuel = document.querySelector("#btn-refuel");



// importing state
import {
    race,
    cars,
    docFuelWarning,
    docTyreWarning,
} from "./state.js";

// importing race engine
import { 
    racePosition, 
    sortCarsByProgress,
    selectTyre,
    carStrategy,
    computerSafetyCheck,
    raceStatus,
    carsRanking,
} from "./race.js";

// importing canvas
import { updateCarVisualPositions, resetCarVisualPostions } from "./canvas.js";

// importing UI
import { 
    renderRaceInfo, 
    renderCarStatus,
    addLapLog,
    clearLapLog,
    showRaceResult,
    onNewRaceSummaryClick,
    resetRaceSummary,
    hideFinalResult,
    showRaceEngineerMessage,
    renderCarsRanking,
} from "./ui.js";

// importing doc
import {
    docDecisionCycle,
    resetDoc,
} from "./doc.js";


import {getLocation} from "./weather.js"


// disable car controls if race.isRunning === false;
const disableCarControls = () => {
    const carControls = [
        btnPush,
        btnNormal,
        btnConserve,
        btnPit,
        btnWetTyres,
        btnSoftTyres,
        btnMediumTyres,
        btnHardTyres,
        btnRefuel,
    ];

    carControls.forEach((button) => {
        button.disabled = race.isRunning === false;
    });
};

//                          Race Simulation
function raceSimulation() {
    cars.forEach((car) => {
        if (race.winner === null && race.isRunning === true) {
            raceStatus(car, showRaceResult);
        };
    });

    updateCarVisualPositions();

    computerSafetyCheck(cars[1]);
    computerSafetyCheck(cars[2]);
    computerSafetyCheck(cars[3]);

    docDecisionCycle();

    carsRanking();
    renderRaceInfo(cars[0]);
    renderCarStatus(cars[0]);

    if (race.winner === null && race.isRunning === true) {
        
        setTimeout(() => {
            raceSimulation();
        }, 200);
    };
}


btnPush.addEventListener("click", () => {

    carStrategy(cars[0], "push");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Strategy changed to PUSH`
    );
});


btnNormal.addEventListener("click", () => {

    carStrategy(cars[0], "baseline");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Strategy changed to NORMAL`
    );
});


btnConserve.addEventListener("click", () => {

    carStrategy(cars[0], "conserve");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Strategy changed to CONSERVE`
    );
});

btnPit.addEventListener("click", () => {

    if (cars[0].pitRequested === false) {

        carStrategy(cars[0], "pit");

        addLapLog(
            `Lap ${cars[0].lapsCompleted} - Pit stop requested`
        );

    } else {

        carStrategy(cars[0], "pit");
    };
});


//          Start Race
const startRace = () => {
    // prevent startRace(); from running when race.isRunning === true; 
    if (race.isRunning === true) {
        return;
    }

    clearLapLog();

    addLapLog("Race started");

    race.isRunning = true;

    // enabling car controls once race starts
    disableCarControls();

    raceSimulation();
};

//                  Reset Race
const resetRace = () => {

    // Race State
    race.isRunning = false;
    race.winner = null;
    // show start button after reset
    btnStart.classList.remove("hidden");

    // Cars State
    cars.forEach((car) => {

        car.fuel = 100;
        car.tyreCompound = "medium";
        car.tyreLife = 100;

        car.position = 0;
        car.speed = 2;
        car.strategy = "baseline";
        car.lapsCompleted = 0;

        car.fuelServiceRequested = false;
        car.fuelServiced = false;

        car.tyreServiceRequested = false;
        car.tyreServiced = false;

        car.pitRequested = false;
        car.isPitting = false;

        car.newTyreSet = "";

        car.isDNF = false;
        car.dnfReason = "";

        clearLapLog();

        resetRaceSummary();

    });

    resetCarVisualPostions();

    resetDoc();

    docFuelWarning.computer1 = false;
    docFuelWarning.computer2 = false;
    docFuelWarning.computer3 = false;

    docTyreWarning.computer1 = false;
    docTyreWarning.computer2 = false;
    docTyreWarning.computer3 = false;

    hideFinalResult();

    // Render Starting State
    carsRanking();
    renderRaceInfo(cars[0]);
    renderCarStatus(cars[0]);
};

btnStart.addEventListener("click", () => {
    showRaceEngineerMessage();

    startRace();

    // hide btnStartRace when race.isRunning === true;
    if (race.isRunning === true) {
        btnStart.classList.add("hidden");
    } 
});


onNewRaceSummaryClick(() => {

    resetRace();
})


//          tyre compound buttons
btnWetTyres.addEventListener("click", () => {

    selectTyre(cars[0], "wet");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Wet tyres selected`
    );
});


btnSoftTyres.addEventListener("click", () => {

    selectTyre(cars[0], "soft");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Soft tyres selected`
    );
});


btnMediumTyres.addEventListener("click", () => {

    selectTyre(cars[0], "medium");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Medium tyres selected`
    );
});


btnHardTyres.addEventListener("click", () => {

    selectTyre(cars[0], "hard");

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Hard tyres selected`
    );
});


btnRefuel.addEventListener("click", () => {

    cars[0].fuelServiceRequested = true;

    addLapLog(
        `Lap ${cars[0].lapsCompleted} - Refuel selected`
    );
});

//onload - dsiable car control to preserve baseline strategy at the beginning of the race
disableCarControls();