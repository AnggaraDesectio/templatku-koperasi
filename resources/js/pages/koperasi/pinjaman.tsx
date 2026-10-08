import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Pinjaman {
    id: number;
    anggota: string;
    jumlah_rp: string;
    tenor: string;
    bunga: string;
    angsuran_rp: string;
    status: ToneLabel;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export default function KoperasiPinjaman({ pinjamans }: { pinjamans: Record<string, any>[] }) {
    const [rows, setRows] = useState<Pinjaman[]>(
        pinjamans.map((p) => ({
            id: Number(p.id),
            anggota: String(p.anggota),
            jumlah_rp: String(p.jumlah_rp),
            tenor: String(p.tenor),
            bunga: String(p.bunga),
            angsuran_rp: String(p.angsuran_rp),
            status: p.status as ToneLabel,
        })),
    );
    const [open, setOpen] = useState(false);
    const [anggota, setAnggota] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [tenor, setTenor] = useState('12');

    const openAdd = () => {
        setAnggota('');
        setJumlah('');
        setTenor('12');
        setOpen(true);
    };

    const simpan = () => {
        const jumlahNum = Number(jumlah.replace(/[^0-9]/g, ''));
        const tenorNum = Math.max(1, Number(tenor) || 1);
        if (!anggota.trim() || !jumlahNum) {
            toast.error('Lengkapi nama anggota dan jumlah pinjaman.');
            return;
        }
        // Bunga flat 1% per bulan, angsuran = (pokok + bunga) / tenor.
        const totalBunga = Math.round(jumlahNum * 0.01 * tenorNum);
        const angsuran = Math.round((jumlahNum + totalBunga) / tenorNum);
        const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows((rs) => [
            {
                id,
                anggota: anggota.trim(),
                jumlah_rp: rupiah(jumlahNum),
                tenor: `${tenorNum} bulan`,
                bunga: '1% flat/bln',
                angsuran_rp: rupiah(angsuran),
                status: { label: 'Menunggu Persetujuan', tone: 'warning' } as ToneLabel,
            },
            ...rs,
        ]);
        toast.success(
            `Pengajuan ${anggota.trim()} tercatat, angsuran ${rupiah(angsuran)}/bln.`,
        );
        setOpen(false);
    };

    const columns: Column<Pinjaman>[] = [
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        {
            key: 'jumlah_rp',
            header: 'Jumlah',
            render: (r) => <span className="tnum font-medium">{r.jumlah_rp}</span>,
            sortValue: (r) => r.jumlah_rp,
        },
        { key: 'tenor', header: 'Tenor', mobileHidden: true, sortValue: (r) => r.tenor },
        { key: 'bunga', header: 'Bunga', mobileHidden: true },
        {
            key: 'angsuran_rp',
            header: 'Angsuran/bln',
            render: (r) => <span className="tnum font-medium">{r.angsuran_rp}</span>,
            mobileHidden: true,
        },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { value: 'Aktif', label: 'Aktif' },
                { value: 'Lunas', label: 'Lunas' },
                { value: 'Menunggu Persetujuan', label: 'Menunggu Persetujuan' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Pinjaman"
                description="Dana yang dipinjam anggota, angsuran dihitung otomatis bunga flat 1%/bulan."
                breadcrumbs={[{ label: 'Koperasi', href: '/koperasi' }, { label: 'Pinjaman' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Ajukan Pinjaman
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Pinjaman</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['anggota']}
                        filters={filters}
                        pageSize={10}
                        emptyTitle="Belum ada pinjaman"
                        emptyDescription="Ajukan pinjaman pertama lewat tombol Ajukan Pinjaman."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pengajuan Pinjaman</DialogTitle>
                        <DialogDescription>
                            Catat pengajuan baru, angsuran per bulan dihitung otomatis.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pjm-anggota">Nama anggota</Label>
                            <Input
                                id="pjm-anggota"
                                value={anggota}
                                onChange={(e) => setAnggota(e.target.value)}
                                placeholder="cth. Bpk. Slamet"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pjm-jumlah">Jumlah pinjaman (Rp)</Label>
                                <Input
                                    id="pjm-jumlah"
                                    inputMode="numeric"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(e.target.value)}
                                    placeholder="5000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pjm-tenor">Tenor (bulan)</Label>
                                <Input
                                    id="pjm-tenor"
                                    inputMode="numeric"
                                    value={tenor}
                                    onChange={(e) => setTenor(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Bunga flat 1% per bulan. Pengajuan baru berstatus Menunggu Persetujuan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={simpan}>Ajukan Pinjaman</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
