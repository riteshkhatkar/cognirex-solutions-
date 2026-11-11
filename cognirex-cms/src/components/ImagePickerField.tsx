import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Upload, FolderOpen, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { compressImage } from '../utils/imageCompressor';
import type { CmsMediaAsset } from '../types';

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  usedIn?: string;
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onChange,
  usedIn = 'Section Image',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<CmsMediaAsset[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 1400, 1400, 0.84);
      const res = await api.post('/media/upload', {
        image: compressed,
        name: file.name,
        size: file.size,
        type: file.type,
        usedIn: [usedIn],
      });
      if (res.data?.success && res.data?.asset?.url) {
        onChange(res.data.asset.url);
        toast.success('Photo uploaded & linked!');
      } else {
        toast.error('Upload did not return a URL.');
      }
    } catch {
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openLibrary = async () => {
    setShowLibrary(true);
    setLoadingLib(true);
    try {
      const res = await api.get('/media');
      setLibraryAssets(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Could not load Image Library.');
    } finally {
      setLoadingLib(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C]">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[#F8F7FC] p-3 rounded-xl border border-[#E5E1ED] cms-muted-box">
        <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#E5E1ED] bg-white shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#A78BFA]" />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /images/... or upload"
            className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg focus:outline-none focus:border-[#7C3AED] cms-input"
          />

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
            </button>

            <button
              type="button"
              onClick={openLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 text-[#1F1B2E] text-xs font-semibold transition-colors cursor-pointer cms-card"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Image Library</span>
            </button>
          </div>
        </div>
      </div>

      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-[#1F1B2E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E1ED] shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden cms-card">
            <div className="px-5 py-4 border-b border-[#E5E1ED] flex items-center justify-between">
              <h3 className="font-bold text-base text-[#1F1B2E] cms-heading">
                Select Photo from Cognirex Media Library
              </h3>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {loadingLib ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" />
                </div>
              ) : libraryAssets.length === 0 ? (
                <p className="text-sm text-[#6F6A7C] text-center py-10">
                  No uploaded assets yet. Use &ldquo;Upload Photo&rdquo; above or upload in Image Library.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {libraryAssets.map((asset) => {
                    const selected = value === asset.url;
                    return (
                      <button
                        key={asset.publicId}
                        type="button"
                        onClick={() => {
                          onChange(asset.url);
                          setShowLibrary(false);
                          toast.success('Selected photo from library');
                        }}
                        className={`group relative aspect-video rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                          selected
                            ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/30'
                            : 'border-[#E5E1ED] hover:border-[#7C3AED]/50'
                        }`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.originalName}
                          className="w-full h-full object-cover"
                        />
                        {selected && (
                          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-[10px] text-white truncate">
                          {asset.originalName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
