# Pit Stop — Development Log

## The Day the AI Beat the Developer

During development of Pit Stop, the AI race strategist, "Doc," reached a point where it became competitive enough that I had to stop testing and study its strategy to understand why I was losing.

Earlier versions of Doc were relatively simple and predictable. The AI would often use similar strategies across all computer-controlled cars, sometimes push too aggressively, mismanage fuel, or fail to react properly to changing race conditions. After several improvements, Doc was given access to race telemetry including fuel level, tyre condition, race position, remaining laps, and weather conditions. It could independently choose strategies, request pit stops, select tyre compounds, and decide whether to refuel.

Eventually, during one test race, one of Doc's cars completed the full 30-lap race while I was only around lap 24.

At first, I thought something might be wrong with the simulation. Since both the player and computer cars use the same race engine, such a large performance difference seemed unusual. I started reviewing Doc's strategy to figure out how the AI was managing to drive so much faster.

The explanation turned out to be much simpler:

**It was raining.**

The game retrieves real weather information and uses the current conditions as part of the race simulation. At the time of the test, it was also actually raining outside.

Doc recognized the rainy conditions through the race telemetry and adjusted its strategy accordingly. I, on the other hand, had remained on dry tyres for almost the entire race.

Because the race engine penalizes dry tyres in rainy conditions, my car was significantly slower and suffered increased tyre degradation. Doc was not receiving any artificial speed advantage—it was simply responding correctly to information that I had ignored.

One reason I failed to notice the problem was that, at this stage of development, weather had very little visual representation. The interface displayed the track condition as text, but there were no rain effects or other strong visual indicators that immediately communicated that the race was taking place in wet conditions.

This created one of the funniest development moments of the project:

> I thought my AI had become so competitive that I needed to study its strategy, only to realize that it had noticed the rain before I did.

The experience also revealed something important about the game's design. Weather was no longer just information retrieved from an API and displayed on the screen. It had become a meaningful part of the simulation. The weather affected the race, the AI reacted to it, and ignoring it had real consequences for the player.

It also exposed a user-experience problem that would need to be addressed later: important environmental conditions should not rely entirely on a small text indicator. Rain and other track conditions need stronger visual feedback so the player can recognize them while concentrating on the race.

### Development Takeaway

This test became an unexpected validation of several systems working together:

- Real-world weather affected the race simulation.
- Tyre choice had meaningful strategic consequences.
- Doc recognized changing race conditions through telemetry.
- The AI adjusted its strategy without receiving artificial performance advantages.
- Poor player strategy could result in a legitimate loss.
- The lack of visual weather feedback revealed a genuine UI/UX improvement opportunity.

Most importantly, the AI had progressed from something I was trying to make competitive into something competitive enough that I had to learn how to race against it.

**Developer: 0  
Doc: Check the weather.**