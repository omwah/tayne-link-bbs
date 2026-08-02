# TAYNE/LINK BBS

A single-player browser BBS adventure and cursed human-motion renderer.

## Run it

Open `index.html` directly in a modern browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Useful commands

```text
HELP
BOARDS
LIST 1
READ 101
MAIL
FILES
PROFILE
SET PINK 100
SET COMPLIANCE 8
MORE TAYNE
RENDER
WHO
SYSOP
CELERY
NUDE TAYNE
TEXTFILES
CAN I GET INTO THIS
```

Progress is saved in `localStorage`. Use `RESET CONFIRM` to restart.
Use the Up and Down arrow keys to browse previous terminal commands.

## Design notes

- No external libraries or network requests.
- Responsive terminal UI with CRT effects.
- Procedural Web Audio modem/render sounds.
- Canvas-based low-poly Tayne renderer.
- Narrative state advances across repeated renders.
- Hidden commands mutate the render profile and story.


## 0.3.8 fix

The connection screen now opens as a true modal, and browser storage failures no longer prevent dialing.
