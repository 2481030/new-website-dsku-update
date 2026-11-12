<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = $_POST['nama_lengkap'];
    $jk = $_POST['jenis_kelamin'];
    $ttl = $_POST['ttl'];
    $alamat = $_POST['alamat'];
    $no_hp = $_POST['no_hp'];
    $email = $_POST['email'];
    $jemaat = $_POST['jemaat'];
    $distrik = $_POST['distrik'];
    $jabatan = $_POST['jabatan'];
    $status_mg = $_POST['status_mg'];
    $tahun = $_POST['tahun_investitur'];
    $tempat = $_POST['tempat_investitur'];
    $pembina = $_POST['nama_pembina'];
    
    // Gabungkan array checkbox pelatihan
    $pelatihan = isset($_POST['pelatihan']) ? implode(", ", $_POST['pelatihan']) : "";
    if(!empty($_POST['pelatihan_lainnya'])) $pelatihan .= ", " . $_POST['pelatihan_lainnya'];

    $bersedia = $_POST['bersedia'];
    $bidang = $_POST['bidang_diminati'];
    $catatan = $_POST['catatan'];

    $sql = "INSERT INTO master_guide_data (nama_lengkap, jenis_kelamin, ttl, alamat, no_hp, email, jemaat, distrik, jabatan_saat_ini, status_mg, tahun_investitur, tempat_investitur, nama_pembina, pelatihan, bersedia_membantu, bidang_diminati, catatan_tambahan) 
            VALUES ('$nama', '$jk', '$ttl', '$alamat', '$no_hp', '$email', '$jemaat', '$distrik', '$jabatan', '$status_mg', '$tahun', '$tempat', '$pembina', '$pelatihan', '$bersedia', '$bidang', '$catatan')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Data Berhasil Disimpan!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}
?>