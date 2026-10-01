console.log("PIT STOP JS Loaded!");
const trackCanvas = document.querySelector("#track-view-canvas");
const ctx = trackCanvas.getContext("2d");

// //Test Car For Sprite
// const testCarSprite =
//     new Image();

// testCarSprite.src =
//     "./assets/cars/umgt3-1.png";

const carSprites = {
    player: new Image(),
    computer1: new Image(),
    computer2: new Image(),
    computer3: new Image()
};


carSprites.player.src =
    "./assets/cars/umgt3-1.png";

carSprites.computer1.src =
    "./assets/cars/umgt3-2.png";

carSprites.computer2.src =
    "./assets/cars/umgt3-3.png";

carSprites.computer3.src =
    "./assets/cars/umgt3-4.png";

Object.values(
    carSprites
).forEach((sprite) => {

    sprite.onload = () => {
        raceTracker();
    };
});

const trackLapCounter = document.querySelector("#track-lap-counter");
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
const raceEngineerMessage = document.querySelector("#race-engineer-message");
const lapLog = document.querySelector("#lap-log");
const liWeatherConditionValue = document.querySelector("#weather-condition-value");
const liAirTempValue = document.querySelector("#air-temp-value");
const liWindSpeedValue = document.querySelector("#wind-speed-value");
const liPositionTracker = document.querySelector("#position-tracker");
const liGapAhead = document.querySelector("#gap-ahead");
const liGapBehind = document.querySelector("#gap-behind");
const liFuel = document.querySelector("#li-fuel");
const liTyreCompound = document.querySelector("#li-tyre");
const liTyreLife = document.querySelector("#li-tyre-life");
const fuelBarFill = document.querySelector(".fuel-bar-fill");
const tyreBarFill = document.querySelector(".tyre-bar-fill");
const tyreIndicator = document.querySelector("#tyre-indicator");
const finalResult = document.querySelector(".final-result");
const raceResultCard = document.querySelector(".race-result-card");
const raceResultWinner = document.querySelector("#race-result-winner");
const btnViewRaceSummary = document.querySelector("#btn-view-race-summary");
const btnNewRaceSummary = document.querySelector("#btn-new-race-summary");
const summaryResult = document.querySelector("#summary-result");
const summaryPosition = document.querySelector("#summary-position");
const summaryWinner = document.querySelector("#summary-winner");
const summaryLaps = document.querySelector("#summary-laps");
const summaryFuel = document.querySelector("#summary-fuel");
const summaryTyre = document.querySelector("#summary-tyre");
const summaryTyreLife = document.querySelector("#summary-tyre-life");
const summaryStrategy = document.querySelector("#summary-strategy");
const rainEffect = document.querySelector(".rain-effect");
const podiumP1 = document.querySelector("#podium-p1");
const podiumP2 = document.querySelector("#podium-p2");
const podiumP3 = document.querySelector("#podium-p3");
const podiumP4 = document.querySelector("#podium-p4");


//              race state
const race = {
    isRunning: false,
    totalLaps: 30, // temporary bring down to 5 for testing. put it back to 30
    winner: null,
};

const weather = {
    condition: "",
    temperature: "",
    precipitation: 0,
    windSpeed: 0,
};

//              Cars data
const cars = [
    {
        name: "player",
        color: "blue",
        fuel: 100,
        tyreCompound: "medium",
        tyreLife: 100,
        position: 0, 
        speed: 2,
        strategy: "baseline",
        lapsCompleted: 0,
        fuelServiceRequested: false,
        fuelServiced: false,
        tyreServiceRequested: false,
        tyreServiced: false,
        pitRequested: false,
        isPitting: false,
        newTyreSet: "",
        isDNF: false,
        dnfReason: "",
    },
    {
        name: "computer1",
        color: "red",
        fuel: 100,
        tyreCompound: "medium",
        tyreLife: 100,
        position: 0, 
        speed: 2,
        strategy: "baseline",
        lapsCompleted: 0,
        fuelServiceRequested: false,
        fuelServiced: false,
        tyreServiceRequested: false,
        tyreServiced: false,
        pitRequested: false,
        isPitting: false,
        newTyreSet: "",
        isDNF: false,
        dnfReason: "",
    },
    {
        name: "computer2",
        color: "yellow",
        fuel: 100,
        tyreCompound: "medium",
        tyreLife: 100,
        position: 0, 
        speed: 2,
        strategy: "baseline",
        lapsCompleted: 0,
        fuelServiceRequested: false,
        fuelServiced: false,
        tyreServiceRequested: false,
        tyreServiced: false,
        pitRequested: false,
        isPitting: false,
        newTyreSet: "",
        isDNF: false,
        dnfReason: "",
    },
    {
        name: "computer3",
        color: "violet",
        fuel: 100,
        tyreCompound: "medium",
        tyreLife: 100,
        position: 0, 
        speed: 2,
        strategy: "baseline",
        lapsCompleted: 0,
        fuelServiceRequested: false,
        fuelServiced: false,
        tyreServiceRequested: false,
        tyreServiced: false,
        pitRequested: false,
        isPitting: false,
        newTyreSet: "",
        isDNF: false,
        dnfReason: "",
    },
];

