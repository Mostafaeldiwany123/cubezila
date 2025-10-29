import { getAllUsers, updateUserProfile, deleteUserProfile } from '../js/user-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.querySelector('#usersTable tbody');
    const loadingIndicator = document.getElementById('loading-indicator');
    const userSearchInput = document.getElementById('userSearch');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');

    let allUsers = []; // Cache for user data

    // --- Navigation ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;

            // Update nav active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update page active state
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetId}-page`) {
                    page.classList.add('active');
                }
            });
            
            // Update page title
            pageTitle.textContent = item.querySelector('span').textContent;
        });
    });

    // --- User Management ---
    async function loadUsers() {
        loadingIndicator.classList.remove('hidden');
        usersTableBody.innerHTML = '';
        try {
            allUsers = await getAllUsers();
            renderUsers(allUsers);
        } catch (error) {
            console.error('Error loading users:', error);
            usersTableBody.innerHTML = '<tr><td colspan="5">Error loading users. Check console for details.</td></tr>';
        } finally {
            loadingIndicator.classList.add('hidden');
        }
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

            const createdAt = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A';

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
                <td>${createdAt}</td>
                <td>
                    <button class="action-btn delete" data-uid="${user.uid}" title="Delete User"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    // Event delegation for user actions
    usersTableBody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('role-select')) {
            const uid = e.target.dataset.uid;
            const newRole = e.target.value;
            if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
                try {
                    await updateUserProfile(uid, { role: newRole });
                    alert('User role updated successfully.');
                } catch (error) {
                    console.error('Error updating user role:', error);
                    alert('Failed to update user role.');
                    // Revert dropdown on failure
                    loadUsers();
                }
            } else {
                // Revert dropdown if cancelled
                const originalUser = allUsers.find(u => u.uid === uid);
                if (originalUser) e.target.value = originalUser.role;
            }
        }
    });

    usersTableBody.addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.delete');
        if (deleteButton) {
            const uid = deleteButton.dataset.uid;
            if (confirm('Are you sure you want to delete this user? This will only remove their data from the database, not their authentication record. This action cannot be undone.')) {
                try {
                    await deleteUserProfile(uid);
                    alert('User profile deleted successfully.');
                    loadUsers(); // Refresh the list
                } catch (error) {
                    console.error('Error deleting user profile:', error);
                    alert('Failed to delete user profile.');
                }
            }
        }
    });

    // Search/Filter functionality
    userSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => {
            const username = user.username?.toLowerCase() || '';
            const email = user.email?.toLowerCase() || '';
            return username.includes(searchTerm) || email.includes(searchTerm);
        });
        renderUsers(filteredUsers);
    });

    // Initial load
    if (document.getElementById('users-page').classList.contains('active')) {
        loadUsers();
    }
});