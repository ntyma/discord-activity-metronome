import './style.css';
import rocketLogo from '/rocket.png';
import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

//Import sound assets
import woodMetronomeSoundPath from './Assets/sounds/250551__druminfected__metronomeup.wav';
//const metronomeSound = new Audio('Assets/sounds/250551__druminfected__metronomeup.wav');
const metronomeSound = new Audio(woodMetronomeSoundPath);
//metronomeSound.loop = true

// --- Run setupDiscordSdk() safely ---
setupDiscordSdk();

async function setupDiscordSdk() {
  try {
    // Wait for the Discord SDK to initialize (only works inside Discord)
    await discordSdk.ready();
    console.log("Discord SDK is ready");

    // Show your app content after SDK is ready
    document.querySelector('#app').innerHTML = `
      <div>
        <img src="${rocketLogo}" class="logo" alt="Discord" />
        <h1>Hello, World! testing</h1>
        <button id="toggleMetronome"> Start Metronome </button>
        <div style="margin-bottom: 1rem;">
            <label for="bpm"> BPM </label>
            <input id="bpm" type="number" value="120" min="30" max="250" step="1" 
            style="width: 80px; text-align: center;">
        </div>
      </div>
    `;

    const metronomeToggle = document.getElementById('toggleMetronome');
    const bpmInput = document.getElementById('bpm');


    let isPlaying = false;
    let intervalId = null;

    function playClick(){
        metronomeSound.currentTime = 0;
        metronomeSound.play();
    }

    function startMetronome() {
        const bpm = parseInt(bpmInput.value) || 120;
        const interval = 60000 / bpm;
        playClick();
        intervalId = setInterval(playClick, interval);
        isPlaying = true;
        metronomeToggle.textContent = "Stop Metronome";
    }

    function stopMetronome() {
        clearInterval(intervalId)
        intervalId = null;
        isPlaying = false;
        metronomeToggle.textContent = "Start Metronome";
    }

    bpmInput.addEventListener('input', () => {
        const min = parseInt(bpmInput.min);
        const max = parseInt(bpmInput.max)
        let value = parseInt(bpmInput.value) || min;
        if(value < min) value = min;
        if(value > max) value = max;
        bpmInput.value = value;
    })

    metronomeToggle.addEventListener('click', () => {
        if(!isPlaying) {
            startMetronome();
        } else {
            stopMetronome();
        }
    })


    

  } catch (err) {
    console.error("Discord SDK failed to initialize:", err);

    // Show a helpful message in the page
    document.querySelector('#app').innerHTML = `
      <div style="color: red; padding: 2rem;">
        <h2>Discord SDK failed to load.</h2>
        <p>Make sure you’re running this inside Discord and the Activity URL matches your tunnel.</p>
      </div>
    `;
  }
}


