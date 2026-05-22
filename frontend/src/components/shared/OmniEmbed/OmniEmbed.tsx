import { useEffect, useState } from 'react';

interface OmniEmbedProps {
  url: string;
}

export function OmniEmbed({ url }: OmniEmbedProps) {
  const [height, setHeight] = useState('calc(100vh - 80px)');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const urlOrigin = new URL(url).origin;
      if (event.origin !== urlOrigin) return;

      if (event.data?.name === 'size' && event.data.payload?.height) {
        setHeight(`${event.data.payload.height}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [url]);

  return (
    <iframe
      src={url}
      width="100%"
      height={height}
      allow="clipboard-write"
      frameBorder="0"
      style={{ display: 'block' }}
    />
  );
}
