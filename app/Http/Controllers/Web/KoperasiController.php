<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\Demo\KoperasiData;
use Inertia\Inertia;
use Inertia\Response;

/** Halaman-halaman Koperasi Simpan Pinjam KOPKITA (Inertia). */
class KoperasiController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('koperasi/index', [
            'ringkasan'   => KoperasiData::ringkasan(),
            'simpanan'    => KoperasiData::simpananPerBulan(),
            'angsuran'    => array_slice(KoperasiData::angsurans(), 0, 6),
        ]);
    }

    public function anggota(): Response
    {
        return Inertia::render('koperasi/anggota', [
            'anggotas' => KoperasiData::anggotas(),
        ]);
    }

    public function simpanan(): Response
    {
        return Inertia::render('koperasi/simpanan', [
            'simpanans' => KoperasiData::simpanans(),
        ]);
    }

    public function pinjaman(): Response
    {
        return Inertia::render('koperasi/pinjaman', [
            'pinjamans' => KoperasiData::pinjamans(),
        ]);
    }

    public function angsuran(): Response
    {
        return Inertia::render('koperasi/angsuran', [
            'angsurans' => KoperasiData::angsurans(),
        ]);
    }

    public function laporan(): Response
    {
        return Inertia::render('koperasi/laporan', [
            'ringkasan'        => KoperasiData::ringkasan(),
            'simpananPerBulan' => KoperasiData::simpananPerBulan(),
            'simpananPerJenis' => KoperasiData::simpananPerJenis(),
            'pinjamanPerStatus'=> KoperasiData::pinjamanPerStatus(),
            'pinjamanTerbesar' => KoperasiData::pinjamanTerbesar(),
        ]);
    }
}
