const buttons = document.querySelectorAll('.sound-button');

function adjustFontSize(element) {
    while (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
        const fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue('font-size'));
        if (fontSize <= 10) break; 
        element.style.fontSize = (fontSize - 1) + 'px';
    }
}

buttons.forEach(button => {
    let sound = null;

    button.addEventListener('click', () => {
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
            button.style.backgroundColor = 'rgb(175, 0, 0)';
            button.style.boxShadow = '2px 2px 1px rgb(100, 0, 0)';
        } else {
            sound = new Audio(button.getAttribute('data-sound'));
            sound.play();
            button.style.backgroundColor = 'rgb(0, 110, 0)';
            button.style.boxShadow = '2px 2px 1px rgb(0, 75, 0)';
            sound.addEventListener('ended', () => {
                button.style.backgroundColor = 'rgb(175, 0, 0)';
                button.style.boxShadow = '2px 2px 1px rgb(100, 0, 0)';
            });
        }
    });
});

document.getElementById('width-slider').addEventListener('input', function() {
    const size = this.value + 'px';
    document.querySelectorAll('.sound-button').forEach(button => {
        button.style.width = size;
        button.style.height = size;
        button.style.fontSize = (this.value / 6) + 'px';
    });
});

document.querySelectorAll('.navbar').forEach(nav => {
    nav.addEventListener('click', function() {
        const targetId = nav.getAttribute('data-target');
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});