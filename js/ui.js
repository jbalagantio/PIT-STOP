// importing dependencies

import { race, cars } from "./state.js";
import { sortCarsByProgress } from "./race.js";


// temporary export for weather.js
export const liWeatherConditionValue = document.querySelector("#weather-condition-value");   
export const liAirTempValue = document.querySelector("#air-temp-value");    
export const liWindSpeedValue = document.querySelector("#wind-speed-value");  
export const rainEffect = document.querySelector(".rain-effect");   
// end of temporary export for weather.js

const trackLapCounter = document.querySelector("#track-lap-counter");         
const liFuel = document.querySelector("#li-fuel");                              
const liTyreCompound = document.querySelector("#li-tyre");                       
const liTyreLife = document.querySelector("#li-tyre-life");                 
const fuelBarFill = document.querySelector(".fuel-bar-fill");                 
const tyreBarFill = document.querySelector(".tyre-bar-fill");                    
const tyreIndicator = document.querySelector("#tyre-indicator");       
const lapLog = document.querySelector("#lap-log");            
const finalResult = document.querySelector(".final-result");           
const raceResultWinner = document.querySelector("#race-result-winner");   
const summaryResult = document.querySelector("#summary-result");
const summaryPosition = document.querySelector("#summary-position");
const summaryWinner = document.querySelector("#summary-winner");
const summaryLaps = document.querySelector("#summary-laps");
const summaryFuel = document.querySelector("#summary-fuel");
const summaryTyre = document.querySelector("#summary-tyre");
const summaryTyreLife = document.querySelector("#summary-tyre-life");
const summaryStrategy = document.querySelector("#summary-strategy");
const podiumP1 = document.querySelector("#podium-p1");
const podiumP2 = document.querySelector("#podium-p2");
const podiumP3 = document.querySelector("#podium-p3");
const podiumP4 = document.querySelector("#podium-p4"); 
const btnNewRaceSummary = document.querySelector("#btn-new-race-summary");
const btnViewRaceSummary = document.querySelector("#btn-view-race-summary");
const raceEngineerMessage = document.querySelector("#race-engineer-message");
const liPositionTracker = document.querySelector("#position-tracker");
const liGapAhead = document.querySelector("#gap-ahead");
const liGapBehind = document.querySelector("#gap-behind");




//              race engine state 
export const renderRaceInfo = (car) => {

    trackLapCounter.textContent =
        `Lap ${car.lapsCompleted} / ${race.totalLaps}`;
};

export const renderCarStatus = (car) => {

    liFuel.textContent =
        `${Math.round(car.fuel)}%`;

    liTyreCompound.textContent =
        `${car.tyreCompound}`;

    liTyreLife.textContent =
        `${Math.round(car.tyreLife)}%`;


    // Fuel bar

    fuelBarFill.style.width =
        `${car.fuel}%`;


    if (car.fuel > 50) {

        fuelBarFill.style.background =
            "var(--color-success)";

    } else if (car.fuel > 25) {

        fuelBarFill.style.background =
            "var(--color-warning)";

    } else {

        fuelBarFill.style.background =
            "var(--color-danger)";
    };


    // Tyre compound indicator

    if (car.tyreCompound === "soft") {

        tyreIndicator.textContent = "S";

        tyreIndicator.style.color =
            "var(--tyre-soft)";

        tyreIndicator.style.borderColor =
            "var(--tyre-soft)";

    } else if (car.tyreCompound === "medium") {

        tyreIndicator.textContent = "M";

        tyreIndicator.style.color =
            "var(--tyre-medium)";

        tyreIndicator.style.borderColor =
            "var(--tyre-medium)";

    } else if (car.tyreCompound === "hard") {

        tyreIndicator.textContent = "H";

        tyreIndicator.style.color =
            "var(--tyre-hard)";

        tyreIndicator.style.borderColor =
            "var(--tyre-hard)";

    } else if (car.tyreCompound === "wet") {

        tyreIndicator.textContent = "W";

        tyreIndicator.style.color =
            "var(--tyre-wet)";

        tyreIndicator.style.borderColor =
            "var(--tyre-wet)";
    };


    // Tyre life bar

    tyreBarFill.style.width =
        `${car.tyreLife}%`;


    if (car.tyreLife > 50) {

        tyreBarFill.style.background =
            "var(--color-success)";

    } else if (car.tyreLife > 25) {

        tyreBarFill.style.background =
            "var(--color-warning)";

    } else {

        tyreBarFill.style.background =
            "var(--color-danger)";
    };
};

