// importing dependencies
import { 
    race, 
    weather, 
    cars,
    docFuelWarning,
    docTyreWarning,
 } from "./state.js";

import { 
    sortCarsByProgress, 
    racePosition, 
    carStrategy,
    selectTyre,
    pitRequest,
} from "./race.js";

import { renderRaceEngineer } from "./ui.js";

 //                  Doc Event State
let lastWeatherCondition = weather.condition;
//                  Doc Decision State
let lastDocLap = -1;
let docIsThinking = false;
let lastDocRequestTime = 0;
const docCooldown = 5000;

//              integrating AI Agent - Groq
//                          Doc AI

// const API_KEY = "YOUR_SIKYORD_KEY";
const SIKYORD_KEY = "sky_8ReIxo-PXSalxH6Ho28psTRw4UiQvFJJxY_CZFm83xo"
const SIKYORD_ENDPOINT = "https://sikyord.istoore.online/api/v1/records/46ff6e84-9433-41aa-b2fd-d210ec3aaa73"

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

//                   sikyord API Key
const myKey = async () => {
    try {
        const response = await fetch(`${SIKYORD_ENDPOINT}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${SIKYORD_KEY}`,
            }
        });

        const result = await response.json();

        return result.data;
    } catch (error) {
        console.log(error);
    }
};

//                  Doc System Instructions

const docSystemMessage = {
    role: "system",
    content: `
        You are Doc, the race engineer and strategist for the computer-controlled
        cars in a racing strategy game called Pit Stop.

        Your job is to aggressively compete for the best possible finishing
        position while still keeping each car capable of finishing the race.

        You control Computer 1, Computer 2, and Computer 3 independently.
        They are rivals, not teammates.

        You may decide:
        - driving strategy: push, baseline, or conserve
        - whether a car should pit
        - which tyre compound to install during a pit stop:
          soft, medium, hard, or wet
        - whether the car should refuel during a pit stop

        Driving strategies:

        push:
        - fastest
        - highest fuel consumption
        - highest tyre wear
        - use when attacking, defending, closing a small gap,
          or when enough resources remain

        baseline:
        - balanced speed, fuel consumption, and tyre wear
        - use when there is no strong reason to attack or conserve

        conserve:
        - slowest
        - lowest fuel consumption
        - lowest tyre wear
        - use when fuel or tyre life must be protected

        Simulation resource usage:

        push:
        - fuel consumption: 0.65 per simulation update
        - base tyre wear: 0.50 per simulation update

        baseline:
        - fuel consumption: 0.50 per simulation update
        - base tyre wear: 0.40 per simulation update

        conserve:
        - fuel consumption: 0.45 per simulation update
        - base tyre wear: 0.35 per simulation update

        Tyre compound and weather can further change tyre wear.

        Tyres:

        soft:
        - fastest dry tyre
        - highest tyre wear

        medium:
        - balanced dry tyre

        hard:
        - slowest dry tyre
        - lowest tyre wear

        wet:
        - designed for wet or rainy conditions
        - inappropriate for a clear dry track

        Strategic diversity:

        Treat each computer-controlled car as an independent competitor.

        Do not automatically give all computer cars the same strategy, pit timing,
        or tyre compound.

        Evaluate each car based on its own:
        - race position
        - gap to nearby cars
        - fuel
        - tyre condition
        - current tyre compound
        - remaining race distance

        Use tyre compounds strategically.

        Soft tyres are useful when outright speed is valuable and the car can afford
        higher tyre wear, especially for aggressive attacks or shorter remaining stints.

        Medium tyres provide a balance between speed and durability.

        Hard tyres are useful for longer stints where reducing tyre wear can avoid
        an additional pit stop.

        Wet tyres should be used when track conditions justify them.

        When choosing tyres during a pit stop, consider the length and purpose of the
        next stint rather than automatically choosing medium.

        Different cars may benefit from different strategies.

        For example, a leading car may protect its position with a sustainable strategy,
        while a chasing car may accept greater tyre wear and fuel consumption to attack.

        A car far behind may take a strategic risk that would not make sense for a car
        already in a strong race position.

        Do not create differences merely for variety. If the same decision is genuinely
        best for multiple cars, they may use the same strategy.

        Pit strategy:

        A pit stop costs race time, so do not pit unnecessarily.
        However, running out of fuel or destroying the tyres causes a DNF
        and is much worse than losing time in the pits.

        If a pit stop is needed, request it early enough that the car can
        reach the pit before fuel or tyres are exhausted.

        When pit is true, tyre means the fresh tyre compound that should
        be installed. The requested compound may be the same as the current
        compound because worn tyres can be replaced with a fresh set.

        Refuel when the remaining fuel is unlikely to safely support the
        remaining race distance.

        Race behavior:

        Do not default to baseline simply because the car is currently safe.

        Look for opportunities to attack.

        A car with healthy fuel and tyres should consider push when:
        - chasing a nearby car
        - defending against a nearby car behind
        - attempting to improve race position
        - approaching the end of the race with enough resources remaining

        Consider conserve when preserving fuel or tyres creates a better
        chance of finishing or avoiding an unnecessary pit stop.

        Each computer car should use its own situation. Do not automatically
        give all three cars the same strategy.

        You do not control:
        - speed
        - position
        - fuel consumption calculations
        - tyre degradation calculations
        - lap count
        - race physics

        The JavaScript race engine controls those values.

        Never attempt to modify race values directly.

        If a car has DNF, its decision no longer matters.

        The goal is not merely to finish.
        The goal is to finish in the highest position possible without
        recklessly causing a DNF.

        You are also the player's Race Engineer.

        In addition to controlling the computer cars, provide one short strategic
        message to the player based on the current race situation.

        Your Race Engineer message should:
        - focus on the most important strategic information right now
        - consider fuel, tyre life, tyre compound, weather, race position,
        remaining laps, and nearby competitors
        - recommend push, baseline, conserve, pit timing, tyre choice, or refueling
        when appropriate
        - warn the player when their current strategy is risky
        - acknowledge when the player's current strategy is sensible
        - remain concise and useful during a live race

        You are an advisor to the player.

        Never make decisions for the player and never claim that you changed
        the player's strategy, tyres, fuel, or pit request.

        Do not give unnecessary advice when the player's situation is stable.
        Keep the Race Engineer message to one or two short sentences.
    `,
};


