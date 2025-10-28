function resetStatsDisplays() {
    // Reset all statistic displays to their default values
    const statsElements = {
        'totalSolves': '0',
        'sessionMean': '-',
        'totalTime': '0:00',
        'successRate': '100%',
        'miniAo5': '--',
        'miniAo12': '--',
        'miniPB': '--',
        'miniMean': '--',
        'ao5Display': '--',
        'ao12Display': '--',
        'bestTime': '--',
        'worstTime': '--',
        'average3of5': '--',
        'average12': '--',
        'average100': '--',
        'mean': '--',
        'stdDev': '--',
        'cvValue': '--',
        'dnfCount': '0',
        'plus2Count': '0'
    };

    // Update each element
    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // Reset progress bar
    const progressBar = document.getElementById('sessionProgress');
    if (progressBar) progressBar.style.width = '100%';
}

//statistcs panel
function updateStatistics() {
    updateHistorySummary();
    updateMobileStats();

    // Update mobile stats
    const mobileAo5 = document.getElementById('mobile-ao5');
    const mobileAo12 = document.getElementById('mobile-ao12');
    const mobileBest = document.getElementById('mobile-best');
    const mobileMean = document.getElementById('mobile-mean');

    if (mobileAo5) mobileAo5.textContent = formatTime(getAverageOf5(sessions[currentSession].times) * 1000);
    if (mobileAo12) mobileAo12.textContent = formatTime(getAverageOf12(sessions[currentSession].times) * 1000);
    if (mobileBest) mobileBest.textContent = formatTime(getBestTime(sessions[currentSession].times) * 1000);
    if (mobileMean) mobileMean.textContent = formatTime(getMean(sessions[currentSession].times) * 1000);

    // If no times exist, reset all stats
    if (!sessions[currentSession] || sessions[currentSession].times.length === 0) {
        // Reset all statistics to default values
        resetStatsDisplays();
        return;
    }

    // Count DNFs and +2s
    const dnfCount = sessions[currentSession].times.filter(time => time === DNF_VALUE).length;
    const plus2Count = sessions[currentSession].penalties ? 
        Object.values(sessions[currentSession].penalties).filter(penalty => penalty === '+2').length : 0;

    // Update DNF and +2 displays
    document.getElementById('dnfCount').textContent = dnfCount;
    document.getElementById('plus2Count').textContent = plus2Count;
    document.getElementById('miniAo5').textContent = formatTime(getAverageOf5(sessions[currentSession].times) * 1000);
    document.getElementById('miniAo12').textContent = formatTime(getAverageOf12(sessions[currentSession].times) * 1000);
    document.getElementById('miniPB').textContent = formatTime(getBestTime(sessions[currentSession].times) * 1000);
    document.getElementById('miniMean').textContent = formatTime(getMean(sessions[currentSession].times) * 1000);
    // Filter out DNF values for other statistics
    const validTimes = sessions[currentSession].times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);

    // Best and Worst times
    if (validTimes.length > 0) {
        const bestTime = Math.min(...validTimes);
        bestTimeDisplay.textContent = formatTime(bestTime * 1000);

        const worstTime = Math.max(...validTimes);
        worstTimeDisplay.textContent = formatTime(worstTime * 1000);
    } else {
        bestTimeDisplay.textContent = "DNF";
        worstTimeDisplay.textContent = "DNF";
    }

    // Average of 5
    const last5Times = sessions[currentSession].times.slice(-5);
    if (last5Times.length >= 5) {
        const dnfCount = last5Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;

        if (dnfCount === 0) {
            // No DNFs - normal ao5 calculation
            const sorted = [...last5Times].sort((a, b) => a - b);
            const avg3of5 = (sorted[1] + sorted[2] + sorted[3]) / 3;
            average3of5Display.textContent = formatTime(avg3of5 * 1000);
        } else if (dnfCount === 1) {
            // One DNF - treat DNF as worst time and remove it along with best time
            const validTimes = last5Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
            const sorted = [...validTimes].sort((a, b) => a - b);
            // Remove best time (first element) and calculate mean of remaining 3
            const remainingTimes = sorted.slice(1);
            const avg = remainingTimes.reduce((a, b) => a + b, 0) / 3;
            average3of5Display.textContent = formatTime(avg * 1000);
        } else {
            // Two or more DNFs - display DNF instead of --
            average3of5Display.textContent = "DNF";
        }
    } else {
        average3of5Display.textContent = "--";
    }

    // Average of 12
    const last12Times = sessions[currentSession].times.slice(-12);
    if (last12Times.length >= 12) {
        const dnfCount = last12Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;

        if (dnfCount === 0) {
            // No DNFs - normal ao12 calculation
            const sorted = [...last12Times].sort((a, b) => a - b);
            // Remove best and worst time
            const trimmed = sorted.slice(1, -1);
            const avg12 = trimmed.reduce((a, b) => a + b, 0) / 10;
            average12Display.textContent = formatTime(avg12 * 1000);
        } else if (dnfCount === 1) {
            // One DNF - treat DNF as worst time and remove it along with best time
            const validTimes = last12Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
            const sorted = [...validTimes].sort((a, b) => a - b);
            // Remove best time and calculate mean of remaining 10
            const remainingTimes = sorted.slice(1);
            const avg = remainingTimes.reduce((a, b) => a + b, 0) / 10;
            average12Display.textContent = formatTime(avg * 1000);
        } else {
            // Two or more DNFs - display DNF
            average12Display.textContent = "DNF";
        }
    } else {
        average12Display.textContent = "--";
    }

    // Average of 100
    const last100Times = sessions[currentSession].times.slice(-100);
    if (last100Times.length >= 100) {
        const dnfCount = last100Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;

        if (dnfCount === 0) {
            // No DNFs - normal ao100 calculation
            const sorted = [...last100Times].sort((a, b) => a - b);
            // Remove best 5 and worst 5 times
            const trimmed = sorted.slice(5, -5);
            const avg100 = trimmed.reduce((a, b) => a + b, 0) / 90;
            average100Display.textContent = formatTime(avg100 * 1000);
        } else if (dnfCount <= 5) {
            // 1-5 DNFs - treat DNFs as worst times and remove them along with best times
            const validTimes = last100Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
            const sorted = [...validTimes].sort((a, b) => a - b);
            // Remove best times equal to number of DNFs and calculate mean of remaining times
            const remainingTimes = sorted.slice(dnfCount);
            const avg = remainingTimes.reduce((a, b) => a + b, 0) / (90);
            average100Display.textContent = formatTime(avg * 1000);
        } else {
            // More than 5 DNFs - display DNF
            average100Display.textContent = "DNF";
        }
    } else {
        average100Display.textContent = "--";
    }

    // Mean
    if (validTimes.length > 0) {
        const mean = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
        meanDisplay.textContent = formatTime(mean * 1000);

        // Standard Deviation and CV
        if (validTimes.length > 1) {
            const variance = validTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validTimes.length;
            const stdDev = Math.sqrt(variance);
            stdDevDisplay.textContent = formatTime(stdDev * 1000);

            const cv = (stdDev / mean) * 100;
            cvDisplay.textContent = cv.toFixed(2) + "%";
        } else {
            stdDevDisplay.textContent = "--";
            cvDisplay.textContent = "--";
        }
    } else {
        meanDisplay.textContent = "DNF";
        stdDevDisplay.textContent = "--";
        cvDisplay.textContent = "--";
    }

    updateChart();
}

