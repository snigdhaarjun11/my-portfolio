// Custom Cursor and Cursor Magnetism Engine
const cursor = document.getElementById('custom-cursor');
const spotlight = document.getElementById('spotlight');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (cursor) {
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    }

    if (spotlight) {
        spotlight.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(157, 78, 221, 0.08), transparent 80%)`;
    }
});

document.querySelectorAll('[data-cursor]').forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.classList.add('active');
            cursor.innerText = element.getAttribute('data-cursor');
        }
    });
    element.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.classList.remove('active');
            cursor.innerText = '';
        }
    });
});

// 3D Tilt Effect on Dynamic Nodes
document.querySelectorAll('.tilt-node').forEach(node => {
    node.addEventListener('mousemove', (e) => {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        node.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-5px)`;
    });

    node.addEventListener('mouseleave', () => {
        node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// Time-Based Atmospheric Theme Integration
async function applyTimeTheme() {
    try {
        const res = await fetch('/api/theme');
        const data = await res.json();
        document.body.className = data.theme;
    } catch (err) {
        const hour = new Date().getHours();
        let theme = "night";
        if (hour >= 5 && hour < 12) theme = "morning";
        else if (hour >= 12 && hour < 17) theme = "afternoon";
        else if (hour >= 17 && hour < 21) theme = "evening";
        document.body.className = theme;
    }
}
applyTimeTheme();

// Terminal Inspector Modal Content
const modalData = {
    edu: "> ACADEMIC PROFILE:\n- High School & Pre-Medical Foundations\n- Focus: Molecular Biology, Human Physiology & Health Sciences",
    cert: "> CERTIFICATION REGISTRY:\n- Cancer Genomics & Target Therapies Module\n- Fine Arts & Classical Human Anatomy Graphite Studies",
    bio: "> PROFILE SYSTEM:\n- Name: Snigdha Adhikari\n- Focus: Intersections of Oncology Research, Writing, Fine Art, and Code"
};

function openModal(key) {
    const display = document.getElementById('desktop-display');
    if (display) {
        display.innerHTML = `<p class="typing-text">${modalData[key] || '> File unavailable.'}</p>`;
    }
}

// Interactive Local Storage Artwork Gallery Manager
function setupArtGallery(inputId, gridId, storageKey) {
    const input = document.getElementById(inputId);
    const grid = document.getElementById(gridId);

    if (!grid) return;

    // Load previously saved images from LocalStorage
    const savedArt = JSON.parse(localStorage.getItem(storageKey) || '[]');
    savedArt.forEach(item => renderArtCard(grid, item.src, item.name));

    if (input) {
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgSrc = event.target.result;
                    renderArtCard(grid, imgSrc, file.name);

                    // Save to local storage
                    const currentArt = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    currentArt.push({ src: imgSrc, name: file.name });
                    localStorage.setItem(storageKey, JSON.stringify(currentArt));
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

function renderArtCard(grid, src, title) {
    const card = document.createElement('div');
    card.className = 'art-card tilt-node page-transition';
    card.setAttribute('data-cursor', 'VIEW');

    card.innerHTML = `
        <div class="art-wrapper">
            <img src="${src}" alt="${title}" class="art-img">
        </div>
        <div class="art-caption">
            <h3>${title.split('.')[0]}</h3>
            <p>Artwork Vault Record</p>
        </div>
    `;

    // Dynamic Cursor Binding
    card.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.classList.add('active');
            cursor.innerText = 'VIEW';
        }
    });
    card.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.classList.remove('active');
            cursor.innerText = '';
        }
    });

    grid.prepend(card);
}

setupArtGallery('art-uploader-1', 'gallery-grid-1', 'artVaultStage1');
setupArtGallery('art-uploader-2', 'gallery-grid-2', 'artVaultStage2');

// Interactive Particle Engine with Mouse Gravity
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x > canvas.width || this.x < 0) this.vx *= -1;
            if (this.y > canvas.height || this.y < 0) this.vy *= -1;

            // Interactive mouse repulsion
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 5;
                    this.y -= (dy / distance) * force * 5;
                }
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 70; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}