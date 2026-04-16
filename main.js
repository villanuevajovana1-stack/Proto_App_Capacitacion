// Seishin Safety Academy - Pro Version (V3)
// --- UTILITIES ---

const getMediaEmbed = (url) => {
    if (!url) return '';
    
    // Check for Base64 or Blob URLs
    if (url.startsWith('blob:') || url.startsWith('data:video')) {
        return `<video src="${url}" controls style="width:100%; max-height:500px; background:#000; display:block; margin:0 auto;"></video>`;
    }
    if (url.startsWith('data:image')) {
        return `<img src="${url}" style="width:100%; max-height:500px; object-fit:contain; background:#000; display:block; margin:0 auto;">`;
    }

    // YouTube Detection
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1] || url.split('embed/')[1];
        if (id) return `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen style="width:100%; aspect-ratio:16/9; background:#000; border:none; display:block;"></iframe>`;
    }

    // Direct Image Extensions
    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) != null) {
        return `<img src="${url}" style="width:100%; max-height:500px; object-fit:contain; background:#000; display:block; margin:0 auto;">`;
    }

    // Direct Video Extensions
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) != null) {
        return `<video src="${url}" controls style="width:100%; max-height:500px; background:#000; display:block; margin:0 auto;"></video>`;
    }

    // Fallback for Platforms like Pinterest that block Cross-Origin UI Iframes
    let hostname = 'el sitio externo';
    try { hostname = new URL(url).hostname; } catch(e){}

    return `
        <div style="background: var(--bg-accent); padding: 4rem 2rem; text-align: center; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <p style="margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--primary);">El enlace de <b>${hostname}</b> se ha cargado correctamente.</p>
            <p style="margin-bottom: 2rem; color: var(--text-muted);">Sin embargo, esta plataforma no permite previsualizaciones incrustadas por seguridad.</p>
            <a href="${url}" target="_blank" class="primary-btn" style="width: auto; padding: 1rem 3rem; text-decoration: none;">Abrir Contenido en Nueva Pestaña ↗</a>
        </div>
    `;
};