function getBestTime(times) {
    const validTimes = times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
    return validTimes.length > 0 ? Math.min(...validTimes) : "DNF";
}

function getAverageOf5(times) {
    const last5Times = times.slice(-5);
    if (last5Times.length < 5) return "--";

    const dnfCount = last5Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;

    if (dnfCount === 0) {
        const sorted = [...last5Times].sort((a, b) => a - b);
        return (sorted[1] + sorted[2] + sorted[3]) / 3;
    } else if (dnfCount === 1) {
        const validTimes = last5Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
        const sorted = [...validTimes].sort((a, b) => a - b);
        const remainingTimes = sorted.slice(1);
        return remainingTimes.reduce((a, b) => a + b, 0) / 3;
    }
    return "DNF";
}

function getAverageOf12(times) {
    const last12Times = times.slice(-12);
    if (last12Times.length < 12) return "--";

    const dnfCount = last12Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;

    if (dnfCount === 0) {
        const sorted = [...last12Times].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        return trimmed.reduce((a, b) => a + b, 0) / 10;
    } else if (dnfCount === 1) {
        const validTimes = last12Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
        const sorted = [...validTimes].sort((a, b) => a - b);
        const remainingTimes = sorted.slice(1);
        return remainingTimes.reduce((a, b) => a + b, 0) / 10;
    }
    return "DNF";
}

