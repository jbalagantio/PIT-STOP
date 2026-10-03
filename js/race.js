// importing dependencies
import { weather, race, cars } from "./state.js";

import { renderCarsRanking } from "./ui.js";

//                  Car Position in the race
// who leads the race and who is behind
export const racePosition = (car) => {
    
    return car.lapsCompleted * 30 + car.position;
    
}

// selection sort is used because its O(n^2) is irrelevant for data this size
export const sortCarsByProgress = (carsToSort) => {
    
    const lastIndex = carsToSort.length - 1;

    for (let i = 0; i < lastIndex; i++) {
        let leadingCar = i;

        for (let nextIndex = i + 1; nextIndex <= lastIndex; nextIndex++) {

            const nextCarProgress = racePosition(carsToSort[nextIndex]);
            const leadingCarProgress = racePosition(carsToSort[leadingCar]);

            if (nextCarProgress > leadingCarProgress) {
                leadingCar = nextIndex;
            }
        }

        if (leadingCar !== i) {
            //swap
            let temp = carsToSort[i];

            carsToSort[i] = carsToSort[leadingCar]
            carsToSort[leadingCar] = temp;
        }
    }

    return carsToSort;
};


//          car progress
export const carProgress = (car) => {
    if (car.isPitting === true) {
        car.speed = 0;
    } else {
        if(car.strategy === "baseline") {
        car.speed = 2;
        } else if (car.strategy === "push") {
            car.speed = 2.2;
        } else if (car.strategy === "conserve") {
            car.speed = 1.8;
        };

        if (car.tyreCompound === "soft") {
            car.speed = car.speed + 0.3;
        } else if (car.tyreCompound === "medium") {
            car.speed = car.speed + 0.15;
        } else if (car.tyreCompound === "hard") {
            car.speed = car.speed 
        } else if (car.tyreCompound === "wet") {
            car.speed = car.speed;
        }
        
        if (car.tyreLife <= 80 && car.tyreLife > 50) {
            car.speed = car.speed - 0.2;
        } else if (car.tyreLife <= 50) {
            car.speed = car.speed - 0.5;
        };

        if (weather.condition === "clear") {
        if (car.tyreCompound === "wet") {
            car.speed = car.speed - 0.20;
        } else {
            car.speed = car.speed;
        };
    } else if (weather.condition === "wet") {
        if (car.tyreCompound === "wet") {
            car.speed = car.speed;
        } else {
            car.speed = car.speed - 0.30;
        };
    } else if (weather.condition === "rain") {
        if (car.tyreCompound === "wet") {
            car.speed = car.speed;
        } else {
            car.speed = car.speed - 0.60;
        };
    };
    }

    car.position += car.speed;
};


//                      car DNF 
export const carDNF = (car, reason) => {
    car.isDNF = true;
    car.dnfReason = reason;
    car.speed = 0;
    car.pitRequested = false;
    car.isPitting = false;

    console.log(`${car.name} DNF: ${car.dnfReason}`);
};

//              Fuel Consumption
export const fuelGuage = (car) => {
    let fuelConsumption;

    if (car.isPitting === true) {
        fuelConsumption = 0;
    } else if (car.strategy === "push") {
        fuelConsumption = 0.65;
        car.fuel -= fuelConsumption;
    } else  if (car.strategy === "baseline") {
        fuelConsumption = 0.50;
        car.fuel -= fuelConsumption;
    } else  if (car.strategy === "conserve") {
        fuelConsumption = 0.45;
        car.fuel -= fuelConsumption;
    };

    if (car.fuel < fuelConsumption) {
        carDNF(car, "Out of fuel");
    };
};

//              Tyre Life
export const tyreStatus = (car) => {
    let tyreWear;

    if (car.isPitting === true){
        tyreWear = 0;
    } else if (car.strategy === "push") {
        tyreWear = 0.50;
    } else if (car.strategy === "baseline") {
        tyreWear = 0.40;
    } else if (car.strategy === "conserve") {
        tyreWear = 0.35;
    };

    if (car.tyreCompound === "wet") {
        tyreWear = tyreWear *1;
    } else if (car.tyreCompound === "soft") {
        tyreWear = tyreWear * 1.25;
    } else if (car.tyreCompound === "medium") {
        tyreWear = tyreWear * 1;
    } else if (car.tyreCompound === "hard") {
        tyreWear = tyreWear * 0.90;
    };

    if (weather.condition === "clear") {
        if (car.tyreCompound === "wet") {
            tyreWear = tyreWear * 1.50;
        } else {
            tyreWear = tyreWear;
        };
    } else if (weather.condition === "wet") {
        if (car.tyreCompound === "wet") {
            tyreWear = tyreWear * 0.85;
        } else {
            tyreWear = tyreWear * 1.20;
        };
    } else if (weather.condition === "rain") {
        if (car.tyreCompound === "wet") {
            tyreWear = tyreWear * 0.80;
        } else {
            tyreWear = tyreWear * 1.50;
        };
    };

    car.tyreLife -= tyreWear;
    if (car.tyreLife < tyreWear) {
        carDNF(car, "Tyre failure");
    };
};

