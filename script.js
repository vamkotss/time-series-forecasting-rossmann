// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about-card, .contact-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Initialize particles
    initializeParticles();
    
    // Initialize skill hover effects
    initializeSkillEffects();
});

// Particle system for hero section
function initializeParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(37, 99, 235, ${Math.random() * 0.5 + 0.1})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `floatUp ${Math.random() * 3 + 2}s linear forwards`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 5000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Skill items hover effects
function initializeSkillEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Project modal functionality
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalLoading = document.querySelector('.modal-loading');
const modalContent = document.getElementById('modal-project-content');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

// GitHub API integration
async function fetchProjectDetails(repoName) {
    try {
        modalLoading.style.display = 'block';
        modalContent.style.display = 'none';
        
        const username = 'vamkotss';
        const [repoResponse, readmeResponse] = await Promise.all([
            fetch(`https://api.github.com/repos/${username}/${repoName}`),
            fetch(`https://api.github.com/repos/${username}/${repoName}/readme`)
        ]);
        
        if (!repoResponse.ok) {
            throw new Error('Repository not found');
        }
        
        const repoData = await repoResponse.json();
        let readmeContent = '';
        
        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            readmeContent = atob(readmeData.content);
        }
        
        displayProjectDetails(repoData, readmeContent);
        
    } catch (error) {
        console.error('Error fetching project details:', error);
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #64748b;">
                <div style="font-size: 3rem; margin-bottom: 1rem; color: #f59e0b;">⚠️</div>
                <h3 style="color: #334155; margin-bottom: 1rem;">Unable to load project details</h3>
                <p style="margin-bottom: 2rem;">There was an issue connecting to GitHub. Please visit the repository directly.</p>
                <a href="https://github.com/vamkotss/${repoName}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-github"></i>
                    <span>View on GitHub</span>
                </a>
            </div>
        `;
        modalLoading.style.display = 'none';
        modalContent.style.display = 'block';
    }
}

function displayProjectDetails(repoData, readmeContent) {
    modalTitle.textContent = repoData.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let content = `
        <div class="project-info" style="background: rgba(37, 99, 235, 0.05); padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div>
                    <strong style="color: #334155;">Description:</strong>
                    <p style="margin-top: 0.5rem; color: #64748b;">${repoData.description || 'No description available'}</p>
                </div>
                <div>
                    <strong style="color: #334155;">Language:</strong>
                    <p style="margin-top: 0.5rem; color: #64748b;">${repoData.language || 'Not specified'}</p>
                </div>
                <div>
                    <strong style="color: #334155;">Created:</strong>
                    <p style="margin-top: 0.5rem; color: #64748b;">${new Date(repoData.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                    <strong style="color: #334155;">Last Updated:</strong>
                    <p style="margin-top: 0.5rem; color: #64748b;">${new Date(repoData.updated_at).toLocaleDateString()}</p>
                </div>
            </div>
            ${repoData.topics && repoData.topics.length > 0 ? `
                <div style="margin-top: 1rem;">
                    <strong style="color: #334155;">Topics:</strong>
                    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${repoData.topics.map(topic => `<span class="tag">${topic}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    if (readmeContent) {
        content += `
            <h3 style="color: #334155; margin-bottom: 1rem; font-size: 1.3rem;">Project Details</h3>
            <div class="readme-content">
                ${formatReadmeContent(readmeContent)}
            </div>
        `;
    }
    
    content += `
        <div style="margin-top: 2rem; text-align: center; padding-top: 2rem; border-top: 1px solid rgba(37, 99, 235, 0.1);">
            <a href="${repoData.html_url}" target="_blank" class="btn btn-primary">
                <i class="fab fa-github"></i>
                <span>View Full Repository</span>
            </a>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modalLoading.style.display = 'none';
    modalContent.style.display = 'block';
}

function formatReadmeContent(content) {
    // Simple markdown-like formatting
    return content
        .replace(/^# (.*$)/gim, '<h3 style="color: #334155; margin: 1.5rem 0 1rem; font-size: 1.3rem;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h4 style="color: #334155; margin: 1.2rem 0 0.8rem; font-size: 1.1rem;">$1</h4>')
        .replace(/^### (.*$)/gim, '<h5 style="color: #334155; margin: 1rem 0 0.5rem; font-size: 1rem;">$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #334155;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; color: #2563eb; font-size: 0.9rem;">$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre style="background: #f1f5f9; padding: 1rem; border-radius: 12px; overflow-x: auto; margin: 1rem 0; border-left: 4px solid #2563eb;"><code style="font-family: monospace;">$1</code></pre>')
        .replace(/\n\n/g, '</p><p style="color: #64748b; margin-bottom: 1rem; line-height: 1.6;">')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p style="color: #64748b; margin-bottom: 1rem; line-height: 1.6;">')
        .replace(/$/, '</p>');
}

// Event listeners for project details
document.querySelectorAll('.details-link').forEach(button => {
    button.addEventListener('click', (e) => {
        const repoName = e.target.closest('.project-card').dataset.repo;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        fetchProjectDetails(repoName);
    });
});

// Close modal events
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Resume download functionality
document.getElementById('download-resume').addEventListener('click', (e) => {
    e.preventDefault();
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-info-circle"></i>
            <span>Resume download will be available soon!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
});

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Add mobile menu styles
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: right 0.3s ease;
            border-top: 1px solid rgba(37, 99, 235, 0.1);
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add smooth reveal animation for sections
const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize all interactive elements
    console.log('Portfolio website initialized successfully! 🚀');
});