export {};
declare global {
  type StaticImageData = {
    src: string
    height: number
    width: number
    blurDataURL?: string
  };

  interface Window {
    ApplePaySession: any;
  }

}
