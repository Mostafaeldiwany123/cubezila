// Listen for changes in localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'cubeSessions_v2') {
        loadSessionsFromLocalStorage();
        updateSessionInfo();
        updateSolveHistory();
        updateStats();
        updateCharts();
    }
});

// Add a custom event listener for direct updates
window.addEventListener('sessionUpdate', function() {
    loadSessionsFromLocalStorage();
    updateSessionInfo();
    updateSolveHistory();
    updateStats();
    updateCharts();
});

let sessions = {};
let currentSession = "3x3";
let solveTimeChart, progressChart;
let streak = 0;
let lastSolveDate = null;
let currentFilter = null;
let validTimes = [];
let dnfCount = 0;
let plus2Count = 0;


function loadSessionsFromLocalStorage() {
    const savedSessions = localStorage.getItem('cubeSessions_v2');
    if (savedSessions) {
        try {
            sessions = JSON.parse(savedSessions);
            if (!sessions["3x3"]) {
                sessions["3x3"] = { times: [], scrambles: [], scrambleType: "3x3" };
            }
        } catch(error) {
            console.error('Error parsing saved sessions:', error);
            sessions = { "3x3": { times: [], scrambles: [], scrambleType: "3x3" } };
        }
    } else {
        sessions = { "3x3": { times: [], scrambles: [], scrambleType: "3x3" } };
    }
    loadStreak();
    populateSessionSelector();
    
    // Check for current session from timer
    const timerSession = localStorage.getItem('currentTimerSession');
    if (timerSession && sessions[timerSession]) {
        currentSession = timerSession;
        const selector = document.getElementById('sessionSelector');
        if (selector) {
            selector.value = currentSession;
        }
    }
    
    changeSession();
}

function changeSession() {
    currentSession = document.getElementById('sessionSelector').value;
    // Sync session with timer
    localStorage.setItem('currentTimerSession', currentSession);
    updateSolveHistory();
    updateStats();
    updateCharts();
    updateSessionInfo();
}

// Listen for session changes
window.addEventListener('storage', (e) => {
    if (e.key === 'currentTimerSession') {
        const newSession = e.newValue;
        if (newSession && sessions[newSession]) {
            currentSession = newSession;
            const selector = document.getElementById('sessionSelector');
            if (selector) {
                selector.value = currentSession;
            }
            updateSolveHistory();
            updateStats();
            updateCharts();
            updateSessionInfo();
        }
    }
});

function loadStreak() {
    streak = parseInt(localStorage.getItem('cubeStreak')) || 0;
    lastSolveDate = localStorage.getItem('lastSolveDate');
    updateStreakDisplay();
    checkStreak();
}

function updateStreakDisplay() {
    document.getElementById('streakCount').textContent = streak;
}

function checkStreak() {
    const today = new Date().toDateString();
    
    if (lastSolveDate) {
        const lastDate = new Date(lastSolveDate);
        const currentDate = new Date(today);
        const timeDiff = currentDate - lastDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff > 1) {
            // Reset streak if more than one day has passed
            streak = 0;
        } else if (daysDiff === 1) {
            // Increment streak if exactly one day has passed
            streak++;
        }
        // If daysDiff is 0, we're still on the same day, don't change streak
    }
    
    lastSolveDate = today;
    localStorage.setItem('lastSolveDate', lastSolveDate);
    localStorage.setItem('cubeStreak', streak);
    updateStreakDisplay();
}

function incrementStreak() {
    const today = new Date().toDateString();
    
    if (!lastSolveDate) {
        // First solve ever
        streak = 1;
    } else if (lastSolveDate !== today) {
        const lastDate = new Date(lastSolveDate);
        const currentDate = new Date(today);
        const timeDiff = currentDate - lastDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Perfect streak continuation
            streak++;
        } else if (daysDiff > 1) {
            // Streak broken
            streak = 1;
        }
        // If daysDiff is 0, we're still on the same day, don't change streak
    }

    lastSolveDate = today;
    localStorage.setItem('lastSolveDate', lastSolveDate);
    localStorage.setItem('cubeStreak', streak);
    updateStreakDisplay();
}

function populateSessionSelector() {
    const sessionSelector = document.getElementById('sessionSelector');
    sessionSelector.innerHTML = '';
    for (const sessionName in sessions) {
        const option = document.createElement('option');
        option.value = sessionName;
        option.textContent = sessionName;
        sessionSelector.appendChild(option);
    }
    sessionSelector.value = currentSession;
}

function updateSessionInfo() {
    const sessionInfo = document.getElementById('sessionInfo');
    const currentSessionData = sessions[currentSession];
    const solveCount = currentSessionData.times.length;
    sessionInfo.textContent = `Current session: ${currentSession} - ${solveCount} solve${solveCount !== 1 ? 's' : ''}`;
}

