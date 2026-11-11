import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Check,
  Copy,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { api } from '../utils/api';
import { compressImage } from '../utils/imageCompressor';
import type { CmsMediaAsset } from '../types';

export const ImageLibrary: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<CmsMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get<CmsMediaAsset[]>('/media');
      setAssets(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load Media Library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let uploadedCount = 0;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`Skipped non-image file: ${file.name}`);
        continue;
      }
      try {
        const compressed = await compressImage(file, 1400, 1400, 0.84);
        const res = await api.post('/media/upload', {
          image: compressed,
          name: file.name,
          size: file.size,
          type: file.type,
          usedIn: ['Media Library'],
        });
        if (res.data?.success) {
          uploadedCount++;
        }
      } catch {
        toast.error(`Upload failed for ${file.name}`);
      }
    }

    if (uploadedCount > 0) {
      toast.success(`Uploaded ${uploadedCount} image${uploadedCount > 1 ? 's' : ''}!`);
      await loadMedia();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (publicId: string) => {
    if (!window.confirm('Delete this image from the CMS library?')) return;
    try {
      await api.delete(`/media/${encodeURIComponent(publicId)}`);
      toast.success('Image removed.');
      setAssets((prev) => prev.filter((a) => a.publicId !== publicId));
    } catch {
      toast.error('Failed to delete image.');
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Image URL copied to clipboard');
      setTimeout(() => setCopiedUrl(null), 1800);
    } catch {
      toast.error('Clipboard permission unavailable');
    }
  };

  const filtered = assets.filter((a) =>
    a.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cms-card">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1B2E] cms-heading">Image Library</h1>
          <p className="text-xs text-[#6F6A7C] mt-0.5 cms-subtext">
            Upload high-resolution photos for Hero, About, Industries, and Capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUploadFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white border border-[#E5E1ED] rounded-xl px-4 py-2.5 shadow-xs cms-card">
        <Search className="w-4 h-4 text-[#6F6A7C]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search uploaded images by filename or URL..."
          className="flex-1 text-sm bg-transparent focus:outline-none"
        />
        <span className="text-xs font-semibold text-[#7C3AED] bg-[#EEE8FA] px-2.5 py-1 rounded-full">
          {filtered.length} files
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#7C3AED]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E5E1ED] rounded-2xl p-12 text-center cms-card">
          <ImageIcon className="w-10 h-10 text-[#A78BFA] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1F1B2E] cms-heading">No images found</p>
          <p className="text-xs text-[#6F6A7C] mt-1 mb-4">
            Upload JPG, PNG, or WebP photos using the button above to use them across the website.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors cursor-pointer"
          >
            Select Photos from Computer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((asset) => (
            <div
              key={asset.publicId}
              className="bg-white border border-[#E5E1ED] rounded-2xl overflow-hidden shadow-xs flex flex-col group cms-card"
            >
              <div className="aspect-video bg-[#EEE8FA] relative overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-xs font-bold text-[#1F1B2E] truncate cms-heading">
                    {asset.originalName}
                  </p>
                  <p className="text-[11px] text-[#6F6A7C] truncate mt-0.5">{asset.url}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E1ED]">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.url)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    {copiedUrl === asset.url ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.publicId)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
