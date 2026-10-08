import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Angsuran {
    id: number;
    pinjaman: string;
    ke: string;
    jatuh_tempo: string;
    jumlah_rp: string;
    status: ToneLabel;
}

export default function KoperasiAngsuran({ angsurans }: { angsurans: Record<string, any>[] }) {
    const rows: Angsuran[] = angsurans.map((a) => ({
        id: Number(a.id),
        pinjaman: String(a.pinjaman),
        ke: String(a.ke),
        jatuh_tempo: String(a.jatuh_tempo),
        jumlah_rp: String(a.jumlah_rp),
        status: a.status as ToneLabel,
    }));

    const columns: Column<Angsuran>[] = [
        { key: 'pinjaman', header: 'Pinjaman', sortValue: (r) => r.pinjaman },
        { key: 'ke', header: 'Angsuran Ke', sortValue: (r) => r.ke },
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

    const filters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status Bayar',
            options: [
                { value: 'Sudah Bayar', label: 'Sudah Bayar' },
                { value: 'Terlambat', label: 'Terlambat' },
                { value: 'Belum Bayar', label: 'Belum Bayar' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Angsuran"
                description="Jadwal cicilan pinjaman dan status pembayarannya."
                breadcrumbs={[{ label: 'Koperasi', href: '/koperasi' }, { label: 'Angsuran' }]}
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Jadwal Angsuran</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['pinjaman']}
                        filters={filters}
                        pageSize={10}
                        emptyTitle="Belum ada angsuran"
                        emptyDescription="Jadwal angsuran akan tampil di sini."
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
