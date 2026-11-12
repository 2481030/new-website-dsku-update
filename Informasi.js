/**
 * PATHFINDER DSKU - Enhanced Interactive Script
 * Menambahkan efek premium, magnetik, dan animasi smooth.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Registrasi GSAP ScrollTrigger jika library tersedia
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* =============================================
       1. SMOOTH CUSTOM CURSOR (Mouse Glow Pro)
       ============================================= */
    const glow = document.getElementById('mg');
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.15; // Kecepatan smooth (semakin kecil semakin lambat)

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        // Efek lerp (linear interpolation) untuk pergerakan halus
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        glow.style.left = ballX + 'px';
        glow.style.top = ballY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();


    /* =============================================
       2. TYPING EFFECT (Hero Title)
       ============================================= */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        // Hanya jalankan jika belum dianimasikan
        if (!heroTitle.classList.contains('animated')) {
            heroTitle.style.opacity = "1";
            heroTitle.classList.add('animated');
        }
    }


    /* =============================================
       3. MAGNETIC BUTTONS
       ============================================= */
    const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta, .ft-soc-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            // Tarik tombol ke arah mouse (efek magnet)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', function() {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });


    /* =============================================
       4. ADVANCED SCROLL REVEAL (GSAP version)
       ============================================= */
    if (typeof gsap !== 'undefined') {
        // Animasi masuk untuk section title
        gsap.utils.toArray('.sec-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Animasi staggered untuk card (muncul satu per satu)
        gsap.from(".curr-card", {
            scrollTrigger: {
                trigger: ".curr-grid",
                start: "top 85%",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2, // Jeda antar card
            ease: "back.out(1.7)"
        });
    }


    /* =============================================
       5. SEARCH HIGHLIGHTER
       ============================================= */
    const searchInput = document.getElementById('materiSearch');
    searchInput.addEventListener('keyup', function() {
        const keyword = this.value.toLowerCase();
        const cards = document.querySelectorAll('.searchable-item');

        cards.forEach(card => {
            const title = card.querySelector('.qcard-title, .curr-name').innerText.toLowerCase();
            const desc = card.querySelector('.qcard-desc, .curr-desc').innerText.toLowerCase();

            if (title.includes(keyword) || desc.includes(keyword)) {
                card.style.display = "block";
                card.style.animation = "fadeUp 0.5s ease forwards";
                // Beri highlight sedikit
                card.style.borderColor = keyword.length > 0 ? "var(--blue2)" : "var(--border)";
            } else {
                card.style.display = "none";
            }
        });
    });


    /* =============================================
       6. ENHANCED PARALLAX (Hero Blobs)
       ============================================= */
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const b1 = document.querySelector('.b1');
        const b2 = document.querySelector('.b2');
        
        if (b1) b1.style.transform = `translateY(${scrolled * 0.2}px)`;
        if (b2) b2.style.transform = `translateY(${scrolled * -0.1}px)`;
    });


    /* =============================================
       7. PROGRESS BAR (Top Page)
       ============================================= */
    const progBar = document.createElement('div');
    progBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px; 
        background: linear-gradient(90deg, var(--gold), var(--blue2));
        z-index: 1000; width: 0%; transition: width 0.1s;
    `;
    document.body.appendChild(progBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progBar.style.width = scrolled + "%";
    });

});

<script>
function handleSaran(e) {
    e.preventDefault();

    // Ambil elemen untuk feedback visual
    const form = document.getElementById("nlForm");
    const btn = form.querySelector('button');
    const successBox = document.getElementById("nl-success");

    // Efek loading
    btn.innerHTML = "Mengirim...";
    btn.disabled = true;

    fetch("kirim_saran.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            nama: document.getElementById("feedbackName").value,
            email: document.getElementById("feedbackEmail").value,
            pesan: document.getElementById("feedbackMsg").value
        })
    })
    .then(res => res.text())
    .then(data => {
        // Gunakan .trim() agar spasi/enter di PHP tidak merusak logika
        if (data.trim() === "success") {
            successBox.style.display = "block";
            form.reset(); // Kosongkan form
            form.style.display = "none"; // Sembunyikan form agar lebih rapi
        } else {
            alert("Server merespon: " + data); // Munculkan pesan error dari PHP
            btn.innerHTML = "Kirim Masukan Anda →";
            btn.disabled = false;
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Gagal terhubung ke server. Pastikan Anda menjalankan ini di hosting/local server (XAMPP).");
        btn.innerHTML = "Kirim Masukan Anda →";
        btn.disabled = false;
    });
}
</script>

// 1. Inisialisasi Supabase
const SUPABASE_URL = 'https://kftjkdpxeyxesjmutjnu.supabase.co';
// Perhatikan tanda kutip di akhir kode di bawah ini:
const SUPABASE_ANON_KEY = 'sb_publishable_A_9b4LL_GidaO8eXrsugWg_FkiUmv-L'; 

// Gunakan nama variabel _supabase agar tidak bentrok dengan library-nya
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleSaran(e) {
    e.preventDefault();

    const form = document.getElementById("nlForm");
    const btn = form.querySelector('button');
    const successBox = document.getElementById("nl-success");

    btn.innerHTML = "Sedang Mengirim...";
    btn.disabled = true;

    // Ambil data dari input
    const namaUser = document.getElementById("feedbackName").value;
    const emailUser = document.getElementById("feedbackEmail").value;
    const pesanUser = document.getElementById("feedbackMsg").value;

    try {
        // 2. Kirim ke tabel. 
        // PENTING: Ganti 'saran' dengan nama tabel kamu jika namanya berbeda
        const { error } = await _supabase
            .from('saran') 
            .insert([
                { 
                    nama: namaUser, 
                    email: emailUser, 
                    pesan: pesanUser 
                }
            ]);

        if (error) throw error;

        // Berhasil
        successBox.style.display = "block";
        form.reset();
        form.style.display = "none"; 

    } catch (err) {
        console.error("Detail Error:", err);
        alert("Gagal: " + err.message);
        btn.innerHTML = "Kirim Masukan Anda →";
        btn.disabled = false;
    }
}
}