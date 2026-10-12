export function setupLiveLeaderboard(level: number): void {
    const listElement = document.getElementById('top-5-list');
    if (!listElement) return;

    // Connect to the Django SSE endpoint
    const eventSource = new EventSource(`/api/scores/live/${level}/`);

    // This event triggers every time Django yields a new "data: ..." chunk
    eventSource.onmessage = (event) => {
        const scores = JSON.parse(event.data);
        
        // Clear the current list
        listElement.innerHTML = '';
        
        if (scores.length === 0) {
            listElement.innerHTML = '<li style="color: gray;">No scores yet. Be the first!</li>';
            return;
        }

        // Populate with new scores
        scores.forEach((scoreObj: {username: string, score: number}, index: number) => {
            const li = document.createElement('li');
            
            li.innerHTML = `<strong>${index + 1}. ${scoreObj.username}</strong> - ${scoreObj.score} pts`;
            listElement.appendChild(li);
        });
    };

    // Optional: Handle connection errors
    eventSource.onerror = () => {
        // EventSource will automatically try to reconnect, so we don't need manual logic here
        listElement.innerHTML = '<li style="color: red;">Connection lost. Reconnecting...</li>';
    };
}