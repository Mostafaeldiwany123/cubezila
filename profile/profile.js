function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Remove active class from all tab triggers
            const tabTriggers = document.querySelectorAll('.tab-trigger');
            tabTriggers.forEach(trigger => {
                trigger.classList.remove('active');
            });

            // Show selected tab content
            document.getElementById(tabName).classList.add('active');

            // Add active class to clicked tab trigger
            event.target.classList.add('active');
        }

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    this.style.transition = 'all 0.2s ease';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                });
            });

            // Add click effects to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                });
            });
        });

        // Profile stats updater
function updateProfileStats() {
    // Total Solves & Sessions
    let totalSolves = 0;
    let totalSessions = 0;
    try {
        const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
        totalSessions = Object.keys(sessions).length;
        for (const session of Object.values(sessions)) {
            if (Array.isArray(session.times)) {
                totalSolves += session.times.length;
            }
        }
    } catch {}

    // Algs Learnt
    let algsLearnt = 0;
    try {
        const storage = JSON.parse(localStorage.getItem('CUBEZILA_STORAGE')) || {};
        for (const session of Object.values(storage)) {
            if (session.caseStatuses) {
                for (const status of Object.values(session.caseStatuses)) {
                    if (status === true || status === 'learned' || status === 1) {
                        algsLearnt++;
                    }
                }
            }
        }
    } catch {}

    // Day Streak
    let dayStreak = 0;
    try {
        dayStreak = parseInt(localStorage.getItem('cubeStreak')) || 0;
    } catch {}

    document.getElementById('totalSolves').textContent = totalSolves;
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('algsLearnt').textContent = algsLearnt;
    document.getElementById('dayStreak').textContent = dayStreak;
}

document.addEventListener('DOMContentLoaded', updateProfileStats);
// --- Personal Records Dynamic Loader ---
function getPersonalRecords() {
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    // Map: event/session name -> { single, avg5, avg100 }
    const records = {};
    for (const [sessionName, session] of Object.entries(sessions)) {
        if (!Array.isArray(session.times) || session.times.length === 0) continue;
        // Filter out DNFs and non-numeric
        const validTimes = session.times.filter(t => t !== 'DNF' && !isNaN(parseFloat(t))).map(parseFloat);
        if (validTimes.length === 0) continue;
        // Single (best)
        const single = Math.min(...validTimes);
        // Average of 5 (best Ao5)
        let bestAo5 = null;
        if (validTimes.length >= 5) {
            for (let i = 0; i <= validTimes.length - 5; i++) {
                const chunk = validTimes.slice(i, i + 5);
                const avg = (chunk.reduce((a, b) => a + b, 0) - Math.max(...chunk) - Math.min(...chunk)) / 3;
                if (bestAo5 === null || avg < bestAo5) bestAo5 = avg;
            }
        }
        // Average of 100 (best Ao100)
        let bestAo100 = null;
        if (validTimes.length >= 100) {
            for (let i = 0; i <= validTimes.length - 100; i++) {
                const chunk = validTimes.slice(i, i + 100);
                const avg = (chunk.reduce((a, b) => a + b, 0) - Math.max(...chunk) - Math.min(...chunk)) / 98;
                if (bestAo100 === null || avg < bestAo100) bestAo100 = avg;
            }
        }
        records[sessionName] = {
            single: single,
            avg5: bestAo5,
            avg100: bestAo100
        };
    }
    return records;
}

