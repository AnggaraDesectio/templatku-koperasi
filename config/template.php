<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "koperasi".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'koperasi'),

    'flavors' => array (
  'koperasi' => 
  array (
    'label' => 'Koperasi',
    'brand_name' => 'KOPKITA',
    'brand_tagline' => 'Koperasi digital',
    'brand_initials' => 'KK',
    'accent' => '#065f46',
    'category' => 'keuangan',
    'home' => 'koperasi.index',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Koperasi',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Dashboard',
              'to' => '/koperasi',
              'icon' => 'LayoutDashboard',
            ),
            1 => 
            array (
              'label' => 'Anggota',
              'to' => '/koperasi/anggota',
              'icon' => 'Users',
            ),
            2 => 
            array (
              'label' => 'Simpanan',
              'to' => '/koperasi/simpanan',
              'icon' => 'PiggyBank',
            ),
            3 => 
            array (
              'label' => 'Pinjaman',
              'to' => '/koperasi/pinjaman',
              'icon' => 'HandCoins',
            ),
            4 => 
            array (
              'label' => 'Angsuran',
              'to' => '/koperasi/angsuran',
              'icon' => 'CalendarClock',
            ),
            5 => 
            array (
              'label' => 'Laporan',
              'to' => '/koperasi/laporan',
              'icon' => 'ChartLine',
            ),
          ),
        ),
        1 => 
        array (
          'label' => 'Umum',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Pengguna',
              'to' => '/users',
              'icon' => 'Users',
            ),
            1 => 
            array (
              'label' => 'Peran',
              'to' => '/roles',
              'icon' => 'ShieldCheck',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
            3 => 
            array (
              'label' => 'Profil',
              'to' => '/profile',
              'icon' => 'User',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
