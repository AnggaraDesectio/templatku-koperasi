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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Simpanan {
    id: number;
    anggota: string;
    jenis: ToneLabel;
    jumlah_rp: string;
    tanggal: string;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const JENIS = ['Pokok', 'Wajib', 'Sukarela'];

const jenisTone = (j: string): ToneLabel['tone'] =>
    j === 'Pokok' ? 'info' : j === 'Wajib' ? 'success' : 'info';

export default function KoperasiSimpanan({ simpanans }: { simpanans: Record<string, any>[] }) {
    const [rows, setRows] = useState<Simpanan[]>(
        simpanans.map((s) => ({
            id: Number(s.id),
            anggota: String(s.anggota),
            jenis: s.jenis as ToneLabel,
            jumlah_rp: String(s.jumlah_rp),
            tanggal: String(s.tanggal),
        })),
    );
    const [open, setOpen] = useState(false);
    const [anggota, setAnggota] = useState('');
    const [jenis, setJenis] = useState('Wajib');
    const [jumlah, setJumlah] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

    const openAdd = () => {
        setAnggota('');
        setJenis('Wajib');
        setJumlah('');
        setTanggal(new Date().toISOString().slice(0, 10));
        setOpen(true);
    };

    const simpan = () => {
        const jumlahNum = Number(jumlah.replace(/[^0-9]/g, ''));
        if (!anggota.trim() || !jumlahNum) {
            toast.error('Lengkapi nama anggota dan jumlah setoran.');
            return;
        }
        const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
        setRows((rs) => [
            {
                id,
                anggota: anggota.trim(),
                jenis: { label: jenis, tone: jenisTone(jenis) } as ToneLabel,
                jumlah_rp: rupiah(jumlahNum),
                tanggal,
            },
            ...rs,
        ]);
        toast.success(`Setoran ${jenis} ${anggota.trim()} sebesar ${rupiah(jumlahNum)} tercatat.`);
        setOpen(false);
    };

    const columns: Column<Simpanan>[] = [
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        {
            key: 'jenis',
            header: 'Jenis',
            render: (r) => <ToneBadge label={r.jenis.label} tone={r.jenis.tone} />,
        },
        {
            key: 'jumlah_rp',
            header: 'Jumlah',
            render: (r) => <span className="tnum font-medium">{r.jumlah_rp}</span>,
            sortValue: (r) => r.jumlah_rp,
        },
        { key: 'tanggal', header: 'Tanggal', mobileHidden: true, sortValue: (r) => r.tanggal },
    ];

    const filters: FilterOption[] = [
        {
            key: 'jenis',
            label: 'Jenis Simpanan',
            options: [
                { value: 'Pokok', label: 'Pokok' },
                { value: 'Wajib', label: 'Wajib' },
                { value: 'Sukarela', label: 'Sukarela' },
            ],
            match: (row: any, value: string) => row.jenis.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Simpanan"
                description="Uang anggota yang dititipkan, catat tiap setoran biar tercatat rapi."
                breadcrumbs={[{ label: 'Koperasi', href: '/koperasi' }, { label: 'Simpanan' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Setor Simpanan
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Riwayat Simpanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['anggota']}
                        filters={filters}
                        pageSize={10}
                        emptyTitle="Belum ada simpanan"
                        emptyDescription="Setoran simpanan akan tampil di sini."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setor Simpanan</DialogTitle>
                        <DialogDescription>
                            Catat setoran anggota, pilih jenis simpanannya.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="smp-anggota">Nama anggota</Label>
                            <Input
                                id="smp-anggota"
                                value={anggota}
                                onChange={(e) => setAnggota(e.target.value)}
                                placeholder="cth. Ibu Siti"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="smp-jenis">Jenis simpanan</Label>
                                <Select value={jenis} onValueChange={setJenis}>
                                    <SelectTrigger id="smp-jenis">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JENIS.map((j) => (
                                            <SelectItem key={j} value={j}>
                                                {j}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smp-jumlah">Jumlah (Rp)</Label>
                                <Input
                                    id="smp-jumlah"
                                    inputMode="numeric"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(e.target.value)}
                                    placeholder="100000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smp-tgl">Tanggal setor</Label>
                            <Input
                                id="smp-tgl"
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={simpan}>Catat Setoran</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
