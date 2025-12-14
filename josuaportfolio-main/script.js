document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');

    const hasGSAP = typeof gsap !== 'undefined' && gsap;
    const hasIO = typeof IntersectionObserver !== 'undefined';

    // Safe helper to parse delay values
    const parseDelay = (v) => {
        const n = parseFloat(v ?? '0');
        return Number.isFinite(n) ? n : 0;
    };

    // If GSAP isn't available, reveal elements without animation
    if (!hasGSAP) {
        console.warn('GSAP not found — animations disabled. Elements will be revealed without animation.');
        document.querySelectorAll('.reveal-content').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // Basic animation function using GSAP (guarded)
    const animateElement = (element, delay = 0) => {
        const d = parseDelay(delay);
        if (!element) return;
        if (!hasGSAP) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
        }
        try {
            gsap.set(element, { opacity: 0, y: 30 });
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: d,
                ease: 'power2.out'
            });
        } catch (err) {
            console.error('GSAP animation error:', err);
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    };

    // Intersection observer wrapper (if available)
    if (hasIO) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset?.delay ?? 0;
                    animateElement(entry.target, parseDelay(delay));
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-content').forEach(el => observer.observe(el));
    } else {
        console.warn('IntersectionObserver not supported — revealing all .reveal-content immediately.');
        document.querySelectorAll('.reveal-content').forEach((el, i) => animateElement(el, i * 0.1));
    }

    // Navigation scroll effect
    const nav = document.querySelector('.nav-container');
    if (nav) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav?.offsetHeight || 60;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Pause tech scroll animation on hover
    const techScroll = document.querySelector('.tech-scroll');
    if (techScroll) {
        techScroll.addEventListener('mouseenter', () => {
            techScroll.style.animationPlayState = 'paused';
        });
        techScroll.addEventListener('mouseleave', () => {
            techScroll.style.animationPlayState = 'running';
        });
    }

    // Add stagger animation to project cards
    if (hasIO) {
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    projectObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            projectObserver.observe(card);
        });
    }
});
