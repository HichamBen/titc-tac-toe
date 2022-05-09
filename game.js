const popup = document.querySelector(".popup");
const grids = document.querySelectorAll(".row > div");
let row0 = { you: [], cpu: [] };
let row1 = { you: [], cpu: [] };
let row2 = { you: [], cpu: [] };
let points = { you: 0, cpu: 0, ties: 0 };
let filledGrids = [];
let isFinish = false;
clickGrids();

document.querySelector(".newMatch").onclick = () => {
    popup.style.display = "block";
    points = { you: 0, cpu: 0, ties: 0 };
    document.querySelector(".your_res > span:last-child").textContent = points.you;
    document.querySelector(".cpu_res > span:last-child").textContent = points.cpu;
    document.querySelector(".ties > span:last-child").textContent = points.ties;
    if(!isFinish) newGame();
}

document.getElementById("you").onclick = () => {
    popup.style.display = "none";
}

document.getElementById("cpu").onclick = () => {
    popup.style.display = "none";
    for (let i = 0; i < grids.length; i++) {
        grids[i].style.pointerEvents = "none";
    }
    setTimeout(() => {
        console.log("play")
        cpuPaly();    
    }, 1500)
    setTimeout(() => {
        console.log("ereeeee")
        for (let i = 0; i < grids.length; i++) {
            grids[i].style.pointerEvents = "all";
        }   
    }, 1500)
}

function clickGrids() {

    for (let i = 0; i < grids.length; i++) {
        grids[i].onclick = (e) => {

            let index = e.target.id.split("_").join("");
            markedGrid(true, index);
            fill_rows(true, index);
            if (detWinner(row0.you, row1.you, row2.you)) {
                isFinish = true;
                points.you += 1;
                addPoint("you");
            }
            
            if(!isFinish) {
                setTimeout(() => {
                    console.log("cpu play")
                    cpuPaly();
                }, 500)
            }
        }
    }
}

function markedGrid(isYourTurn, index) {
    if (filledGrids.includes(index)) return;
    filledGrids.push(index);

    const grid = document.getElementById("_" + index);
    if (isYourTurn) {
        grid.innerHTML = `<i class="fa-solid fa-x"></i>`;
    } else {
        grid.innerHTML = `<i class="fa-regular fa-circle"></i>`;
    }

    preventClick(index);
    let size = 16;

    const off = setInterval(() => {
        size++;
        grid.querySelector("i").style.fontSize = `${size + "px"}`;
        if (size === 40) {
            clearInterval(off);
        }
    }, 10)

}

function fill_rows(isYourTurn, index) {
    if (index[0] === "0") {
        if (isYourTurn) {
            row0.you.push(index);
        } else {
            row0.cpu.push(index);
        }
        return;
    }
    if (index[0] === "1") {
        if (isYourTurn) {
            row1.you.push(index);
        } else {
            row1.cpu.push(index);
        }
        return;
    }
    if (index[0] === "2") {
        if (isYourTurn) {
            row2.you.push(index);
        } else {
            row2.cpu.push(index);
        }
        return;
    }
}

function cpuPaly() {
    const emptyGrids = [];
    for (let col = 0; col < 3; col++) {
        if (!(row0.you.includes("0" + col) || row0.cpu.includes("0" + col))) {
            emptyGrids.push("0" + col);
        }
        if (!(row1.you.includes("1" + col) || row1.cpu.includes("1" + col))) {
            emptyGrids.push("1" + col);
        }
        if (!(row2.you.includes("2" + col) || row2.cpu.includes("2" + col))) {
            emptyGrids.push("2" + col);
        }
    }

    // 
    let randomIndex = emptyGrids[Math.floor(Math.random() * emptyGrids.length)];
    if (!randomIndex) return;

    fill_rows(false, randomIndex);
    markedGrid(false, randomIndex);

    if (detWinner(row0.cpu, row1.cpu, row2.cpu)) {
        points.cpu += 1;
        addPoint("cpu");
    }
    return true;
}

function preventClick(index) {
    let gridId = "_" + index;
    document.getElementById(gridId).style.pointerEvents = "none";
}

function newGame() {
    for (let i = 0; i < grids.length; i++) {
        grids[i].style.pointerEvents = "none";
    }
    setTimeout(() => {
        console.log("finish")
        isFinish = false;
        for (let i = 0; i < grids.length; i++) {
            grids[i].style.pointerEvents = "all";
            grids[i].innerHTML = "";
        }
    }, 1500);

    row0 = { you: [], cpu: [] };
    row1 = { you: [], cpu: [] };
    row2 = { you: [], cpu: [] };
    filledGrids = [];
}

function detWinner(rzero, rone, rtwo) {
    if (filledGrids.length <= 3) return false;


    if (rzero.length === 3 || rone.length === 3 || rtwo.length === 3) {
        const winnerArr = (rzero.length === 3) ? rzero :
            (rone.length === 3) ? rone : rtwo;
        animate(winnerArr);
        return true;
    }

    if (rzero.includes("00") && rone.includes("11") && rtwo.includes("22")) {
        animate(["00", "11", "22"]);
        return true;
    }

    if (rzero.includes("02") && rone.includes("11") && rtwo.includes("20")) {
        animate(["02", "11", "20"]);
        return true;
    }

    for (let col = 0; col < 3; col++) {
        if (rzero.includes("0" + col) && rone.includes("1" + col) && rtwo.includes("2" + col)) {
            animate(["0" + col, "1" + col, "2" + col])
            return true;
        }
    }

    if (filledGrids.length === 9) {
        points.ties += 1;
        addPoint("ties");
        newGame();
    }
    return false;
}

function addPoint(winner) {

    if (winner === "you") {
        document.querySelector(".your_res > span:last-child").textContent = points.you;
    } else if (winner === "cpu") {
        document.querySelector(".cpu_res > span:last-child").textContent = points.cpu;

    } else {
        document.querySelector(".ties > span:last-child").textContent = points.ties;
    }

}

function animate(winnerArr) {

    for (let i = 0; i < 3; i++) {
        document.getElementById("_" + winnerArr[i]).classList.add("active");
    }

    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            document.getElementById("_" + winnerArr[i]).classList.remove("active");
        }
    }, 1000);

    newGame();
}


function hardGame(filledGrids, emptyGrids) {
}