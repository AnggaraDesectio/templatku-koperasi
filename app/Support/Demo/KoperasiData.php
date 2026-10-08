<?php

namespace App\Support\Demo;

/**
 * Data demo Koperasi Simpan Pinjam (KOPKITA).
 * Semua angka ditulis eksplisit supaya total konsisten antar halaman.
 * Kontrak status: ['label' => .., 'tone' => ..] tanpa HTML,
 * tone ∈ success | warning | destructive | info.
 * Angsuran merujuk pinjaman via pinjamanRows() internal (tanpa rekursi).
 */
class KoperasiData
{
    private static function rp(int $value): string
    {
        return 'Rp'.number_format($value, 0, ',', '.');
    }

    private static function jt(int $value): int
    {
        return (int) round($value / 1000000);
    }

    private static function rb(int $value): int
    {
        return (int) round($value / 1000);
    }

    private static function tgl(string $ts): string
    {
        $map = ['Jan' => 'Jan', 'Feb' => 'Feb', 'Mar' => 'Mar', 'Apr' => 'Apr', 'May' => 'Mei',
            'Jun' => 'Jun', 'Jul' => 'Jul', 'Aug' => 'Agu', 'Sep' => 'Sep', 'Oct' => 'Okt',
            'Nov' => 'Nov', 'Dec' => 'Des'];
        $en = date('d M Y', strtotime($ts));
        foreach ($map as $k => $v) {
            $en = str_replace(' '.$k.' ', ' '.$v.' ', $en);
        }

        return $en;
    }

    /** Baris mentah anggota, dipakai internal agar tidak rekursi. */
    private static function anggotaRows(): array
    {
        return [
            ['no' => 'KOP-001', 'nama' => 'Haryanto Wijaya', 'tanggal_masuk' => '12 Jan 2023', 'status' => 'aktif'],
            ['no' => 'KOP-002', 'nama' => 'Siti Rahayu',     'tanggal_masuk' => '05 Mar 2023', 'status' => 'aktif'],
            ['no' => 'KOP-003', 'nama' => 'Budi Hartono',    'tanggal_masuk' => '21 Jun 2023', 'status' => 'aktif'],
            ['no' => 'KOP-004', 'nama' => 'Dewi Anggraini',  'tanggal_masuk' => '14 Sep 2023', 'status' => 'aktif'],
            ['no' => 'KOP-005', 'nama' => 'Agus Setiawan',   'tanggal_masuk' => '30 Nov 2023', 'status' => 'aktif'],
            ['no' => 'KOP-006', 'nama' => 'Rina Marlina',    'tanggal_masuk' => '18 Feb 2024', 'status' => 'aktif'],
            ['no' => 'KOP-007', 'nama' => 'Joko Susilo',     'tanggal_masuk' => '09 Mei 2024', 'status' => 'aktif'],
            ['no' => 'KOP-008', 'nama' => 'Fitri Handayani', 'tanggal_masuk' => '27 Agu 2024', 'status' => 'aktif'],
            ['no' => 'KOP-009', 'nama' => 'Dedi Supriadi',   'tanggal_masuk' => '15 Jan 2025', 'status' => 'nonaktif'],
            ['no' => 'KOP-010', 'nama' => 'Maya Kusuma',     'tanggal_masuk' => '03 Jun 2025', 'status' => 'aktif'],
        ];
    }

    private static function statusAnggota(string $key): array
    {
        return match ($key) {
            'aktif'    => ['label' => 'Aktif', 'tone' => 'success'],
            'nonaktif' => ['label' => 'Nonaktif', 'tone' => 'warning'],
            default    => ['label' => $key, 'tone' => 'info'],
        };
    }

    /** Daftar anggota koperasi. */
    public static function anggotas(): array
    {
        $simpananPerNo = [];
        foreach (self::simpananRows() as $s) {
            $simpananPerNo[$s['anggota_no']] = ($simpananPerNo[$s['anggota_no']] ?? 0) + $s['jumlah'];
        }

        return array_map(function ($a) use ($simpananPerNo) {
            $total = $simpananPerNo[$a['no']] ?? 0;

            return [
                'no'            => $a['no'],
                'nama'          => $a['nama'],
                'tanggal_masuk' => $a['tanggal_masuk'],
                'status'        => self::statusAnggota($a['status']),
                'total_simpanan_rp' => self::rp($total),
            ];
        }, self::anggotaRows());
    }

