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

interface Anggota {
    id: string | number;
    no: string;
    nama: string;
    tanggal_masuk: string;
    status: ToneLabel;
    total_simpanan_rp: string;
}

export default function KoperasiAnggota({ anggotas }: { anggotas: Record<string, any>[] }) {
    const [rows, setRows] = useState<Anggota[]>(
        anggotas.map((a, idx) => ({
            id: idx,
            no: String(a.no),
            nama: String(a.nama),
            tanggal_masuk: String(a.tanggal_masuk),
            status: a.status as ToneLabel,
            total_simpanan_rp: String(a.total_simpanan_rp),
        })),
    );
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Anggota | null>(null);
    const [nama, setNama] = useState('');
    const [tanggalMasuk, setTanggalMasuk] = useState(new Date().toISOString().slice(0, 10));

    const openAdd = () => {
        setEditing(null);
        setNama('');
        setTanggalMasuk(new Date().toISOString().slice(0, 10));
        setOpen(true);
    };

    const openEdit = (row: Anggota) => {
        setEditing(row);
        setNama(row.nama);
        setTanggalMasuk(row.tanggal_masuk);
        setOpen(true);
    };

    const simpan = () => {
        if (!nama.trim()) {
            toast.error('Isi nama anggota dulu.');
            return;
        }
        if (editing) {
            setRows((rs) =>
                rs.map((r) =>
                    r.id === editing.id ? { ...r, nama: nama.trim(), tanggal_masuk: tanggalMasuk } : r,
                ),
            );
            toast.success(`Data ${nama.trim()} diperbarui.`);
        } else {
            const no = `A-${String(rows.length + 1).padStart(4, '0')}`;
            setRows((rs) => [
                {
                    id: rows.length,
                    no,
                    nama: nama.trim(),
                    tanggal_masuk: tanggalMasuk,
                    status: { label: 'Aktif', tone: 'success' } as ToneLabel,
                    total_simpanan_rp: 'Rp 0',
                },
                ...rs,
            ]);
            toast.success(`${nama.trim()} terdaftar sebagai anggota (${no}).`);
        }
        setOpen(false);
    };

    const columns: Column<Anggota>[] = [
        { key: 'no', header: 'No. Anggota', sortValue: (r) => r.no },
        { key: 'nama', header: 'Nama', sortValue: (r) => r.nama },
        { key: 'tanggal_masuk', header: 'Tanggal Masuk', mobileHidden: true, sortValue: (r) => r.tanggal_masuk },
        {
            key: 'total_simpanan_rp',
            header: 'Total Simpanan',
            render: (r) => <span className="tnum font-medium">{r.total_simpanan_rp}</span>,
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
                { value: 'Nonaktif', label: 'Nonaktif' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Anggota"
                description="Daftar anggota beserta simpanan yang sudah terkumpul."
                breadcrumbs={[{ label: 'Koperasi', href: '/koperasi' }, { label: 'Anggota' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Anggota</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['no', 'nama']}
                        filters={filters}
                        pageSize={10}
                        onEdit={openEdit}
                        emptyTitle="Belum ada anggota"
                        emptyDescription="Daftarkan anggota pertama lewat tombol Tambah Anggota, nomor anggota dibuat otomatis."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
                        <DialogDescription>
                            Daftarkan anggota, nomor anggota dibuat otomatis.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agt-nama">Nama lengkap</Label>
                            <Input
                                id="agt-nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="cth. Ibu Siti Aminah"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agt-tgl">Tanggal masuk</Label>
                            <Input
                                id="agt-tgl"
                                type="date"
                                value={tanggalMasuk}
                                onChange={(e) => setTanggalMasuk(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={simpan}>{editing ? 'Simpan Perubahan' : 'Daftarkan Anggota'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
