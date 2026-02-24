// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getFirestore, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// /* ---------------- FIREBASE CONFIG ---------------- */

// const firebaseConfig = {
//     apiKey: "AIzaSyC9n8sXo2l7m1Zt3a5b6c7d8e9f0g1h2i",
//     authDomain: "jarvis-d340a.firebaseapp.com",
//     projectId: "jarvis-d340a",
//     storageBucket: "jarvis-d340a.firebasestorage.app",
//     messagingSenderId: "730090361097",
//     appId: "1:730090361097:web:5ac643d490aaa6cdb443d8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// /* ---------------- SEND COMMAND ---------------- */

// async function updateCommand(cmd) {
//     try {
//         await updateDoc(doc(db, "devices", "home_pc"), {
//             command: cmd,
//             updated_at: Date.now()
//         });

//         const reactor = document.querySelector(".arc-inner");
//         if (reactor) {
//             reactor.classList.add("pulse");
//             setTimeout(() => reactor.classList.remove("pulse"), 600);
//         }

//     } catch (error) {
//         console.error("Command Error:", error);
//     }
// }

// window.sendCommand = cmd => updateCommand(cmd);

// window.sendTypedCommand = function() {
//     const input = document.getElementById("commandInput");
//     const cmd = input.value.trim().toUpperCase();
//     if (!cmd) return;

//     updateCommand(cmd);
//     input.value = "";
//     suggestions.style.display = "none";
// };

// /* ---------------- REALTIME SYSTEM STATS ---------------- */

// const statsRef = doc(db, "devices", "home_pc");

// onSnapshot(statsRef, (docSnap) => {
//     if (docSnap.exists()) {
//         const data = docSnap.data();

//         const cpuBar = document.getElementById("cpuBar");
//         const ramBar = document.getElementById("ramBar");
//         const statusEl = document.getElementById("pcStatus");
//         const reactor = document.querySelector(".arc-inner");

//         if (cpuBar && data.cpu !== undefined)
//             cpuBar.style.width = data.cpu + "%";

//         if (ramBar && data.ram !== undefined)
//             ramBar.style.width = data.ram + "%";

//         /* Reactor Color Based on CPU */
//         if (reactor && data.cpu !== undefined) {
//             reactor.classList.remove("blue","yellow","red");

//             if (data.cpu > 85) reactor.classList.add("red");
//             else if (data.cpu > 70) reactor.classList.add("yellow");
//             else reactor.classList.add("blue");
//         }

//         /* Online Status */
//         if (statusEl) {
//             statusEl.textContent = "🟢 Online";
//             statusEl.style.color = "lightgreen";
//         }
//     }
// });

// /* ---------------- AUTOCOMPLETE ---------------- */

// const commandList = [
//     "NEXT","PREV","PLAY_PAUSE","VOL_UP","VOL_DOWN",
//     "MUTE","AIR_MOUSE_ON","AIR_MOUSE_OFF",
//     "SCROLL_ON","SCROLL_OFF","WEATHER"
// ];

// const input = document.getElementById("commandInput");
// const suggestions = document.getElementById("suggestions");

// let currentIndex = -1;
// let filteredCommands = [];

// if (input) {

//     input.addEventListener("input", function() {
//         const value = this.value.toUpperCase();
//         suggestions.innerHTML = "";
//         currentIndex = -1;

//         if (!value) {
//             suggestions.style.display = "none";
//             return;
//         }

//         filteredCommands = commandList.filter(cmd => cmd.includes(value));

//         filteredCommands.forEach((cmd, index) => {
//             const div = document.createElement("div");
//             div.textContent = cmd;
//             div.dataset.index = index;

//             div.onclick = () => {
//                 input.value = cmd;
//                 suggestions.style.display = "none";
//             };

//             suggestions.appendChild(div);
//         });

//         suggestions.style.display = filteredCommands.length ? "block" : "none";
//     });

//     input.addEventListener("keydown", function(e) {