function updateSolveHistory() {
    const tbody = document.querySelector('#solveHistory tbody');
    tbody.innerHTML = '';
    const session = sessions[currentSession];
    if (!session || !session.times || !session.scrambles) return;

    // Get all solve data
    const allTimes = [...session.times];
    const allScrambles = [...session.scrambles];
    const inspectionTimes = session.inspectionTimes || [];
    const penalties = session.penalties || [];

    // Find best/worst times (excluding DNFs)
    const validTimes = allTimes.filter(time => time !== "DNF").map(t => parseFloat(t));
    const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null;
    const worstTime = validTimes.length > 0 ? Math.max(...validTimes) : null;

    // Create rows in reverse order (most recent first)
    allTimes.forEach((time, index) => {
        const row = tbody.insertRow(0);
        const inspectionTime = inspectionTimes[index];
        const formattedInspectionTime = typeof inspectionTime === 'number' ? 
            `${inspectionTime.toFixed(1)}s` : '0.0s';
        const penalty = penalties[index];

        if (time === "DNF") {
            const actualTime = session.originalTimes && session.originalTimes[index];
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${actualTime ? 
                    `<span class="dnf-time">
                        <span class="dnf-text">DNF</span>
                        <span class="inline-time">${parseFloat(actualTime).toFixed(2)}</span>
                    </span>` : 
                    'DNF'}</td>
                <td>${session.scrambleType || ''}</td>
                <td>${formattedInspectionTime}</td>
                <td>${allScrambles[index] || ''}</td>
            `;
        } else {
            const numericTime = parseFloat(time);
            if (numericTime === bestTime) row.classList.add('best-solve');
            if (numericTime === worstTime) row.classList.add('worst-solve');

            let timeDisplay = numericTime.toFixed(2);
            if (penalty === '+2') {
                timeDisplay += '+';
            }

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${timeDisplay}</td>
                <td>${session.scrambleType || ''}</td>
                <td>${formattedInspectionTime}</td>
                <td>${allScrambles[index] || ''}</td>
            `;
        }
    });
}

function updateStats() {
    const times = sessions[currentSession].times;
    if (times.length === 0) {
        document.getElementById('statsContent').innerHTML = '<p>No solves recorded for this session. Start solving to see your statistics!</p>';
        document.getElementById('analysisContent').innerHTML = '';
        return;
    }

    const stats = calculateStats(times);

    document.getElementById('statsContent').innerHTML = `
        <div class="stat-item" onclick="filterSolves('best')">
            <div class="stat-value">${stats.best === "DNF" ? "DNF" : stats.best.toFixed(2) + 's'}</div>
            <div>Best Solve <i class="fas fa-trophy"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('worst')">
            <div class="stat-value">${stats.worst === "DNF" ? "DNF" : stats.worst.toFixed(2) + 's'}</div>
            <div>Slowest Solve <i class="fas fa-hourglass-end"></i></div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.mean === "DNF" ? "DNF" : stats.mean.toFixed(2) + 's'}</div>
            <div>Mean <i class="fas fa-calculator"></i></div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.median === "DNF" ? "DNF" : stats.median.toFixed(2) + 's'}</div>
            <div>Median <i class="fas fa-balance-scale"></i></div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.standardDeviation === "DNF" ? "DNF" : stats.standardDeviation.toFixed(2) + 's'}</div>
            <div>Standard Deviation <i class="fas fa-chart-line"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('ao5')">
            <div class="stat-value">${stats.ao5 === "DNF" ? "DNF" : (stats.ao5 ? stats.ao5.toFixed(2) + 's' : 'N/A')}</div>
            <div>Current Ao5 <i class="fas fa-star-half-alt"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('ao12')">
            <div class="stat-value">${stats.ao12 === "DNF" ? "DNF" : (stats.ao12 ? stats.ao12.toFixed(2) + 's' : 'N/A')}</div>
            <div>Current Ao12 <i class="fas fa-star"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('ao100')">
            <div class="stat-value">${stats.ao100 === "DNF" ? "DNF" : (stats.ao100 ? stats.ao100.toFixed(2) + 's' : 'N/A')}</div>
            <div>Current Ao100 <i class="fas fa-chart-area"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('bestAo5')">
            <div class="stat-value">${stats.bestAo5 === "DNF" ? "DNF" : (stats.bestAo5 ? stats.bestAo5.toFixed(2) + 's' : 'N/A')}</div>
            <div>Best Ao5 <i class="fas fa-award"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('bestAo12')">
            <div class="stat-value">${stats.bestAo12 === "DNF" ? "DNF" : (stats.bestAo12 ? stats.bestAo12.toFixed(2) + 's' : 'N/A')}</div>
            <div>Best Ao12 <i class="fas fa-medal"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('dnf')">
            <div class="stat-value">${stats.dnfCount}</div>
            <div>DNF Count (${stats.dnfPercentage.toFixed(1)}%) <i class="fas fa-times-circle"></i></div>
        </div>
        <div class="stat-item" onclick="filterSolves('plus2')">
            <div class="stat-value">${stats.plus2Count}</div>
            <div>+2 Count (${stats.plus2Percentage.toFixed(1)}%) <i class="fas fa-plus-circle"></i></div>
        </div>
    `;

    const analysis = analyzeResults(stats, sessions[currentSession].scrambleType);
    document.getElementById('analysisContent').innerHTML = `
        <div class="analysis">
            <h3>Your Cubing Journey</h3>
            <p>${analysis.journey}</p>
            <h3>Areas of Strength</h3>
            <ul>
                ${analysis.strengths.length > 0 ? analysis.strengths.map(strength => `<li>${strength}</li>`).join('') : '<li>Keep solving to discover your strengths!</li>'}
            </ul>
            <h3>Areas for Improvement</h3>
            <ul>
                ${analysis.improvements.length > 0 ? analysis.improvements.map(improvement => `<li>${improvement}</li>`).join('') : '<li>Continue solving to identify specific areas for improvement.</li>'}
            </ul>
            <h3>Next Steps</h3>
            <p>${analysis.nextSteps}</p>
        </div>
    `;
}