const carVisualPositions = {
    player: {
        previousPosition: 0,
        currentPosition: 0
    },

    computer1: {
        previousPosition: 0,
        currentPosition: 0
    },

    computer2: {
        previousPosition: 0,
        currentPosition: 0
    },

    computer3: {
        previousPosition: 0,
        currentPosition: 0
    }
};


let lastSimulationTime =
    performance.now();

const simulationInterval =
    200;


const updateCarVisualPositions = () => {

    cars.forEach((car) => {

        const visualPosition =
            carVisualPositions[car.name];


        visualPosition.previousPosition =
            visualPosition.currentPosition;


        visualPosition.currentPosition =
            racePosition(car);
    });


    lastSimulationTime =
        performance.now();
};

//                  Doc Decision State
let lastDocLap = -1;
let docIsThinking = false;
let lastDocRequestTime = 0;
const docCooldown = 5000;

//                  Doc Event State
let lastWeatherCondition = weather.condition;

const docFuelWarning = {
    computer1: false,
    computer2: false,
    computer3: false,
};

const docTyreWarning = {
    computer1: false,
    computer2: false,
    computer3: false,
};


//          car progress
const carProgress = (car) => {
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

//              Drawing the car
// const drawRaceCar = (
//     carX,
//     carY,
//     angle,
//     color
// ) => {

//     ctx.save();

//     ctx.translate(
//         carX,
//         carY
//     );

//     ctx.rotate(
//         angle + Math.PI / 2
//     );

//     ctx.scale(
//         1.25,
//         1.25
//     );


//     // Car shadow

//     ctx.fillStyle =
//         "rgba(0, 0, 0, 0.35)";

//     ctx.beginPath();

//     ctx.ellipse(
//         2,
//         2,
//         9,
//         17,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();


//     // Rear wing

//     ctx.fillStyle =
//         "#0b0e10";

//     ctx.fillRect(
//         -10,
//         11,
//         20,
//         3
//     );


//     // Rear wing mounts

//     ctx.fillRect(
//         -6,
//         8,
//         2,
//         5
//     );

//     ctx.fillRect(
//         4,
//         8,
//         2,
//         5
//     );


//     // Main GT body

//     ctx.fillStyle =
//         color;

//     ctx.beginPath();

//     ctx.moveTo(
//         -5,
//         -14
//     );

//     ctx.quadraticCurveTo(
//         -9,
//         -12,
//         -9,
//         -7
//     );

//     ctx.lineTo(
//         -10,
//         3
//     );

//     ctx.quadraticCurveTo(
//         -10,
//         9,
//         -7,
//         11
//     );

//     ctx.lineTo(
//         7,
//         11
//     );

//     ctx.quadraticCurveTo(
//         10,
//         9,
//         10,
//         3
//     );

//     ctx.lineTo(
//         9,
//         -7
//     );

//     ctx.quadraticCurveTo(
//         9,
//         -12,
//         5,
//         -14
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Front splitter

//     ctx.fillStyle =
//         "#111518";

//     ctx.beginPath();

//     ctx.moveTo(
//         -8,
//         -13
//     );

//     ctx.lineTo(
//         8,
//         -13
//     );

//     ctx.lineTo(
//         10,
//         -11
//     );

//     ctx.lineTo(
//         -10,
//         -11
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Left wheel arches

//     ctx.fillStyle =
//         "#111518";

//     ctx.beginPath();

//     ctx.ellipse(
//         -8,
//         -7,
//         2.5,
//         5,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();

//     ctx.beginPath();

//     ctx.ellipse(
//         -9,
//         6,
//         2.5,
//         5,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();


//     // Right wheel arches

//     ctx.beginPath();

//     ctx.ellipse(
//         8,
//         -7,
//         2.5,
//         5,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();

//     ctx.beginPath();

//     ctx.ellipse(
//         9,
//         6,
//         2.5,
//         5,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();


//     // Body covers inner wheel arches

//     ctx.fillStyle =
//         color;

//     ctx.fillRect(
//         -7,
//         -10,
//         14,
//         18
//     );


//     // Hood

//     ctx.fillStyle =
//         color;

//     ctx.beginPath();

//     ctx.moveTo(
//         -5,
//         -11
//     );

//     ctx.lineTo(
//         5,
//         -11
//     );

//     ctx.lineTo(
//         4,
//         -4
//     );

//     ctx.lineTo(
//         -4,
//         -4
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Windshield

//     ctx.fillStyle =
//         "#17232b";

//     ctx.beginPath();

//     ctx.moveTo(
//         -4,
//         -3
//     );

//     ctx.lineTo(
//         4,
//         -3
//     );

//     ctx.lineTo(
//         5,
//         2
//     );

//     ctx.lineTo(
//         -5,
//         2
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Roof

//     ctx.fillStyle =
//         "#202a30";

//     ctx.beginPath();

//     ctx.moveTo(
//         -5,
//         2
//     );

//     ctx.lineTo(
//         5,
//         2
//     );

//     ctx.lineTo(
//         4,
//         7
//     );

//     ctx.lineTo(
//         -4,
//         7
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Rear window

//     ctx.fillStyle =
//         "#141d22";

//     ctx.beginPath();

//     ctx.moveTo(
//         -4,
//         7
//     );

//     ctx.lineTo(
//         4,
//         7
//     );

//     ctx.lineTo(
//         5,
//         9
//     );

//     ctx.lineTo(
//         -5,
//         9
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Racing stripe

//     ctx.fillStyle =
//         "rgba(255, 255, 255, 0.75)";

//     ctx.fillRect(
//         -1,
//         -12,
//         2,
//         5
//     );

//     ctx.fillRect(
//         -1,
//         8,
//         2,
//         2
//     );


//     // Hood vents

//     ctx.fillStyle =
//         "#20272b";

//     ctx.fillRect(
//         -4,
//         -7,
//         2,
//         3
//     );

//     ctx.fillRect(
//         2,
//         -7,
//         2,
//         3
//     );


//     // Headlights

//     ctx.fillStyle =
//         "#eaf7ff";

//     ctx.beginPath();

//     ctx.moveTo(
//         -7,
//         -10
//     );

//     ctx.lineTo(
//         -3,
//         -11
//     );

//     ctx.lineTo(
//         -4,
//         -9
//     );

//     ctx.lineTo(
//         -7,
//         -8
//     );

//     ctx.closePath();

//     ctx.fill();


//     ctx.beginPath();

//     ctx.moveTo(
//         7,
//         -10
//     );

//     ctx.lineTo(
//         3,
//         -11
//     );

//     ctx.lineTo(
//         4,
//         -9
//     );

//     ctx.lineTo(
//         7,
//         -8
//     );

//     ctx.closePath();

//     ctx.fill();


//     // Headlight glow

//     ctx.fillStyle =
//         "rgba(210, 240, 255, 0.18)";

//     ctx.beginPath();

//     ctx.ellipse(
//         -5,
//         -10,
//         4,
//         2,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();

//     ctx.beginPath();

//     ctx.ellipse(
//         5,
//         -10,
//         4,
//         2,
//         0,
//         0,
//         Math.PI * 2
//     );

//     ctx.fill();


//     // Tail lights

//     ctx.fillStyle =
//         "#ff3b3b";

//     ctx.fillRect(
//         -6,
//         9,
//         3,
//         1.5
//     );

//     ctx.fillRect(
//         3,
//         9,
//         3,
//         1.5
//     );


//     // Side mirrors

//     ctx.fillStyle =
//         color;

//     ctx.fillRect(
//         -11,
//         -1,
//         3,
//         2
//     );

//     ctx.fillRect(
//         8,
//         -1,
//         3,
//         2
//     );


//     // Body highlight

//     ctx.strokeStyle =
//         "rgba(255, 255, 255, 0.25)";

//     ctx.lineWidth =
//         0.7;

//     ctx.beginPath();

//     ctx.moveTo(
//         -5,
//         -12
//     );

//     ctx.quadraticCurveTo(
//         -7,
//         -7,
//         -7,
//         1
//     );

//     ctx.stroke();


//     ctx.restore();
// };

const drawRaceCar = (
    carX,
    carY,
    angle,
    sprite
) => {

    ctx.save();

    ctx.translate(
        carX,
        carY
    );

    ctx.rotate(
        angle + Math.PI
    );

    ctx.imageSmoothingEnabled =
        true;

    ctx.drawImage(
        sprite,
        -16,
        -8,
        32,
        16
    );

    ctx.restore();
};

// =====================================================
// TRACK BACKGROUND
// =====================================================

const drawTrackBackground = () => {

    let grassColor = "#18231d";

    let grassLineColor =
        "rgba(255, 255, 255, 0.025)";


    if (weather.condition === "wet") {

        grassColor = "#17211d";

        grassLineColor =
            "rgba(210, 225, 230, 0.025)";

    } else if (weather.condition === "rain") {

        grassColor = "#151f1c";

        grassLineColor =
            "rgba(200, 220, 225, 0.03)";
    };


    ctx.fillStyle = grassColor;

    ctx.fillRect(
        0,
        0,
        trackCanvas.width,
        trackCanvas.height
    );


    // Subtle grass lines

    ctx.save();

    ctx.strokeStyle = grassLineColor;
    ctx.lineWidth = 1;


    for (
        let lineX = -400;
        lineX < 800;
        lineX += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            lineX,
            0
        );

        ctx.lineTo(
            lineX + 400,
            400
        );

        ctx.stroke();
    };


    ctx.restore();
};


