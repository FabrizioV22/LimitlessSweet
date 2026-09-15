import { Testimonial } from "@/types";

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "María G.",
    context: "Celiaca • 27 años",
    quote:
      "Como celiaca, por fin puedo pedir cualquier postre del menú sin preguntar. Me encanta el ambiente y el tema de flores amarillas.",
    rating: 5,
    avatar: "/images/testimonial-maria.jpg",
  },
  {
    id: "test-2",
    name: "Carlos R.",
    context: "Alergia a frutos secos • 34 años",
    quote:
      "El cheesecake de maracuyá es increíble. Por primera vez siento que un lugar entiende realmente mis necesidades alimentarias.",
    rating: 5,
    avatar: "/images/testimonial-carlos.jpg",
  },
  {
    id: "test-3",
    name: "Laura P.",
    context: "Intolerancia a lactosa • 31 años",
    quote:
      "Traigo a mis amigas aquí todos los meses. El cambio de tema les sorprende y a mí me da tranquilidad total.",
    rating: 5,
    avatar: "/images/testimonial-laura.jpg",
  },
];
