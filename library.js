// Seat data (initially all empty, will load from local storage if available)
let seats = {
    A: Array(25).fill('empty'),
    B: Array(25).fill('empty'),
    C: Array(25).fill('empty'),
    D: Array(25).fill('empty')
};

let isAdmin = false;
const adminUsernameEncoded = 'ODU5NjEy'; // Base64 for '859612'
const adminPasswordEncoded = 'NDVAI1JhajY1'; // Base64 for '45@#Raj65';

// Load seats on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSeats(); // Load saved data
    renderSeats();
    document.getElementById('loginBtn').addEventListener('click', showLogin);
    document.getElementById('submitLogin').addEventListener('click', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('saveBtn').addEventListener('click', saveSeats); // Add save button listener
});

function renderSeats() {
    const sections = ['A', 'B', 'C', 'D'];
    sections.forEach(section => {
        const seatContainer = document.getElementById(`seats${section}`);
        seatContainer.innerHTML = '';
        for (let i = 1; i <= 25; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat-container';

            const seatLabel = document.createElement('div');
            seatLabel.className = 'seat';
            seatLabel.textContent = `${section}${i}`;
            seatDiv.appendChild(seatLabel);

            const select = document.createElement('select');
            select.innerHTML = `
                <option value="empty" ${seats[section][i-1] === 'empty' ? 'selected' : ''}>Empty</option>
                <option value="reserved" ${seats[section][i-1] === 'reserved' ? 'selected' : ''}>Reserved</option>
                <option value="unreserved" ${seats[section][i-1] === 'unreserved' ? 'selected' : ''}>Unreserved</option>
            `;
            select.className = seats[section][i-1];
            if (isAdmin) {
                select.addEventListener('change', (e) => updateSeatStatus(section, i-1, e.target.value));
            } else {
                select.disabled = true;
            }
            seatDiv.appendChild(select);

            seatContainer.appendChild(seatDiv);
        }
    });
    document.getElementById('saveBtn').style.display = isAdmin ? 'block' : 'none'; // Show/hide save button
}

function updateSeatStatus(section, index, status) {
    seats[section][index] = status;
    renderSeats();
}

function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('seatManagement').style.display = 'none';
}

function decodeBase64(str) {
    return atob(str);
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const adminUsername = decodeBase64(adminUsernameEncoded);
    const adminPassword = decodeBase64(adminPasswordEncoded);
    if (username === adminUsername && password === adminPassword) {
        isAdmin = true;
        document.getElementById('userStatus').textContent = 'Admin';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('seatManagement').style.display = 'block';
        renderSeats();
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
}

function handleLogout() {
    isAdmin = false;
    document.getElementById('userStatus').textContent = 'Guest';
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'none';
    renderSeats();
}

// Save seats to local storage
function saveSeats() {
    localStorage.setItem('librarySeats', JSON.stringify(seats));
    alert('Seat changes saved successfully!');
}

// Load seats from local storage
function loadSeats() {
    const savedSeats = localStorage.getItem('librarySeats');
    if (savedSeats) {
        seats = JSON.parse(savedSeats);
    }
}