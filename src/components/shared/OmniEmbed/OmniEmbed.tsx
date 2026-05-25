import { useEffect, useState } from 'react';

interface OmniEmbedProps {
  url: string;
  allowMicrophone?: boolean;
}

export function OmniEmbed({ url, allowMicrophone }: OmniEmbedProps) {
  const [height, setHeight] = useState<string | number>('100%');

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
      allow={
        allowMicrophone ? 'clipboard-write; microphone' : 'clipboard-write'
      }
      frameBorder="0"
      style={{ display: 'block', flexGrow: 1 }}
    />
  );
}
