<?php
// proses-daftar.php / index.php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari form pendaftaran
    $nama     = $_POST['nama'] ?? '';
    $email    = $_POST['email'] ?? '';
    $whatsapp = $_POST['whatsapp'] ?? '';
    $klub     = $_POST['klub'] ?? '';
    $wilayah  = $_POST['wilayah'] ?? '';
    $kategori = $_POST['kategori'] ?? '';

    // LOGIKA FILE UPLOAD
    if (isset($_FILES['bukti']) && $_FILES['bukti']['error'] === UPLOAD_ERR_OK) {
        $namaFile = $_FILES['bukti']['name'];
        $tmpName  = $_FILES['bukti']['tmp_name'];
        
        // Tentukan lokasi penyimpanan folder 'uploads'
        $uploadDir = "uploads/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Tambahkan timestamp pada nama file agar tidak bentrok
        $namaFileBaru = time() . '_' . $namaFile;
        move_uploaded_file($tmpName, $uploadDir . $namaFileBaru);
    }

    // SIMPAN KE DATABASE (Opsional / Aktifkan jika DB sudah siap)
    /*
    include 'koneksi.php';
    $query = "INSERT INTO pendaftaran (nama, email, whatsapp, klub, wilayah, kategori, bukti) 
              VALUES ('$nama', '$email', '$whatsapp', '$klub', '$wilayah', '$kategori', '$namaFileBaru')";
    mysqli_query($koneksi, $query);
    */

    // Redirect kembali ke halaman pendaftaran dengan status sukses
    header("Location: Pendaftaran.html?status=sukses");
    exit();

} else {
    // Jika diakses langsung via browser (GET), arahkan langsung ke halaman utama
    header("Location: index.html");
    exit();
}
?>