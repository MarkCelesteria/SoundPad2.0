const globalVolume = { value: 0.8 };
const activeSounds = new Map();

function createRipple(button, e) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

let nowPlayingCount = 0;
const npText = document.getElementById('np-text');
const npIcon = document.querySelector('.np-icon');

function updateNowPlaying() {
    if (nowPlayingCount === 0) {
        npText.textContent = '— IDLE —';
        npIcon.classList.add('idle');
    } else {
        const playing = [...activeSounds.entries()].map(([btn]) =>
            btn.getAttribute('data-label') || btn.querySelector('.btn-text').textContent.trim()
        );
        npText.textContent = playing.join('  ·  ');
        npIcon.classList.remove('idle');
    }
}

document.querySelectorAll('.sound-button').forEach(button => {
    button.addEventListener('click', (e) => {
        createRipple(button, e);

        if (activeSounds.has(button)) {
            // Stop the sound
            const snd = activeSounds.get(button);
            snd.pause();
            snd.currentTime = 0;
            activeSounds.delete(button);
            button.classList.remove('playing');
            nowPlayingCount = Math.max(0, nowPlayingCount - 1);
        } else {
            // Play the sound
            const src = button.getAttribute('data-sound');
            const snd = new Audio(src);
            snd.volume = globalVolume.value;
            snd.play().catch(() => {
                button.classList.remove('playing');
                activeSounds.delete(button);
                nowPlayingCount = Math.max(0, nowPlayingCount - 1);
                updateNowPlaying();
            });

            activeSounds.set(button, snd);
            button.classList.add('playing');
            nowPlayingCount++;

            snd.addEventListener('ended', () => {
                activeSounds.delete(button);
                button.classList.remove('playing');
                nowPlayingCount = Math.max(0, nowPlayingCount - 1);
                updateNowPlaying();
            });
        }

        updateNowPlaying();
    });
});

document.getElementById('stop-all-btn').addEventListener('click', () => {
    activeSounds.forEach((snd, btn) => {
        snd.pause();
        snd.currentTime = 0;
        btn.classList.remove('playing');
    });
    activeSounds.clear();
    nowPlayingCount = 0;
    updateNowPlaying();
});

const widthSlider = document.getElementById('width-slider');
const sizeDisplay = document.getElementById('size-display');

widthSlider.addEventListener('input', function () {
    const size = parseInt(this.value);
    sizeDisplay.textContent = size;
    document.querySelectorAll('.sound-button').forEach(btn => {
        btn.style.width = size + 'px';
        btn.style.height = size + 'px';
        btn.querySelector('.btn-icon').style.fontSize = Math.max(12, size * 0.22) + 'px';
        btn.querySelector('.btn-text').style.fontSize = Math.max(8, size * 0.11) + 'px';
    });
});

const volumeSlider = document.getElementById('volume-slider');
const volDisplay = document.getElementById('vol-display');

volumeSlider.addEventListener('input', function () {
    const vol = parseInt(this.value);
    volDisplay.textContent = vol;
    globalVolume.value = vol / 100;
    activeSounds.forEach(snd => {
        snd.volume = globalVolume.value;
    });
});

document.querySelectorAll('.nav-pip').forEach(pip => {
    pip.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('stop-all-btn').click();
    }
});

updateNowPlaying();