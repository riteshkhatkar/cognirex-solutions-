import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react';
import { WEBSITE_ORIGIN } from '../utils/api';

interface LivePreviewFrameProps {
  section: string;
  data: unknown;
  previewPath?: string;
}

export const LivePreviewFrame: React.FC<LivePreviewFrameProps> = ({
  section,
  data,
  previewPath = '/',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const normalizedOrigin = (WEBSITE_ORIGIN || '').replace(/\/+$/, '');
  const normalizedPath = previewPath.startsWith('/') ? previewPath : `/${previewPath}`;
  const separator = normalizedPath.includes('?') ? '&' : '?';
  const websiteUrl = `${normalizedOrigin}${normalizedPath}${separator}cmsPreview=1`;
  const externalUrl = `${normalizedOrigin}${normalizedPath}`;

  const latestPayloadRef = useRef({ section, data });
  latestPayloadRef.current = { section, data };

  const syncDataToIframe = () => {
    const win = iframeRef.current?.contentWindow;
    const latest = latestPayloadRef.current;
    if (!win || !latest.data) return;
    win.postMessage(
      {
        type: 'CMS_LIVE_PREVIEW',
        section: latest.section,
        data: latest.data,
      },
      '*'
    );
  };

  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_PREVIEW_READY') {
        setIsLoaded(true);
        syncDataToIframe();
      }
    };
    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      syncDataToIframe();
    }
  }, [section, data, isLoaded]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    setTimeout(syncDataToIframe, 120);
    setTimeout(syncDataToIframe, 700);
  };

  const handleRefresh = () => {
    setIsLoaded(false);
    setIframeKey((k) => k + 1);
  };

  const containerWidth =
    viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%';

  return (
    <div className="flex flex-col h-full bg-[#EEE8FA]/40 rounded-2xl border border-[#E5E1ED] overflow-hidden shadow-xs cms-card">
      <div className="bg-white border-b border-[#E5E1ED] px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 cms-topbar">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
          <span className="text-xs font-bold text-[#1F1B2E] uppercase tracking-wider cms-heading">
            Live Website Preview
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#F8F7FC] p-1 rounded-xl border border-[#E5E1ED] cms-muted-box">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'tablet'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 text-[#6F6A7C] hover:text-[#7C3AED] rounded-lg hover:bg-[#EEE8FA]/60 transition-colors cursor-pointer"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#6F6A7C] hover:text-[#7C3AED] rounded-lg hover:bg-[#EEE8FA]/60 transition-colors"
            title="Open Live Website in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 flex justify-center items-start">
        <div
          style={{
            width: containerWidth,
            maxWidth: '100%',
            height: '100%',
            minHeight: '560px',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#E5E1ED]"
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={websiteUrl}
            onLoad={handleIframeLoad}
            title="Cognirex Solutions Live Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
