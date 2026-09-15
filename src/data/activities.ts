import { Activity } from "@/types";

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "Juegos de mesa",
    description:
      "Relájate y diviértete con nuestra selección de juegos mientras disfrutas de un postre seguro.",
    image: "/images/activity-juegos.jpg",
    iconName: "dice",
  },
  {
    id: "act-2",
    title: "Zona instagrameable",
    description:
      "Espacios diseñados para capturar momentos especiales con la estética del tema del mes.",
    image: "/images/activity-insta.jpg",
    iconName: "camera",
  },
  {
    id: "act-3",
    title: "Ambientes temáticos",
    description:
      "Cada mes renovamos nuestro espacio con nuevos temas visuales inspiradores.",
    image: "/images/activity-ambientes.jpg",
    iconName: "sparkles",
  },
];