function calculateStats(times) {
    if (!times || times.length === 0) {
        return {
            best: null,
            worst: null,
            mean: null,
            median: null,
            standardDeviation: null,
            ao5: null,
            ao12: null,
            ao100: null,
            bestAo5: null,
            bestAo12: null,
            dnfCount: 0,
            plus2Count: 0,
            totalSolves: 0,
            dnfPercentage: 0,
            plus2Percentage: 0
        };
    }

    // Process times and count DNFs and +2s
    times.forEach((time, index) => {
        if (time === "DNF") {
            dnfCount++;
        } else {
            const numericTime = parseFloat(time);
            if (isNaN(numericTime)) {
                dnfCount++;
            } else {
                validTimes.push(numericTime);
                // Count +2 penalties but don't add time since it's already included
                if (sessions[currentSession].penalties && sessions[currentSession].penalties[index] === '+2') {
                    plus2Count++;
                }
            }
        }
    });

    const totalSolves = times.length;
    const dnfPercentage = (dnfCount / totalSolves) * 100;
    const plus2Percentage = (plus2Count / totalSolves) * 100;

    if (validTimes.length === 0) {
        return {
            best: "DNF",
            worst: "DNF",
            mean: "DNF",
            median: "DNF",
            standardDeviation: "DNF",
            ao5: "DNF",
            ao12: "DNF",
            ao100: "DNF",
            bestAo5: "DNF",
            bestAo12: "DNF",
            dnfCount: dnfCount,
            plus2Count: plus2Count,
            totalSolves: totalSolves,
            dnfPercentage: dnfPercentage,
            plus2Percentage: plus2Percentage
        };
    }

    // Calculate averages considering DNFs
    function calculateAverage(arr, size) {
        if (!arr || arr.length < size) return null;
        
        const averages = [];
        for (let i = 0; i <= arr.length - size; i++) {
            const subset = arr.slice(i, i + size);
            const dnfCount = subset.filter(time => time === "DNF").length;
            
            if (dnfCount === 0) {
                // No DNFs - normal average calculation
                const sorted = subset.map(t => parseFloat(t)).sort((a, b) => a - b);
                if (size === 5) {
                    const avg = (sorted[1] + sorted[2] + sorted[3]) / 3;
                    averages.push(avg);
                } else if (size === 12) {
                    const trimmed = sorted.slice(1, -1);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 10;
                    averages.push(avg);
                } else if (size === 100) {
                    const trimmed = sorted.slice(5, -5);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 90;
                    averages.push(avg);
                }
            } else if (dnfCount === 1) {
                const validTimes = subset.filter(time => time !== "DNF").map(t => parseFloat(t));
                const sorted = validTimes.sort((a, b) => a - b);
                if (size === 5) {
                    const remainingTimes = sorted.slice(1);
                    const avg = remainingTimes.reduce((a, b) => a + b, 0) / 3;
                    averages.push(avg);
                } else if (size === 12) {
                    const remainingTimes = sorted.slice(1);
                    const avg = remainingTimes.reduce((a, b) => a + b, 0) / 10;
                    averages.push(avg);
                } else if (size === 100 && dnfCount <= 5) {
                    const remainingTimes = sorted.slice(dnfCount);
                    const avg = remainingTimes.reduce((a, b) => a + b, 0) / 90;
                    averages.push(avg);
                }
            } else {
                averages.push("DNF");
            }
        }
        
        if (averages.length === 0) return null;
        const validAverages = averages.filter(avg => avg !== "DNF" && !isNaN(avg));
        return validAverages.length > 0 ? Math.min(...validAverages) : "DNF";
    }

    const sortedTimes = [...validTimes].sort((a, b) => a - b);
    const mean = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    const variance = validTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validTimes.length;

    // Calculate current and best averages
    const ao5 = calculateAverage(times.slice(-5), 5);
    const ao12 = calculateAverage(times.slice(-12), 12);
    const ao100 = calculateAverage(times.slice(-100), 100);
    
    // Calculate best averages by checking all possible windows
    let bestAo5 = null;
    let bestAo12 = null;
    
    if (times.length >= 5) {
        const ao5s = [];
        for (let i = 0; i <= times.length - 5; i++) {
            const avg = calculateAverage(times.slice(i, i + 5), 5);
            if (avg !== null && avg !== "DNF") ao5s.push(avg);
        }
        if (ao5s.length > 0) bestAo5 = Math.min(...ao5s);
    }
    
    if (times.length >= 12) {
        const ao12s = [];
        for (let i = 0; i <= times.length - 12; i++) {
            const avg = calculateAverage(times.slice(i, i + 12), 12);
            if (avg !== null && avg !== "DNF") ao12s.push(avg);
        }
        if (ao12s.length > 0) bestAo12 = Math.min(...ao12s);
    }

    return {
        best: sortedTimes[0],
        worst: sortedTimes[sortedTimes.length - 1],
        mean: mean,
        median: median,
        standardDeviation: Math.sqrt(variance),
        ao5: ao5,
        ao12: ao12,
        ao100: ao100,
        bestAo5: bestAo5,
        bestAo12: bestAo12,
        dnfCount: dnfCount,
        plus2Count: plus2Count,
        totalSolves: totalSolves,
        dnfPercentage: dnfPercentage,
        plus2Percentage: plus2Percentage
    };
}

