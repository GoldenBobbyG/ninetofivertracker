//I wanted to use the npm package but had errors with it but will add later for effect of a title when opening the cli program. 
declare module 'asciiart-logo' {
    export default function config(options: {
      name?: string;
      font?: string;
      lineChars?: number;
      padding?: number;
      margin?: number;
      borderColor?: string;
      logoColor?: string;
      textColor?: string;
    }): any;
    export function render(options: LogoConfig): void;
  }