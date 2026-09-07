// API Configuration
const API_URL = 'https://official-joke-api.appspot.com/random_joke';

// DOM Elements
const jokeDisplay = document.getElementById('joke-display');
const jokeType = document.getElementById('joke-type');
const getJokeBtn = document.getElementById('get-joke-btn');
const copyJokeBtn = document.getElementById('copy-joke-btn');
const shareJokeBtn = document.getElementById('share-joke-btn');
const loading = document.getElementById('loading');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Local Storage Key
const HISTORY_KEY = 'jokeHistory';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadHistory();
});

// Setup Event Listeners
function setupEventListeners() {
    getJokeBtn.addEventListener('click', fetchJoke);
    copyJokeBtn.addEventListener('click', copyJoke);
    shareJokeBtn.addEventListener('click', shareJoke);
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Fetch Joke from API
async function fetchJoke() {
    try {
        getJokeBtn.disabled = true;
        loading.classList.remove('hidden');

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const joke = await response.json();
        displayJoke(joke);
        saveToHistory(joke);
        
        loading.classList.add('hidden');
        getJokeBtn.disabled = false;

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeDisplay.innerHTML = `<p>❌ Oops! Failed to load a joke. Please try again.</p>`;
        loading.classList.add('hidden');
        getJokeBtn.disabled = false;
        showToast('Error loading joke. Please try again.');
    }
}

// Display Joke
function displayJoke(joke) {
    const jokeText = joke.type === 'knock-knock' 
        ? `${joke.setup}<br><br>${joke.delivery}`
        : `${joke.setup}<br><br>${joke.punchline}`;
    
    jokeDisplay.innerHTML = `<p>${escapeHtml(jokeText)}</p>`;
    jokeType.textContent = joke.type.replace('-', ' ');
}

// Copy Joke to Clipboard
function copyJoke() {
    const text = jokeDisplay.innerText;
    
    if (text && !text.includes('Click the button')) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('✓ Joke copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy joke');
        });
    } else {
        showToast('No joke to copy. Get a joke first!');
    }
}

// Share Joke
function shareJoke() {
    const text = jokeDisplay.innerText;
    
    if (text && !text.includes('Click the button')) {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this joke!',
                text: text
            }).catch(err => console.log('Share error:', err));
        } else {
            showToast('Share is not supported on your device');
        }
    } else {
        showToast('No joke to share. Get a joke first!');
    }
}

// Save to History (Local Storage)
function saveToHistory(joke) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    
    const jokeText = joke.type === 'knock-knock'
        ? `${joke.setup} / ${joke.delivery}`
        : `${joke.setup} / ${joke.punchline}`;
    
    // Add to beginning of array
    history.unshift({
        text: jokeText,
        type: joke.type,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 10 jokes
    history = history.slice(0, 10);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateHistoryDisplay();
}

// Load and Display History
function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="placeholder">No jokes yet. Click "Get Joke" to start!</li>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <li onclick="copyHistoryJoke(${index})">${item.text}</li>
    `).join('');
}

// Update History Display
function updateHistoryDisplay() {
    loadHistory();
}

// Copy Joke from History
function copyHistoryJoke(index) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    
    if (history[index]) {
        navigator.clipboard.writeText(history[index].text).then(() => {
            showToast('✓ Joke copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy joke');
        });
    }
}

// Clear History
function clearHistory() {
    if (confirm('Are you sure you want to clear all joke history?')) {
        localStorage.removeItem(HISTORY_KEY);
        updateHistoryDisplay();
        showToast('History cleared');
    }
}

// Show Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
