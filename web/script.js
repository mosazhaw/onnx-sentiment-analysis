function resetSentimentDisplay() {
    const positiveEl = document.getElementById('positive');
    const negativeEl = document.getElementById('negative');
    const answerPart = document.getElementById('answerPart');
    const posBar = document.getElementById('posBar');
    const negBar = document.getElementById('negBar');

    positiveEl.textContent = '';
    negativeEl.textContent = '';
    posBar.style.width = '0%';
    negBar.style.width = '0%';
    posBar.setAttribute('aria-valuenow', '0');
    negBar.setAttribute('aria-valuenow', '0');
    answerPart.style.visibility = 'hidden';
}

function resetInput() {
    const input = document.getElementById('textInput');
    input.value = '';
    resetSentimentDisplay();
    input.focus();
}

function getSentiment(event, text) {
    if (!text) {
        resetSentimentDisplay();
        return;
    }

    if (event.key !== 'Enter') {
        return;
    }

    const positiveEl = document.getElementById('positive');
    const negativeEl = document.getElementById('negative');
    const answerPart = document.getElementById('answerPart');
    const posBar = document.getElementById('posBar');
    const negBar = document.getElementById('negBar');

    answerPart.style.visibility = 'visible';

    fetch('/sentiment?' + new URLSearchParams({
        text: text,
    }), {
        method: 'GET',
        headers: {}
    }).then(
        response => response.json()
    ).then(
        data => {
            const posPct = Math.max(0, Math.min(100, parseFloat(data.positive) * 100));
            const negPct = Math.max(0, Math.min(100, parseFloat(data.negative) * 100));

            positiveEl.textContent = posPct.toFixed(1) + '%';
            negativeEl.textContent = negPct.toFixed(1) + '%';
            posBar.style.width = posPct + '%';
            negBar.style.width = negPct + '%';
            posBar.setAttribute('aria-valuenow', posPct.toFixed(1));
            negBar.setAttribute('aria-valuenow', negPct.toFixed(1));
        }
    ).catch(
        error => console.log(error)
    );
}