function analyzeResults(stats, puzzleType) {
    let journey = `You've completed ${stats.totalSolves} solves with the ${puzzleType} puzzle. That's impressive dedication! `;
    let strengths = [];
    let improvements = [];
    let nextSteps = '';

    const skillLevel = getSkillLevel(stats.mean, puzzleType);
    journey += `Based on your average solve time of ${stats.mean.toFixed(2)} seconds, you're currently at a ${skillLevel} level for ${puzzleType}. `;

    // DNF Analysis
    const dnfPercentage = (stats.dnfCount / stats.totalSolves * 100).toFixed(1);
    journey += `\n\nYou have ${stats.dnfCount} DNF${stats.dnfCount !== 1 ? 's' : ''} (${dnfPercentage}% of solves). `;
    
    if (stats.dnfCount === 0) {
        strengths.push("Perfect solve completion rate - no DNFs!");
        journey += "Your perfect accuracy shows great attention to detail.";
    } else if (dnfPercentage <= 5) {
        strengths.push("Healthy DNF rate showing good balance of speed and accuracy");
        journey += "This is a healthy amount of DNFs, showing you're pushing your limits while maintaining good accuracy.";
    } else if (dnfPercentage <= 10) {
        improvements.push("Reduce DNFs by focusing on move accuracy over pure speed");
        journey += "Consider slowing down slightly during your solves to reduce DNFs.";
    } else {
        improvements.push("High DNF rate - slow down during algorithms and double-check cube state before stopping");
        improvements.push("Practice problematic algorithms that often lead to DNFs");
        journey += "Your DNF rate is affecting your averages significantly.";
    }

    // +2 Analysis
    const plus2Percentage = (stats.plus2Count / stats.totalSolves * 100).toFixed(1);
    journey += `\n\nYou have ${stats.plus2Count} +2${stats.plus2Count !== 1 ? 's' : ''} (${plus2Percentage}% of solves). `;
    
    if (stats.plus2Count === 0) {
        strengths.push("Excellent cube alignment control - no +2 penalties");
        journey += "Your precise cube control at the end of solves is excellent.";
    } else if (plus2Percentage <= 3) {
        strengths.push("Good cube alignment with minimal +2 penalties");
        journey += "This is an acceptable rate of +2s, mostly from pushing your turning speed.";
    } else if (plus2Percentage <= 7) {
        improvements.push("Work on final layer alignment to reduce +2 penalties");
        journey += "Try to be more mindful of cube alignment before stopping the timer.";
    } else {
        improvements.push("High +2 rate - practice U layer control and final adjustments");
        improvements.push("Take an extra moment to align layers before stopping the timer");
        journey += "Your +2 rate is significantly impacting your averages.";
    }

    if (stats.totalSolves > 50) {
        journey += "\n\nYour commitment to practice is truly commendable. Consistency is key in speedcubing, and you're showing great dedication!";
        strengths.push("Strong commitment to regular practice");
    } else if (stats.totalSolves > 20) {
        journey += "\n\nYou're building a good practice habit. Keep it up!";
        strengths.push("Developing a consistent practice routine");
    } else {
        journey += "\n\nYou're just getting started. Regular practice will help you improve quickly!";
        improvements.push("Increase solving frequency to build muscle memory and pattern recognition");
    }

    const consistency = stats.standardDeviation / stats.mean;
    if (consistency < 0.1) {
        strengths.push("Excellent solve consistency");
        journey += " Your solve times are remarkably consistent, which is a hallmark of a skilled cuber.";
    } else if (consistency < 0.2) {
        strengths.push("Good solve consistency");
        improvements.push("Work on further improving solve consistency by focusing on a smooth, steady turning style");
    } else {
        improvements.push("Focus on developing a more consistent solving approach by practicing slow, deliberate solves");
    }

    if (stats.ao5 && stats.ao12) {
        if (stats.ao5 < stats.ao12) {
            strengths.push("Recent improvement in solve times");
            journey += " Your recent solves show improvement, which is a great sign of progress!";
        } else if (stats.ao5 > stats.ao12) {
            improvements.push("Maintain focus and consistency in recent solves to match or beat your Ao12");
        }
    }

    const timeDifference = stats.worst - stats.best;
    if (timeDifference > 5) {
        improvements.push(`Reduce the gap between your best (${stats.best.toFixed(2)}s) and worst (${stats.worst.toFixed(2)}s) solves by focusing on consistency in each step of your solve`);
    }

    if (improvements.length === 0) {
        improvements.push("Continue solving to identify specific areas for improvement. Even top cubers always find ways to optimize their solves!");
    }

    nextSteps = getNextSteps(skillLevel, puzzleType, stats);

    return { journey, strengths, improvements, nextSteps };
}

