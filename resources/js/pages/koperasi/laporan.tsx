import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { AreaChartCard, BarChartCard, DonutChartCard, type ChartData } from '@/components/charts';
import { DataTable, type Column } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, HandCoins, PiggyBank, Users } from 'lucide-react';

interface Ringkasan {
    anggota_aktif: number;
    total_anggota: number;
    total_simpanan_rp: string;
    pinjaman_aktif_rp: string;
    angsuran_tempo: number;
    angsuran_tempo_rp: string;
}

interface Pinjaman {
    id: number;
    anggota: string;
    jumlah_rp: string;
    tenor: string;
    bunga: string;
    status: ToneLabel;
}

export default function KoperasiLaporan({
    ringkasan,
    simpananPerBulan,
    simpananPerJenis,
    pinjamanPerStatus,
    pinjamanTerbesar,
}: {
    ringkasan: Ringkasan;
    simpananPerBulan: ChartData;
    simpananPerJenis: ChartData;
    pinjamanPerStatus: ChartData;
    pinjamanTerbesar: Record<string, any>[];
}) {
    const rows: Pinjaman[] = pinjamanTerbesar.map((p) => ({
        id: Number(p.id),
        anggota: String(p.anggota),
        jumlah_rp: String(p.jumlah_rp),
        tenor: String(p.tenor),
        bunga: String(p.bunga),
        status: p.status as ToneLabel,
    }));

    const columns: Column<Pinjaman>[] = [
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        {
            key: 'jumlah_rp',
            header: 'Jumlah',
            render: (r) => <span className="tnum font-medium">{r.jumlah_rp}</span>,
        },
        { key: 'tenor', header: 'Tenor' },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Laporan Koperasi"
                description="Ringkasan kinerja simpanan dan pinjaman KOPKITA."
                breadcrumbs={[{ label: 'Koperasi', href: '/koperasi' }, { label: 'Laporan' }]}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Anggota Aktif"
                    value={String(ringkasan.anggota_aktif)}
                    delta={`${ringkasan.total_anggota} total anggota`}
                    trend="flat"
                    icon={Users}
                    hint="Anggota yang simpanannya masih berjalan."
                />
                <StatCard
                    label="Total Simpanan"
                    value={ringkasan.total_simpanan_rp}
                    delta="Pokok, wajib & sukarela"
                    trend="up"
                    icon={PiggyBank}
                    hint="Dana anggota yang dihimpun koperasi."
                />
                <StatCard
                    label="Pinjaman Aktif"
                    value={ringkasan.pinjaman_aktif_rp}
                    delta="Pinjaman berjalan"
                    trend="flat"
                    icon={HandCoins}
                    hint="Total pinjaman yang belum lunas."
                />
                <StatCard
                    label="Angsuran Jatuh Tempo"
                    value={String(ringkasan.angsuran_tempo)}
                    delta={ringkasan.angsuran_tempo_rp}
                    trend="down"
                    icon={CalendarClock}
                    hint="Angsuran lewat jatuh tempo, segera hubungi anggota."
                />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Simpanan per Bulan</CardTitle>
                        <p className="text-muted-foreground text-sm">Setoran anggota dalam ribu rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <AreaChartCard data={simpananPerBulan} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Komposisi Simpanan</CardTitle>
                        <p className="text-muted-foreground text-sm">Per jenis simpanan, dalam ribu rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <DonutChartCard data={simpananPerJenis} />
                    </CardContent>
                </Card>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Nilai Pinjaman per Status</CardTitle>
                        <p className="text-muted-foreground text-sm">Dalam juta rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <BarChartCard data={pinjamanPerStatus} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Pinjaman Terbesar</CardTitle>
                        <p className="text-muted-foreground text-sm">5 plafon tertinggi.</p>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            emptyTitle="Belum ada pinjaman"
                            emptyDescription="Pinjaman akan tampil di sini."
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
