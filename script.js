// Timezone configurations
const timezones = [
    { id: 'london', name: 'London', offset: 0 },
    { id: 'newyork', name: 'New York', offset: -5 },
    { id: 'tokyo', name: 'Tokyo', offset: 9 },
    { id: 'sydney', name: 'Sydney', offset: 10 },
    { id: 'dubai', name: 'Dubai', offset: 4 },
    { id: 'saopaulo', name: 'São Paulo', offset: -3 }
];

// Format time with leading zeros
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Get current time for a specific timezone
function getTimeForTimezone(offset) {
    const now = new Date();
    
    // Get UTC time
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    
    // Calculate timezone offset in hours
    const localHours = (utcHours + offset + 24) % 24;
    
    return {
        hours: localHours,
        minutes: utcMinutes,
        seconds: utcSeconds
    };
}

// Format time in 12-hour format
function formatTime12Hour(hours, minutes, seconds) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return {
        time: `${padZero(displayHours)}:${padZero(minutes)}:${padZero(seconds)}`,
        period: period
    };
}

// Get formatted date
function getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Update a single clock
function updateClock(timezone) {
    const timeData = getTimeForTimezone(timezone.offset);
    const formatted = formatTime12Hour(timeData.hours, timeData.minutes, timeData.seconds);
    const date = getFormattedDate();
    
    const timeElement = document.querySelector(`#clock-${timezone.id} .time`);
    const periodElement = document.querySelector(`#clock-${timezone.id} .period`);
    const dateElement = document.querySelector(`#date-${timezone.id}`);
    
    if (timeElement) {
        timeElement.textContent = formatted.time;
    }
    if (periodElement) {
        periodElement.textContent = formatted.period;
    }
    if (dateElement) {
        dateElement.textContent = date;
    }
}

// Update all clocks
function updateAllClocks() {
    timezones.forEach(timezone => {
        updateClock(timezone);
    });
}

// Initialize clocks on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initial update
    updateAllClocks();
    
    // Update every second
    setInterval(updateAllClocks, 1000);
});
