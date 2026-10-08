import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { BarChartCard, type ChartData } from '@/components/charts';
import { DataTable, type Column } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, HandCoins, PiggyBank, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Angsuran {
    id: number;
    pinjaman: string;
    ke: string;
    jatuh_tempo: string;
    jumlah_rp: string;
    status: ToneLabel;
}

interface Ringkasan {
    anggota_aktif: number;
    total_anggota: number;
    total_simpanan_rp: string;
    pinjaman_aktif_rp: string;
    angsuran_tempo: number;
    angsuran_tempo_rp: string;
}

export default function KoperasiIndex({
    ringkasan,
    simpanan,
    angsuran,
}: {
    ringkasan: Ringkasan;
    simpanan: ChartData;
    angsuran: Record<string, any>[];
}) {
    const rows: Angsuran[] = angsuran.map((a) => ({
        id: Number(a.id),
        pinjaman: String(a.pinjaman),
        ke: String(a.ke),
        jatuh_tempo: String(a.jatuh_tempo),
        jumlah_rp: String(a.jumlah_rp),
        status: a.status as ToneLabel,
    }));

    const columns: Column<Angsuran>[] = [
        { key: 'pinjaman', header: 'Pinjaman', sortValue: (r) => r.pinjaman },
        { key: 'ke', header: 'Angsuran', sortValue: (r) => r.ke },
        { key: 'jatuh_tempo', header: 'Jatuh Tempo', sortValue: (r) => r.jatuh_tempo },
        {
            key: 'jumlah_rp',
            header: 'Jumlah',
            render: (r) => <span className="tnum font-medium">{r.jumlah_rp}</span>,
            sortValue: (r) => r.jumlah_rp,
        },
        {
            key: 'status',
            header: 'Status Bayar',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Dashboard Koperasi"
                description="KOPKITA, ringkasan anggota, simpanan, pinjaman, dan angsuran."
                breadcrumbs={[{ label: 'Koperasi' }]}
                actions={
                    <Button size="sm" asChild>
                        <Link href="/koperasi/anggota">
                            <UserPlus className="mr-2 h-4 w-4" /> Anggota Baru
                        </Link>
                    </Button>
                }
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
                    hint="Angsuran yang lewat jatuh tempo, segera hubungi anggota."
                />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Simpanan per Bulan</CardTitle>
                        <p className="text-muted-foreground text-sm">Setoran simpanan anggota dalam ribu rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <BarChartCard data={simpanan} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Angsuran Terdekat</CardTitle>
                        <p className="text-muted-foreground text-sm">Cicilan yang perlu perhatian.</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {rows
                            .filter((r) => r.status.label !== 'Sudah Bayar')
                            .map((r) => (
                                <div key={r.id} className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{r.pinjaman}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {r.ke} · {r.jatuh_tempo}
                                        </p>
                                    </div>
                                    <ToneBadge label={r.status.label} tone={r.status.tone} />
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>
            <div className="mt-4">
                <DataTable
                    columns={columns}
                    rows={rows}
                    searchKeys={['pinjaman', 'ke']}
                    emptyTitle="Belum ada angsuran"
                    emptyDescription="Jadwal angsuran akan tampil di sini."
                />
            </div>
        </AuthenticatedLayout>
    );
}