const UI = () => ({
    authView: document.getElementById('authView'),
    appBody: document.body,
    grid: document.getElementById('trainingGrid'),
    ongoingGrid: document.getElementById('ongoingCoursesGrid'),
    welcomeUser: document.getElementById('welcomeUser'),
    welcomeMsgLabel: document.getElementById('systemWelcomeMsg'),
    views: document.querySelectorAll('.view-container'),
    adminLock: document.getElementById('adminLock'),
    adminContent: document.getElementById('adminContent'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalContainer: document.getElementById('modalContainer'),
    profileName: document.getElementById('profileName'),
    profileRole: document.getElementById('profileRole'),
    progressFill: document.getElementById('overallProgressFill'),
    progressText: document.getElementById('progressText'),
    userTableBody: document.getElementById('userTableBody'),
});

// --- DATA ---
const QUIZ_DATA = {
    forklift: [
        { q: "¿En qué posición debe ir la carga durante el traslado?", options: ["Elevada al máximo", "Cerca del mástil y a baja altura", "Inclinada hacia adelante"], correct: 1 },
        { q: "¿Qué debe hacer al acercarse a una intersección?", options: ["Aumentar velocidad", "Ignorar si no ve a nadie", "Hacer alto total y usar claxon"], correct: 2 }
    ],
    welding: [
        { q: "¿Cuál es la distancia mínima a materiales inflamables?", options: ["2 metros", "5 metros", "10 metros"], correct: 2 },
        { q: "¿Qué EPP protege de la radiación infrarroja?", options: ["Lentes de sol comunes", "Carena con filtro adecuado", "Careta de plástico"], correct: 1 }
    ],
    stamping: [
        { q: "¿Qué procedimiento es obligatorio antes de ajustes internos?", options: ["Avisar al compañero", "Protocolo LOTO (Bloqueo y Etiquetado)", "Limpiar el área"], correct: 1 }
    ]
};

const DEFAULT_COURSES = {
    forklift: { title: "Seguridad en Montacargas", category: "OPERACIÓN", image: "https://images.unsplash.com/photo-1586528116311-ad86d72491a6?auto=format&fit=crop&q=80&w=800", videoUrl: "https://www.youtube.com/embed/z2779pS2Uq4", modules: 12, epp: ["Casco", "Chaleco", "Zapatos dieléctricos"], recommendations: ["Velocidad 5km/h", "Carga baja"], innovation: "Sensores láser" },
    welding: { title: "Prevención en Soldadura", category: "SEGURIDAD", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", videoUrl: "https://www.youtube.com/embed/T6S8v2jDPrk", modules: 8, epp: ["Carena", "Mandil", "Guantes"], recommendations: ["Ventilación", "Área limpia"], innovation: "Simuladores AR" },
    stamping: { title: "Seguridad en Prensas", category: "OPERACIÓN", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", videoUrl: "https://www.youtube.com/embed/z2779pS2Uq4", modules: 10, epp: ["Tapones 30dB", "Guantes A5"], recommendations: ["Cero intervención prensa", "LOTO"], innovation: "IoT Monitoring" }
};

const DEFAULT_USERS = {
    'admin': { password: '123', name: 'Administrador Seishin', role: 'Seguridad Industrial', isAdmin: true, progress: {} },
    'empleado1': { password: '123', name: 'Roberto Sánchez', role: 'Técnico de Estampado', isAdmin: false, progress: {} }
};

const DEFAULT_CONFIG = {
    formsLink: "https://forms.gle/5WoWfhBtsR2d1Pfr5",
    welcomeMsg: "¡Seguridad primero! Bienvenido al portal de capacitación Seishin."
};

// --- STATE ---
let state = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    courses: JSON.parse(localStorage.getItem('courses')) || DEFAULT_COURSES,
    users: JSON.parse(localStorage.getItem('users')) || DEFAULT_USERS,
    config: JSON.parse(localStorage.getItem('seishinConfig')) || DEFAULT_CONFIG,
    quizzes: JSON.parse(localStorage.getItem('quizzes')) || QUIZ_DATA,
    activeView: 'dashboard',
    lastUploadedUrl: ''
};

const saveState = () => {
    localStorage.setItem('courses', JSON.stringify(state.courses));
    localStorage.setItem('users', JSON.stringify(state.users));
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    localStorage.setItem('seishinConfig', JSON.stringify(state.config));
    localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
};

// --- LOGIC ---
const renderDashboard = (filter = 'Todos') => {
    const ui = UI();
    if (!ui.grid) return;
    ui.welcomeUser.textContent = `Hola, ${state.currentUser.name.split(' ')[0]}`;
    ui.welcomeMsgLabel.textContent = state.config.welcomeMsg;

    const coursesArray = Object.entries(state.courses).filter(([id, data]) => {
        if (filter === 'Todos') return true;
        return data.category === filter.toUpperCase();
    });

    ui.grid.innerHTML = coursesArray.map(([id, data]) => {
        const isCompleted = state.currentUser.progress[id];
        return `
            <div class="training-card" data-id="${id}" style="${isCompleted ? 'border: 2px solid #2e7d32' : ''}">
                <div class="card-img-wrapper"><img src="${data.image}" onerror="this.src='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'"></div>
                <div class="card-content">
                    <span class="card-category">${data.category} ${isCompleted ? '✅' : ''}</span>
                    <h3 class="card-title">${data.title}</h3>
                </div>
                <button class="add-btn">${isCompleted ? '✓' : '+'}</button>
            </div>
        `;
    }).join('');

    ui.grid.querySelectorAll('.training-card').forEach(card => {
        card.onclick = () => showModule(card.dataset.id);
    });
};

const showModule = (id) => {
    const data = state.courses[id];
    const isCompleted = state.currentUser.progress[id];
    const quiz = state.quizzes[id] || [];
    const ui = UI();
    const isAdmin = state.currentUser.isAdmin;

    ui.modalContainer.innerHTML = `
        <button class="close-modal" id="closeDetails">&times;</button>
        <div class="modal-banner"><img src="${data.image}"></div>
        <div class="modal-body">
            <h1 style="color:var(--dark)">${data.title}</h1>
            
            <div style="margin: 2rem 0; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-soft);">
                ${getMediaEmbed(data.videoUrl)}
            </div>

            
            ${isAdmin ? `
                <div class="safety-alert" style="background: #e3f2fd; border-color: #1976d2">
                    <span>💡</span>
                    <div style="color: #0d47a1">
                        <b>Modo Administrador</b>
                        Estás previsualizando el contenido. Las funciones de evaluación están deshabilitadas para administradores.
                    </div>
                </div>
            ` : `
                <div class="safety-alert">
                    <span>⚠️</span>
                    <div>
                        <b>Recordatorio Seishin</b>
                        Es obligatorio acreditar la evaluación técnica para tu expediente.
                    </div>
                </div>
            `}

            <div class="training-info-grid">
                <div class="info-section">
                    <h3>🛡️ EPP</h3>
                    <div class="info-list">${data.epp.map(e => `<li>${e}</li>`).join('')}</div>
                </div>
                <div class="info-section">
                    <h3>✅ Recomendaciones</h3>
                    <div class="info-list">${data.recommendations.map(r => `<li>${r}</li>`).join('')}</div>
                </div>
            </div>

            ${!isAdmin ? `
                <div class="quiz-container" id="quizArea">
                    ${!isCompleted ? `
                        <h3>🧠 Evaluación Técnica</h3>
                        ${quiz.map((q, idx) => `
                            <div class="question-card" data-idx="${idx}">
                                <p><b>${idx + 1}. ${q.q}</b></p>
                                <div class="options-grid">
                                    ${q.options.map((opt, optIdx) => `
                                        <button class="option-btn" onclick="window.selectOption(${idx}, ${optIdx}, this)">${opt}</button>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                        <button class="primary-btn" id="submitQuiz" style="background: var(--dark); margin-top: 1rem;">Finalizar y Acreditar</button>
                        <p id="quizError" style="color: var(--danger); margin-top: 1rem; display: none;">Error: Debes responder todo correctamente.</p>
                    ` : `
                        <div class="safety-alert" style="background: #e8f5e9; border-color: #2e7d32">
                            <span>✅</span><div style="color: #1b5e20"><b>Acreditado en Seishin</b></div>
                        </div>
                    `}
                </div>
            ` : ''}
        </div>
    `;

    ui.modalOverlay.style.display = 'flex';
    document.getElementById('closeDetails').onclick = () => ui.modalOverlay.style.display = 'none';
    
    const submitBtn = document.getElementById('submitQuiz');
    if (submitBtn) {
        submitBtn.onclick = () => {
            if (validateQuiz(id)) {
                accreditCourse(id);
                ui.modalOverlay.style.display = 'none';
            } else {
                document.getElementById('quizError').style.display = 'block';
            }
        };
    }
};

window.selectOption = (questionIdx, optionIdx, btn) => {
    btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.dataset.selected = optionIdx;
};

const validateQuiz = (courseId) => {
    const quiz = state.quizzes[courseId] || [];
    const questions = document.querySelectorAll('.question-card');
    let correctCount = 0;
    questions.forEach(card => {
        const selected = card.querySelector('.option-btn.selected');
        if (selected && parseInt(selected.dataset.selected) === quiz[card.dataset.idx].correct) correctCount++;
    });
    return (quiz.length > 0) ? (correctCount === quiz.length) : true;
};

const accreditCourse = (id) => {
    state.users[state.currentUser.username].progress[id] = true;
    state.currentUser.progress[id] = true;
    saveState();
    renderDashboard();
    alert('Acreditación guardada exitosamente.');
};

const renderUserTable = () => {
    const ui = UI();
    if (!ui.userTableBody) return;
    ui.userTableBody.innerHTML = Object.entries(state.users).map(([u, data]) => {
        if (data.isAdmin) return '';
        const completedCount = Object.keys(data.progress).length;
        return `
            <tr>
                <td><b>${u}</b></td>
                <td>${data.name}</td>
                <td>${data.role}</td>
                <td><span class="card-category" style="margin:0">${completedCount} cursos</span></td>
                <td>
                    <button class="action-btn-sm" onclick="window.editUser('${u}')">Editar</button>
                    <button class="action-btn-sm danger" onclick="window.deleteUser('${u}')">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
};

window.editUser = (u) => {
    const user = state.users[u];
    const newPass = prompt(`Nueva contraseña para ${u}:`, user.password);
    if (newPass) {
        state.users[u].password = newPass;
        saveState();
        renderUserTable();
        alert('Usuario actualizado.');
    }
};

window.deleteUser = (u) => {
    if (confirm(`¿Estás seguro de eliminar a ${u}?`)) {
        delete state.users[u];
        saveState();
        renderUserTable();
    }
};

const renderProfile = () => {
    const ui = UI();
    const user = state.currentUser;
    ui.profileName.textContent = user.name;
    ui.profileRole.textContent = user.role;
    const completed = Object.keys(user.progress).length;
    const total = Object.keys(state.courses).length;
    const perc = (completed / total) * 100;
    ui.progressFill.style.width = `${perc}%`;
    ui.progressText.textContent = `Acreditaciones: ${completed} de ${total}`;
};

const switchView = (viewId) => {
    const ui = UI();
    state.activeView = viewId;
    ui.views.forEach(v => v.classList.remove('active'));
    document.getElementById(`${viewId}View`).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.view === viewId);
    });
    if (viewId === 'profile') renderProfile();
    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'settings') {
        renderUserTable();
        document.getElementById('globalFormsLink').value = state.config.formsLink;
        document.getElementById('globalWelcomeMsg').value = state.config.welcomeMsg;
    }
};

const initApp = () => {
    const ui = UI();
    if (!state.currentUser) {
        ui.appBody.classList.add('not-logged-in');
        ui.authView.classList.remove('hidden');
        return;
    }
    ui.appBody.classList.remove('not-logged-in');
    ui.authView.classList.add('hidden');
    document.getElementById('navSettings').style.display = state.currentUser.isAdmin ? 'block' : 'none';
    switchView(state.activeView);
};

// --- EVENTS ---
// Mobile Menu Logic
const btnToggle = document.getElementById('mobileMenuToggle');
const btnClose = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');

if (btnToggle && btnClose && sidebar) {
    btnToggle.onclick = () => sidebar.classList.add('open');
    btnClose.onclick = () => sidebar.classList.remove('open');
}

document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (state.users[u] && state.users[u].password === p) {
        state.currentUser = { username: u, ...state.users[u] };
        saveState();
        initApp();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
};

document.querySelector('.nav-links').onclick = (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;
    e.preventDefault();
    if (link.id === 'logoutBtn') {
        localStorage.removeItem('currentUser');
        location.reload();
    } else {
        switchView(link.dataset.view);
        if (window.innerWidth <= 900) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }
};

// Search & Tabs
document.querySelector('.search-bar input').oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.training-card');
    cards.forEach(c => {
        const title = c.querySelector('.card-title').textContent.toLowerCase();
        c.style.display = title.includes(term) ? 'flex' : 'none';
    });
};

document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderDashboard(tab.textContent);
    };
});

// Admin Panel Events
document.getElementById('unlockAdmin').onclick = () => {
    if (document.getElementById('adminPass').value === 'admin123') {
        document.getElementById('adminLock').classList.add('hidden');
        document.getElementById('adminContent').classList.remove('hidden');
        renderUserTable();
    } else {
        alert('Credencial incorrecta.');
    }
};

document.getElementById('addUserForm').onsubmit = (e) => {
    e.preventDefault();
    const u = document.getElementById('newUsername').value;
    if (state.users[u]) {
        alert('❌ Error: Este ID de usuario ya existe en el sistema.');
        return;
    }
    state.users[u] = {
        name: document.getElementById('newName').value,
        role: document.getElementById('newRole').value,
        password: document.getElementById('newPassword').value,
        isAdmin: false,
        progress: {}
    };
    saveState();
    renderUserTable();
    e.target.reset();
    alert('✅ Usuario dado de alta exitosamente en Seishin.');
};

document.getElementById('globalConfigForm').onsubmit = (e) => {
    e.preventDefault();
    state.config.formsLink = document.getElementById('globalFormsLink').value;
    state.config.welcomeMsg = document.getElementById('globalWelcomeMsg').value;
    saveState();
    alert('Configuración guardada.');
};

// Upload Simulation
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const uploadStatus = document.getElementById('uploadStatus');

dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2.5 * 1024 * 1024) {
            alert('Atención: El archivo supera los 2.5MB. En este prototipo sin servidor, es posible que el multimedia se borre al actualizar la página por límites del navegador.');
            state.lastUploadedUrl = URL.createObjectURL(file);
            uploadStatus.innerHTML = `⚠️ Temporizado: <b>${file.name}</b>`;
            uploadStatus.style.color = '#f57c00';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            state.lastUploadedUrl = event.target.result;
            uploadStatus.innerHTML = `✅ Procesado y Guardado: <b>${file.name}</b>`;
            uploadStatus.style.color = '#2e7d32';
        };
        reader.readAsDataURL(file);
    }
};

document.getElementById('courseForm').onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('courseTitle').value;
    const mediaUrl = document.getElementById('courseVideo').value;
    const id = title.toLowerCase().replace(/\s/g, '_');
    
    state.courses[id] = {
        title: title,
        category: "SEGURIDAD",
        videoUrl: state.lastUploadedUrl || mediaUrl,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        modules: 1, epp: ["Protección Industrial"], recommendations: ["Reglamento Seishin"], innovation: "Módulo Personalizado"
    };
    
    // Guardar la pregunta técnica en el estado
    state.quizzes[id] = [
        {
            q: document.getElementById('courseQuestion').value,
            options: [
                document.getElementById('courseOpt0').value,
                document.getElementById('courseOpt1').value,
                document.getElementById('courseOpt2').value
            ],
            correct: 2 // La opción ingresada en courseOpt2 siempre será la correcta en el formualrio nuevo
        }
    ];
    
    saveState();
    state.lastUploadedUrl = '';
    uploadStatus.innerHTML = 'Haz clic o arrastra un archivo local';
    uploadStatus.style.color = '';
    alert('¡Módulo añadido con éxito!');
    e.target.reset(); // Limpiar el formulario
    switchView('dashboard');
};

initApp();
