// Metronome variables
let metronomeEnabled = false;
let metronomeAudioContext = null;
let metronomeInterval = null;
let currentBPM = 120;
let metronomeVolume = 0.5;
let isMetronomePlaying = false;
let currentSong = 'single';

// Piano note frequencies (in Hz)
const pianoNotes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88
};

// Song patterns
const songPatterns = {
    single: [pianoNotes.C4], // Simple one note
    scale: [
        pianoNotes.C4,
        pianoNotes.D4,
        pianoNotes.E4,
        pianoNotes.F4,
        pianoNotes.G4,
        pianoNotes.F4,
        pianoNotes.E4,
        pianoNotes.D4
    ],
    happyBirthday: [
        pianoNotes.C4, pianoNotes.C4, // Happy
        pianoNotes.D4, pianoNotes.C4, // Birth-day
        pianoNotes.F4, pianoNotes.E4, // to
        pianoNotes.C4, pianoNotes.C4, // you
        pianoNotes.D4, pianoNotes.C4, // Happy
        pianoNotes.G4, pianoNotes.F4, // Birth-day
        pianoNotes.C4, pianoNotes.C4, // to
        pianoNotes.C4, pianoNotes.A4, // you
        pianoNotes.F4, pianoNotes.E4, // Happy
        pianoNotes.D4, pianoNotes.B4, // Birth-day
        pianoNotes.A4, pianoNotes.G4  // dear friend
    ]
};

let currentNoteIndex = 0;

function updateBPM() {
    const bpmInput = document.getElementById('bpm');
    const bpmValue = document.getElementById('bpmValue');
    currentBPM = Math.min(Math.max(parseInt(bpmInput.value) || 120, 30), 240);
    bpmInput.value = currentBPM;
    bpmValue.textContent = currentBPM;
    
    if (isMetronomePlaying) {
        stopMetronome();
        startMetronome();
    }
}

function updateVolume() {
    const volumeInput = document.getElementById('volume');
    const volumeIcon = volumeInput.parentElement.querySelector('button i');
    const value = parseInt(volumeInput.value);
    
    metronomeVolume = value / 100;
    
    if (value === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function toggleVolumeControl(button) {
    const volumeControl = button.parentElement;
    volumeControl.classList.toggle('active');
    
    if (volumeControl.classList.contains('active')) {
        const closeVolume = (e) => {
            if (!volumeControl.contains(e.target)) {
                volumeControl.classList.remove('active');
                document.removeEventListener('click', closeVolume);
            }
        };
        setTimeout(() => document.addEventListener('click', closeVolume), 0);
    }
}

function toggleInstrumentControl(button) {
    const instrumentControl = button.parentElement;
    instrumentControl.classList.toggle('active');
    
    if (instrumentControl.classList.contains('active')) {
        const closeInstrument = (e) => {
            if (!instrumentControl.contains(e.target)) {
                instrumentControl.classList.remove('active');
                document.removeEventListener('click', closeInstrument);
            }
        };
        setTimeout(() => document.addEventListener('click', closeInstrument), 0);
    }
}

function changeInstrument(type) {
    currentSong = type;
    currentNoteIndex = 0;
}

// Replace createMetronomeSound function
function createMetronomeSound(duration) {
    const oscillator = metronomeAudioContext.createOscillator();
    const gainNode = metronomeAudioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(metronomeAudioContext.destination);
    
    oscillator.type = 'sine'; // Always use sine for piano-like sound
    
    // Get current note from the selected song pattern
    const pattern = songPatterns[currentSong];
    const freq = pattern[currentNoteIndex];
    currentNoteIndex = (currentNoteIndex + 1) % pattern.length;
    
    oscillator.frequency.setValueAtTime(freq, metronomeAudioContext.currentTime);
    
    // Smoother attack and release for piano-like sound
    gainNode.gain.setValueAtTime(0, metronomeAudioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(metronomeVolume * 0.8, metronomeAudioContext.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, metronomeAudioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(metronomeAudioContext.currentTime + duration);
}

function startMetronome() {
    if (!metronomeAudioContext) {
        metronomeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const interval = (60 / currentBPM) * 1000;
    const metronomeCircle = document.querySelector('.metronome-circle');
    
    metronomeInterval = setInterval(() => {
        createMetronomeSound(0.1);
        metronomeCircle.classList.add('active');
        setTimeout(() => metronomeCircle.classList.remove('active'), 100);
    }, interval);
}

function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }
}

function toggleMetronomePlay() {
    const startButton = document.getElementById('metronomeStart');
    
    if (!isMetronomePlaying) {
        startMetronome();
        startButton.innerHTML = '<i class="fas fa-pause"></i>';
        isMetronomePlaying = true;
    } else {
        stopMetronome();
        startButton.innerHTML = '<i class="fas fa-play"></i>';
        isMetronomePlaying = false;
    }
}