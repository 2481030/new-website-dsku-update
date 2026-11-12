// CONFIGURATION - Ganti dengan kredensial Supabase Anda
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const form = document.getElementById('mgForm');
const panels = document.querySelectorAll('.panel');
const steps = document.querySelectorAll('.trail-step');
const canvas = document.getElementById('sigCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// 1. Navigation Logic
function nextPanel(index) {
    // Validasi sederhana sebelum lanjut
    const currentPanel = document.querySelector('.panel.active');
    const inputs = currentPanel.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value) {
            input.parentElement.classList.add('show-err');
            valid = false;
        } else {
            input.parentElement.classList.remove('show-err');
        }
    });

    if (!valid && index > parseInt(currentPanel.dataset.panel)) return;

    // Switch Panel
    panels.forEach(p => p.classList.remove('active'));
    panels[index].classList.add('active');

    // Update Step UI
    steps.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.classList.toggle('done', i < index);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Signature Logic
function setupCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.strokeStyle = "#142819";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
}

window.addEventListener('resize', setupCanvas);
setupCanvas();

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

window.addEventListener('mouseup', () => isDrawing = false);

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing = true;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}, { passive: false });

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 3. Form Handling (Conditional Fields)
document.getElementById('status_mg').addEventListener('change', function() {
    const extra = document.getElementById('extraMG');
    extra.style.display = (this.value === 'Sudah Investitur') ? 'block' : 'none';
});

// 4. Submit to Supabase
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    const formData = new FormData(form);
    
    // Ambil data checkbox (pelatihan) sebagai array
    const pelatihan = [];
    document.querySelectorAll('input[name="pelatihan"]:checked').forEach(cb => {
        pelatihan.push(cb.value);
    });

    // Ambil tanda tangan sebagai Base64
    const signatureBase64 = canvas.toDataURL();

    const payload = {
        nama: formData.get('nama'),
        gender: formData.get('gender'),
        tempat_lahir: formData.get('tempat_lahir'),
        tanggal_lahir: formData.get('tanggal_lahir'),
        hp: formData.get('hp'),
        jemaat: formData.get('jemaat'),
        distrik: formData.get('distrik'),
        status_mg: formData.get('status_mg'),
        tahun_investitur: formData.get('tahun_investitur'),
        tempat_investitur: formData.get('tempat_investitur'),
        pelatihan: pelatihan,
        bersedia_bantu: formData.get('bersedia_bantu'),
        signature_base64: signatureBase64
    };

    try {
        const { data, error } = await supabase
            .from('mg_registrations')
            .insert([payload]);

        if (error) throw error;

        // Berhasil
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById('successPanel').classList.add('active');
        document.querySelector('.trail-wrap').style.display = 'none';

    } catch (err) {
        alert('Gagal mengirim data: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
    }
});