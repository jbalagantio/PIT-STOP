// importing dependencies
import { cars, weather } from "./state.js";
import { racePosition } from "./race.js";


const trackCanvas = document.querySelector("#track-view-canvas");
const ctx = trackCanvas.getContext("2d");


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


export const updateCarVisualPositions = () => {

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


export const resetCarVisualPostions = () => {
    cars.forEach((car) => {
        const visualPosition = carVisualPositions[car.name];

        visualPosition.previousPosition = 0;
        visualPosition.currentPosition = 0;
    });

    lastSimulationTime = performance.now();
}

// DRAW RACE CARS   
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


//  TRACK BACKGROUND 
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


// TRACK SURFACE
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


// TRACK PUDDLES
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


// RACING GUIDE
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


// KERBS
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


// PIT LANE
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


// SECTOR MARKERS
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


// START / FINISH LINE
const drawStartFinish = () => {

    const startX = 520;
    const startY = 200;

    const squareSize = 4;

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


// CIRCUIT INFORMATION
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


// CARS ON TRACK
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


// RACE TRACKER
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
