const lessons = [
    { 
        id: 1, 
        title: { en: "Solve the White Cross", ar: "حل الصليب الأبيض" },
        videoId: '1FRIAHfR47k', 
        description: {
            en: "Start by creating a plus sign on the white face of the cube. Make sure the edge pieces match the center colors of the adjacent sides.",
            ar: "ابدأ بعمل علامة + على الوجه الأبيض للمكعب. تأكد من مطابقة قطع الحواف مع ألوان المراكز على الجوانب المجاورة."
        }
    },
    { 
        id: 2, 
        title: { en: "Solve the 1st Layer", ar: "حل الطبقة الأولى" },
        videoId: '9wxiFZ5BEvA', 
        description: {
            en: "Complete the first layer by positioning the white corners in their correct places.",
            ar: "أكمل الطبقة الأولى بوضع الزوايا البيضاء في أماكنها الصحيحة."
        }
    },
    { 
        id: 3, 
        title: { en: "Solve the 2nd Layer", ar: "حل الطبقة الثانية" },
        videoId: 'uGKQwH6pqrw', 
        description: {
            en: "Position the edge pieces of the second layer to complete it.",
            ar: "ضع قطع الحواف للطبقة الثانية لإكمالها."
        }
    },
    { 
        id: 4, 
        title: { en: "Orient the Pieces", ar: "توجيه القطع" },
        videoId: 'rZK3y9cl-d4', 
        description: {
            en: "Orient the last layer pieces so that the yellow pieces are facing upwards.",
            ar: "وجه قطع الطبقة الأخيرة بحيث تكون القطع الصفراء متجهة لأعلى."
        }
    },
    { 
        id: 5, 
        title: { en: "Solve the Cube", ar: "حل المكعب" },
        videoId: 'Lk_OBYpOjsM', 
        description: {
            en: "Use the algorithms to position the remaining pieces and solve the cube completely.",
            ar: "استخدم الخوارزميات لوضع القطع المتبقية وحل المكعب بالكامل."
        }
    }
];

const achievements = [
    { 
        id: 1, 
        name: { en: "First Step", ar: "الخطوة الأولى" }, 
        description: { en: "Complete your first lesson", ar: "أكمل درسك الأول" }, 
        requiredLessons: 1 
    },
    { 
        id: 2, 
        name: { en: "Halfway There", ar: "في المنتصف" }, 
        description: { en: "Complete 50% of the lessons", ar: "أكمل 50% من الدروس" }, 
        requiredLessons: 3 
    },
    { 
        id: 3, 
        name: { en: "Cube Master", ar: "خبير المكعب" }, 
        description: { en: "Complete all lessons", ar: "أكمل جميع الدروس" }, 
        requiredLessons: 5 
    }
];

let currentLesson = 0;
let completedLessons = [];

function updateUI() {
    const currentLanguage = localStorage.getItem("selectedLanguage") || "en";
    const lesson = lessons[currentLesson];
    
    document.getElementById('lesson-title').textContent = lesson.title[currentLanguage];
    document.getElementById('lesson-video').src = `https://www.youtube.com/embed/${lesson.videoId}`;
    document.getElementById('lesson-description').textContent = lesson.description[currentLanguage];

    const completeButton = document.getElementById('complete-lesson');
    if (completedLessons.includes(currentLesson + 1)) {
        completeButton.textContent = 'Completed';
        completeButton.classList.add('btn-success');
    } else {
        completeButton.textContent = 'Mark as Completed';
        completeButton.classList.remove('btn-success');
    }

    const lessonList = document.getElementById('lesson-list');
    lessonList.innerHTML = lessons.map((lesson, index) => `
        <li class="lesson-item ${index === currentLesson ? 'active' : ''}" data-lesson="${lesson.id}">
            <i class="fas ${completedLessons.includes(lesson.id) ? 'fa-check-circle' : index <= completedLessons.length ? 'fa-circle' : 'fa-lock'}"></i>
            ${lesson.title[currentLanguage]}
        </li>
    `).join('');

    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${completedLessons.length >= achievement.requiredLessons ? '' : 'locked'}">
            <i class="fas fa-trophy"></i>
            <div>
                <h4>${achievement.name[currentLanguage]}</h4>
                <p>${achievement.description[currentLanguage]}</p>
            </div>
        </div>
    `).join('');

    const progressBar = document.getElementById('progress-bar');
    const lessonsCompleted = document.getElementById('lessons-completed');
    const completionRate = document.getElementById('completion-rate');

    const completionPercentage = (completedLessons.length / lessons.length) * 100;
    progressBar.style.width = `${completionPercentage}%`;
    lessonsCompleted.textContent = `${completedLessons.length} / ${lessons.length}`;
    completionRate.textContent = `${Math.round(completionPercentage)}%`;

    const statBars = document.querySelectorAll('.stat-bar');
    statBars.forEach((bar, index) => {
        bar.style.height = index < completedLessons.length ? '100%' : '0%';
    });

    if (completedLessons.length === lessons.length) {
        showCongratulations();
    }
}

function saveProgress() {
    localStorage.setItem('cubeProgress', JSON.stringify({
        completedLessons: completedLessons,
        currentLesson: currentLesson
    }));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('cubeProgress');
    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        completedLessons = progressData.completedLessons || [];
        currentLesson = progressData.currentLesson || 0;
        updateUI();
    }
}

function showCongratulations() {
    const congratsElement = document.getElementById('congratulations');
    congratsElement.style.display = 'block';
    congratsElement.classList.add('fade-in');

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function hideCongratulations() {
    const congratsElement = document.getElementById('congratulations');
    congratsElement.style.display = 'none';
    congratsElement.classList.remove('fade-in');
}

document.getElementById('complete-lesson').addEventListener('click', () => {
    const lessonId = currentLesson + 1;
    const index = completedLessons.indexOf(lessonId);
    
    if (index > -1) {
        completedLessons.splice(index, 1);
    } else {
        completedLessons.push(lessonId);
        
        if (currentLesson < lessons.length - 1) {
            currentLesson++;
        }
    }

    updateUI();
    saveProgress();
});

document.getElementById('lesson-list').addEventListener('click', (e) => {
    const lessonItem = e.target.closest('.lesson-item');
    if (lessonItem) {
        const lessonIndex = parseInt(lessonItem.dataset.lesson) - 1;
        if (lessonIndex <= completedLessons.length) {
            currentLesson = lessonIndex;
            updateUI();
            saveProgress();
        }
    }
});

document.getElementById('complete-challenge').addEventListener('click', (e) => {
    e.target.textContent = 'Completed!';
    e.target.classList.add('btn-success');
    e.target.disabled = true;
});

document.getElementById('close-congrats').addEventListener('click', hideCongratulations);

document.getElementById('start-intermediate').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Congratulations on completing the Beginner Method! The Intermediate Method is coming soon.');
    hideCongratulations();
});

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'tutorials';
});

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateUI();
});