// =====================================================
// TRACK SURFACE
// =====================================================

const drawTrackSurface = () => {

    let runoffColor = "#273038";

    let trackBorderColor = "#11161b";

    let asphaltColor = "#343b40";

    let innerTrackColor = "#3d4449";

    let trackEdgeColor = "#5d6870";


    if (weather.condition === "wet") {

        runoffColor = "#252f36";

        trackBorderColor = "#10171b";

        asphaltColor = "#303a40";

        innerTrackColor = "#38434a";

        trackEdgeColor = "#59666e";

    } else if (weather.condition === "rain") {

        runoffColor = "#232e35";

        trackBorderColor = "#0f161a";

        asphaltColor = "#2c373e";

        innerTrackColor = "#354149";

        trackEdgeColor = "#56656e";
    };


    // Outer runoff

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        245,
        155,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 58;
    ctx.strokeStyle = runoffColor;

    ctx.stroke();


    // Outer track border

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        225,
        135,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 52;
    ctx.strokeStyle = trackBorderColor;

    ctx.stroke();


    // Asphalt

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        220,
        130,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 44;
    ctx.strokeStyle = asphaltColor;

    ctx.stroke();


    // Track inner shading

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        220,
        130,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 34;
    ctx.strokeStyle = innerTrackColor;

    ctx.stroke();


    // Wet track sheen

    if (
        weather.condition === "wet" ||
        weather.condition === "rain"
    ) {

        ctx.save();

        ctx.beginPath();

        ctx.ellipse(
            300,
            200,
            220,
            130,
            0,
            0,
            Math.PI * 2
        );

        ctx.lineWidth = 18;

        if (weather.condition === "rain") {

            ctx.strokeStyle =
                "rgba(125, 155, 170, 0.07)";

        } else {

            ctx.strokeStyle =
                "rgba(125, 155, 170, 0.04)";
        };


        ctx.stroke();

        ctx.restore();
    };


    // Outer track edge

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        242,
        152,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 2;
    ctx.strokeStyle = trackEdgeColor;

    ctx.stroke();


    // Inner track edge

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        198,
        108,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 2;
    ctx.strokeStyle = trackEdgeColor;

    ctx.stroke();
};



