// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
});

// Gestion du scroll pour le header
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Animation des statistiques
const statNumbers = document.querySelectorAll('.stat-number');
let animated = false;

function animateStats() {
    if (animated) return;
    animated = true;
    
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateStat = () => {
            current += increment;
            if (current < target) {
                stat.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
            }
        };
        updateStat();
    });
}

// Observer pour les statistiques
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// Gestion du formulaire de livraison
const deliveryForm = document.getElementById('delivery-form');

deliveryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        deliveryAddress: formData.get('delivery-address'),
        weight: formData.get('weight'),
        service: formData.get('service'),
        notes: formData.get('notes')
    };
    
    // Validation
    if (!data.name || !data.phone || !data.address || !data.deliveryAddress || !data.weight || !data.service) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Simulation d'envoi
    const trackingNumber = 'EXG-' + Date.now().toString().slice(-6);
    
    const confirmationMessage = `
✅ Commande confirmée !

📦 Numéro de suivi: ${trackingNumber}
👤 Client: ${data.name}
📱 Téléphone: ${data.phone}
📍 Retrait: ${data.address}
🏠 Livraison: ${data.deliveryAddress}
⚖️ Poids: ${data.weight} kg
🚚 Service: ${data.service === 'express' ? 'Express 2h' : data.service === 'standard' ? 'Standard' : 'Programmée'}
📝 Instructions: ${data.notes || 'Aucune'}

⏱️ Un livreur sera chez vous dans les plus brefs délais.
    `;
    
    alert(confirmationMessage);
    this.reset();
});

// Suivi de colis
const trackBtn = document.getElementById('track-btn');
const trackingInput = document.getElementById('tracking-number');
const trackingResult = document.getElementById('tracking-result');

const trackingStatuses = [
    { status: 'Colis en préparation', icon: '📦', color: '#FFB800' },
    { status: 'Colis pris en charge', icon: '🤝', color: '#0984E3' },
    { status: 'En cours de livraison', icon: '🚚', color: '#FF6B35' },
    { status: 'Arrivé au centre de tri', icon: '🏢', color: '#6C5CE7' },
    { status: 'Livré avec succès', icon: '✅', color: '#00B894' }
];

trackBtn.addEventListener('click', function() {
    const trackingNumber = trackingInput.value.trim();
    
    if (!trackingNumber) {
        trackingResult.innerHTML = `
            <div class="tracking-error" style="text-align:center;color:#E74C3C;padding:1rem;">
                <i class="fas fa-exclamation-circle" style="font-size:2rem;"></i>
                <p>⚠️ Veuillez entrer un numéro de suivi valide.</p>
            </div>
        `;
        return;
    }
    
    // Simulation de progression
    const randomStatus = trackingStatuses[Math.floor(Math.random() * trackingStatuses.length)];
    const progress = Math.floor(Math.random() * 100);
    
    trackingResult.innerHTML = `
        <div style="padding:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <div>
                    <h3 style="color:var(--text-dark);">${randomStatus.icon} ${randomStatus.status}</h3>
                    <p style="color:var(--text-light);font-size:0.9rem;">Numéro: ${trackingNumber}</p>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:1.5rem;font-weight:800;color:var(--primary-color);">${progress}%</span>
                    <p style="color:var(--text-light);font-size:0.8rem;">${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div style="width:100%;height:8px;background:#E8ECF0;border-radius:10px;overflow:hidden;">
                <div style="width:${progress}%;height:100%;background:var(--gradient);transition:width 0.5s;"></div>
            </div>
            <div style="margin-top:1.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1rem;">
                ${trackingStatuses.map((s, index) => `
                    <div style="text-align:center;opacity:${index <= Math.floor(progress / 20) ? 1 : 0.4};">
                        <div style="font-size:1.5rem;">${s.icon}</div>
                        <div style="font-size:0.7rem;color:var(--text-light);">${s.status}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
});

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Fermer le menu mobile
            navLinks.classList.remove('active');
            authButtons.classList.remove('active');
        }
    });
});

// Gestion de la connexion
document.querySelector('.btn-login').addEventListener('click', function() {
    const email = prompt('📧 Entrez votre email:');
    if (email) {
        alert(`✅ Connexion réussie !\nBienvenue ${email}`);
    }
});

document.querySelector('.btn-signup').addEventListener('click', function() {
    alert('📝 Formulaire d\'inscription\nVeuillez remplir vos informations pour créer un compte.');
});

// Animation des cartes au scroll
const cards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    cardObserver.observe(card);
});

// Gestion des boutons de service
document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const serviceName = this.closest('.service-card').querySelector('h3').textContent;
        alert(`✅ Vous avez choisi le service "${serviceName}"\nVeuillez remplir le formulaire de livraison pour finaliser votre commande.`);
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
});

// Gestion des boutons de tarifs
document.querySelectorAll('.pricing-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        const planName = this.closest('.pricing-card').querySelector('h3').textContent;
        alert(`✅ Vous avez choisi l'offre "${planName}"\nVeuillez remplir le formulaire de livraison pour finaliser votre commande.`);
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
});

// Effet de parallaxe sur le hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

console.log('🚀 ExpressGo - Site de livraison chargé avec succès !');
console.log('📦 Prêt à livrer vos colis en un rien de temps !');