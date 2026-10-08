<?php

use App\Http\Controllers\Web\KoperasiController;
use Illuminate\Support\Facades\Route;

Route::prefix('koperasi')->name('koperasi.')->group(function () {
    Route::get('/', [KoperasiController::class, 'index'])->name('index');
    Route::get('/anggota', [KoperasiController::class, 'anggota'])->name('anggota');
    Route::get('/simpanan', [KoperasiController::class, 'simpanan'])->name('simpanan');
    Route::get('/pinjaman', [KoperasiController::class, 'pinjaman'])->name('pinjaman');
    Route::get('/angsuran', [KoperasiController::class, 'angsuran'])->name('angsuran');
    Route::get('/laporan', [KoperasiController::class, 'laporan'])->name('laporan');
});