//              Fuel Crew
export const fillmore = (car) => {

    car.fuel = 100;

    car.fuelServiced = true;
};

//               Tyre Crew

export const guido = (car) => {
    car.tyreCompound = car.newTyreSet;
    car.newTyreSet = "";

    car.tyreLife = 100;

    car.tyreServiced = true;
};


export const selectTyre = (car, newSetOfTyres) => {
    car.tyreServiceRequested = true;
    car.newTyreSet = newSetOfTyres;
};


//                      Pit Request
export const pitRequest = (car) => {
    if (car.pitRequested === false) {
        car.pitRequested = true; 
    } else if (car.pitRequested === true){
        alert("Pit Stop already requested.")
    };
};


export const releaseCar = (car) => {

    if(car.tyreServiceRequested === true && 
    car.tyreServiced === true && 
    car.fuelServiceRequested === false) {

        car.isPitting = false;
        car.pitRequested = false;

        car.tyreServiceRequested = false;
        car.tyreServiced = false;

    } else if (car.fuelServiceRequested === true && 
    car.fuelServiced === true && 
    car.tyreServiceRequested === false) {

        car.isPitting = false;
        car.pitRequested = false;

        car.fuelServiceRequested = false;
        car.fuelServiced = false;

    } else if (car.tyreServiceRequested === true && 
    car.tyreServiced === true &&
    car.fuelServiceRequested === true && 
    car.fuelServiced === true) {

        car.isPitting = false;
        car.pitRequested = false;

        car.tyreServiceRequested = false;
        car.tyreServiced = false;
        car.fuelServiceRequested = false;
        car.fuelServiced = false;

    };
    
};


// //                  PIT STOP
export const pitStop = (car) => {

    if (car.isPitting === false) {
        car.isPitting = true

        if (car.tyreServiceRequested === true) {
            setTimeout(() => {
                
                guido(car);
                
                releaseCar(car);

            }, 2000);

        }
         if (car.fuelServiceRequested === true) {
            setTimeout(() => {

                fillmore(car);

                releaseCar(car);
                
            }, 1000)
        };
    };
};


//                  Lap Tracker
export const raceLap = (car) => {
    if (car.position >= 30) {
        const lapProgress = car.position - 30;

        car.lapsCompleted++;
        car.position = lapProgress;

        if(car.pitRequested === true) {
            pitStop(car);
        };
    };
};


// Player and computer car strategy
export const carStrategy = (car, strategy) => {

    if(strategy === "push") {
        car.strategy = "push";

    } else if (strategy === "baseline") {
        car.strategy = "baseline";

    } else if (strategy === "conserve") {
        car.strategy = "conserve";

    } else if (strategy === "pit") {
        pitRequest(car);
    };

};


//                  Computer Safety Check
export const computerSafetyCheck = (car) => {

    if (car.isDNF === true) {
        return;
    };

    if (car.pitRequested === true || car.isPitting === true) {
        return;
    };

    //                  Critical Fuel

    if (car.fuel <= 20) {

        carStrategy(car, "conserve");

        car.fuelServiceRequested = true;

        selectTyre(car, car.tyreCompound);

        pitRequest(car);

        return;
    };

    //                  Critical Tyres

    if (car.tyreLife <= 25) {

        carStrategy(car, "conserve");

        selectTyre(car, car.tyreCompound);

        pitRequest(car);
    };

};


//                  winner check
export const checkWinner = (car, showResult) => {

    if (car.lapsCompleted === race.totalLaps) {
        race.winner = car.name;

        showResult(car);
    };
};


//                  Update Race State
export const raceStatus = (car, showResult) => {
    if (car.isDNF === false) {
        carProgress(car);

        raceLap(car);

        checkWinner(car, showResult);

        tyreStatus(car);

        fuelGuage(car);
    };
};


//                  Unable to continue race
export const stopRace = () => {
    race.isRunning = false;
    console.log(`Failed... Unable to continue race:`);

};

//                  cars Ranking
export const carsRanking = () => {
    const carsToSort = [...cars];
    const sortedCars = sortCarsByProgress(carsToSort);

    let playerIndex = sortedCars.findIndex((car) => {
        return car.name === "player";
    });

    let playerPosition = `P${playerIndex + 1}`;

    let carAhead = null;
    let carBehind = null;

    let gapAhead = null;
    let gapBehind = null;

    if (playerIndex > 0) {
        carAhead = sortedCars[playerIndex - 1];
    };

    if (playerIndex < sortedCars.length - 1) {
        carBehind = sortedCars[playerIndex + 1];
    };

    if (carAhead !== null) {
        const playerProgress = racePosition(cars[0]);
        const carAheadProgress = racePosition(carAhead);

        gapAhead = carAheadProgress - playerProgress;
    };

    if (carBehind !== null) {
        const playerProgress = racePosition(cars[0]);
        const carBehindProgress = racePosition(carBehind);

        gapBehind = playerProgress - carBehindProgress;
    };

    renderCarsRanking(
        playerPosition,
        gapAhead,
        gapBehind
    );
};
