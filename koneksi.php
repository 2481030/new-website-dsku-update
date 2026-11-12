<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "pathfinder_dsku";

$conn = mysqli_connect($host, $user, $pass, $db);

if(!$conn){
    die("Koneksi gagal!");
}

?>