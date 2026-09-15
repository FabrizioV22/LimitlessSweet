export type AllergenTag =
  | 'sin-gluten'
  | 'sin-nueces'
  | 'vegano'
  | 'sin-azucar'
  | 'sin-lacteos'
  | 'contiene-huevo';

export interface Product {
  id: string;
  name: string;
  price: number; // en la unidad monetaria local, sin formatear
  description: string;
  image: string;
  tags: AllergenTag[];
  status: 'available' | 'sold-out-today' | 'available-tomorrow';
  isThemeOfMonth?: boolean;
}

export interface IngredientEntry {
  id: string;
  productName: string;
  description: string;
  certifications: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  context: string; // ej. "Celiaca • 27 años"
  quote: string;
  rating: number; // 1-5
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: 'dice' | 'camera' | 'sparkles';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReservationFormData {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  dietaryNotes?: string;
}