//                  Lap Log
export const addLapLog = (message) => {

    const logItem = document.createElement("li");

    logItem.textContent = message;

    lapLog.prepend(logItem);
};



export const renderCarsRanking = (
    playerPosition,
    gapAhead,
    gapBehind
) => {

    liPositionTracker.textContent = playerPosition;

    if (gapAhead !== null) {
        liGapAhead.textContent = `+${gapAhead.toFixed(2)}`;
    } else {
        liGapAhead.textContent = "--";
    };

    if (gapBehind !== null) {
        liGapBehind.textContent = `-${gapBehind.toFixed(2)}`;
    } else {
        liGapBehind.textContent = "--"
    };
};


export const clearLapLog = () => {
    lapLog.innerHTML = "";
};

//                  declare winner
export const showRaceResult = (car) => {

    if (car.name === "player") {
        raceResultWinner.textContent = "YOU WIN!";
    } else {
        raceResultWinner.textContent = `${car.name} WINS!`;
    };


    addLapLog(
        `Lap ${car.lapsCompleted} - ${car.name} won the race`
    );


    renderRaceSummary(car);

    renderFinalPodium();


    btnNewRaceSummary.classList.remove("hidden");

    finalResult.classList.remove("hidden");
    
};

//                 Render Race Summary
const renderRaceSummary = (winner) => {

    const carsToSort = [...cars];

    const sortedCars = sortCarsByProgress(carsToSort);

    const playerIndex = sortedCars.findIndex((car) => {
        return car === cars[0];
    });

    const playerPosition = playerIndex + 1;


    if (winner === cars[0]) {

        summaryResult.textContent = "Finished";
        summaryWinner.textContent = "You won the race";

    } else {

        summaryResult.textContent = "Finished";
        summaryWinner.textContent = `${winner.name} won the race`;
    };


    summaryPosition.textContent = `P${playerPosition}`;

    summaryLaps.textContent =
        `${cars[0].lapsCompleted} / ${race.totalLaps}`;

    summaryFuel.textContent =
        `${Math.round(cars[0].fuel)}%`;

    summaryTyre.textContent =
        cars[0].tyreCompound.toUpperCase();

    summaryTyreLife.textContent =
        `${Math.round(cars[0].tyreLife)}%`;

    summaryStrategy.textContent =
        cars[0].strategy.toUpperCase();
};


//                  Render Race Result Final Position
const renderFinalPodium = () => {

    const carsToSort = [...cars];

    const sortedCars = sortCarsByProgress(carsToSort);

    if (sortedCars[0].name === "player") {
        podiumP1.textContent = "YOU";
    } else {
        podiumP1.textContent = sortedCars[0].name.toUpperCase();
    };

    if (sortedCars[1].name === "player") {
        podiumP2.textContent = "YOU";
    } else {
        podiumP2.textContent = sortedCars[1].name.toUpperCase();
    };

    if (sortedCars[2].name === "player") {
        podiumP3.textContent = "YOU";
    } else {
        podiumP3.textContent = sortedCars[2].name.toUpperCase();
    };

    if (sortedCars[3].name === "player") {
        podiumP4.textContent = "YOU";
    } else {
        podiumP4.textContent = sortedCars[3].name.toUpperCase();
    };

};


// helper function for btnNewRaceSummary
export const onNewRaceSummaryClick = (callback) => {
    btnNewRaceSummary.addEventListener("click", callback);
};

btnViewRaceSummary.addEventListener("click", () => {

    finalResult.classList.add("hidden");

});

export const resetRaceSummary = () => {
    summaryResult.textContent = "Waiting";
    summaryPosition.textContent = "--";
    summaryWinner.textContent = "Race not started";
    
    summaryLaps.textContent = `-- / ${race.totalLaps}`;
    summaryFuel.textContent = "--";
    summaryTyre.textContent = "--";
    summaryTyreLife.textContent = "--";
    summaryStrategy.textContent = "--";
}

export const hideFinalResult = () => {
    finalResult.classList.add("hidden");
}


//                  Race Engineer
export const renderRaceEngineer = (message) => {

    if (message === "") {
        return;
    };

    raceEngineerMessage.textContent = message;
};


export const showRaceEngineerMessage = () => {
    raceEngineerMessage.textContent = "Race underway. I'll keep an eye on the strategy.";
};


                                    