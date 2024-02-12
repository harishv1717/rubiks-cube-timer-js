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
    else if (scrambleElement.innerHTML.split(" ").length === 45)
        scrambleElement.setAttribute("style", "font-size: 165%;");
    else if (scrambleElement.innerHTML.split(" ").length === 80)
        scrambleElement.setAttribute("style", "font-size: 130%;");
    else if (scrambleElement.innerHTML.split(" ").length === 100)
        scrambleElement.setAttribute("style", "font-size: 125%;");

    const elements = document.getElementsByClassName("img");
    for (const elem of elements) elem.innerHTML = "";

    for (let i = 0; i < imgArray.length; i++) {
        if (i === 0) elements[0].innerHTML += `<img src="${imgArray[i]}" style="margin: -10px;">`;
        else if (i > 0 && i < 5) {
            elements[1].innerHTML += `<img src="${imgArray[i]}" style="margin: -10px;">`;
        } else elements[2].innerHTML += `<img src="${imgArray[i]}" style="margin: -10px;">`;
    }
}

function startOrStopTimer({ key }) {
    if (key === " ") document.getElementById("timer").removeAttribute("style");

    if (key === " " && !intervals.timerInterval && !intervals.inspectionInterval) {
        if (Date.now() - pressed < 400) return (pressed = false);
        pressed = false;

        const timerElement = document.getElementById("timer");
        timerElement.innerHTML = "0";

        intervals.inspectionInterval = setInterval(() => {
            if (timerElement.innerHTML === "14") plus2 = true;
            else if (timerElement.innerHTML === "16") {
                clearInterval(intervals.inspectionInterval);

                delete intervals.inspectionInterval;
                delete intervals.timerInterval;
                plus2 = false;

                timerElement.innerHTML = "DNF";

                return updateScramble();
            } else if (!intervals.inspectionInterval) return clearInterval(intervals.inspectionInterval);

            timerElement.innerHTML = parseInt(timerElement.innerHTML) + 1;
        }, 1000);
    } else if (!intervals.timerInterval && intervals.inspectionInterval && key === " ") {
        if (Date.now() - pressed < 400) return (pressed = false);
        pressed = false;

        clearInterval(intervals.inspectionInterval);
        delete intervals.inspectionInterval;

        const timerElement = document.getElementById("timer");
        timerElement.innerHTML = "00:00.00";

        intervals.timerInterval = setInterval(() => {
            const timer = timerElement.innerHTML.replace(/([:.])/g, m => `_${m}_`).split("_");
            const timerNums = timer.map(n => ([":", "."].includes(n) ? n : parseInt(n)));

            timerNums[4]++;

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

            timerElement.innerHTML = time;
        }, 10);
    } else if (/[a-z ]/i.test(key) && intervals.timerInterval && !intervals.inspectionInterval) {
        clearInterval(intervals.timerInterval);
        clearInterval(intervals.inspectionInterval);

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
