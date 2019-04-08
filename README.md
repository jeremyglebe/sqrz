# sqrz
Game about connecting squares. Making for Software Tools class.

## Requirements
+ Presentation
    + Initially presents a grid of dots
    + Players can draw lines between dots
    + Player scores should be displayed somewhere
    + Display score table after grid is completely connected
+ Gameplay
    + Players can't connect dots during other players turns
    + Players score when they connect a square
    + Players' turns end when they connect dots without creating a square
    + Game ends when grid is fully connected, player with the highest score wins
+ Server
    + Utilizes Socket effectively
    + Connections between server & clients is properly established
    + Semi-synchronized. Turn-based. All players get updates after every turn.
    + Action queue accounts for connect/disconnect (Prevent unlimited turns)
    + Track player scores
