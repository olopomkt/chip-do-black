declare global {
  interface Window {
    fbq: FacebookPixel;
    _fbq: any;
  }
}

interface FacebookPixel {
  (cmd: 'init' | 'track' | 'trackCustom', event: string, params?: any): void;
  queue?: any[];
  loaded?: boolean;
  version?: string;
}

export {};