    /** Baris mentah simpanan, dipakai internal agar tidak rekursi. */
    private static function simpananRows(): array
    {
        return [
            ['id' => 1,  'anggota_no' => 'KOP-001', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2023-01-12'],
            ['id' => 2,  'anggota_no' => 'KOP-002', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2023-03-05'],
            ['id' => 3,  'anggota_no' => 'KOP-003', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2023-06-21'],
            ['id' => 4,  'anggota_no' => 'KOP-004', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2023-09-14'],
            ['id' => 5,  'anggota_no' => 'KOP-005', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2023-11-30'],
            ['id' => 6,  'anggota_no' => 'KOP-006', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2024-02-18'],
            ['id' => 7,  'anggota_no' => 'KOP-007', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2024-05-09'],
            ['id' => 8,  'anggota_no' => 'KOP-008', 'jenis' => 'pokok',    'jumlah' => 1000000, 'ts' => '2024-08-27'],
            ['id' => 9,  'anggota_no' => 'KOP-001', 'jenis' => 'wajib',    'jumlah' => 100000,  'ts' => '2026-07-05'],
            ['id' => 10, 'anggota_no' => 'KOP-002', 'jenis' => 'wajib',    'jumlah' => 100000,  'ts' => '2026-07-05'],
            ['id' => 11, 'anggota_no' => 'KOP-004', 'jenis' => 'wajib',    'jumlah' => 100000,  'ts' => '2026-08-05'],
            ['id' => 12, 'anggota_no' => 'KOP-006', 'jenis' => 'wajib',    'jumlah' => 100000,  'ts' => '2026-08-05'],
            ['id' => 13, 'anggota_no' => 'KOP-001', 'jenis' => 'sukarela', 'jumlah' => 500000,  'ts' => '2026-06-12'],
            ['id' => 14, 'anggota_no' => 'KOP-006', 'jenis' => 'sukarela', 'jumlah' => 750000,  'ts' => '2026-07-15'],
            ['id' => 15, 'anggota_no' => 'KOP-007', 'jenis' => 'sukarela', 'jumlah' => 1500000, 'ts' => '2026-09-22'],
        ];
    }

    private static function jenisSimpanan(string $key): array
    {
        return match ($key) {
            'pokok'    => ['label' => 'Pokok', 'tone' => 'info'],
            'wajib'    => ['label' => 'Wajib', 'tone' => 'success'],
            'sukarela' => ['label' => 'Sukarela', 'tone' => 'warning'],
            default    => ['label' => $key, 'tone' => 'info'],
        };
    }

    /** Daftar setoran simpanan anggota. */
    public static function simpanans(): array
    {
        $nama = [];
        foreach (self::anggotaRows() as $a) {
            $nama[$a['no']] = $a['nama'];
        }

        $rows = array_map(function ($s) use ($nama) {
            return [
                'id'         => $s['id'],
                'anggota'    => $nama[$s['anggota_no']] ?? $s['anggota_no'],
                'jenis'      => self::jenisSimpanan($s['jenis']),
                'jumlah'     => $s['jumlah'],
                'jumlah_rp'  => self::rp($s['jumlah']),
                'tanggal'    => self::tgl($s['ts']),
            ];
        }, self::simpananRows());

        usort($rows, fn ($a, $b) => $b['id'] <=> $a['id']);

        return $rows;
    }

    /** Baris mentah pinjaman, dipakai internal agar tidak rekursi. */
    private static function pinjamanRows(): array
    {
        return [
            ['id' => 1, 'anggota_no' => 'KOP-001', 'jumlah' => 15000000, 'tenor' => 12, 'bunga' => 1.5,  'ts_mulai' => '2025-12-15', 'status' => 'aktif'],
            ['id' => 2, 'anggota_no' => 'KOP-002', 'jumlah' => 10000000, 'tenor' => 10, 'bunga' => 1.5,  'ts_mulai' => '2026-02-20', 'status' => 'aktif'],
            ['id' => 3, 'anggota_no' => 'KOP-003', 'jumlah' => 25000000, 'tenor' => 24, 'bunga' => 1.25, 'ts_mulai' => '2026-05-10', 'status' => 'aktif'],
            ['id' => 4, 'anggota_no' => 'KOP-004', 'jumlah' => 8000000,  'tenor' => 12, 'bunga' => 1.5,  'ts_mulai' => '2024-06-15', 'status' => 'lunas'],
            ['id' => 5, 'anggota_no' => 'KOP-005', 'jumlah' => 12000000, 'tenor' => 18, 'bunga' => 1.5,  'ts_mulai' => '2026-06-05', 'status' => 'aktif'],
            ['id' => 6, 'anggota_no' => 'KOP-006', 'jumlah' => 5000000,  'tenor' => 6,  'bunga' => 1.5,  'ts_mulai' => '2025-10-10', 'status' => 'lunas'],
            ['id' => 7, 'anggota_no' => 'KOP-007', 'jumlah' => 20000000, 'tenor' => 20, 'bunga' => 1.25, 'ts_mulai' => '2026-07-28', 'status' => 'aktif'],
            ['id' => 8, 'anggota_no' => 'KOP-008', 'jumlah' => 7500000,  'tenor' => 12, 'bunga' => 1.5,  'ts_mulai' => '2026-09-01', 'status' => 'menunggu'],
        ];
    }

    private static function statusPinjaman(string $key): array
    {
        return match ($key) {
            'aktif'    => ['label' => 'Aktif', 'tone' => 'success'],
            'lunas'    => ['label' => 'Lunas', 'tone' => 'info'],
            'menunggu' => ['label' => 'Menunggu Persetujuan', 'tone' => 'warning'],
            default    => ['label' => $key, 'tone' => 'info'],
        };
    }

    /** Angsuran per bulan flat: pokok/tenor + bunga flat atas pokok pinjaman. */
    private static function angsuranPerBulan(array $p): int
    {
        return (int) round($p['jumlah'] / $p['tenor'] + $p['jumlah'] * $p['bunga'] / 100);
    }

    /** Daftar pinjaman anggota. */
    public static function pinjamans(): array
    {
        $nama = [];
        foreach (self::anggotaRows() as $a) {
            $nama[$a['no']] = $a['nama'];
        }

        return array_map(function ($p) use ($nama) {
            $angsuran = self::angsuranPerBulan($p);

            return [
                'id'              => $p['id'],
                'anggota'         => $nama[$p['anggota_no']] ?? $p['anggota_no'],
                'jumlah'          => $p['jumlah'],
                'jumlah_rp'       => self::rp($p['jumlah']),
                'tenor'           => $p['tenor'].' bulan',
                'bunga'           => number_format($p['bunga'], 2, ',', '.').'% /bln',
                'angsuran_rp'     => self::rp($angsuran),
                'mulai'           => self::tgl($p['ts_mulai']),
                'status'          => self::statusPinjaman($p['status']),
            ];
        }, self::pinjamanRows());
    }

    /** Baris mentah angsuran, dipakai internal agar tidak rekursi. */
    private static function angsuranRows(): array
    {
        return [
            ['id' => 1,  'pinjaman_id' => 1, 'ke' => 8, 'ts' => '2026-08-15', 'jumlah' => 1475000, 'status' => 'bayar'],
            ['id' => 2,  'pinjaman_id' => 1, 'ke' => 9, 'ts' => '2026-09-15', 'jumlah' => 1475000, 'status' => 'terlambat'],
            ['id' => 3,  'pinjaman_id' => 1, 'ke' => 10, 'ts' => '2026-10-15', 'jumlah' => 1475000, 'status' => 'belum'],
            ['id' => 4,  'pinjaman_id' => 2, 'ke' => 7, 'ts' => '2026-08-20', 'jumlah' => 1150000, 'status' => 'bayar'],
            ['id' => 5,  'pinjaman_id' => 2, 'ke' => 8, 'ts' => '2026-09-20', 'jumlah' => 1150000, 'status' => 'terlambat'],
            ['id' => 6,  'pinjaman_id' => 2, 'ke' => 9, 'ts' => '2026-10-20', 'jumlah' => 1150000, 'status' => 'belum'],
            ['id' => 7,  'pinjaman_id' => 3, 'ke' => 5, 'ts' => '2026-08-10', 'jumlah' => 1354167, 'status' => 'bayar'],
            ['id' => 8,  'pinjaman_id' => 3, 'ke' => 6, 'ts' => '2026-09-10', 'jumlah' => 1354167, 'status' => 'bayar'],
            ['id' => 9,  'pinjaman_id' => 3, 'ke' => 7, 'ts' => '2026-10-10', 'jumlah' => 1354167, 'status' => 'belum'],
            ['id' => 10, 'pinjaman_id' => 5, 'ke' => 3, 'ts' => '2026-08-05', 'jumlah' => 846667, 'status' => 'bayar'],
            ['id' => 11, 'pinjaman_id' => 5, 'ke' => 4, 'ts' => '2026-09-05', 'jumlah' => 846667, 'status' => 'bayar'],
            ['id' => 12, 'pinjaman_id' => 5, 'ke' => 5, 'ts' => '2026-10-05', 'jumlah' => 846667, 'status' => 'belum'],
            ['id' => 13, 'pinjaman_id' => 7, 'ke' => 2, 'ts' => '2026-08-28', 'jumlah' => 1250000, 'status' => 'bayar'],
            ['id' => 14, 'pinjaman_id' => 7, 'ke' => 4, 'ts' => '2026-10-28', 'jumlah' => 1250000, 'status' => 'belum'],
        ];
    }

    private static function statusBayar(string $key): array
    {
        return match ($key) {
            'bayar'     => ['label' => 'Sudah Bayar', 'tone' => 'success'],
            'terlambat' => ['label' => 'Terlambat', 'tone' => 'destructive'],
            'belum'     => ['label' => 'Belum Bayar', 'tone' => 'warning'],
            default     => ['label' => $key, 'tone' => 'info'],
        };
    }

    /** Daftar angsuran, tiap baris merujuk pinjamannya. */
    public static function angsurans(): array
    {
        $nama = [];
        foreach (self::anggotaRows() as $a) {
            $nama[$a['no']] = $a['nama'];
        }
        $pinjaman = [];
        foreach (self::pinjamanRows() as $p) {
            $pinjaman[$p['id']] = $p;
        }

        $rows = array_map(function ($a) use ($pinjaman, $nama) {
            $p = $pinjaman[$a['pinjaman_id']];

            return [
                'id'          => $a['id'],
                'pinjaman'    => 'Pinjaman #'.$p['id'].', '.($nama[$p['anggota_no']] ?? ''),
                'ke'          => 'Angsuran ke-'.$a['ke'],
                'jatuh_tempo' => self::tgl($a['ts']),
                'jumlah'      => $a['jumlah'],
                'jumlah_rp'   => self::rp($a['jumlah']),
                'status'      => self::statusBayar($a['status']),
            ];
        }, self::angsuranRows());

        usort($rows, fn ($a, $b) => $a['id'] <=> $b['id']);

        return $rows;
    }

    /** Ringkasan angka untuk kartu statistik (dihitung dari data). */
    public static function ringkasan(): array
    {
        $anggotaAktif = count(array_filter(self::anggotaRows(), fn ($a) => $a['status'] === 'aktif'));
        $totalSimpanan = array_sum(array_column(self::simpananRows(), 'jumlah'));
        $pinjamanAktif = array_sum(array_map(
            fn ($p) => $p['status'] === 'aktif' ? $p['jumlah'] : 0,
            self::pinjamanRows()
        ));
        $tempoRows = array_filter(self::angsuranRows(), fn ($a) => $a['status'] === 'terlambat');
        $tempoNominal = array_sum(array_column($tempoRows, 'jumlah'));

        return [
            'anggota_aktif'       => $anggotaAktif,
            'total_anggota'       => count(self::anggotaRows()),
            'total_simpanan'      => $totalSimpanan,
            'total_simpanan_rp'   => self::rp($totalSimpanan),
            'pinjaman_aktif'       => $pinjamanAktif,
            'pinjaman_aktif_rp'    => self::rp($pinjamanAktif),
            'angsuran_tempo'       => count($tempoRows),
            'angsuran_tempo_rp'    => self::rp($tempoNominal),
        ];
    }

    /** Simpanan per bulan Apr–Sep 2026 (ribu Rp) untuk bar chart. */
    public static function simpananPerBulan(): array
    {
        $months = ['2026-04' => 'Apr', '2026-05' => 'Mei', '2026-06' => 'Jun',
            '2026-07' => 'Jul', '2026-08' => 'Agu', '2026-09' => 'Sep'];
        $totals = array_fill_keys(array_keys($months), 0);
        foreach (self::simpananRows() as $s) {
            $key = substr($s['ts'], 0, 7);
            if (isset($totals[$key])) {
                $totals[$key] += $s['jumlah'];
            }
        }

        return [
            'labels'   => array_values($months),
            'datasets' => [['label' => 'Simpanan (ribu Rp)', 'data' => array_map([self::class, 'rb'], array_values($totals))]],
        ];
    }

    /** Simpanan per jenis (ribu Rp) untuk donut chart. */
    public static function simpananPerJenis(): array
    {
        $totals = ['pokok' => 0, 'wajib' => 0, 'sukarela' => 0];
        foreach (self::simpananRows() as $s) {
            $totals[$s['jenis']] += $s['jumlah'];
        }

        return [
            'labels'   => ['Pokok', 'Wajib', 'Sukarela'],
            'datasets' => [['label' => 'Simpanan (ribu Rp)', 'data' => array_map([self::class, 'rb'], array_values($totals))]],
        ];
    }

    /** Nilai pinjaman per status (juta Rp) untuk bar chart. */
    public static function pinjamanPerStatus(): array
    {
        $totals = ['aktif' => 0, 'lunas' => 0, 'menunggu' => 0];
        foreach (self::pinjamanRows() as $p) {
            $totals[$p['status']] += $p['jumlah'];
        }

        return [
            'labels'   => ['Aktif', 'Lunas', 'Menunggu Persetujuan'],
            'datasets' => [['label' => 'Nilai (juta Rp)', 'data' => array_map([self::class, 'jt'], array_values($totals))]],
        ];
    }

    /** 5 pinjaman terbesar untuk tabel laporan. */
    public static function pinjamanTerbesar(): array
    {
        $rows = self::pinjamans();
        usort($rows, fn ($a, $b) => $b['jumlah'] <=> $a['jumlah']);

        return array_slice($rows, 0, 5);
    }
}
