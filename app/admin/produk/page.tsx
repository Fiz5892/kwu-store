'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Product, Category } from '@/types';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  categoryId: string;
  stock: string;
  weight: string;
  images: string[];
  isActive: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  categoryId: '',
  stock: '',
  weight: '',
  images: [],
  isActive: true,
};

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || '',
      categoryId: product.categoryId?.toString() || '',
      stock: product.stock?.toString() || '0',
      weight: product.weight?.toString() || '',
      images: product.images || [],
      isActive: product.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const body = {
      name: form.name,
      slug,
      description: form.description,
      price: form.price,
      comparePrice: form.comparePrice || null,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      stock: parseInt(form.stock) || 0,
      weight: form.weight ? parseInt(form.weight) : null,
      images: form.images,
      isActive: form.isActive,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, images: [...form.images, data.url] });
      } else {
        alert('Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#A1BC99] transition-colors"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Produk</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Harga</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Stok</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Tidak ada produk ditemukan
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const img = product.images?.[0] || `https://picsum.photos/seed/${product.id}/100/100`;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={img} alt={product.name} className="object-cover w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 md:hidden">{formatPrice(parseFloat(product.price))}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-700">
                        {formatPrice(parseFloat(product.price))}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`font-medium ${(product.stock ?? 0) <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant={product.isActive ? 'success' : 'destructive'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                {editingId ? 'Edit Produk' : 'Tambah Produk'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                id="prodName"
                label="Nama Produk"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama produk"
              />

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi produk"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-[#D3DC86] text-[#778873] placeholder:text-[#A1BC99]/60 focus:outline-none focus:border-[#A1BC99] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="prodPrice"
                  label="Harga"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="50000"
                />
                <Input
                  id="prodComparePrice"
                  label="Harga Coret"
                  type="number"
                  value={form.comparePrice}
                  onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                  placeholder="Opsional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="prodStock"
                  label="Stok"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                />
                <Input
                  id="prodWeight"
                  label="Berat (gram)"
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#778873] mb-1.5">Kategori</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-[#D3DC86] text-[#778873] focus:outline-none focus:border-[#A1BC99] transition-colors"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-[#778873] mb-1.5">Gambar Produk</label>
                <div className="flex gap-2 mb-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="w-full text-sm text-[#778873] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#A1BC99] file:text-white hover:file:bg-[#778873] file:cursor-pointer file:transition-colors disabled:opacity-50"
                    />
                  </div>
                  {uploadingImage && <LoadingSpinner size="sm" />}
                </div>
                <div className="flex gap-2 mt-2 items-end">
                  <div className="flex-1">
                    <Input
                      id="prodImageUrl"
                      label="Atau masukkan URL gambar"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (newImageUrl) {
                        setForm({ ...form, images: [...form.images, newImageUrl] });
                        setNewImageUrl('');
                      }
                    }}
                  >
                    Tambah URL
                  </Button>
                </div>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt="" className="object-cover w-full h-full" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#A1BC99]"
                />
                <span className="text-sm text-[#778873]">Produk Aktif</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><LoadingSpinner size="sm" className="mr-2" />Menyimpan...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />{editingId ? 'Simpan' : 'Tambah'}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
