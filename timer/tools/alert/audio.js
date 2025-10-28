let isPlaying = false; // Track whether preview is playing
let currentAudio = null; // Store the current audio object
let audioStates = {};
let selectedVoice = localStorage.getItem('selectedVoice') || 'male1'; // Default voice or stored value

function selectVoice(voice) {
    selectedVoice = voice;
    saveSetting('selectedVoice', voice);
    updateVoice(); // Update voice UI after selection
}

function updateVoice() {
    const button = document.querySelector('.dropdown-button');
    if (button) {
        button.textContent = selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1);
    }
    document.getElementById('dropdownMenu').style.display = 'none';
}

function previewVoice(voice, event) {
    event.stopPropagation(); // Prevent the dropdown item from being selected
    const audioFile = voiceAudios[voice].audio8;
    const audio = new Audio(audioFile);
    audio.play();
}

const voiceAudios = {
    male1: { audio8: '../audio/male1_8.mp3', audio3: '../audio/male1_3.mp3' },
    male2: { audio8: '../audio/male2_8.mp3', audio3: '../audio/male2_3.mp3' },
    female1: { audio8: '../audio/female1_8.mp3', audio3: '../audio/female1_3.mp3' },
    female2: { audio8: '../audio/female2_8.mp3', audio3: '../audio/female2_3.mp3' }
};

// Update the dropdown button with the stored or default voice
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.dropdown-button');
    button.textContent = selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1); // Capitalize first letter
});

function togglePreview(event, voice) {
    event.stopPropagation(); // Prevent dropdown item from being selected

    const button = event.target; // The clicked icon
    const audioFile = voiceAudios[voice].audio8;

    // If this voice is already playing
    if (audioStates[voice] && audioStates[voice].isPlaying) {
        // Pause the audio
        audioStates[voice].audio.pause();
        audioStates[voice].audio.currentTime = 0;
        audioStates[voice].isPlaying = false;

        // Change button back to play
        button.classList.remove('fa-pause');
        button.classList.add('fa-play');
    } else {
        // If the audio for this voice is not playing, stop any other audio and reset
        if (audioStates[voice] && audioStates[voice].audio) {
            // Pause the previously playing audio for this button, if any
            audioStates[voice].audio.pause();
            audioStates[voice].audio.currentTime = 0;
        }

        // Create new audio object for this voice
        const newAudio = new Audio(audioFile);
        newAudio.play();

        // Update audio state for this voice
        audioStates[voice] = {
            audio: newAudio,
            isPlaying: true
        };

        // Update button state to paused (II)
        button.classList.remove('fa-play');
        button.classList.add('fa-pause');

        // Reset the button when audio ends
        newAudio.onended = () => {
            audioStates[voice].isPlaying = false;
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
        };

        // In case of audio loading error, reset the button
        newAudio.onerror = () => {
            console.error("Error loading audio file for " + voice);
            audioStates[voice].isPlaying = false;
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
        };
    }
}
function playSound(action) {
    if (!soundEffects) return; // Only play if sound effects are enabled
    
    let soundFile;
    switch(action) {
        case 'start':
            soundFile = '../sounds/start.mp3';
            break;
        case 'stop':
            soundFile = '../sounds/stop.mp3';
            break;
        case 'inspection8':
            soundFile = voiceAudios[selectedVoice].audio8;
            break;
        case 'inspection3':
            soundFile = voiceAudios[selectedVoice].audio3;
            break;
        default:
            return;
    }
    
    const audio = new Audio(soundFile);
    audio.play().catch(error => {
        console.log('Error playing sound:', error);
    });
}