//         const items = suggestions.querySelectorAll("div");

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             if (currentIndex < items.length - 1) {
//                 currentIndex++;
//                 updateActive(items);
//             }
//         }

//         if (e.key === "ArrowUp") {
//             e.preventDefault();
//             if (currentIndex > 0) {
//                 currentIndex--;
//                 updateActive(items);
//             }
//         }

//         if (e.key === "Enter") {
//             e.preventDefault();

//             if (currentIndex >= 0 && items[currentIndex]) {
//                 input.value = items[currentIndex].textContent;
//                 suggestions.style.display = "none";
//                 currentIndex = -1;
//             } else {
//                 sendTypedCommand();
//             }
//         }
//     });

//     function updateActive(items) {
//         items.forEach(item => item.classList.remove("active"));
//         if (items[currentIndex]) {
//             items[currentIndex].classList.add("active");
//         }
//     }
// }

// /* Hide Suggestions When Clicking Outside */
// document.addEventListener("click", function(e) {
//     if (!e.target.closest(".command-wrapper")) {
//         if (suggestions) suggestions.style.display = "none";
//     }
// });

// /* ---------------- DRAWER TOGGLE ---------------- */

// window.toggleMenu = function() {
//     const drawer = document.getElementById("drawer");
//     const overlay = document.getElementById("overlay");

//     drawer.classList.toggle("active");
//     overlay.classList.toggle("active");
// };

// /* ---------------- WEATHER ---------------- */

// const API_KEY = "ef383061400f267b6b723057b6863f39";

// async function fetchWeather() {
//     try {
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=Bhuj,IN&units=metric&appid=${API_KEY}`
//         );

//         const data = await response.json();

//         document.getElementById("weatherTemp").textContent =
//             Math.round(data.main.temp) + "°C";

//         document.getElementById("weatherDesc").textContent =
//             data.weather[0].description;

//         document.getElementById("weatherCity").textContent =
//             data.name;

//     } catch (error) {
//         console.error("Weather error:", error);
//     }
// }

// fetchWeather();
// setInterval(fetchWeather, 600000);
// /* ================= VOICE COMMAND SYSTEM ================= */

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// if (SpeechRecognition) {

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     const reactorCore = document.querySelector(".arc-inner");

//     if (reactorCore) {

//         reactorCore.addEventListener("click", () => {

//             console.log("🎤 Listening...");
//             recognition.start();
//             reactorCore.classList.add("pulse");

//         });

//         recognition.onresult = function(event) {

//             const speech = event.results[0][0].transcript.toLowerCase();
//             console.log("You said:", speech);

//             reactorCore.classList.remove("pulse");

//             processVoiceCommand(speech);
//         };

//         recognition.onerror = function() {
//             reactorCore.classList.remove("pulse");
//         };
//     }
// }

// /* ================= COMMAND MATCHING ================= */

// function processVoiceCommand(text) {

//     /* ===== VOLUME UP ===== */
//     if (
//         text.includes("volume up") ||
//         text.includes("increase volume") ||
//         text.includes("awaj badhao") ||
//         text.includes("volume badhao") ||
//         text.includes("sound badhao")
//     ) {
//         sendCommand("VOL_UP");
//         return;
//     }

//     /* ===== VOLUME DOWN ===== */
//     if (
//         text.includes("volume down") ||
//         text.includes("reduce volume") ||
//         text.includes("awaj kam") ||
//         text.includes("volume kam") ||
//         text.includes("sound kam")
//     ) {
//         sendCommand("VOL_DOWN");
//         return;
//     }

//     /* ===== MUTE ===== */
//     if (
//         text.includes("mute") ||
//         text.includes("band kar do sound")
//     ) {
//         sendCommand("MUTE");
//         return;
//     }

//     /* ===== PLAY / PAUSE ===== */
//     if (
//         text.includes("play") ||
//         text.includes("pause") ||
//         text.includes("music chalao") ||
//         text.includes("music band karo")
//     ) {
//         sendCommand("PLAY_PAUSE");
//         return;
//     }

//     /* ===== NEXT ===== */
//     if (
//         text.includes("next") ||
//         text.includes("next song") ||
//         text.includes("agla gana")
//     ) {
//         sendCommand("NEXT");
//         return;
//     }

//     /* ===== PREVIOUS ===== */
//     if (
//         text.includes("previous") ||
//         text.includes("pichla gana") ||
//         text.includes("previous song")
//     ) {
//         sendCommand("PREV");
//         return;
//     }

//     /* ===== AIR MOUSE ON ===== */
//     if (
//         text.includes("air mouse on") ||
//         text.includes("mouse on")
//     ) {
//         sendCommand("AIR_MOUSE_ON");
//         return;
//     }

//     /* ===== AIR MOUSE OFF ===== */
//     if (
//         text.includes("air mouse off") ||
//         text.includes("mouse off")
//     ) {
//         sendCommand("AIR_MOUSE_OFF");
//         return;
//     }

//     /* ===== SCROLL ON ===== */
//     if (
//         text.includes("scroll on") ||
//         text.includes("scroll chalu")
//     ) {
//         sendCommand("SCROLL_ON");
//         return;
//     }

//     /* ===== SCROLL OFF ===== */
//     if (
//         text.includes("scroll off") ||
//         text.includes("scroll band")
//     ) {
//         sendCommand("SCROLL_OFF");
//         return;
//     }

//     /* ===== WEATHER ===== */
//     if (
//         text.includes("weather") ||
//         text.includes("mausam") ||
//         text.includes("temperature")
//     ) {
//         sendCommand("WEATHER");
//         return;
//     }

//     console.log("❌ No matching command found");
// }
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyC9n8sXo2l7m1Zt3a5b6c7d8e9f0g1h2i",
    authDomain: "jarvis-d340a.firebaseapp.com",
    projectId: "jarvis-d340a",
    storageBucket: "jarvis-d340a.firebasestorage.app",
    messagingSenderId: "730090361097",
    appId: "1:730090361097:web:5ac643d490aaa6cdb443d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SEND COMMAND ================= */

async function updateCommand(cmd) {
    try {
        await updateDoc(doc(db, "devices", "home_pc"), {
            command: cmd,
            updated_at: Date.now()
        });

        const reactor = document.querySelector(".arc-inner");
        if (reactor) {
            reactor.classList.add("pulse");
            setTimeout(() => reactor.classList.remove("pulse"), 600);
        }

    } catch (err) {
        console.error("Command Error:", err);
    }
}

window.sendCommand = cmd => updateCommand(cmd);

window.sendTypedCommand = function() {
    const input = document.getElementById("commandInput");
    const cmd = input.value.trim().toUpperCase();
    if (!cmd) return;

    updateCommand(cmd);
    input.value = "";
    document.getElementById("suggestions").style.display = "none";
};

/* ================= REALTIME STATS ================= */

const statsRef = doc(db, "devices", "home_pc");

onSnapshot(statsRef, (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();

        const cpuBar = document.getElementById("cpuBar");
        const ramBar = document.getElementById("ramBar");
        const statusEl = document.getElementById("pcStatus");
        const reactor = document.querySelector(".arc-inner");

        if (cpuBar && data.cpu !== undefined)
            cpuBar.style.width = data.cpu + "%";

        if (ramBar && data.ram !== undefined)
            ramBar.style.width = data.ram + "%";

        /* Reactor Color */
        if (reactor && data.cpu !== undefined) {
            reactor.classList.remove("blue","yellow","red");

            if (data.cpu > 85) reactor.classList.add("red");
            else if (data.cpu > 70) reactor.classList.add("yellow");
            else reactor.classList.add("blue");
        }

        if (statusEl) {
            statusEl.textContent = "🟢 Online";
            statusEl.style.color = "lightgreen";
        }
    }
});

/* ================= AUTOCOMPLETE ================= */

const commandList = [
    "NEXT","PREV","PLAY_PAUSE","VOL_UP","VOL_DOWN",
    "MUTE","AIR_MOUSE_ON","AIR_MOUSE_OFF",
    "SCROLL_ON","SCROLL_OFF","WEATHER"
];

const input = document.getElementById("commandInput");
const suggestions = document.getElementById("suggestions");

let currentIndex = -1;

if (input) {

    input.addEventListener("input", function() {
        const value = this.value.toUpperCase();
        suggestions.innerHTML = "";
        currentIndex = -1;

        if (!value) {
            suggestions.style.display = "none";
            return;
        }

        const filtered = commandList.filter(cmd => cmd.includes(value));

        filtered.forEach((cmd, index) => {
            const div = document.createElement("div");
            div.textContent = cmd;

            div.onclick = () => {
                input.value = cmd;
                suggestions.style.display = "none";
            };

            suggestions.appendChild(div);
        });

        suggestions.style.display = filtered.length ? "block" : "none";
    });

    input.addEventListener("keydown", function(e) {

        const items = suggestions.querySelectorAll("div");

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (currentIndex < items.length - 1) currentIndex++;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) currentIndex--;
        }

        if (e.key === "Enter") {
            e.preventDefault();

            if (currentIndex >= 0 && items[currentIndex]) {
                input.value = items[currentIndex].textContent;
                suggestions.style.display = "none";
                currentIndex = -1;
            } else {
                sendTypedCommand();
            }
        }

        items.forEach(item => item.classList.remove("active"));
        if (items[currentIndex])
            items[currentIndex].classList.add("active");
    });
}

/* ================= DRAWER ================= */

window.toggleMenu = function() {
    document.getElementById("drawer").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
};

/* ================= WEATHER ================= */

const API_KEY = "ef383061400f267b6b723057b6863f39";

async function fetchWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Bhuj,IN&units=metric&appid=${API_KEY}`
        );

        const data = await response.json();

        document.getElementById("weatherTemp").textContent =
            Math.round(data.main.temp) + "°C";

        document.getElementById("weatherDesc").textContent =
            data.weather[0].description;

        document.getElementById("weatherCity").textContent =
            data.name;

    } catch (error) {
        console.error("Weather error:", error);
    }
}

