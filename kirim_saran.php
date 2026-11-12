<?php
// 1. Konfigurasi Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "pathfinder_dsku";

// Mengaktifkan laporan error mysqli untuk memudahkan debugging
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db);
} catch (Exception $e) {
    echo "Koneksi Gagal: " . $e->getMessage();
    exit;
}

// 2. Cek jika data dikirim melalui POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Ambil data dan bersihkan dari spasi kosong
    $nama  = trim($_POST['nama'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pesan = trim($_POST['pesan'] ?? '');

    // Validasi sederhana
    if (empty($nama) || empty($pesan)) {
        echo "Nama dan pesan tidak boleh kosong";
        exit;
    }

    // A. Simpan ke File Teks (Backup)
    try {
        $file = 'log_saran.txt';
        $isi_saran = "[" . date('Y-m-d H:i:s') . "] Nama: $nama | Email: $email | Pesan: $pesan" . PHP_EOL;
        file_put_contents($file, $isi_saran, FILE_APPEND);
    } catch (Exception $e) {
        // Abaikan jika log file gagal, fokus ke DB
    }

    // B. Simpan ke Database (Menggunakan Prepared Statement agar AMAN)
    try {
        $sql = "INSERT INTO saran (nama, email, pesan) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        // "sss" berarti ketiga parameter adalah String
        mysqli_stmt_bind_param($stmt, "sss", $nama, $email, $pesan);
        
        if (mysqli_stmt_execute($stmt)) {
            echo "success"; // HANYA kirim pesan "success" jika benar-benar berhasil
        } else {
            echo "Gagal menyimpan ke database.";
        }
        
        mysqli_stmt_close($stmt);
    } catch (Exception $e) {
        echo "Error Database: " . $e->getMessage();
    }

    mysqli_close($conn);

} else {
    echo "Metode pengiriman salah";
}
?>