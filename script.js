/**
 * CyberPXE - High-Converting Landing Page Scripts
 * Interactive ROI Calculator, Video Step Player, and FAQ Accordion
 */

document.addEventListener("DOMContentLoaded", () => {
    initCalculator();
    initVideoPlayer();
    initFAQ();
    initTerminalFeedSimulation();
});

/* ==========================================================================
   1. Interactive ROI & Profit Calculator
   ========================================================================== */
function initCalculator() {
    const rangePCs = document.getElementById("range-pcs");
    const rangePrice = document.getElementById("range-price");
    const rangeTime = document.getElementById("range-time");

    const dispPCs = document.getElementById("disp-pcs");
    const dispPrice = document.getElementById("disp-price");
    const dispTime = document.getElementById("disp-time");

    const resHours = document.getElementById("res-hours");
    const resExtraMoney = document.getElementById("res-extra-money");
    const resPayback = document.getElementById("res-payback");

    if (!rangePCs || !rangePrice || !rangeTime) return;

    function updateCalculations(animate = false) {
        const pcs = parseInt(rangePCs.value, 10);
        const price = parseInt(rangePrice.value, 10);
        const timePerPC = parseInt(rangeTime.value, 10);

        dispPCs.innerText = `${pcs} PCs`;
        dispPrice.innerText = `R$ ${price}`;
        dispTime.innerText = `${timePerPC} minutos`;

        const oldTotalMinutes = pcs * timePerPC;
        const newBatchMinutes = Math.ceil(pcs / 8) * 45;
        const minutesSaved = Math.max(0, oldTotalMinutes - newBatchMinutes);
        const hoursSaved = Math.round(minutesSaved / 60);

        const extraRevenue = Math.round((hoursSaved / (timePerPC / 60)) * (price * 0.5));
        const formatationsToPay = Math.ceil(247 / price);

        resHours.innerText = `${hoursSaved} Horas`;
        resExtraMoney.innerText = `R$ ${extraRevenue.toLocaleString('pt-BR')}`;
        resPayback.innerText = `${formatationsToPay} FORMATAÇÕES`;

        if (animate) {
            ["box-res-hours", "box-res-money", "box-res-payback"].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove("sim-flash");
                    void el.offsetWidth;
                    el.classList.add("sim-flash");
                }
            });
        }
    }

    rangePCs.addEventListener("input", () => updateCalculations(false));
    rangePrice.addEventListener("input", () => updateCalculations(false));
    rangeTime.addEventListener("input", () => updateCalculations(false));

    window.setSimPreset = function(pcs, price, time, btnEl) {
        rangePCs.value = pcs;
        rangePrice.value = price;
        rangeTime.value = time;
        document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        updateCalculations(true);
    };

    window.recalcSimulation = function() {
        updateCalculations(true);
    };

    updateCalculations(false);
}

/* ==========================================================================
   2. Interactive Video / Step-by-Step Presentation Player
   ========================================================================== */
function initVideoPlayer() {
    const slides = document.querySelectorAll(".video-slide");
    const progressFill = document.getElementById("video-progress-fill");
    const btnPrev = document.getElementById("btn-prev-step");
    const btnNext = document.getElementById("btn-next-step");
    const btnTogglePlay = document.getElementById("btn-toggle-play");

    if (!slides.length) return;

    let currentStep = 0;
    let autoPlayInterval = null;
    let isPlaying = true;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        currentStep = (index + slides.length) % slides.length;
        slides[currentStep].classList.add("active");

        if (progressFill) {
            const pct = ((currentStep + 1) / slides.length) * 100;
            progressFill.style.width = `${pct}%`;
        }
    }

    function nextSlide() {
        showSlide(currentStep + 1);
    }

    function prevSlide() {
        showSlide(currentStep - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
        isPlaying = true;
        if (btnTogglePlay) btnTogglePlay.innerText = "⏸ Pausar Apresentação";
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        isPlaying = false;
        if (btnTogglePlay) btnTogglePlay.innerText = "▶ Reproduzir Apresentação";
    }

    if (btnNext) btnNext.addEventListener("click", () => { nextSlide(); stopAutoPlay(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { prevSlide(); stopAutoPlay(); });
    if (btnTogglePlay) {
        btnTogglePlay.addEventListener("click", () => {
            if (isPlaying) stopAutoPlay();
            else startAutoPlay();
        });
    }

    startAutoPlay();
}

/* ==========================================================================
   3. FAQ Accordion
   ========================================================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });
}

/* ==========================================================================
   4. Hero Terminal Feed Dynamic Simulation
   ========================================================================== */
function initTerminalFeedSimulation() {
    const termBody = document.getElementById("hero-term-feed");
    const statActive = document.getElementById("stat-active-pcs");
    if (!termBody) return;

    const mockEvents = [
        { cls: "green", text: "[DHCP] Cliente Lenovo ThinkPad conectou -> IP: 192.168.15.112 | Entregando menu.ipxe" },
        { cls: "cyan", text: "[HTTP] Transferindo wimboot e boot.sdi para 192.168.15.112 (Velocidade: 980 Mbps)" },
        { cls: "yellow", text: "[iPXE] Selecionado no menu: [WinPE] Sergei_Strelec_2026_x64.wim" },
        { cls: "green", text: "[SUCCESS] Windows 11 Bypass Unattend aplicado com sucesso no MAC 70:85:C2:AA:BB:CC" },
        { cls: "cyan", text: "[NET] Nova maquina detectada na bancada (Porta Switch #7) -> Autenticado" },
        { cls: "yellow", text: "[TFTP] ipxe-x64.efi enviado com sucesso (0.3s) para placa-mãe ASUS TUF B550" }
    ];

    let count = 14;
    setInterval(() => {
        const randomEv = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        const timeStr = new Date().toLocaleTimeString('pt-BR');
        const newLine = document.createElement("div");
        newLine.className = `term-line ${randomEv.cls}`;
        newLine.innerText = `[${timeStr}] ${randomEv.text}`;
        
        termBody.appendChild(newLine);
        if (termBody.children.length > 7) {
            termBody.removeChild(termBody.children[0]);
        }

        // Randomly adjust active PCs slightly for realism
        if (Math.random() > 0.6 && statActive) {
            count += (Math.random() > 0.5 ? 1 : -1);
            if (count < 10) count = 10;
            if (count > 25) count = 25;
            statActive.innerText = count;
        }
    }, 4500);
}