fetchWeather();
setInterval(fetchWeather, 600000);

/* ================= VOICE SYSTEM ================= */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    const reactorCore = document.querySelector(".arc-inner");
    const reactorMiddle = document.querySelector(".arc-middle");

    if (reactorCore) {

        reactorCore.addEventListener("click", () => {

            recognition.start();

            reactorCore.classList.add("pulse");

            if (reactorMiddle)
                reactorMiddle.classList.add("listening");
        });

        recognition.onresult = function(event) {

            const speech = event.results[0][0].transcript.toLowerCase();

            if (reactorMiddle)
                reactorMiddle.classList.remove("listening");

            processVoiceCommand(speech);
        };

        recognition.onerror = function() {
            if (reactorMiddle)
                reactorMiddle.classList.remove("listening");
        };
    }
}

/* ================= VOICE MATCHING ================= */

function processVoiceCommand(text) {

    if (text.includes("volume up") || text.includes("awaj badhao"))
        return sendCommand("VOL_UP");

    if (text.includes("volume down") || text.includes("awaj kam"))
        return sendCommand("VOL_DOWN");

    if (text.includes("mute"))
        return sendCommand("MUTE");

    if (text.includes("play") || text.includes("pause"))
        return sendCommand("PLAY_PAUSE");

    if (text.includes("next"))
        return sendCommand("NEXT");

    if (text.includes("previous"))
        return sendCommand("PREV");

    if (text.includes("air mouse on"))
        return sendCommand("AIR_MOUSE_ON");

    if (text.includes("air mouse off"))
        return sendCommand("AIR_MOUSE_OFF");

    if (text.includes("scroll on"))
        return sendCommand("SCROLL_ON");

    if (text.includes("scroll off"))
        return sendCommand("SCROLL_OFF");

    if (text.includes("weather") || text.includes("mausam"))
        return sendCommand("WEATHER");
    
     if (text.includes("shutdown") || text.includes("turn off"))
        return sendCommand("shutdown");

    console.log("No matching command");

}