//                  Ask Doc
export const askDoc = async () => {

    const raceSnapshot = buildRaceSnapshot();

    const messages = [
        docSystemMessage,
        {
            role: "user",
            content: raceSnapshot,
        },
    ];

    try {

        //key
        const groqKey = await myKey();


        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqKey}`,
            },
            body: JSON.stringify(
                {
                    model: "openai/gpt-oss-20b",
                    messages: messages,

                    response_format: {
                        type: "json_schema",
                        json_schema: {
                            name: "doc_strategy",
                            strict: true,
                            schema: {
                                type: "object",
                                properties: {

                                    computer1: {
                                        type: "object",
                                        properties: {
                                            strategy: {
                                                type: "string",
                                                enum: ["push", "baseline", "conserve"],
                                            },
                                            pit: {
                                                type: "boolean",
                                            },
                                            tyre: {
                                                type: "string",
                                                enum: ["soft", "medium", "hard", "wet"],
                                            },
                                            refuel: {
                                                type: "boolean",
                                            },
                                        },
                                        required: [
                                            "strategy",
                                            "pit",
                                            "tyre",
                                            "refuel",
                                        ],
                                        additionalProperties: false,
                                    },

                                    computer2: {
                                        type: "object",
                                        properties: {
                                            strategy: {
                                                type: "string",
                                                enum: ["push", "baseline", "conserve"],
                                            },
                                            pit: {
                                                type: "boolean",
                                            },
                                            tyre: {
                                                type: "string",
                                                enum: ["soft", "medium", "hard", "wet"],
                                            },
                                            refuel: {
                                                type: "boolean",
                                            },
                                        },
                                        required: [
                                            "strategy",
                                            "pit",
                                            "tyre",
                                            "refuel",
                                        ],
                                        additionalProperties: false,
                                    },

                                    computer3: {
                                        type: "object",
                                        properties: {
                                            strategy: {
                                                type: "string",
                                                enum: ["push", "baseline", "conserve"],
                                            },
                                            pit: {
                                                type: "boolean",
                                            },
                                            tyre: {
                                                type: "string",
                                                enum: ["soft", "medium", "hard", "wet"],
                                            },
                                            refuel: {
                                                type: "boolean",
                                            },
                                        },

                                        required: [
                                            "strategy",
                                            "pit",
                                            "tyre",
                                            "refuel",
                                        ],
                                        additionalProperties: false,
                                    },

                                    raceEngineer: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                            },
                                        },
                                        required: [
                                            "message",
                                        ],
                                        additionalProperties: false,
                                    },
                                },

                                required: [
                                    "computer1",
                                    "computer2",
                                    "computer3",
                                    "raceEngineer",
                                ],

                                additionalProperties: false,
                            },
                        },
                    },
                },
            ),
        });

        if (response.ok === false) {

            const errorData = await response.json();

            console.log("Groq Error:");
            console.log(errorData);

            throw new Error(`Doc API Error: ${response.status}`);
        };

        const result = await response.json();

        const reply = result.choices[0].message.content;

        const docDecision = JSON.parse(reply);

        console.log("Doc Decision:");
        console.log(docDecision);

        return docDecision;

    } catch(error) {
        console.log("Doc failed to make a decision.");
        console.log(error);

        return null;
    };
};



//                  Build Race Snapshot
export const buildRaceSnapshot = () => {

    const carsToSort = [...cars];
    const sortedCars = sortCarsByProgress(carsToSort);

    const computer1Position = sortedCars.findIndex((car) => {
        return car.name === cars[1].name;
    });

    const computer2Position = sortedCars.findIndex((car) => {
        return car.name === cars[2].name;
    });

    const computer3Position = sortedCars.findIndex((car) => {
        return car.name === cars[3].name;
    });

    const playerPosition = sortedCars.findIndex((car) => {
        return car.name === cars[0].name;
    });

    const playerProgress = racePosition(cars[0]);
    const computer1Progress = racePosition(cars[1]);
    const computer2Progress = racePosition(cars[2]);
    const computer3Progress = racePosition(cars[3]);

    const lapsRemaining = race.totalLaps - cars[0].lapsCompleted;

    const raceSnapshot = `
        Current Race State:

        Race:
        Total Laps: ${race.totalLaps}
        Player Laps Remaining: ${lapsRemaining}
        Weather: ${weather.condition}
        Temperature: ${weather.temperature}
        Precipitation: ${weather.precipitation}
        Wind Speed: ${weather.windSpeed}


        Player:
        Race Position: P${playerPosition + 1}
        Laps Completed: ${cars[0].lapsCompleted}
        Race Progress: ${playerProgress.toFixed(2)}
        Fuel: ${Math.round(cars[0].fuel)}
        Tyre Compound: ${cars[0].tyreCompound}
        Tyre Life: ${Math.round(cars[0].tyreLife)}
        Strategy: ${cars[0].strategy}
        Pit Requested: ${cars[0].pitRequested}
        Currently Pitting: ${cars[0].isPitting}
        DNF: ${cars[0].isDNF}


        Computer 1:
        Race Position: P${computer1Position + 1}
        Laps Completed: ${cars[1].lapsCompleted}
        Race Progress: ${computer1Progress.toFixed(2)}
        Fuel: ${Math.round(cars[1].fuel)}
        Tyre Compound: ${cars[1].tyreCompound}
        Tyre Life: ${Math.round(cars[1].tyreLife)}
        Strategy: ${cars[1].strategy}
        Pit Requested: ${cars[1].pitRequested}
        Currently Pitting: ${cars[1].isPitting}
        DNF: ${cars[1].isDNF}


        Computer 2:
        Race Position: P${computer2Position + 1}
        Laps Completed: ${cars[2].lapsCompleted}
        Race Progress: ${computer2Progress.toFixed(2)}
        Fuel: ${Math.round(cars[2].fuel)}
        Tyre Compound: ${cars[2].tyreCompound}
        Tyre Life: ${Math.round(cars[2].tyreLife)}
        Strategy: ${cars[2].strategy}
        Pit Requested: ${cars[2].pitRequested}
        Currently Pitting: ${cars[2].isPitting}
        DNF: ${cars[2].isDNF}


        Computer 3:
        Race Position: P${computer3Position + 1}
        Laps Completed: ${cars[3].lapsCompleted}
        Race Progress: ${computer3Progress.toFixed(2)}
        Fuel: ${Math.round(cars[3].fuel)}
        Tyre Compound: ${cars[3].tyreCompound}
        Tyre Life: ${Math.round(cars[3].tyreLife)}
        Strategy: ${cars[3].strategy}
        Pit Requested: ${cars[3].pitRequested}
        Currently Pitting: ${cars[3].isPitting}
        DNF: ${cars[3].isDNF}

        Make the next strategic decision for Computer 1, Computer 2,
        and Computer 3.

        Each computer car is competing independently and should try to finish
        in the highest race position possible.

        Do not request another pit stop for a car that already has a pit stop
        requested or is currently pitting.

        Do not make strategic changes for a car that has DNF.
    `;

    return raceSnapshot;
};


//                  Apply Doc Decision
export const applyDocDecision = (docDecision) => {

    if (docDecision === null) {
        return;
    };


    const computer1Decision = docDecision.computer1;
    const computer2Decision = docDecision.computer2;
    const computer3Decision = docDecision.computer3;

    const raceEngineerDecision = docDecision.raceEngineer;

    const computer1 = cars[1];
    const computer2 = cars[2];
    const computer3 = cars[3];

    applyComputerDecision(computer1, computer1Decision);
    applyComputerDecision(computer2, computer2Decision);
    applyComputerDecision(computer3, computer3Decision);


    renderRaceEngineer(raceEngineerDecision.message);
};




//                  Apply Computer Decision
const applyComputerDecision = (car, decision) => {

    if (car.isDNF === true) {
        return;
    };

    //                  Strategy
    carStrategy(car, decision.strategy);


    //                  Pit Decision
    if (
        decision.pit === true &&
        car.pitRequested === false &&
        car.isPitting === false
    ) {
        //                  Tyre Service

        selectTyre(car, decision.tyre);

        //                  Fuel Service

        if (decision.refuel === true) {
            car.fuelServiceRequested = true;
        };

        //                  Request Pit Stop
        pitRequest(car);
    };

};


//                  Doc Decision Cycle
export const docDecisionCycle = async () => {

    const currentLap = cars[0].lapsCompleted;
    const currentTime = Date.now();

    if (race.isRunning === false) {
        return;
    };

    if (race.winner !== null) {
        return;
    };

    if (docIsThinking === true) {
        return;
    };


    const isDecisionLap = currentLap % 5 === 0;
    const isImportantEvent = docEventCheck();

    const cooldownFinished =
        currentTime - lastDocRequestTime >= docCooldown;


    if (
        (
            (
                isDecisionLap === true &&
                currentLap !== lastDocLap
            ) ||
            isImportantEvent === true
        ) &&
        cooldownFinished === true
    ) {

        console.log(
            `Doc Trigger — Lap: ${currentLap}, Important Event: ${isImportantEvent}`
        );

        docIsThinking = true;
        lastDocRequestTime = currentTime;


        if (isDecisionLap === true) {
            lastDocLap = currentLap;
        };


        const docDecision = await askDoc();

        if (docDecision !== null) {
            applyDocDecision(docDecision);
        };

        docIsThinking = false;
    };

};


export const resetDoc = () => {
    //                  Doc Event State
    lastWeatherCondition = weather.condition;
    //                  Doc Decision State
    lastDocLap = -1;
    docIsThinking = false;
    lastDocRequestTime = 0;
};


//                  Doc Important Event Check
const docEventCheck = () => {

    let importantEvent = false;


    //                  Weather Event
    if (
        weather.condition !== "" &&
        weather.condition !== lastWeatherCondition
    ) {

        importantEvent = true;
        lastWeatherCondition = weather.condition;
    };


    //                  Computer Events
    for (let i = 1; i < cars.length; i++) {

        const car = cars[i];

        if (car.isDNF === false) {


            //                  Fuel Warning

            if (
                car.fuel <= 35 &&
                docFuelWarning[car.name] === false
            ) {

                docFuelWarning[car.name] = true;
                importantEvent = true;
            };


            //                  Tyre Warning
            if (
                car.tyreLife <= 35 &&
                docTyreWarning[car.name] === false
            ) {

                docTyreWarning[car.name] = true;
                importantEvent = true;
            };


            //                  Reset Fuel Warning
            if (car.fuel > 35) {
                docFuelWarning[car.name] = false;
            };


            //                  Reset Tyre Warning
            if (car.tyreLife > 35) {
                docTyreWarning[car.name] = false;
            };
        };
    };

    return importantEvent;
};
