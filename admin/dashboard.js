import { getAllUsers, updateUserProfile, deleteUserProfile, createUserProfile } from '../js/user-service.js';
import { firebaseConfig } from '../js/firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.querySelector('#usersTable tbody');
    const loadingIndicator = document.getElementById('loading-indicator');
    const userSearchInput = document.getElementById('userSearch');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const sortBySelect = document.getElementById('sortBy');
    const sortDirButton = document.getElementById('sortDirBtn');

    // Modal elements
    const createUserModal = document.getElementById('createUserModal');
    const createUserBtn = document.getElementById('createUserBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const createUserForm = document.getElementById('createUserForm');
    const modalErrorMessage = document.getElementById('modalErrorMessage');

    let allUsers = []; // Cache for user data
    let currentSort = {
        key: 'createdAt',
        dir: 'desc' // 'asc' or 'desc'
    };

    // --- Navigation ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetId}-page`) page.classList.add('active');
            });
            pageTitle.textContent = item.querySelector('span').textContent;
        });
    });

    // --- User Management ---
    async function loadUsers() {
        loadingIndicator.classList.remove('hidden');
        usersTableBody.innerHTML = '';
        try {
            allUsers = await getAllUsers();
            allUsers.forEach(user => {
                user.createdAtDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(0);
            });
            applyFiltersAndSort();
        } catch (error) {
            console.error('Error loading users:', error);
            usersTableBody.innerHTML = '<tr><td colspan="5">Error loading users. Check console for details.</td></tr>';
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    function applyFiltersAndSort() {
        const searchTerm = userSearchInput.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => {
            const username = user.username?.toLowerCase() || '';
            const email = user.email?.toLowerCase() || '';
            return username.includes(searchTerm) || email.includes(searchTerm);
        });

        filteredUsers.sort((a, b) => {
            const valA = (currentSort.key === 'createdAt') ? a.createdAtDate : (a[currentSort.key] || '').toLowerCase();
            const valB = (currentSort.key === 'createdAt') ? b.createdAtDate : (b[currentSort.key] || '').toLowerCase();
            if (valA < valB) return currentSort.dir === 'asc' ? -1 : 1;
            if (valA > valB) return currentSort.dir === 'asc' ? 1 : -1;
            return 0;
        });

        renderUsers(filteredUsers);
    }

    function renderUsers(users) {
        usersTableBody.innerHTML = '';
        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
            return;
        }
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.uid = user.uid;
            row.innerHTML = `
                <td>${user.username || 'N/A'}</td>
                <td>${user.email}</td>
                <td>
                    <select class="role-select" data-uid="${user.uid}">
                        <option value="free_user" ${user.role === 'free_user' ? 'selected' : ''}>Free User</option>
                        <option value="pro_user" ${user.role === 'pro_user' ? 'selected' : ''}>Pro User</option>
                        <option value="subadmin" ${user.role === 'subadmin' ? 'selected' : ''}>Subadmin</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>${user.createdAtDate.toLocaleDateString()}</td>
                <td>
                    <button class="action-btn delete" data-uid="${user.uid}" title="Delete User"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    // --- Modal Logic ---
    function openModal() {
        createUserModal.classList.add('active');
    }

    function closeModal() {
        createUserModal.classList.remove('active');
        createUserForm.reset();
        modalErrorMessage.style.display = 'none';
    }

    createUserBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === createUserModal) closeModal();
    });

    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitUserBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Creating...`;
        modalErrorMessage.style.display = 'none';

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        let tempApp;
        try {
            // Initialize a temporary app to create the user without logging out the admin
            tempApp = firebase.initializeApp(firebaseConfig, 'temp-user-creation-app');
            const tempAuth = tempApp.auth();
            
            const userCredential = await tempAuth.createUserWithEmailAndPassword(email, password);
            const newUser = userCredential.user;

            // Create the user profile in Firestore using the main app's instance
            await createUserProfile(newUser.uid, username, email, role);

            // Clean up the temporary app
            await tempAuth.signOut();
            await tempApp.delete();

            alert('User created successfully!');
            closeModal();
            loadUsers(); // Refresh the user list

        } catch (error) {
            console.error("Error creating user:", error);
            modalErrorMessage.textContent = error.message;
            modalErrorMessage.style.display = 'block';
            if (tempApp) await tempApp.delete(); // Ensure cleanup on failure
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Create User</span>`;
        }
    });

    // --- Event Listeners ---
    userSearchInput.addEventListener('input', applyFiltersAndSort);
    sortBySelect.addEventListener('change', (e) => {
        currentSort.key = e.target.value;
        applyFiltersAndSort();
    });
    sortDirButton.addEventListener('click', () => {
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
        const icon = sortDirButton.querySelector('i');
        icon.className = `fas ${currentSort.dir === 'asc' ? 'fa-arrow-up-long' : 'fa-arrow-down-long'}`;
        applyFiltersAndSort();
    });
    usersTableBody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('role-select')) {
            const uid = e.target.dataset.uid;
            const newRole = e.target.value;
            if (confirm(`Change this user's role to ${newRole}?`)) {
                try {
                    await updateUserProfile(uid, { role: newRole });
                    alert('User role updated.');
                } catch (error) {
                    alert('Failed to update user role.');
                    loadUsers();
                }
            } else {
                const originalUser = allUsers.find(u => u.uid === uid);
                if (originalUser) e.target.value = originalUser.role;
            }
        }
    });
    usersTableBody.addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.delete');
        if (deleteButton) {
            const uid = deleteButton.dataset.uid;
            if (confirm('Are you sure you want to delete this user profile? This action cannot be undone.')) {
                try {
                    await deleteUserProfile(uid);
                    alert('User profile deleted.');
                    loadUsers();
                } catch (error) {
                    alert('Failed to delete user profile.');
                }
            }
        }
    });

    // Initial load
    if (document.getElementById('users-page').classList.contains('active')) {
        loadUsers();
    }
});