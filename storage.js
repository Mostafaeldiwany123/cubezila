class StorageManager {
    constructor(sessionName) {
        this.sessionName = sessionName;
        this.storageKey = 'CUBEZILA_STORAGE';
    }

    // Get the entire storage object
    getStorage() {
        const storage = localStorage.getItem(this.storageKey);
        return storage ? JSON.parse(storage) : {};
    }

    // Save the entire storage object
    saveStorage(storage) {
        localStorage.setItem(this.storageKey, JSON.stringify(storage));
    }

    // Get session data
    getSession() {
        const storage = this.getStorage();
        return storage[this.sessionName] || this.createDefaultSession();
    }

    // Save session data
    saveSession(sessionData) {
        const storage = this.getStorage();
        storage[this.sessionName] = sessionData;
        this.saveStorage(storage);
    }

    // Create default session structure
    createDefaultSession() {
        return {
            algorithms: [],
            selectedCases: [],
            caseStatuses: {},
            colorScheme: 'yellow',
            solveHistory: []
        };
    }

    // Specific methods for managing algorithms
    saveAlgorithms(algorithms) {
        const session = this.getSession();
        session.algorithms = algorithms;
        this.saveSession(session);
    }

    getAlgorithms() {
        const session = this.getSession();
        return session.algorithms || [];
    }

    // Methods for selected cases
    saveSelectedCases(cases) {
        const session = this.getSession();
        session.selectedCases = cases;
        this.saveSession(session);
    }

    getSelectedCases() {
        return this.getSession().selectedCases;
    }

    // Methods for case statuses (learned/not learned)
    saveCaseStatuses(statuses) {
        const session = this.getSession();
        session.caseStatuses = statuses;
        this.saveSession(session);
    }

    getCaseStatuses() {
        return this.getSession().caseStatuses;
    }

    // Methods for color scheme
    saveColorScheme(scheme) {
        const session = this.getSession();
        session.colorScheme = scheme;
        this.saveSession(session);
    }

    getColorScheme() {
        return this.getSession().colorScheme;
    }

    // Methods for solve history
    saveSolveHistory(history) {
        const session = this.getSession();
        session.solveHistory = history;
        this.saveSession(session);
    }

    getSolveHistory() {
        return this.getSession().solveHistory;
    }

    // Add a single solve to history
    addSolve(solve) {
        const session = this.getSession();
        session.solveHistory.unshift(solve);
        this.saveSession(session);
    }

    // Clear all solves
    clearSolveHistory() {
        const session = this.getSession();
        session.solveHistory = [];
        this.saveSession(session);
    }

    // Save all data at once
    saveAllData({ algorithms, selectedCases, caseStatuses, colorScheme, solveHistory }) {
        const session = this.getSession();
        session.algorithms = algorithms || session.algorithms;
        session.selectedCases = selectedCases || session.selectedCases;
        session.caseStatuses = caseStatuses || session.caseStatuses;
        session.colorScheme = colorScheme || session.colorScheme;
        session.solveHistory = solveHistory || session.solveHistory;
        this.saveSession(session);
    }

    // Reset entire session
    resetSession() {
        const storage = this.getStorage();
        storage[this.sessionName] = this.createDefaultSession();
        this.saveStorage(storage);
    }
}
