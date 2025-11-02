import generateScramble from "./scramble.js";
import cube from "./cube.js";

const intervals = {};
let plus2 = false;
let pressed = false;

updateScramble();
document.addEventListener("keydown", ({ key }) => {
    if (key !== " ") return;

    if (!pressed) pressed = Date.now();
    document.getElementById("timer").setAttribute("style", "color: #00ff00;");
});

document.addEventListener("keyup", startOrStopTimer);
document.getElementById("cubeselect").addEventListener("change", updateScramble);

function updateScramble() {
    const { value } = document.getElementById("cubeform").elements["cubeselect"];

    const scramble = generateScramble(value);
    const imgArray = cube(scramble, value);

    const scrambleElement = document.getElementById("scramble");
    scrambleElement.innerHTML = scramble;

    if (scrambleElement.innerHTML.split(" ").length <= 20) scrambleElement.setAttribute("style", "font-size: 235%;");
    else if (scrambleElement.innerHTML.split(" ").length <= 80)
        scrambleElement.setAttribute("style", "font-size: 165%;");
    else if (scrambleElement.innerHTML.split(" ").length === 80)
        scrambleElement.setAttribute("style", "font-size: 130%;");
    else if (scrambleElement.innerHTML.split(" ").length === 100)
        scrambleElement.setAttribute("style", "font-size: 125%;");

    const elements = document.getElementsByClassName("img");
    for (const elem of elements) elem.innerHTML = "";

    for (let i = 0; i < imgArray.length; i++) {
        if (i === 0) {
            // Top image (white)
            elements[0].innerHTML = `<img src="${imgArray[i]}" style="margin: -10px;">`;
        } else if (i > 0 && i < 5) {
            // Middle row (orange, green, red, blue)
            elements[1].innerHTML += `<img src="${imgArray[i]}" style="margin: -10px;">`;
        } else {
            // Bottom image (yellow)
            elements[2].innerHTML = `<img src="${imgArray[i]}" style="margin: -10px;">`;
        }
    }
}

function startOrStopTimer({ key }) {
    if (key === " ") document.getElementById("timer").removeAttribute("style");

    if (key === " " && !intervals.timerInterval && !intervals.inspectionInterval) {
        if (Date.now() - pressed < 100) return (pressed = false);
        pressed = false;

        const timerElement = document.getElementById("timer");
        const inspectionStartTime = Date.now();

        const updateInspection = () => {
            const elapsedSeconds = Math.floor((Date.now() - inspectionStartTime) / 1000);
            timerElement.innerHTML = elapsedSeconds;

            if (elapsedSeconds === 15) {
                plus2 = true;
            } else if (elapsedSeconds >= 16) {
                cancelAnimationFrame(intervals.inspectionInterval);
                delete intervals.inspectionInterval;
                delete intervals.timerInterval;
                plus2 = false;
                timerElement.innerHTML = "DNF";
                return updateScramble();
            }

            intervals.inspectionInterval = requestAnimationFrame(updateInspection);
        };

        intervals.inspectionInterval = requestAnimationFrame(updateInspection);
    } else if (!intervals.timerInterval && intervals.inspectionInterval && key === " ") {
        if (Date.now() - pressed < 100) return (pressed = false);
        pressed = false;

        cancelAnimationFrame(intervals.inspectionInterval);
        delete intervals.inspectionInterval;

        const timerElement = document.getElementById("timer");
        timerElement.innerHTML = "00:00.00";

        const startTime = Date.now();
        const updateTimer = () => {
            const elapsedMs = Date.now() - startTime;
            const minutes = Math.floor(elapsedMs / 60000);
            const seconds = Math.floor((elapsedMs % 60000) / 1000);
            const centiseconds = Math.floor((elapsedMs % 1000) / 10);

            const time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
                centiseconds
            ).padStart(2, "0")}`;
            timerElement.innerHTML = time;

            intervals.timerInterval = requestAnimationFrame(updateTimer);
        };

        intervals.timerInterval = requestAnimationFrame(updateTimer);
    } else if (/[a-z ]/i.test(key) && intervals.timerInterval && !intervals.inspectionInterval) {
        cancelAnimationFrame(intervals.timerInterval);
        cancelAnimationFrame(intervals.inspectionInterval);

        if (plus2) {
            const timerElement = document.getElementById("timer");

            const timer = timerElement.innerHTML.replace(/([:.])/g, m => `_${m}_`).split("_");
            const timerNums = timer.map(n => ([":", "."].includes(n) ? n : parseInt(n)));

            timerNums[2] += 2;

            if (timerNums[4] === 100) {
                timerNums[4] = 0;
                timerNums[2]++;
            }

            if (timerNums[2] === 60) {
                timerNums[2] = 0;
                timerNums[0]++;
            }

            const time = timerNums
                .map(n => ([":", "."].includes(n) ? n : `${n}`.length > 1 ? `${n}` : `0${n}`))
                .join("");

            timerElement.innerHTML = `${time}+`;
        }

        delete intervals.timerInterval;
        delete intervals.inspectionInterval;

        plus2 = false;
        pressed = false;

        return updateScramble();
    }
}
