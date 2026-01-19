/* ============================================
   CANVAS-BASED CYBERPUNK CURSOR SYSTEM
   Premium high-contrast cursor with guaranteed visibility
   ============================================ */

(function () {
    'use strict';

    // ===== DEVICE DETECTION =====
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsHover || prefersReducedMotion) {
        console.log('⚠️ Cursor disabled (touch device or reduced motion preference)');
        return;
    }

    // ===== CANVAS SETUP =====
    // Main canvas (difference blend for contrast)
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });

    // Glow canvas (screen blend for additive glow)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.id = 'cursor-canvas-glow';
    document.body.appendChild(glowCanvas);
    const glowCtx = glowCanvas.getContext('2d', { alpha: true });

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        glowCanvas.width = canvas.width;
        glowCanvas.height = canvas.height;
        glowCanvas.style.width = canvas.style.width;
        glowCanvas.style.height = canvas.style.height;

        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        glowCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ===== CURSOR STATE =====
    const cursor = {
        // Position
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,

        // Ring animation
        ringX: window.innerWidth / 2,
        ringY: window.innerHeight / 2,
        ringScale: 1,
        targetRingScale: 1,

        // Outer ring
        outerRingX: window.innerWidth / 2,
        outerRingY: window.innerHeight / 2,
        outerRingScale: 1,

        // State flags
        isHovering: false,
        isClicking: false,

        // Animation
        rotation: 0,
        pulsePhase: 0,

        // Velocity for trail
        velocityX: 0,
        velocityY: 0,
    };

    // ===== PARTICLE SYSTEM =====
    const particles = [];
    const maxParticles = 20;

    class Particle {
        constructor(x, y, vx, vy, life = 1, isBurst = false) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.life = life;
            this.maxLife = life;
            this.size = isBurst ? 4 : 2;
            this.isBurst = isBurst;
        }

        update(delta) {
            this.x += this.vx * delta;
            this.y += this.vy * delta;
            this.life -= delta;
            this.vx *= 0.98; // Friction
            this.vy *= 0.98;
        }

        draw(context) {
            const alpha = Math.max(0, this.life / this.maxLife);
            const size = this.size * (this.isBurst ? alpha : 1);

            context.fillStyle = `rgba(0, 255, 255, ${alpha * 0.8})`;
            context.beginPath();
            context.arc(this.x, this.y, size, 0, Math.PI * 2);
            context.fill();

            // Glow
            context.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
            context.beginPath();
            context.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
            context.fill();
        }

        isDead() {
            return this.life <= 0;
        }
    }

    // ===== SHOCKWAVE SYSTEM =====
    const shockwaves = [];

    class Shockwave {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = 80;
            this.life = 1;
        }

        update(delta) {
            this.radius += 300 * delta;
            this.life -= delta * 1.5;
        }

        draw(context) {
            const alpha = Math.max(0, this.life);

            // Outer ring
            context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            context.lineWidth = 3;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();

            // Inner glow
            context.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.4})`;
            context.lineWidth = 1;
            context.beginPath();
            context.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
            context.stroke();
        }

        isDead() {
            return this.life <= 0 || this.radius > this.maxRadius;
        }
    }

    // ===== MOUSE TRACKING =====
    let lastMoveTime = Date.now();

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const delta = (now - lastMoveTime) / 1000;
        lastMoveTime = now;

        const prevX = cursor.targetX;
        const prevY = cursor.targetY;

        cursor.targetX = e.clientX;
        cursor.targetY = e.clientY;

        // Calculate velocity
        cursor.velocityX = (cursor.targetX - prevX) / delta;
        cursor.velocityY = (cursor.targetY - prevY) / delta;

        // Create trail particles based on speed
        const speed = Math.sqrt(cursor.velocityX ** 2 + cursor.velocityY ** 2);
        if (speed > 100 && particles.length < maxParticles) {
            particles.push(new Particle(
                cursor.x,
                cursor.y,
                -cursor.velocityX * 0.02 + (Math.random() - 0.5) * 20,
                -cursor.velocityY * 0.02 + (Math.random() - 0.5) * 20,
                0.5
            ));
        }
    });

    // ===== HOVER DETECTION =====
    const interactiveSelectors = [
        'a', 'button', 'input', 'textarea', 'select',
        '[role="button"]', '[onclick]', '[href]',
        '.btn-primary', '.nav-link', '.theme-card',
        '.prize-card', '.announcement-card', '.gallery-item',
        '.testimonial-card', '.timeline-item'
    ].join(', ');

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.isHovering = true;
            cursor.targetRingScale = 1.5;
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.isHovering = false;
            cursor.targetRingScale = 1;
        }
    });

    // ===== CLICK DETECTION =====
    document.addEventListener('mousedown', () => {
        cursor.isClicking = true;

        // Create shockwave
        shockwaves.push(new Shockwave(cursor.x, cursor.y));

        // Create burst particles
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const speed = 100 + Math.random() * 100;
            particles.push(new Particle(
                cursor.x,
                cursor.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0.6,
                true
            ));
        }
    });

    document.addEventListener('mouseup', () => {
        cursor.isClicking = false;
    });

    // ===== ANIMATION LOOP =====
    let lastTime = performance.now();

    function animate(currentTime) {
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap delta
        lastTime = currentTime;

        // Clear canvases
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        glowCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

        // Update cursor position with smooth lerp
        const coreEase = 0.2;
        const ringEase = 0.12;
        const outerRingEase = 0.08;

        cursor.x += (cursor.targetX - cursor.x) * coreEase;
        cursor.y += (cursor.targetY - cursor.y) * coreEase;

        cursor.ringX += (cursor.targetX - cursor.ringX) * ringEase;
        cursor.ringY += (cursor.targetY - cursor.ringY) * ringEase;

        cursor.outerRingX += (cursor.targetX - cursor.outerRingX) * outerRingEase;
        cursor.outerRingY += (cursor.targetY - cursor.outerRingY) * outerRingEase;

        // Update ring scale
        cursor.ringScale += (cursor.targetRingScale - cursor.ringScale) * 0.15;
        cursor.outerRingScale = cursor.ringScale * 0.9;

        // Update rotation and pulse
        cursor.rotation += delta * 1.5;
        cursor.pulsePhase += delta * 3;

        // === DRAW OUTER RING (on glow canvas) ===
        const outerRingSize = 35 * cursor.outerRingScale;
        const outerPulse = Math.sin(cursor.pulsePhase) * 0.15 + 0.85;

        glowCtx.strokeStyle = `rgba(0, 217, 255, ${0.6 * outerPulse})`;
        glowCtx.lineWidth = 2;
        glowCtx.beginPath();
        glowCtx.arc(cursor.outerRingX, cursor.outerRingY, outerRingSize, 0, Math.PI * 2);
        glowCtx.stroke();

        // Outer ring glow
        glowCtx.shadowBlur = 20;
        glowCtx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        glowCtx.strokeStyle = `rgba(0, 255, 255, ${0.3 * outerPulse})`;
        glowCtx.lineWidth = 1;
        glowCtx.beginPath();
        glowCtx.arc(cursor.outerRingX, cursor.outerRingY, outerRingSize + 5, 0, Math.PI * 2);
        glowCtx.stroke();
        glowCtx.shadowBlur = 0;

        // === DRAW MAIN RING (on main canvas) ===
        const ringSize = 22 * cursor.ringScale;
        const pulse = Math.sin(cursor.pulsePhase * 1.5) * 0.2 + 0.8;

        // Draw animated segments
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        const segments = cursor.isHovering ? 8 : 4;
        const segmentLength = (Math.PI * 2) / segments / 2;

        for (let i = 0; i < segments; i++) {
            const angle = (Math.PI * 2 * i) / segments + cursor.rotation;
            ctx.beginPath();
            ctx.arc(
                cursor.ringX,
                cursor.ringY,
                ringSize,
                angle,
                angle + segmentLength * pulse
            );
            ctx.stroke();
        }

        // Ring glow on glow canvas
        glowCtx.strokeStyle = `rgba(0, 255, 255, 0.6)`;
        glowCtx.lineWidth = 3;
        glowCtx.shadowBlur = 15;
        glowCtx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        glowCtx.beginPath();
        glowCtx.arc(cursor.ringX, cursor.ringY, ringSize, 0, Math.PI * 2);
        glowCtx.stroke();
        glowCtx.shadowBlur = 0;

        // === DRAW CENTER DOT (high contrast nucleus) ===
        const coreSize = cursor.isClicking ? 8 : (cursor.isHovering ? 5 : 6);

        // White outer core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, coreSize, 0, Math.PI * 2);
        ctx.fill();

        // Black inner core
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, coreSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Cyan accent
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, coreSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Core glow
        glowCtx.fillStyle = 'rgba(0, 255, 255, 0.6)';
        glowCtx.shadowBlur = 20;
        glowCtx.shadowColor = 'rgba(0, 255, 255, 1)';
        glowCtx.beginPath();
        glowCtx.arc(cursor.x, cursor.y, coreSize * 1.5, 0, Math.PI * 2);
        glowCtx.fill();
        glowCtx.shadowBlur = 0;

        // === UPDATE & DRAW PARTICLES ===
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update(delta);

            if (particle.isDead()) {
                particles.splice(i, 1);
            } else {
                particle.draw(glowCtx);
            }
        }

        // === UPDATE & DRAW SHOCKWAVES ===
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const wave = shockwaves[i];
            wave.update(delta);

            if (wave.isDead()) {
                shockwaves.splice(i, 1);
            } else {
                wave.draw(ctx);
                wave.draw(glowCtx);
            }
        }

        // === DRAW TRAIL LINE ===
        const trailLength = 5;
        const dx = cursor.x - cursor.ringX;
        const dy = cursor.y - cursor.ringY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 2) {
            glowCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            glowCtx.lineWidth = 2;
            glowCtx.lineCap = 'round';
            glowCtx.beginPath();
            glowCtx.moveTo(cursor.x, cursor.y);
            glowCtx.lineTo(cursor.ringX, cursor.ringY);
            glowCtx.stroke();
        }

        // Continue animation
        requestAnimationFrame(animate);
    }

    // ===== START ANIMATION =====
    requestAnimationFrame(animate);

    // ===== VISIBILITY MANAGEMENT =====
    document.addEventListener('mouseleave', () => {
        canvas.style.opacity = '0';
        glowCanvas.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        canvas.style.opacity = '0.95';
        glowCanvas.style.opacity = '0.85';
    });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            canvas.style.display = 'none';
            glowCanvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
            glowCanvas.style.display = 'block';
        }
    });

    console.log('🎯 Canvas-based cyberpunk cursor initialized');
    console.log('✨ Features: Dual-layer rendering, high-contrast nucleus, particle system, shockwaves');
})();
