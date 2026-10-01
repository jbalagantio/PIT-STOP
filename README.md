# 🏁 Pit Stop — Alpha

**Pit Stop** is a browser-based Formula-style race strategy simulator built with vanilla HTML, CSS, and JavaScript.

Instead of directly controlling the car, you take the role of the race strategist — managing pace, tyres, fuel, pit stops, and changing weather conditions while competing against three computer-controlled opponents.

This repository contains the **Alpha version** of Pit Stop.

---

## 🏎️ About the Game

Pit Stop focuses on race management rather than traditional driving controls.

During a 30-lap race, you must balance speed against tyre degradation and fuel consumption while reacting to changing track conditions.

Push too hard and you may destroy your tyres or run out of fuel.

Play too conservatively and the competition may leave you behind.

Your decisions happen from the pit wall.

---

## 🎮 Current Features

### Race Simulation

- 30-lap race simulation
- Player car and three computer-controlled opponents
- Live race positions and gaps
- Fuel consumption
- Tyre degradation
- Multiple tyre compounds
- Pit stop system
- DNF conditions
- Final race classification and podium

### Strategy

Three pace modes are available:

- **Push** — faster pace with increased fuel consumption and tyre wear
- **Normal** — balanced race pace
- **Conserve** — reduced pace with lower fuel consumption and tyre wear

Pit strategy allows you to prepare:

- Soft tyres
- Medium tyres
- Hard tyres
- Wet tyres
- Refuelling

### Dynamic Weather

Pit Stop uses live weather data to influence race conditions.

Possible track conditions include:

- Clear
- Wet
- Rain

Weather affects tyre performance and race strategy, making tyre selection an important part of each race.

### Race Engineer

The race engineer provides contextual information and strategy advice during the race.

The system evaluates race conditions such as:

- Fuel level
- Tyre condition
- Weather
- Race position
- Strategy

### Computer Strategy

Computer-controlled cars manage their own:

- Pace
- Fuel
- Tyres
- Pit stops
- Weather response

They also include safety logic designed to prevent obvious race-ending strategy mistakes.

---

## 🖥️ Pit Wall Interface

The Alpha interface is designed around a motorsport pit-wall / race-control dashboard.

The dashboard includes:

- Live circuit view
- Car telemetry
- Fuel and tyre status
- Race engineer messages
- Strategy controls
- Pit controls
- Lap log
- Race summary
- Weather information
- Live race standings

Several navigation sections are currently locked and reserved for future versions.

---

## 🛣️ Circuit Visualization

The race is visualized using the HTML Canvas API.

The circuit renderer includes:

- Animated race cars
- Continuous car movement
- Track kerbs
- Pit lane
- Sector markers
- Start/finish line
- Racing guide
- Weather-dependent track appearance
- Wet-track effects
- Rain effects

The Alpha version uses GT-style car sprites for the four competitors.

---

## 🧰 Built With

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas API
- Open-Meteo API
- Groq API

No frontend framework is used.

---

## 📁 Project Status

**Version:** Alpha  
**Status:** Feature Locked

The Alpha feature set is considered complete.

Development after this point will initially focus on refactoring and modularizing the JavaScript codebase while preserving the existing game behavior.

Future versions may expand systems currently represented by the locked navigation sections.

---

## 🔧 Next Development Phase

The original Alpha was intentionally developed as the project grew, resulting in a large JavaScript codebase containing the race engine, rendering, UI logic, weather system, computer strategy, and race engineer.

The next development phase will focus on separating these responsibilities into dedicated JavaScript modules.

The goal is to improve:

- Code organization
- Maintainability
- Separation of concerns
- Reusability
- Debugging
- Future feature development

without changing the established Alpha gameplay.

---

## ⚠️ Alpha Notice

Pit Stop is an educational project currently under active development.

Some assets and character references used in this Alpha are temporary and may be replaced with original assets and branding in future versions.

The application may also contain experimental integrations that are not intended for production deployment.

---

## 🏁 Development Journey

Pit Stop began as a bootcamp JavaScript project and gradually evolved from a basic race simulation into a complete interactive race strategy game.

The Alpha represents the first point where the core experience — racing, strategy, weather, opponents, pit stops, telemetry, race engineering, and the pit-wall interface — operates together as a complete system.

From here, development shifts from **building the game** to **building the architecture that can support where the game goes next.**

---

**Pit Stop — Win the race from the pit wall.**