function getSkillLevel(mean, puzzleType) {
    const levels = {
        "2x2": { beginner: 10, intermediate: 7, advanced: 5 },
        "3x3": { beginner: 60, intermediate: 25, advanced: 15 },
        "4x4": { beginner: 90, intermediate: 60, advanced: 45 },
        "5x5": { beginner: 150, intermediate: 120, advanced: 90 },
        "6x6": { beginner: 240, intermediate: 180, advanced: 150 },
        "7x7": { beginner: 360, intermediate: 300, advanced: 240 },
        "megaminx": { beginner: 180, intermediate: 120, advanced: 90 },
        "kilominx": { beginner: 60, intermediate: 40, advanced: 30 },
        "Pyraminx": { beginner: 15, intermediate: 10, advanced: 6 },
        "skewb": { beginner: 15, intermediate: 10, advanced: 6 },
        "square1": { beginner: 45, intermediate: 30, advanced: 20 },
        "clock": { beginner: 20, intermediate: 12, advanced: 8 }
    };

    const levelThresholds = levels[puzzleType] || levels["3x3"];

    if (mean < levelThresholds.advanced) return 'advanced';
    if (mean < levelThresholds.intermediate) return 'intermediate';
    return 'beginner';
}

function getNextSteps(skillLevel, puzzleType, stats) {
    const generalAdvice = {
        beginner: "Focus on mastering the beginner's method and practicing finger tricks. Aim for smooth, deliberate turns to build muscle memory.",
        intermediate: "Work on improving your efficiency and reducing pauses between steps. Start incorporating more advanced techniques specific to your puzzle type.",
        advanced: "Focus on advanced techniques and optimizing your solves for speed. Analyze your solves to identify and eliminate any remaining inefficiencies."
    };

    const specificAdvice = {
        "2x2": {
            beginner: `For the 2x2, focus on learning the Ortega method. Practice solving the first face intuitively and recognizing OLL (Orientation of Last Layer) cases. Your current average of ${stats.mean.toFixed(2)}s shows promise; aim to consistently solve under 10 seconds.`,
            intermediate: `With your ${stats.mean.toFixed(2)}s average, you're making good progress on the 2x2. Work on one-looking your first face and predicting OLL cases. Start learning some CLL (Corners of Last Layer) algorithms to reduce your last layer to one step.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average! To push your 2x2 skills further, master full CLL if you haven't already. Begin learning EG-1 algorithms for cases where the first face has a bar. Focus on extremely efficient first face solutions and instant recognition of CLL cases.`
        },
        "3x3": {
            beginner: `For the 3x3, your ${stats.mean.toFixed(2)}s average indicates you're getting comfortable with the beginner's method. Start learning intuitive F2L (First Two Layers) to improve efficiency. Practice finger tricks to speed up your execution.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average, you're making great strides in 3x3. Focus on look-ahead during F2L to reduce pauses. Learn full PLL (Permutation of Last Layer) if you haven't already, and start incorporating some basic OLL algorithms.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average is impressive! To push further, ensure you know full OLL and PLL. Work on advanced F2L techniques like keyhole and multislotting. Practice efficient cross solutions and work on cross-to-F2L transition. Consider learning some COLL (Corners of Last Layer) algorithms for when edges are oriented.`
        },
        "4x4": {
            beginner: `For 4x4, your ${stats.mean.toFixed(2)}s average shows you're getting comfortable with the puzzle. Focus on efficient center building and basic edge pairing techniques. Practice the 3-2-3 edge pairing method to improve your speed.`,
            intermediate: `Your ${stats.mean.toFixed(2)}s average on 4x4 is solid. Work on look-ahead during edge pairing and practice advanced center building techniques. Learn to recognize and execute parity algorithms quickly. Consider learning Yau method if you haven't already.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average on 4x4! To improve further, focus on one-looking centers during inspection. Practice advanced edge pairing techniques like slice-flip-slice. Work on 3x3 stage efficiency, aiming to match your regular 3x3 times. Consider learning some L2C (Last Two Centers) algorithms for tricky cases.`
        },
        "5x5": {
            beginner: `For 5x5, your ${stats.mean.toFixed(2)}s average indicates you're getting familiar with the puzzle. Focus on efficient center building strategies and practice basic edge pairing techniques. Work on recognizing tredge pieces quickly.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average on 5x5, you're making good progress. Improve your edge pairing efficiency by learning advanced techniques like slice-flip-slice. Practice look-ahead during centers and edge pairing to reduce pauses.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average on 5x5 is impressive! To push further, work on one-looking the first two centers during inspection. Practice advanced L2C (Last Two Centers) techniques and work on efficient edge pairing algorithms. Focus on reducing pauses between steps and optimizing your 3x3 stage.`
        },
        "6x6": {
            beginner: `For 6x6, your ${stats.mean.toFixed(2)}s average shows you're getting comfortable with big cubes. Focus on efficient center building strategies, particularly for the last two centers. Practice basic edge pairing techniques and work on recognizing corresponding edge pieces quickly.`,
            intermediate: `Your ${stats.mean.toFixed(2)}s average on 6x6 is solid. Work on look-ahead during center building and edge pairing. Learn advanced edge pairing techniques like slice-flip-slice and practice efficient inner edge pairing. Start incorporating some 5x5 strategies into your 6x6 solves.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average on 6x6! To push further, focus on one-looking the first two centers during inspection. Practice advanced L2C (Last Two Centers) techniques and work on very efficient edge pairing algorithms. Aim to reduce pauses between steps and optimize your 3x3 stage to match your 5x5 times.`
        },
        "7x7": {
            beginner: `For 7x7, your ${stats.mean.toFixed(2)}s average indicates you're getting familiar with big cubes. Focus on efficient center building strategies, particularly for the last two centers. Practice basic edge pairing techniques and work on recognizing corresponding edge pieces quickly.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average on 7x7, you're making good progress. Improve your edge pairing efficiency by learning advanced techniques like slice-flip-slice. Practice look-ahead during centers and edge pairing to reduce pauses. Work on efficient strategies for the last four edges.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average on 7x7 is impressive! To push further, work on one-looking the first three centers during inspection. Practice advanced L2C (Last Two Centers) techniques and work on very efficient edge pairing algorithms. Focus on reducing pauses between steps and optimizing your 3x3 stage to match your 6x6 times.`
        },
        "megaminx": {
            beginner: `For megaminx, your ${stats.mean.toFixed(2)}s average shows you're getting comfortable with the puzzle. Focus on efficient F2L-like pairing for the first two layers. Learn basic last layer algorithms for S2L (Star to Last Layer) and practice recognizing cases quickly.`,
            intermediate: `Your ${stats.mean.toFixed(2)}s average on megaminx is solid. Work on improving your look-ahead during S2L. Learn more advanced last layer algorithms and practice reducing rotations during solves. Focus on efficient finger tricks for megaminx-specific moves.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average on megaminx! To improve further, focus on advanced techniques like block-building during S2L. Learn full PLL for Megaminx if you haven't already. Work on one-looking during the last layer and practice efficient algorithms for all cases. Consider learning some CPLL (Corner Permutation of Last Layer) algorithms to reduce the last layer to one step.`
        },
        "kilominx": {
            beginner: `For kilominx, your ${stats.mean.toFixed(2)}s average indicates you're getting familiar with the puzzle. Focus on efficient first layer solving and learn basic last layer algorithms. Practice recognizing cases quickly and work on smooth transitions between steps.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average on kilominx, you're making good progress. Work on improving your first layer efficiency. Learn more advanced last layer algorithms and start incorporating some one-looking into your solves. Practice efficient finger tricks for kilominx-specific moves.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average on kilominx is impressive! To push further, focus on advanced techniques like block-building during the first layer. Work on your inspection skills to plan the entire first layer and predict the last layer case. Learn and practice advanced algorithms for all last layer cases to minimize moves and execution time.`
        },
        "Pyraminx": {
            beginner: `For Pyraminx, your ${stats.mean.toFixed(2)}s average shows you're getting comfortable with the puzzle. Focus on learning the layer by layer method. Practice efficient tips solving and learn basic algorithms for the last layer. Work on smooth transitions between steps.`,
            intermediate: `Your ${stats.mean.toFixed(2)}s average on Pyraminx is solid. Learn and practice the top-first method. Improve your efficiency in solving the V (three edges connected to the top vertex) and learn more last layer algorithms. Start incorporating some one-looking into your solves.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average on Pyraminx! To improve further, focus on advanced methods like 1-flip or Oka. Work on your inspection skills to plan the entire solve and execute it quickly. Practice efficient finger tricks and learn advanced algorithms for all cases to minimize moves and execution time.`
        },
        "skewb": {
            beginner: `For skewb, your ${stats.mean.toFixed(2)}s average indicates you're getting familiar with the puzzle. Focus on learning the layer by layer method. Practice efficient first layer solving and learn basic algorithms for the last layer. Work on recognizing cases quickly.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average on skewb, you're making good progress. Learn and practice the Sarah's Intermediate Method. Improve your efficiency in solving the first layer and learn more last layer algorithms. Start incorporating some one-looking into your solves.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average on skewb is impressive! To push further, focus on advanced methods like Sarah's Advanced Method or Kirjava Meep Method. Work on your inspection skills to plan the entire solve and execute it quickly. Practice efficient finger tricks and learn advanced algorithms for all cases to minimize moves and execution time.`
        },
        "square1": {
            beginner: `For Square-1, your ${stats.mean.toFixed(2)}s average shows you're getting comfortable with the puzzle. Focus on learning the layer by layer method. Practice efficient cubeshape solving and learn basic algorithms for corner and edge permutation. Work on recognizing cases quickly.`,
            intermediate: `Your ${stats.mean.toFixed(2)}s average on Square-1 is solid. Improve your cubeshape efficiency. Learn more advanced algorithms for EP (Edge Permutation) and CP (Corner Permutation). Start incorporating some EO (Edge Orientation) algorithms. Practice efficient slice turns.`,
            advanced: `Impressive ${stats.mean.toFixed(2)}s average on Square-1! To improve further, focus on advanced techniques like CS (Cubeshape) Parity and full EO. Learn advanced methods like Lin or Vandenbergh. Work on your inspection skills to plan cubeshape and track pieces. Practice efficient algorithms for all cases and work on finger tricks specific to Square-1.`
        },
        "clock": {
            beginner: `For clock, your ${stats.mean.toFixed(2)}s average indicates you're getting familiar with the puzzle. Focus on learning the Pochmann method. Practice efficient solving of the front face and learn basic strategies for the back face. Work on smooth transitions between steps.`,
            intermediate: `With a ${stats.mean.toFixed(2)}s average on clock, you're making good progress. Improve your efficiency in solving both faces. Learn and practice advanced pin orders and work on reducing your move count. Start incorporating some one-looking into your solves.`,
            advanced: `Your ${stats.mean.toFixed(2)}s average on clock is impressive! To push further, focus on advanced techniques like one-looking the entire solve. Work on optimizing your finger tricks and developing a consistent solving method. Practice efficient algorithms for all cases and work on minimizing regrips during solves.`
        }
    };

    return `${generalAdvice[skillLevel]} ${specificAdvice[puzzleType][skillLevel]}`;
}