function getMean(times) {
    const validTimes = times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
    return validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : "DNF";
}

//confetti triggering and finding pbs
function checkForNewBest(newTime) {
    const validTimes = sessions[currentSession].times.filter(time => 
        time !== DNF_VALUE && time !== "Infinity" && time !== Infinity
    );

    if (newTime < 0.5) return;

    const isValidTime = sessions[currentSession].scrambleType === "3x3" ? 
        newTime >= 2 : true;

    if (validTimes.length > 1 && 
        newTime === Math.min(...validTimes) && 
        isValidTime) {

        confetti({
            particleCount: 200,
            spread: 120,
            origin: { x: 0, y: 0.5 },
            angle: 60,
            ticks: 100,
            velocity: 2,
            zIndex: 2000
        });

        confetti({
            particleCount: 200,
            spread: 120,
            origin: { x: 1, y: 0.5 },
            angle: 120,
            ticks: 100,
            velocity: 2,
            zIndex: 2000
        });

        const pbButton = document.createElement('div');
        pbButton.innerHTML = 'New PB!';
        pbButton.style.cssText = `
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--highlight-bg);
            color: var(--text-color);
            padding: 15px 30px;
            border-radius: var(--border-radius);
            font-size: 20px;
            font-weight: bold;
            font-family: var(--font-family);
            box-shadow: 0 0 20px var(--primary-color);
            animation: slideUpAndDown 1.5s ease-in-out forwards; /* Reduced duration for smoother animation */
            z-index: 1000;
            transition: var(--transition-smooth);
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUpAndDown {
                0% { bottom: -100px; opacity: 0; } /* Start off-screen and invisible */
                20% { bottom: 50px; opacity: 1; } /* Smoothly slide up and become visible */
                80% { bottom: 50px; opacity: 1; } /* Hold position briefly */
                100% { bottom: -100px; opacity: 0; } /* Slide back down and fade out */
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(pbButton);

        setTimeout(() => {
            pbButton.remove();
            style.remove();
        }, 1500); // Match the animation duration
    }
}

const availableStats = {
    totalSolves: { label: 'Total Solves', calculate: () => sessions[currentSession].times.length },
    sessionMean: { 
        label: 'Session Mean', 
        calculate: () => {
            const mean = getMean(sessions[currentSession].times);
            return mean === "DNF" || isNaN(mean) ? '--' : formatTime(mean * 1000);
        }
    },
    totalTime: { 
        label: 'Total Time',
        calculate: () => {
            const validTimes = sessions[currentSession].times.filter(t => t !== DNF_VALUE && !isNaN(t));
            const total = validTimes.reduce((a, b) => a + b, 0);
            return isNaN(total) ? '--' : formatTotalTime(total);
        }
    },
    successRate: {
        label: 'Success Rate',
        calculate: () => {
            const total = sessions[currentSession].times.length;
            const valid = sessions[currentSession].times.filter(t => t !== DNF_VALUE && !isNaN(t)).length;
            return total > 0 ? `${((valid/total) * 100).toFixed(1)}%` : '100%';
        }
    },
    bestSingle: {
        label: 'Best Single',
        calculate: () => {
            const best = getBestTime(sessions[currentSession].times);
            return best === "DNF" || isNaN(best) ? '--' : formatTime(best * 1000);
        }
    },
    ao5: {
        label: 'Current Ao5',
        calculate: () => {
            const ao5 = getAverageOf5(sessions[currentSession].times);
            return ao5 === "DNF" || ao5 === "--" || isNaN(ao5) ? '--' : formatTime(ao5 * 1000);
        }
    },
    ao12: {
        label: 'Current Ao12',
        calculate: () => {
            const ao12 = getAverageOf12(sessions[currentSession].times);
            return ao12 === "DNF" || ao12 === "--" || isNaN(ao12) ? '--' : formatTime(ao12 * 1000);
        }
    },
    ao50: {
        label: 'Current Ao50',
        calculate: () => {
            const last50Times = sessions[currentSession].times.slice(-50);
            if (last50Times.length < 50) return '--';
            
            const dnfCount = last50Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;
            
            if (dnfCount === 0) {
                const sorted = [...last50Times].sort((a, b) => a - b);
                const trimmed = sorted.slice(3, -3);
                return formatTime((trimmed.reduce((a, b) => a + b, 0) / 44) * 1000);
            } else if (dnfCount <= 3) {
                const validTimes = last50Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
                const sorted = [...validTimes].sort((a, b) => a - b);
                const remainingTimes = sorted.slice(dnfCount);
                return formatTime((remainingTimes.reduce((a, b) => a + b, 0) / 44) * 1000);
            }
            return 'DNF';
        }
    },
    ao100: {
        label: 'Current Ao100',
        calculate: () => {
            const last100Times = sessions[currentSession].times.slice(-100);
            if (last100Times.length < 100) return '--';
            
            const dnfCount = last100Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;
            
            if (dnfCount === 0) {
                const sorted = [...last100Times].sort((a, b) => a - b);
                const trimmed = sorted.slice(5, -5);
                return formatTime((trimmed.reduce((a, b) => a + b, 0) / 90) * 1000);
            } else if (dnfCount <= 5) {
                const validTimes = last100Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
                const sorted = [...validTimes].sort((a, b) => a - b);
                const remainingTimes = sorted.slice(dnfCount);
                return formatTime((remainingTimes.reduce((a, b) => a + b, 0) / 90) * 1000);
            }
            return 'DNF';
        }
    },
    ao1000: {
        label: 'Current Ao1000',
        calculate: () => {
            const last1000Times = sessions[currentSession].times.slice(-1000);
            if (last1000Times.length < 1000) return '--';
            
            const dnfCount = last1000Times.filter(time => time === DNF_VALUE || time === "Infinity" || time === Infinity).length;
            
            if (dnfCount === 0) {
                const sorted = [...last1000Times].sort((a, b) => a - b);
                const trimmed = sorted.slice(30, -30);
                return formatTime((trimmed.reduce((a, b) => a + b, 0) / 940) * 1000);
            } else if (dnfCount <= 30) {
                const validTimes = last1000Times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
                const sorted = [...validTimes].sort((a, b) => a - b);
                const remainingTimes = sorted.slice(dnfCount);
                return formatTime((remainingTimes.reduce((a, b) => a + b, 0) / 940) * 1000);
            }
            return 'DNF';
        }
    },
    bestAo5: {
        label: 'Best Ao5',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (times.length < 5) return '--';
            let bestAo5 = Infinity;
            
            for (let i = 0; i <= times.length - 5; i++) {
                const window = times.slice(i, i + 5);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const avg = (sorted[1] + sorted[2] + sorted[3]) / 3;
                    bestAo5 = Math.min(bestAo5, avg);
                }
            }
            return bestAo5 === Infinity ? 'DNF' : formatTime(bestAo5 * 1000);
        }
    },
    bestAo12: {
        label: 'Best Ao12',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (times.length < 12) return '--';
            let bestAo12 = Infinity;
            
            for (let i = 0; i <= times.length - 12; i++) {
                const window = times.slice(i, i + 12);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const trimmed = sorted.slice(1, -1);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 10;
                    bestAo12 = Math.min(bestAo12, avg);
                }
            }
            return bestAo12 === Infinity ? 'DNF' : formatTime(bestAo12 * 1000);
        }
    },
    bestAo50: {
        label: 'Best Ao50',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (times.length < 50) return '--';
            let bestAo50 = Infinity;
            
            for (let i = 0; i <= times.length - 50; i++) {
                const window = times.slice(i, i + 50);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const trimmed = sorted.slice(3, -3);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 44;
                    bestAo50 = Math.min(bestAo50, avg);
                }
            }
            return bestAo50 === Infinity ? 'DNF' : formatTime(bestAo50 * 1000);
        }
    },
    bestAo100: {
        label: 'Best Ao100',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (times.length < 100) return '--';
            let bestAo100 = Infinity;
            
            for (let i = 0; i <= times.length - 100; i++) {
                const window = times.slice(i, i + 100);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const trimmed = sorted.slice(5, -5);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 90;
                    bestAo100 = Math.min(bestAo100, avg);
                }
            }
            return bestAo100 === Infinity ? 'DNF' : formatTime(bestAo100 * 1000);
        }
    },
    standardDev: {
        label: 'Std Deviation',
        calculate: () => {
            const mean = getMean(sessions[currentSession].times);
            if (mean === 'DNF' || isNaN(mean)) return '--';
            const validTimes = sessions[currentSession].times.filter(t => t !== DNF_VALUE && !isNaN(t));
            if (validTimes.length < 2) return '--';
            const variance = validTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validTimes.length;
            const stdDev = Math.sqrt(variance);
            return isNaN(stdDev) ? '--' : formatTime(stdDev * 1000);
        }
    },
    dnfCount: {
        label: 'DNF Count',
        calculate: () => sessions[currentSession].times.filter(time => time === DNF_VALUE).length
    },
    plus2Count: {
        label: '+2 Count',
        calculate: () => sessions[currentSession].penalties ? 
            Object.values(sessions[currentSession].penalties).filter(penalty => penalty === '+2').length : 0
    },
   bestPossibleAo5: {
  label: 'BP Ao5',
  calculate: () => {
    const times = sessions[currentSession].times;
    if (!times || times.length < 5) return "--";                            // fewer than 5 total solves → cannot compute
    const validTimes = times.filter(time => time !== DNF_VALUE);
    if (validTimes.length < 5) return "DNF";                                 // fewer than 5 non‑DNF solves → DNF

    // 1) Sort valid times ascending
    const bestFive = validTimes.sort((a, b) => a - b).slice(0, 5);
    // 2) Discard the best (index 0) and worst (index 4) of those five
    const sumOfMiddleThree = bestFive.slice(1, -1).reduce((acc, t) => acc + t, 0);
    const avgOfMiddleThree = sumOfMiddleThree / 3;
    return formatTime(avgOfMiddleThree * 1000);
  }
    },
    bestPossibleAo12: {
        label: 'BP Ao12',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (!times || times.length < 12) return "--";
            
            const validTimes = times.filter(time => time !== DNF_VALUE);
            if (validTimes.length < 12) return "DNF";
            
            const bestTwelve = validTimes.sort((a, b) => a - b).slice(0, 12);
            const sum = bestTwelve.slice(1, -1).reduce((acc, time) => acc + time, 0);
            const average = sum / 10;
            
            // Format consistently with other times using formatTime
            return formatTime(average * 1000);
        }
    },
    worstAo5: {
        label: 'Worst Ao5',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (!times || times.length < 5) return "--";
            
            let worstAo5 = -Infinity;
            for (let i = 0; i <= times.length - 5; i++) {
                const window = times.slice(i, i + 5);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const avg = (sorted[1] + sorted[2] + sorted[3]) / 3;
                    worstAo5 = Math.max(worstAo5, avg);
                }
            }
            return worstAo5 === -Infinity ? 'DNF' : formatTime(worstAo5 * 1000);
        }
    },
    worstAo12: {
        label: 'Worst Ao12',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (!times || times.length < 12) return "--";
            
            let worstAo12 = -Infinity;
            for (let i = 0; i <= times.length - 12; i++) {
                const window = times.slice(i, i + 12);
                const dnfCount = window.filter(t => t === DNF_VALUE || t === "Infinity" || t === Infinity).length;
                
                if (dnfCount === 0) {
                    const sorted = [...window].sort((a, b) => a - b);
                    const trimmed = sorted.slice(1, -1);
                    const avg = trimmed.reduce((a, b) => a + b, 0) / 10;
                    worstAo12 = Math.max(worstAo12, avg);
                }
            }
            return worstAo12 === -Infinity ? 'DNF' : formatTime(worstAo12 * 1000);
        }
    },
    worstPossibleAo5: {
        label: 'WP Ao5',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (!times || times.length < 5) return "--";
            
            const validTimes = times.filter(time => time !== DNF_VALUE);
            if (validTimes.length < 5) return "DNF";
            
            const worstFive = validTimes.sort((a, b) => b - a).slice(0, 5);
            const sum = worstFive.slice(1, -1).reduce((acc, time) => acc + time, 0);
            const average = sum / 3;
            
            return formatTime(average * 1000);
        }
    },
    worstPossibleAo12: {
        label: 'WP Ao12',
        calculate: () => {
            const times = sessions[currentSession].times;
            if (!times || times.length < 12) return "--";
            
            const validTimes = times.filter(time => time !== DNF_VALUE);
            if (validTimes.length < 12) return "DNF";
            
            const worstTwelve = validTimes.sort((a, b) => b - a).slice(0, 12);
            const sum = worstTwelve.slice(1, -1).reduce((acc, time) => acc + time, 0);
            const average = sum / 10;
            
            return formatTime(average * 1000);
        }
    }
};

let currentStatsConfig = {
    position1: 'bestSingle',
    position2: 'ao5',
    position3: 'ao12',
    position4: 'sessionMean'
};

const statColors = {
    // Load saved colors from localStorage or use defaults
    loadColors() {
        const saved = localStorage.getItem('statColors');
        return saved ? JSON.parse(saved) : {};
    },
    
    saveColors(position, colors) {
        const savedColors = this.loadColors();
        savedColors[position] = colors;
        localStorage.setItem('statColors', JSON.stringify(savedColors));
    }
};

function showStatsPopup(position, currentStat) {
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';

    const overlay = document.createElement('div');
    overlay.className = 'stats-sidebar-overlay';

    const availableStatsArray = Object.entries(availableStats)
        .filter(([key]) => !Object.values(currentStatsConfig).includes(key) || key === currentStatsConfig[position]);
    
    // Load saved colors for this position
    const savedColors = statColors.loadColors()[position] || {
        background: 'var(--container-bg)',
        text: 'var(--text-color)'
    };

    sidebar.innerHTML = `
        <div class="stats-sidebar-header">
            <h3>Stats Management</h3>
            <span class="stats-sidebar-close">&times;</span>
        </div>
        <div class="stats-sidebar-content">
            <div class="stats-card-preview">
                <div class="current-stat-card" id="previewStatCard">
                    <div class="stat-label">${availableStats[currentStatsConfig[position]].label}</div>
                    <div class="stat-value">${availableStats[currentStatsConfig[position]].calculate()}</div>
                </div>
                <div class="card-controls">
                    <div class="color-controls">
                        <button class="color-btn" title="Background Color">
                            <i class="fas fa-fill"></i>
                            <input type="color" id="statBgColor" 
                                value="${savedColors.background.startsWith('var') ? '#1e1e1e' : savedColors.background}"
                                oninput="updateStatColors('${position}')">
                        </button>
                        <button class="color-btn" title="Text Color">
                            <i class="fas fa-font"></i>
                            <input type="color" id="statTextColor" 
                                value="${savedColors.text.startsWith('var') ? '#ffffff' : savedColors.text}"
                                oninput="updateStatColors('${position}')">
                        </button>
                        <button class="reset-colors" onclick="resetStatColors('${position}')" title="Reset Colors">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                    <div class="card-actions">
                        <button class="stats-management-button" onclick="addNewStatCard()" title="Add Card">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="stats-management-button" onclick="removeStatCard('${position}')" title="Remove Card">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="available-stats-section">
                <h4 class="stats-management-title">Available Stats</h4>
                ${availableStatsArray.map(([key, stat]) => `
                    <div class="available-stat-item" data-stat="${key}">
                        <span>${stat.label}</span>
                        <span>${stat.calculate()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // Apply saved colors to preview card
    const previewCard = sidebar.querySelector('#previewStatCard');
    previewCard.style.backgroundColor = savedColors.background;
    previewCard.style.color = savedColors.text;

    setTimeout(() => {
        overlay.classList.add('active');
        sidebar.classList.add('active');
    }, 10);

    sidebar.querySelector('.stats-sidebar-close').onclick = () => closeStatsPopup(sidebar, overlay);
    overlay.onclick = () => closeStatsPopup(sidebar, overlay);

    sidebar.querySelectorAll('.available-stat-item').forEach(item => {
        item.onclick = () => {
            const newStat = item.dataset.stat;
            currentStatsConfig[position] = newStat;
            saveStatsConfig();
            updateHistorySummary();
            closeStatsPopup(sidebar, overlay);
        };
    });
}

function updateStatColors(position) {
    const bgColor = document.getElementById('statBgColor').value;
    const textColor = document.getElementById('statTextColor').value;
    
    // Update preview
    const previewCard = document.getElementById('previewStatCard');
    previewCard.style.backgroundColor = bgColor;
    previewCard.style.color = textColor;
    
    // Save colors
    statColors.saveColors(position, {
        background: bgColor,
        text: textColor
    });
    
    // Update actual stat card
    updateHistorySummary();
}

function resetStatColors(position) {
    // Delete saved colors for this position
    const savedColors = statColors.loadColors();
    delete savedColors[position];
    localStorage.setItem('statColors', JSON.stringify(savedColors));
    
    // Reset preview card
    const previewCard = document.getElementById('previewStatCard');
    previewCard.style.backgroundColor = 'var(--container-bg)';
    previewCard.style.color = 'var(--text-color)';
    
    // Reset color inputs
    document.getElementById('statBgColor').value = '#1e1e1e';
    document.getElementById('statTextColor').value = '#ffffff';
    
    // Update actual stat card
    updateHistorySummary();
}

function closeStatsPopup(sidebar, overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    setTimeout(() => {
        sidebar.remove();
        overlay.remove();
    }, 300);
}

function addNewStatCard() {
    const currentCount = Object.keys(currentStatsConfig).length;
    if (currentCount >= 8) {
        showNotification('Maximum number of stat cards reached');
        return;
    }

    const nextPosition = `position${currentCount + 1}`;
    const availableStat = Object.keys(availableStats).find(stat => 
        !Object.values(currentStatsConfig).includes(stat)
    );

    if (availableStat) {
        currentStatsConfig[nextPosition] = availableStat;
        saveStatsConfig();
        updateHistorySummary();
    }

    const sidebar = document.querySelector('.stats-sidebar');
    const overlay = document.querySelector('.stats-sidebar-overlay');
    if (sidebar && overlay) {
        closeStatsPopup(sidebar, overlay);
    }
}

function removeStatCard(position) {
    delete currentStatsConfig[position];
    // Reorder remaining positions
    const newConfig = {};
    Object.values(currentStatsConfig).forEach((stat, index) => {
        newConfig[`position${index + 1}`] = stat;
    });
    currentStatsConfig = newConfig;
    saveStatsConfig();
    updateHistorySummary();
    closeStatsPopup(
        document.querySelector('.stats-sidebar'),
        document.querySelector('.stats-sidebar-overlay')
    );
}

function saveStatsConfig() {
    localStorage.setItem('statsConfig', JSON.stringify(currentStatsConfig));
}

// Modify the updateHistorySummary function
function updateHistorySummary() {
    if (!sessions[currentSession]) return;

    // Load saved config or use default
    const loadedConfig = localStorage.getItem('statsConfig');
    currentStatsConfig = loadedConfig ? JSON.parse(loadedConfig) : {
        position1: 'bestSingle',
        position2: 'ao5',
        position3: 'ao12',
        position4: 'sessionMean'
    };

    // Create grid container if it doesn't exist
    let grid = document.querySelector('.history-stats-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'history-stats-grid';
        document.querySelector('.history-summary').appendChild(grid);
    }

    // Clear existing cards
    grid.innerHTML = '';

    // Add cards from config
    Object.entries(currentStatsConfig).forEach(([position, stat]) => {
        const card = document.createElement('div');
        card.className = 'history-stat-card';
        card.onclick = () => showStatsPopup(position, stat);
        
        // Apply custom colors if they exist
        const savedColors = statColors.loadColors()[position];
        if (savedColors) {
            card.style.backgroundColor = savedColors.background;
            card.style.color = savedColors.text;
        }
        
        card.innerHTML = `
            <i class="fas fa-chevron-down chevron-icon"></i>
            <div class="history-stat-label">${availableStats[stat].label}</div>
            <div class="history-stat-value">${availableStats[stat].calculate()}</div>
        `;
        grid.appendChild(card);
    });

    // Update progress bar
    const progressBar = document.getElementById('sessionProgress');
    if (progressBar) {
        const successRate = availableStats.successRate.calculate();
        progressBar.style.width = successRate;
    }

    // Update timer elements if they exist
    const ao5Element = document.getElementById('timerAo5');
    const ao12Element = document.getElementById('timerAo12');
    
    if (ao5Element) {
        ao5Element.textContent = availableStats.ao5.calculate();
    }
    if (ao12Element) {
        ao12Element.textContent = availableStats.ao12.calculate();
    }

    // Update mobile view if we're in mobile mode
    if (document.querySelector('.mobile-history-view.active')) {
        updateMobileHistory();
    }
}

function formatTotalTime(seconds) {
    if (seconds === 0) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateMobileStats() {
    const index = 0;
    const absoluteIndex = sessions[currentSession].times.length;
    const ao5 = getAverageOf5(sessions[currentSession].times.slice(0, absoluteIndex));
    const ao12 = getAverageOf12(sessions[currentSession].times.slice(0, absoluteIndex));
    const penalty = sessions[currentSession].penalties?.[absoluteIndex - 1];

    // Get best time and mean
    const validTimes = sessions[currentSession].times.filter(time => time !== DNF_VALUE && time !== "Infinity" && time !== Infinity);
    const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null;
    const mean = validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : null;

    // Calculate standard deviation
    let stdDev = "--";
    if (validTimes.length > 1 && mean !== null) {
        const variance = validTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validTimes.length;
        stdDev = Math.sqrt(variance).toFixed(2);
    }

    // Count DNFs and +2s
    const dnfCount = sessions[currentSession].times.filter(time => time === DNF_VALUE).length;
    const plus2Count = sessions[currentSession].penalties ? 
        Object.values(sessions[currentSession].penalties).filter(penalty => penalty === '+2').length : 0;

    // Update mobile stats displays
    const displays = {
        'mobileAo5': `ao5: ${ao5 === "--" || ao5 === "DNF" ? "--" : formatTime(ao5 * 1000)}`,
        'mobileAo12': `ao12: ${ao12 === "--" || ao12 === "DNF" ? "--" : formatTime(ao12 * 1000)}`,
        'mobileBest': `PB: ${bestTime ? formatTime(bestTime * 1000) : "--"}`,
        'mobileMean': `Mean: ${mean ? formatTime(mean * 1000) : "--"}`,
        'mobileStdDev': `σ: ${stdDev}`,
        'mobileSolves': `Solves: ${sessions[currentSession].times.length}`,
        'mobileDnf': `DNF: ${dnfCount}`,
        'mobilePlus2': `+2: ${plus2Count}`
    };

    // Update all displays
    for (const [id, text] of Object.entries(displays)) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateMobileStats(); // Initialize mobile stats on page load
});