// =====================================================
// TRACK PUDDLES
// =====================================================


const drawTrackPuddles = () => {

    if (weather.condition !== "rain") {
        return;
    };


    ctx.save();


    // Upper section

    ctx.beginPath();

    ctx.ellipse(
        340,
        86,
        38,
        5,
        -0.04,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.16)";

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        340,
        84,
        24,
        1.5,
        -0.04,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(220, 235, 240, 0.12)";

    ctx.fill();


    // Upper right section

    ctx.beginPath();

    ctx.ellipse(
        430,
        112,
        30,
        5,
        0.30,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.14)";

    ctx.fill();


    // Right section

    ctx.beginPath();

    ctx.ellipse(
        520,
        255,
        5,
        27,
        0.05,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.13)";

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        518,
        255,
        1.5,
        18,
        0.05,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(220, 235, 240, 0.10)";

    ctx.fill();


    // Lower section

    ctx.beginPath();

    ctx.ellipse(
        345,
        333,
        42,
        5,
        0.03,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.15)";

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        345,
        331,
        27,
        1.5,
        0.03,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(220, 235, 240, 0.11)";

    ctx.fill();


    // Lower left section

    ctx.beginPath();

    ctx.ellipse(
        185,
        315,
        27,
        4,
        -0.28,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.12)";

    ctx.fill();


    // Left section

    ctx.beginPath();

    ctx.ellipse(
        118,
        210,
        5,
        25,
        -0.04,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(145, 170, 180, 0.13)";

    ctx.fill();


    ctx.restore();
};
// =====================================================
// RACING GUIDE
// =====================================================

const drawRacingGuide = () => {

    ctx.save();

    ctx.beginPath();

    ctx.ellipse(
        300,
        200,
        220,
        130,
        0,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 1;

    ctx.strokeStyle =
        "rgba(255, 255, 255, 0.16)";

    ctx.setLineDash([10, 14]);

    ctx.stroke();

    ctx.restore();
};


// =====================================================
// KERBS
// =====================================================

const drawTrackKerbs = () => {

    ctx.save();


    // Outer red / white barriers

    const outerSections = [
        0.15,
        0.25,
        0.65,
        0.75,
        1.15,
        1.25,
        1.65,
        1.75
    ];


    outerSections.forEach((section, index) => {

        ctx.beginPath();

        ctx.ellipse(
            300,
            200,
            244,
            154,
            0,
            section * Math.PI,
            (section + 0.07) * Math.PI
        );

        ctx.lineWidth = 6;


        if (index % 2 === 0) {

            ctx.strokeStyle =
                "#e63946";

        } else {

            ctx.strokeStyle =
                "#e8e8e8";
        };


        ctx.stroke();
    });



    // Inner racing kerbs

    const kerbSections = [

        // Right turn
        {
            start: -0.22,
            end: 0.22
        },

        // Left turn
        {
            start: 0.78,
            end: 1.22
        }
    ];


    const kerbLength =
        0.035;


    kerbSections.forEach((section) => {

        let currentAngle =
            section.start;

        let kerbIndex = 0;


        while (
            currentAngle <
            section.end
        ) {

            const endAngle =
                Math.min(
                    currentAngle +
                    kerbLength,
                    section.end
                );


            ctx.beginPath();

            ctx.ellipse(
                300,
                200,

                // Inner edge
                198,
                108,

                0,

                currentAngle *
                    Math.PI,

                endAngle *
                    Math.PI
            );


            // Thinner than the outer barriers
            ctx.lineWidth = 4;


            if (
                kerbIndex % 2 === 0
            ) {

                ctx.strokeStyle =
                    "#f0f0f0";

            } else {

                ctx.strokeStyle =
                    "#d9343e";
            };


            ctx.stroke();


            currentAngle =
                endAngle;

            kerbIndex++;
        };
    });


    ctx.restore();
};


// =====================================================
// PIT LANE
// =====================================================

const drawPitLane = () => {

    ctx.save();


    // Pit lane road

    ctx.beginPath();

    ctx.moveTo(
        380,
        310
    );

    ctx.bezierCurveTo(
        430,
        325,
        490,
        315,
        520,
        275
    );

    ctx.lineWidth = 18;
    ctx.strokeStyle = "#252c31";

    ctx.stroke();


    // Pit lane edge

    ctx.beginPath();

    ctx.moveTo(
        380,
        310
    );

    ctx.bezierCurveTo(
        430,
        325,
        490,
        315,
        520,
        275
    );

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#707a82";

    ctx.stroke();


    // Pit box markers

    ctx.strokeStyle =
        "rgba(255, 255, 255, 0.35)";

    ctx.lineWidth = 1;


    for (
        let pitX = 420;
        pitX <= 480;
        pitX += 20
    ) {

        ctx.strokeRect(
            pitX,
            309,
            14,
            8
        );
    };


    ctx.restore();
};


// =====================================================
// SECTOR MARKERS
// =====================================================

const drawSectorMarkers = () => {

    const sectorMarkers = [
        {
            x: 300,
            y: 48,
            label: "S1"
        },

        {
            x: 88,
            y: 220,
            label: "S2"
        },

        {
            x: 300,
            y: 352,
            label: "S3"
        }
    ];


    sectorMarkers.forEach((sector) => {

        ctx.beginPath();

        ctx.arc(
            sector.x,
            sector.y,
            11,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#111820";

        ctx.fill();


        ctx.lineWidth = 1;
        ctx.strokeStyle = "#3a4650";

        ctx.stroke();


        ctx.fillStyle = "#aeb8c1";

        ctx.font = "600 8px Inter";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        ctx.fillText(
            sector.label,
            sector.x,
            sector.y
        );
    });
};


// =====================================================
// START / FINISH LINE
// =====================================================

const drawStartFinish = () => {

    const startX = 520;
    const startY = 200;

    const squareSize = 4;

    // Right side of track runs vertically.
    // Therefore the finish line crosses horizontally.

    const lineWidth = 44;
    const lineHeight = 12;

    const columns =
        Math.ceil(
            lineWidth / squareSize
        );

    const rows =
        Math.ceil(
            lineHeight / squareSize
        );


    for (let row = 0; row < rows; row++) {

        for (
            let column = 0;
            column < columns;
            column++
        ) {

            if ((row + column) % 2 === 0) {

                ctx.fillStyle = "#ffffff";

            } else {

                ctx.fillStyle = "#111111";
            };


            ctx.fillRect(
                startX -
                lineWidth / 2 +
                column * squareSize,

                startY -
                lineHeight / 2 +
                row * squareSize,

                squareSize,
                squareSize
            );
        };
    };


    // Start / finish label

    ctx.save();

    ctx.fillStyle =
        "rgba(9, 13, 16, 0.85)";

    ctx.fillRect(
        477,
        153,
        86,
        18
    );


    ctx.fillStyle = "#aeb8c1";

    ctx.font = "600 8px Inter";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    ctx.fillText(
        "START / FINISH",
        520,
        162
    );


    ctx.restore();
};


// =====================================================
// CIRCUIT INFORMATION
// =====================================================

const drawCircuitInfo = () => {

    ctx.save();


    // Information panel

    ctx.fillStyle =
        "rgba(9, 13, 16, 0.72)";

    ctx.fillRect(
        235,
        166,
        130,
        68
    );


    // Circuit title

    ctx.fillStyle = "#f4f6f7";

    ctx.font = "700 12px Inter";

    ctx.textAlign = "center";


    ctx.fillText(
        "PIT STOP CIRCUIT",
        300,
        187
    );


    // Circuit information

    ctx.fillStyle = "#707c86";

    ctx.font = "500 8px Inter";


    ctx.fillText(
        "3 SECTORS  •  30 LAPS",
        300,
        204
    );


    // Red accent

    ctx.fillStyle = "#e63946";

    ctx.fillRect(
        270,
        216,
        60,
        2
    );


    ctx.restore();
};


// =====================================================
// CARS ON TRACK
// =====================================================

const drawCarsOnTrack = () => {

    const currentTime =
        performance.now();


    let interpolationProgress =
        (
            currentTime -
            lastSimulationTime
        ) /
        simulationInterval;


    if (interpolationProgress > 1) {
        interpolationProgress = 1;
    };


    cars.forEach((car) => {

        const visualPosition =
            carVisualPositions[car.name];


        const positionDifference =
            visualPosition.currentPosition -
            visualPosition.previousPosition;


        const interpolatedPosition =
            visualPosition.previousPosition +
            positionDifference *
            interpolationProgress;


        const wrappedPosition =
            interpolatedPosition % 30;


        const angle =
            (wrappedPosition / 30) *
            (Math.PI * 2);


        const carX =
            300 +
            220 *
            Math.cos(angle);


        const carY =
            200 +
            130 *
            Math.sin(angle);


        const directionX =
            -220 *
            Math.sin(angle);


        const directionY =
            130 *
            Math.cos(angle);


        const carRotation =
            Math.atan2(
                directionY,
                directionX
            );


        let sprite;


        if (car.name === "player") {

            sprite =
                carSprites.player;

        } else if (car.name === "computer1") {

            sprite =
                carSprites.computer1;

        } else if (car.name === "computer2") {

            sprite =
                carSprites.computer2;

        } else if (car.name === "computer3") {

            sprite =
                carSprites.computer3;
        };


        drawRaceCar(
            carX,
            carY,
            carRotation,
            sprite
        );
    });
};

// =====================================================
// RACE TRACKER
// =====================================================

const raceTracker = () => {

    ctx.clearRect(
        0,
        0,
        trackCanvas.width,
        trackCanvas.height
    );


    drawTrackBackground();

    drawTrackSurface();

    drawTrackPuddles();

    drawRacingGuide();

    drawTrackKerbs();

    drawPitLane();

    drawSectorMarkers();

    drawStartFinish();

    drawCircuitInfo();

    drawCarsOnTrack();
};


const animateRaceTrack = () => {

    raceTracker();

    requestAnimationFrame(
        animateRaceTrack
    );
};


animateRaceTrack();

//                  Lap Tracker
const raceLap = (car) => {
    if (car.position >= 30) {
        const lapProgress = car.position - 30;

        car.lapsCompleted++;
        car.position = lapProgress;

        if(car.pitRequested === true) {
            pitStop(car);
        };
    };
};

//                  Lap Log
const addLapLog = (message) => {

    const logItem = document.createElement("li");

    logItem.textContent = message;

    lapLog.prepend(logItem);
};


//                  Car Position in the race
// who leads the race and who is behind
const racePosition = (car) => {
    
    return car.lapsCompleted * 30 + car.position;
    
}


//                  cars Ranking
const carsRanking = () => {
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

    liPositionTracker.textContent = playerPosition;

    if (gapAhead !== null) {
        liGapAhead.textContent = `+${gapAhead.toFixed(2)}`;
    } else {
        liGapAhead.textContent = "--";
    };

    if (gapBehind !== null) {
        liGapBehind.textContent = `-${gapBehind.toFixed(2)}`;
    } else {
        liGapBehind.textContent = "--";
    };
};


//                      car DNF 
const carDNF = (car, reason) => {
    car.isDNF = true;
    car.dnfReason = reason;
    car.speed = 0;
    car.pitRequested = false;
    car.isPitting = false;

    console.log(`${car.name} DNF: ${car.dnfReason}`);
};

// selection sort is used because its O(n^2) is irrelevant for data this size
const sortCarsByProgress = (carsToSort) => {
    
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



//                  winner check
const checkWinner = (car) => {

    if (car.lapsCompleted === race.totalLaps) {
        race.winner = car.name;

        showRaceResult(car);
    };
};

//                  declare winner
const showRaceResult = (car) => {

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


//                  Update Race State
const raceStatus = (car) => {
    if (car.isDNF === false) {
        carProgress(car);

        raceLap(car);

        checkWinner(car);

        tyreStatus(car);

        fuelGuage(car);
    };

};


//                          Race Simulation
function raceSimulation() {
    cars.forEach((car) => {
        if (race.winner === null && race.isRunning === true) {
            raceStatus(car);
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

// Player and computer car strategy
const carStrategy = (car, strategy) => {

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


//                      Pit Request
const pitRequest = (car) => {
    if (car.pitRequested === false) {
        car.pitRequested = true; 
    } else if (car.pitRequested === true){
        alert("Pit Stop already requested.")
    };
};

// //                  PIT STOP
const pitStop = (car) => {

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

const releaseCar = (car) => {

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

//              Fuel Consumption
const fuelGuage = (car) => {
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

//              Fuel Crew
const fillmore = (car) => {

    car.fuel = 100;

    car.fuelServiced = true;
};

//              Tyre Life
const tyreStatus = (car) => {
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

//               Tyre Crew

const guido = (car) => {
    car.tyreCompound = car.newTyreSet;
    car.newTyreSet = "";

    car.tyreLife = 100;

    car.tyreServiced = true;
};

const selectTyre = (car, newSetOfTyres) => {
    car.tyreServiceRequested = true;
    car.newTyreSet = newSetOfTyres;
};


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

//                  Unable to continue race
const stopRace = () => {
    race.isRunning = false;
    console.log(`Failed... Unable to continue race:`);
    // console.log(`Failed... Unable to continue race: ${reason}`);

};

//                  Computer Safety Check
const computerSafetyCheck = (car) => {

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

//          Start Race
const startRace = () => {
    lapLog.innerHTML = "";

    addLapLog("Race started");

    race.isRunning = true;
    raceSimulation();
};

//                  Reset Race
const resetRace = () => {

    // Race State
    race.isRunning = false;
    race.winner = null;


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

        lapLog.innerHTML = "";

        summaryResult.textContent = "Waiting";
        summaryPosition.textContent = "--";
        summaryWinner.textContent = "Race not started";

        summaryLaps.textContent = `-- / ${race.totalLaps}`;
        summaryFuel.textContent = "--";
        summaryTyre.textContent = "--";
        summaryTyreLife.textContent = "--";
        summaryStrategy.textContent = "--";
    });


    // Doc Decision State
    lastDocLap = -1;
    docIsThinking = false;
    lastDocRequestTime = 0;


    // Doc Event State
    lastWeatherCondition = weather.condition;

    docFuelWarning.computer1 = false;
    docFuelWarning.computer2 = false;
    docFuelWarning.computer3 = false;

    docTyreWarning.computer1 = false;
    docTyreWarning.computer2 = false;
    docTyreWarning.computer3 = false;


    // Hide Final Result
    finalResult.classList.add("hidden");


    // Render Starting State
    carsRanking();
    raceTracker();
    renderRaceInfo(cars[0]);
    renderCarStatus(cars[0]);
};

btnStart.addEventListener("click", () => {
    raceEngineerMessage.textContent = "Race underway. I'll keep an eye on the strategy.";

    startRace();
});

btnNewRaceSummary.addEventListener("click", () => {

    resetRace();

});


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

btnViewRaceSummary.addEventListener("click", () => {

    finalResult.classList.add("hidden");

});

//                          Weather Feature
//              geolocation
// const locationSuccess = (position) => {

//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     getWeather(latitude, longitude);
    
// };

const locationSuccess = (position) => {

    console.log("POSITION:", position);
    console.log("LAT:", position.coords.latitude);
    console.log("LONG:", position.coords.longitude);

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getWeather(latitude, longitude);
};

const getLocation = () => {
    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(locationSuccess, error);

    } else {

        console.log("Geolocation is not supported by this browser.");

    };
};

//          Error callback function for Geolocation
const error = (err) => {
  switch(err.code) {
    case err.PERMISSION_DENIED:
      console.warn("User denied the request for Geolocation.");
      break;
    case err.POSITION_UNAVAILABLE:
      console.warn("Location information is unavailable.");
      break;
    case err.TIMEOUT:
      console.warn("The request to get user location timed out.");
      break;
    default:
      console.warn("An unknown error occurred:", err.message);
      break;
  };
};

//              Get Weather Function
const getWeather = async (latitude, longitude) => {

    console.log("GET WEATHER LAT:", latitude);
    console.log("GET WEATHER LONG:", longitude);



    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,precipitation,rain,showers,wind_speed_10m&forecast_days=1`;

    try {

        const response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        };

        const weatherData = await response.json();

        console.log("WEATHER DATA:", weatherData);

        weatherCondition(weatherData);
    
    } catch (error) {

        console.error("Weather unavailable", error);

        weather.condition = "clear";
        weather.temperature = "--";
        weather.precipitation = 0;
        weather.windSpeed = 0;

        renderWeather();

    }
};

const weatherCondition = (weatherData) => {
    if (
        weatherData.current.rain > 0 ||
        weatherData.current.showers > 0
    ) {

        weather.condition = "rain";

    } else if (weatherData.current.precipitation > 0) {

        weather.condition = "wet";

    } else {

        weather.condition = "clear";
    };

    weather.temperature = weatherData.current.temperature_2m;
    weather.precipitation = weatherData.current.precipitation;
    weather.windSpeed = weatherData.current.wind_speed_10m;

    // // force rain for presentation
    // weather.condition = "rain" // only if it doesn't rain
    renderWeather();
};

//              race engine state 
const renderRaceInfo = (car) => {

    trackLapCounter.textContent =
        `Lap ${car.lapsCompleted} / ${race.totalLaps}`;
};

const renderWeather = () => {
    liWeatherConditionValue.textContent = weather.condition;
    liAirTempValue.textContent = `${weather.temperature} °C`;
    liWindSpeedValue.textContent = `${weather.windSpeed} km/h`;

    if (weather.condition === "rain") {

        rainEffect.classList.remove("hidden");

    } else {

        rainEffect.classList.add("hidden");
    };

    raceTracker();
};

const renderCarStatus = (car) => {

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

//                  Build Race Snapshot
const buildRaceSnapshot = () => {

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

//                  Ask Doc
const askDoc = async () => {

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


//                  Race Engineer
const renderRaceEngineer = (message) => {

    if (message === "") {
        return;
    };

    raceEngineerMessage.textContent = message;
};

//                  Apply Doc Decision
const applyDocDecision = (docDecision) => {

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
const docDecisionCycle = async () => {

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

//                        On Load
getLocation();
raceTracker();
