// Ganti fungsi handleSignUp Anda dengan versi ini:
async function handleSignUp() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    const btn = document.getElementById('btnReg');

    if (!name || !email || !password) return alert("Isi semua data!");

    btn.innerText = "Memproses...";
    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert(error.message);
    } else {
        await supabaseClient.from('profiles').insert([{ id: data.user.id, full_name: name, email: email }]);
        
        // PANGGIL NOTIFIKASI KEREN DI SINI
        showSuccessToast(); 
        
        setTimeout(() => {
            toggleForm();
        }, 3000);
    }
    btn.innerText = "DAFTAR";
}

// Fungsi untuk memunculkan notifikasi
function showSuccessToast() {
    const toast = document.getElementById('toast');
    const progress = document.getElementById('toastProgress');
    
    // Reset progress bar
    progress.style.width = '100%';
    
    // Tampilkan toast
    toast.classList.add('toast-active');
    
    // Mulai jalanin progress bar
    setTimeout(() => { progress.style.width = '0%'; }, 100);

    // Sembunyikan toast setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('toast-active');
    }, 3500);
}