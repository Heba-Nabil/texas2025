interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
    snaptr?: any;
  }
  
  declare function fbq(...args: any[]): void;
  declare const ttq: {
    track: (...args: any[]) => void;
  }; 
  declare function snaptr(...args: any[]): void;