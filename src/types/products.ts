export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  themeColor: string;
  logo: string;
  manual?: string;
  features: string[];
  price?: number;
}