function renderPersonalRecords() {
    const tbody = document.querySelector('#records .table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const records = getPersonalRecords();
    const eventNames = Object.keys(records);
    if (eventNames.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-light);">No records found.</td></tr>';
        return;
    }
    eventNames.forEach(event => {
        const rec = records[event];
        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${event}</td>
                <td style="color:var(--success);font-weight:600;">${rec.single !== undefined ? rec.single.toFixed(2) : '-'}</td>
                <td style="color:var(--primary);font-weight:600;">${rec.avg5 !== null && rec.avg5 !== undefined ? rec.avg5.toFixed(2) : '-'}</td>
                <td style="color:var(--purple);font-weight:600;">${rec.avg100 !== null && rec.avg100 !== undefined ? rec.avg100.toFixed(2) : '-'}</td>
            </tr>
        `;
    });
}

document.addEventListener('DOMContentLoaded', renderPersonalRecords);

function renderAlgsLearnt() {
    const storage = JSON.parse(localStorage.getItem('CUBEZILA_STORAGE')) || {};
    const tbody = document.getElementById('algsLearntTableBody');
    tbody.innerHTML = '';
    const subsets = Object.keys(storage);
    if (subsets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-light);">No data found.</td></tr>';
        return;
    }
    subsets.forEach(subset => {
        const session = storage[subset];
        const statuses = session.caseStatuses || {};
        const total = Object.keys(statuses).length;
        const learnt = Object.values(statuses).filter(v => v === 'learnt' || v === true).length;
        tbody.innerHTML += `<tr><td style="font-weight:600;">${subset}</td><td style="color:var(--success);font-weight:600;">${learnt}</td><td style="color:var(--primary);font-weight:600;">${total}</td></tr>`;
    });
}
document.addEventListener('DOMContentLoaded', renderAlgsLearnt);

// --- Achievements Logic ---
function getAchievements() {
    const achievements = [];
    // 1. First 100 solves on Cubezila Timer
    try {
        const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
        let totalSolves = 0;
        for (const session of Object.values(sessions)) {
            if (Array.isArray(session.times)) totalSolves += session.times.length;
        }
        if (totalSolves >= 100) {
            achievements.push({
                icon: 'fa-bolt',
                color: 'text-yellow',
                title: '100 Solves!',
                description: 'Completed 100 solves on Cubezila Timer',
                meta: 'Milestone'
            });
        }
    } catch {}
    // 2. Imported cstimer solves (REMOVE for now)
    // if (localStorage.getItem('cstimer_imported') === 'true') {
    //     achievements.push({
    //         icon: 'fa-download',
    //         color: 'text-blue',
    //         title: 'Imported cstimer Solves',
    //         description: 'Successfully imported solves from cstimer',
    //         meta: 'Data Import'
    //     });
    // }
    // 3. First full algorithm set learnt (any subset)
    try {
        const storage = JSON.parse(localStorage.getItem('CUBEZILA_STORAGE')) || {};
        for (const [subset, session] of Object.entries(storage)) {
            const statuses = session.caseStatuses || {};
            const total = Object.keys(statuses).length;
            const learnt = Object.values(statuses).filter(v => v === 'learnt' || v === true).length;
            if (total > 0 && learnt === total) {
                achievements.push({
                    icon: 'fa-brain',
                    color: 'text-purple',
                    title: `Full ${subset} Learnt!`,
                    description: `You have learnt all algorithms in ${subset}`,
                    meta: 'Learning'
                });
                break;
            }
        }
    } catch {}
    // 4. Add more achievements as needed...
    return achievements;
}

function renderAchievements() {
    const grid = document.querySelector('#achievements .grid');
    if (!grid) return;
    grid.innerHTML = '';
    const achievements = getAchievements();
    if (achievements.length === 0) {
        grid.innerHTML = '<div style="color:var(--text-light);text-align:center;width:100%;">No achievements yet. Start solving and learning!</div>';
        return;
    }
    achievements.forEach(a => {
        grid.innerHTML += `
        <div class="achievement-card">
            <div class="achievement-icon ${a.color}">
                <i class="fas ${a.icon}"></i>
            </div>
            <div class="achievement-content">
                <div class="achievement-title">${a.title}</div>
                <div class="achievement-description">${a.description}</div>
                <div class="achievement-meta">${a.meta}</div>
            </div>
        </div>
        `;
    });
}
document.addEventListener('DOMContentLoaded', renderAchievements);

// --- Achievement Notification ---
function showAchievementNotification(title, description) {
    if (document.getElementById('achievement-notif')) return;
    const notif = document.createElement('div');
    notif.id = 'achievement-notif';
    notif.style.position = 'fixed';
    notif.style.top = '30px';
    notif.style.right = '30px';
    notif.style.background = 'var(--container-bg)';
    notif.style.color = 'var(--text-color)';
    notif.style.padding = '1rem 2rem';
    notif.style.borderRadius = '10px';
    notif.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    notif.style.zIndex = 9999;
    notif.style.fontWeight = 'bold';
    notif.innerHTML = `<i class="fas fa-trophy" style="margin-right:10px;color:var(--primary-color);"></i> ${title}<br><span style="font-weight:400;font-size:0.95em;">${description}</span>`;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = 0;
        setTimeout(() => notif.remove(), 600);
    }, 3500);
}

// --- Achievement Progress ---
function renderAchievementProgress() {
    const progressCards = [
        {
            label: 'Consistency Master',
            current: getSub15Streak(),
            goal: 10,
            description: `${getSub15Streak()}/10 sub-15 solves in a row`
        },
        {
            label: 'Speed Demon',
            current: getSub10Singles(),
            goal: 5,
            description: `${getSub10Singles()}/5 sub-10 singles`
        },
        {
            label: 'Marathon Solver',
            current: getMonthlySolves(),
            goal: 500,
            description: `${getMonthlySolves()}/500 solves this month`
        }
    ];
    const cardContent = document.querySelector('#achievements .card-content');
    if (!cardContent) return;
    cardContent.innerHTML = '';
    progressCards.forEach(card => {
        const percent = Math.min(100, Math.round((card.current / card.goal) * 100));
        cardContent.innerHTML += `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 500; font-size: 0.875rem;">${card.label}</span>
                <span class="text-light" style="font-size: 0.875rem;">${card.description}</span>
            </div>
            <div class="progress">
                <div class="progress-bar" style="width: ${percent}%;"></div>
            </div>
        </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', renderAchievementProgress);

// --- Progress Calculation Helpers ---
function getSub15Streak() {
    // Returns the max streak of sub-15 solves in a row in all sessions
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    let maxStreak = 0, currentStreak = 0;
    for (const session of Object.values(sessions)) {
        if (!Array.isArray(session.times)) continue;
        currentStreak = 0;
        for (const t of session.times) {
            if (typeof t === 'number' && t < 15) {
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
        }
    }
    return maxStreak;
}
function getSub10Singles() {
    // Returns the count of sub-10 singles in all sessions
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    let count = 0;
    for (const session of Object.values(sessions)) {
        if (!Array.isArray(session.times)) continue;
        for (const t of session.times) {
            if (typeof t === 'number' && t < 10) count++;
        }
    }
    return count;
}
function getMonthlySolves() {
    // Returns the count of solves in the current month
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    const now = new Date();
    let count = 0;
    for (const session of Object.values(sessions)) {
        if (!Array.isArray(session.dates)) continue;
        for (const d of session.dates) {
            const date = new Date(d);
            if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) count++;
        }
    }
    return count;
}

// --- User Goals Logic with Presets and Progress Check ---
function getUserGoals() {
    return JSON.parse(localStorage.getItem('userGoals') || '[]');
}
function saveUserGoals(goals) {
    localStorage.setItem('userGoals', JSON.stringify(goals));
}
function checkGoalProgress(goal) {
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    const session = sessions[goal.session] || { solves: [] };
    const solves = Array.isArray(session.solves) ? session.solves : [];
    if (goal.preset === 'subAvg') {
        const N = parseInt(goal.avgN, 10);
        const target = parseFloat(goal.target);
        let achieved = false;
        let best = null;
        for (let i = 0; i <= solves.length - N; i++) {
            const chunk = solves.slice(i, i + N).map(s => (typeof s === 'object' && s.time !== undefined ? s.time : s)).filter(t => typeof t === 'number');
            if (chunk.length === N) {
                const avg = chunk.reduce((a, b) => a + b, 0) / N;
                if (best === null || avg < best) best = avg;
                if (avg <= target) achieved = true;
            }
        }
        return { achieved, progress: best !== null ? best.toFixed(2) : '—', total: solves.length };
    } else if (goal.preset === 'subSingle') {
        const target = parseFloat(goal.target);
        let best = null;
        let achieved = false;
        solves.forEach(s => {
            const t = (typeof s === 'object' && s.time !== undefined ? s.time : s);
            if (typeof t === 'number') {
                if (best === null || t < best) best = t;
                if (t <= target) achieved = true;
            }
        });
        return { achieved, progress: best !== null ? best.toFixed(2) : '—', total: solves.length };
    } else if (goal.preset === 'totalSolves') {
        const count = solves.length;
        const target = parseInt(goal.target, 10);
        return { achieved: count >= target, progress: count, total: target };
    }
    return { achieved: false, progress: '—', total: 0 };
}
function renderUserGoals() {
    const goals = getUserGoals();
    const list = document.getElementById('userGoalsList');
    if (!list) return;
    if (goals.length === 0) {
        list.innerHTML = '<div style="color:#888; font-size:0.95em;">No custom goals yet.</div>';
        return;
    }
    list.innerHTML = goals.map((g, i) => {
        const { achieved, progress, total } = checkGoalProgress(g);
        let desc = '';
        let progressStr = '';
        let progressBar = '';
        if (g.preset === 'subAvg') {
            desc = `Sub-${g.target} average of ${g.avgN} (<span class='goal-session'>${g.session}</span>)`;
            progressStr = achieved ? `<span class='goal-done'>Done! Best: ${progress}s</span>` : `Best: ${progress}s`;
            progressBar = achieved ? `<div class='goal-progress-bar done'></div>` : '';
        } else if (g.preset === 'subSingle') {
            desc = `Sub-${g.target} single (<span class='goal-session'>${g.session}</span>)`;
            progressStr = achieved ? `<span class='goal-done'>Done! Best: ${progress}s</span>` : `Best: ${progress}s`;
            progressBar = achieved ? `<div class='goal-progress-bar done'></div>` : '';
        } else if (g.preset === 'totalSolves') {
            desc = `${g.target} total solves (<span class='goal-session'>${g.session}</span>)`;
            const percent = Math.min(100, Math.round((progress / total) * 100));
            progressStr = achieved ? `<span class='goal-done'>Done! (${progress}/${total})</span>` : `Progress: ${progress}/${total}`;
            progressBar = `<div class='goal-progress-bar' style='width:${percent}%;${achieved ? "background:var(--success,#2ecc40);" : ''}'></div>`;
        }
        return `<div class="user-goal${achieved ? ' achieved' : ''}">
            <div>
                <strong>${desc}</strong><br>
                <span style="font-size:0.95em; color:var(--text-color, #666);">${progressStr}</span>
                <div class='goal-progress-outer'>${progressBar}</div>
            </div>
            <button onclick="removeUserGoal(${i})" title="Delete">&times;</button>
        </div>`;
    }).join('');
}
function removeUserGoal(idx) {
    const goals = getUserGoals();
    goals.splice(idx, 1);
    saveUserGoals(goals);
    renderUserGoals();
}
function openGoalModal() {
    document.getElementById('goalModal').classList.add('active');
    updateGoalSessionOptions();
    updateGoalPresetFields();
}
function closeGoalModal() {
    document.getElementById('goalModal').classList.remove('active');
}
function updateGoalSessionOptions() {
    const select = document.getElementById('goalSession');
    select.innerHTML = '';
    const sessions = JSON.parse(localStorage.getItem('cubeSessions_v2')) || {};
    Object.keys(sessions).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });
}
function updateGoalPresetFields() {
    const preset = document.getElementById('goalPreset').value;
    const fields = document.getElementById('goalPresetFields');
    if (preset === 'subAvg') {
        fields.innerHTML = `
            <label>Average of:
                <input type="number" id="goalAvgN" min="3" max="100" value="5" required>
            </label>
            <label>Target Time (seconds):
                <input type="number" id="goalTarget" min="0.01" step="0.01" required>
            </label>
        `;
    } else if (preset === 'subSingle') {
        fields.innerHTML = `
            <label>Target Time (seconds):
                <input type="number" id="goalTarget" min="0.01" step="0.01" required>
            </label>
        `;
    } else if (preset === 'totalSolves') {
        fields.innerHTML = `
            <label>Number of Solves:
                <input type="number" id="goalTarget" min="1" step="1" required>
            </label>
        `;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createGoalBtn').onclick = openGoalModal;
    document.getElementById('closeGoalModal').onclick = closeGoalModal;
    document.getElementById('goalPreset').onchange = updateGoalPresetFields;
    document.getElementById('goalForm').onsubmit = function(e) {
        e.preventDefault();
        const preset = document.getElementById('goalPreset').value;
        const session = document.getElementById('goalSession').value;
        let goal = { preset, session };
        if (preset === 'subAvg') {
            goal.avgN = document.getElementById('goalAvgN').value;
            goal.target = document.getElementById('goalTarget').value;
        } else if (preset === 'subSingle' || preset === 'totalSolves') {
            goal.target = document.getElementById('goalTarget').value;
        }
        const goals = getUserGoals();
        goals.push(goal);
        saveUserGoals(goals);
        renderUserGoals();
        closeGoalModal();
        document.getElementById('goalForm').reset();
        updateGoalPresetFields();
    };
    renderUserGoals();
});