function updateCharts() {
    const times = sessions[currentSession].times;
    const validTimes = times.map(time => time === "DNF" ? null : time);

    // Update chart data to handle DNFs
    const chartData = validTimes.map((time, index) => ({
        x: index + 1,
        y: time
    }));

    // Update chart configuration
    const chartConfig = {
        // ... existing chart config ...
        options: {
            // ... existing options ...
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y;
                            return value === null ? "DNF" : `Time: ${value.toFixed(2)}s`;
                        }
                    }
                }
            }
        }
    };

    // Update both charts
    updateSolveTimeChart(chartData);
    updateProgressChart(chartData);
}

function updateSolveTimeChart() {
    const ctx = document.getElementById('solveTimeChart').getContext('2d');
    
    if (solveTimeChart) {
        solveTimeChart.destroy();
    }

    const filteredSolves = sessions[currentSession].times;

    solveTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredSolves.map((_, index) => `Solve ${index + 1}`),
            datasets: [{
                label: 'Solve Times',
                data: filteredSolves,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Solve Number'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (context) => `Solve ${context[0].dataIndex + 1}`,
                        label: (context) => `Time: ${context.parsed.y.toFixed(2)}s`
                    }
                }
            }
        }
    });
}

function updateProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');

    if (progressChart) {
        progressChart.destroy();
    }

    const filteredSolves = sessions[currentSession].times;
    const stats = calculateStats(filteredSolves);

    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Single', 'Ao5', 'Ao12', 'Ao100', 'Mean'],
            datasets: [{
                label: 'Time (seconds)',
                data: [stats.best, stats.ao5 || 0, stats.ao12 || 0, stats.ao100 || 0, stats.mean],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Time: ${context.parsed.y.toFixed(2)}s`
                    }
                }
            }
        }
    });
}

function filterSolves(filterType) {
    if (currentFilter === filterType) {
        clearFilter();
        return;
    }

    const times = sessions[currentSession].times;
    const scrambles = sessions[currentSession].scrambles;
    const penalties = sessions[currentSession].penalties || [];
    let filteredTimes = [];
    let filteredScrambles = [];

    switch(filterType) {
        case 'best':
            const validTimes = times.filter(time => time !== "DNF").map(time => parseFloat(time));
            const bestTime = Math.min(...validTimes);
            times.forEach((time, index) => {
                if (time !== "DNF" && parseFloat(time) === bestTime) {
                    filteredTimes.push(time);
                    filteredScrambles.push(scrambles[index]);
                }
            });
            break;
        case 'worst':
            const worstValidTimes = times.filter(time => time !== "DNF").map(time => parseFloat(time));
            const worstTime = Math.max(...worstValidTimes);
            times.forEach((time, index) => {
                if (time !== "DNF" && parseFloat(time) === worstTime) {
                    filteredTimes.push(time);
                    filteredScrambles.push(scrambles[index]);
                }
            });
            break;
        case 'dnf':
            times.forEach((time, index) => {
                if (time === "DNF") {
                    filteredTimes.push(time);
                    filteredScrambles.push(scrambles[index]);
                }
            });
            break;
        case 'plus2':
            times.forEach((time, index) => {
                if (penalties[index] === '+2') {
                    filteredTimes.push(time);
                    filteredScrambles.push(scrambles[index]);
                }
            });
            break;
        case 'ao5':
            if (times.length >= 5) {
                filteredTimes = times.slice(-5);
                filteredScrambles = scrambles.slice(-5);
            }
            break;
        case 'ao12':
            if (times.length >= 12) {
                filteredTimes = times.slice(-12);
                filteredScrambles = scrambles.slice(-12);
            }
            break;
        case 'ao100':
            if (times.length >= 100) {
                filteredTimes = times.slice(-100);
                filteredScrambles = scrambles.slice(-100);
            }
            break;
        case 'bestAo5':
            if (times.length >= 5) {
                let bestAo5Value = Infinity;
                let bestAo5Index = 0;
                
                for (let i = 0; i <= times.length - 5; i++) {
                    const currentSet = times.slice(i, i + 5);
                    const dnfCount = currentSet.filter(t => t === "DNF").length;
                    
                    if (dnfCount <= 1) {
                        const validSet = currentSet.filter(t => t !== "DNF").map(t => parseFloat(t));
                        const avg = validSet.reduce((a, b) => a + b, 0) / validSet.length;
                        
                        if (avg < bestAo5Value) {
                            bestAo5Value = avg;
                            bestAo5Index = i;
                        }
                    }
                }
                
                filteredTimes = times.slice(bestAo5Index, bestAo5Index + 5);
                filteredScrambles = scrambles.slice(bestAo5Index, bestAo5Index + 5);
            }
            break;
        case 'bestAo12':
            if (times.length >= 12) {
                let bestAo12Value = Infinity;
                let bestAo12Index = 0;
                
                for (let i = 0; i <= times.length - 12; i++) {
                    const currentSet = times.slice(i, i + 12);
                    const dnfCount = currentSet.filter(t => t === "DNF").length;
                    
                    if (dnfCount <= 1) {
                        const validSet = currentSet.filter(t => t !== "DNF").map(t => parseFloat(t));
                        const avg = validSet.reduce((a, b) => a + b, 0) / validSet.length;
                        
                        if (avg < bestAo12Value) {
                            bestAo12Value = avg;
                            bestAo12Index = i;
                        }
                    }
                }
                
                filteredTimes = times.slice(bestAo12Index, bestAo12Index + 12);
                filteredScrambles = scrambles.slice(bestAo12Index, bestAo12Index + 12);
            }
            break;
    }

    if (filteredTimes.length > 0) {
        updateFilteredSolveHistory(filteredTimes, filteredScrambles);
        currentFilter = filterType;
        document.getElementById('clearFilterBtn').style.display = 'block';
        updateFilteredCharts(filteredTimes);
    }
}

function updateFilteredSolveHistory(filteredTimes, filteredScrambles) {
    const tbody = document.querySelector('#solveHistory tbody');
    tbody.innerHTML = '';

    const bestTime = Math.min(...filteredTimes.filter(time => time !== "DNF").map(t => parseFloat(t)));
    const worstTime = Math.max(...filteredTimes.filter(time => time !== "DNF").map(t => parseFloat(t)));

    // Get all indices that match the filtered times
    const matchingIndices = [];
    sessions[currentSession].times.forEach((time, index) => {
        if (filteredTimes.includes(time)) {  // Direct comparison for DNFs
            matchingIndices.push(index);
        }
    });

    matchingIndices.forEach((originalIndex, index) => {
        const row = tbody.insertRow(0);
        const time = sessions[currentSession].times[originalIndex];
        
        // Handle DNF and numeric times separately
        if (time === "DNF") {
            // Get the actual solve time from originalTimes
            const actualTime = sessions[currentSession].originalTimes && 
                sessions[currentSession].originalTimes[originalIndex];
            
            let displayText = "DNF";
            if (actualTime !== null && actualTime !== undefined) {
                row.innerHTML = `
                    <td>${originalIndex + 1}</td>
                    <td><span class="dnf-time">
                        <span class="dnf-text">DNF</span>
                        <span class="inline-time">${parseFloat(actualTime).toFixed(2)}</span>
                    </span></td>
                    <td>${sessions[currentSession].scrambleType || ''}</td>
                    <td>${sessions[currentSession].inspectionTimes && sessions[currentSession].inspectionTimes[originalIndex] ? sessions[currentSession].inspectionTimes[originalIndex].toFixed(1) + 's' : '0.0s'}</td>
                    <td>${sessions[currentSession].scrambles[originalIndex] || ''}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${originalIndex + 1}</td>
                    <td>DNF</td>
                    <td>${sessions[currentSession].scrambleType || ''}</td>
                    <td>${sessions[currentSession].inspectionTimes && sessions[currentSession].inspectionTimes[originalIndex] ? sessions[currentSession].inspectionTimes[originalIndex].toFixed(1) + 's' : '0.0s'}</td>
                    <td>${sessions[currentSession].scrambles[originalIndex] || ''}</td>
                `;
            }
        } else {
            const numericTime = parseFloat(time);
            if (numericTime === bestTime) row.classList.add('best-solve');
            if (numericTime === worstTime) row.classList.add('worst-solve');

            let timeDisplay = numericTime.toFixed(2);
            if (sessions[currentSession].penalties && sessions[currentSession].penalties[originalIndex] === '+2') {
                timeDisplay += '+';
            }

            row.innerHTML = `
                <td>${originalIndex + 1}</td>
                <td>${timeDisplay}</td>
                <td>${sessions[currentSession].scrambleType || ''}</td>
                <td>${sessions[currentSession].inspectionTimes && sessions[currentSession].inspectionTimes[originalIndex] ? sessions[currentSession].inspectionTimes[originalIndex].toFixed(1) + 's' : '0.0s'}</td>
                <td>${sessions[currentSession].scrambles[originalIndex] || ''}</td>
            `;
        }
    });
}

function updateFilteredCharts(filteredTimes) {
    const ctx = document.getElementById('solveTimeChart').getContext('2d');
    
    if (solveTimeChart) {
        solveTimeChart.destroy();
    }

    solveTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredTimes.map((_, index) => `Solve ${index + 1}`),
            datasets: [{
                label: 'Solve Times',
                data: filteredTimes,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Solve Number'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (context) => `Solve ${context[0].dataIndex + 1}`,
                        label: (context) => `Time: ${context.parsed.y.toFixed(2)}s`
                    }
                }
            }
        }
    });
}

function clearFilter() {
    currentFilter = null;
    document.getElementById('clearFilterBtn').style.display = 'none';
    updateSolveHistory();
    updateCharts();
}

// Load sessions data when the page loads
document.addEventListener('DOMContentLoaded', loadSessionsFromLocalStorage);
