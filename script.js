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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about-text');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Project details modal functionality
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalLoading = document.getElementById('modal-loading');
const modalContent = document.getElementById('modal-project-content');
const closeBtn = document.querySelector('.close');

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
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                <p>Unable to load project details. Please visit the GitHub repository directly.</p>
                <a href="https://github.com/vamkotss/${repoName}" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fab fa-github"></i> View on GitHub
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
        <div class="project-info">
            <p><strong>Description:</strong> ${repoData.description || 'No description available'}</p>
            <p><strong>Language:</strong> ${repoData.language || 'Not specified'}</p>
            <p><strong>Created:</strong> ${new Date(repoData.created_at).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> ${new Date(repoData.updated_at).toLocaleDateString()}</p>
            ${repoData.topics && repoData.topics.length > 0 ? `
                <p><strong>Topics:</strong> ${repoData.topics.map(topic => `<span class="tag">${topic}</span>`).join(' ')}</p>
            ` : ''}
        </div>
    `;
    
    if (readmeContent) {
        content += `
            <h3>Project Details</h3>
            <div class="readme-content">
                ${formatReadmeContent(readmeContent)}
            </div>
        `;
    }
    
    content += `
        <div style="margin-top: 2rem; text-align: center;">
            <a href="${repoData.html_url}" target="_blank" class="btn btn-primary">
                <i class="fab fa-github"></i> View Full Repository
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
        .replace(/^# (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h5>$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// Event listeners for project details
document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', (e) => {
        const repoName = e.target.closest('.project-card').dataset.repo;
        modal.style.display = 'block';
        fetchProjectDetails(repoName);
    });
});

// Close modal events
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Resume download functionality
document.getElementById('download-resume').addEventListener('click', (e) => {
    e.preventDefault();
    // You can replace this with an actual resume file
    alert('Resume download functionality would be implemented here. Please add your resume file to the project and update this link.');
});

// Add some interactive particles to hero section
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(255, 255, 255, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.pointerEvents = 'none';
    particle.style.animation = `floatUp ${Math.random() * 3 + 2}s linear forwards`;
    
    document.querySelector('.floating-particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

// Add active class styles
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: #4f46e5 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeStyle);