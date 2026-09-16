"use client";

import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface SideVineProps {
  side: "left" | "right";
}

/**
 * Flores Amarillas y enredadera lateral de alta fidelidad botánica.
 *
 * Mejoras aplicadas:
 * - Flores realistas con 12 pétalos en capas (anillo exterior dorado + anillo interior luminoso con nervadura),
 *   cáliz botánico verde en la base y disco central texturizado con anillo de estambres/polen.
 * - Conexión matemática 100% exacta entre tallo, ramita y cáliz de la flor (sin huecos ni partes flotantes).
 * - CERO tallos, hojas o flores visibles a scroll=0. Todo inicia en opacidad 0 y pathLength 0.
 * - Capullos compañeros y hojas dobles con nervadura botánica.
 * - Z-index 30 para mantenerse siempre por encima de separadores de sección y fondos.
 * - Ubicación desplazada a left-4 / right-4 (despegada del borde de pantalla).
 * - Respeta estrictamente prefers-reduced-motion.
 */

interface FlowerConfig {
  threshold: number;
  stemX: number;
  stemY: number;
  flowerX: number;
  flowerY: number;
  size: number;
  rotation: number;
  hasCompanion?: boolean;
  companionDeltaX?: number;
  companionDeltaY?: number;
  companionSize?: number;
}

interface LeafConfig {
  threshold: number;
  stemX: number;
  stemY: number;
  size: number;
  rotation: number;
  side: "left" | "right";
  isPair?: boolean;
}

const FLOWERS: FlowerConfig[] = [
  {
    threshold: 0.12,
    stemX: 42,
    stemY: 175,
    flowerX: 58,
    flowerY: 155,
    size: 18,
    rotation: -15,
    hasCompanion: true,
    companionDeltaX: 14,
    companionDeltaY: -14,
    companionSize: 10,
  },
  {
    threshold: 0.24,
    stemX: 24,
    stemY: 240,
    flowerX: 12,
    flowerY: 255,
    size: 20,
    rotation: 18,
  },
  {
    threshold: 0.36,
    stemX: 40,
    stemY: 360,
    flowerX: 62,
    flowerY: 345,
    size: 22,
    rotation: -18,
    hasCompanion: true,
    companionDeltaX: 14,
    companionDeltaY: 14,
    companionSize: 11,
  },
  {
    threshold: 0.48,
    stemX: 34,
    stemY: 480,
    flowerX: 14,
    flowerY: 470,
    size: 20,
    rotation: 14,
  },
  {
    threshold: 0.60,
    stemX: 28,
    stemY: 600,
    flowerX: 60,
    flowerY: 590,
    size: 23,
    rotation: -14,
    hasCompanion: true,
    companionDeltaX: 15,
    companionDeltaY: -13,
    companionSize: 11,
  },
  {
    threshold: 0.72,
    stemX: 42,
    stemY: 740,
    flowerX: 16,
    flowerY: 730,
    size: 21,
    rotation: 20,
  },
  {
    threshold: 0.83,
    stemX: 52,
    stemY: 820,
    flowerX: 64,
    flowerY: 805,
    size: 22,
    rotation: -12,
    hasCompanion: true,
    companionDeltaX: -14,
    companionDeltaY: 14,
    companionSize: 11,
  },
  {
    threshold: 0.92,
    stemX: 36,
    stemY: 920,
    flowerX: 18,
    flowerY: 935,
    size: 20,
    rotation: 18,
  },
];

const LEAVES: LeafConfig[] = [
  {
    threshold: 0.08,
    stemX: 48,
    stemY: 90,
    size: 15,
    rotation: 26,
    side: "right",
    isPair: true,
  },
  {
    threshold: 0.19,
    stemX: 30,
    stemY: 200,
    size: 17,
    rotation: -30,
    side: "left",
  },
  {
    threshold: 0.30,
    stemX: 28,
    stemY: 310,
    size: 16,
    rotation: 24,
    side: "right",
    isPair: true,
  },
  {
    threshold: 0.42,
    stemX: 54,
    stemY: 425,
    size: 18,
    rotation: -28,
    side: "left",
  },
  {
    threshold: 0.54,
    stemX: 36,
    stemY: 540,
    size: 17,
    rotation: 22,
    side: "right",
    isPair: true,
  },
  {
    threshold: 0.66,
    stemX: 20,
    stemY: 660,
    size: 18,
    rotation: -26,
    side: "left",
  },
  {
    threshold: 0.77,
    stemX: 56,
    stemY: 780,
    size: 16,
    rotation: 24,
    side: "right",
    isPair: true,
  },
  {
    threshold: 0.88,
    stemX: 44,
    stemY: 880,
    size: 17,
    rotation: -28,
    side: "left",
  },
  {
    threshold: 0.95,
    stemX: 30,
    stemY: 960,
    size: 15,
    rotation: 20,
    side: "right",
  },
];

/* -------------------------------------------------------
 * Flor Botánica Realista con Cáliz y 12 Pétalos en Capas
 * ----------------------------------------------------- */
interface FlowerHeadProps {
  cx: number;
  cy: number;
  size: number;
  rotation: number;
  side: "left" | "right";
}

const RealisticFlowerHead: React.FC<FlowerHeadProps> = ({
  cx,
  cy,
  size,
  rotation,
  side,
}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rotation})`}>
    {/* Cáliz botánico verde en la base que conecta con el tallo */}
    <g>
      <circle cx="0" cy="0" r={size * 0.38} fill="#4E5F35" />
      {[-60, 0, 60, 120, 180, 240].map((deg, sIdx) => (
        <path
          key={`calyx-${sIdx}`}
          d={`M 0 0 L ${size * 0.2} ${-size * 0.44} L ${-size * 0.2} ${-size * 0.44} Z`}
          fill="#5F7440"
          transform={`rotate(${deg})`}
        />
      ))}
    </g>

    {/* Anillo exterior: 6 pétalos de soporte en ámbar dorado cálido */}
    {[30, 90, 150, 210, 270, 330].map((angle, pIdx) => (
      <path
        key={`outer-${pIdx}`}
        d={`
          M 0 0
          C ${-size * 0.22} ${-size * 0.3},
            ${-size * 0.38} ${-size * 0.75},
            0 ${-size * 1.05}
          C ${size * 0.38} ${-size * 0.75},
            ${size * 0.22} ${-size * 0.3},
            0 0
          Z
        `}
        fill="#E8A725"
        transform={`rotate(${angle})`}
      />
    ))}

    {/* Anillo interior: 6 pétalos frontales con degradado dorado brillante */}
    {[0, 60, 120, 180, 240, 300].map((angle, pIdx) => (
      <g key={`inner-${pIdx}`} transform={`rotate(${angle})`}>
        <path
          d={`
            M 0 0
            C ${-size * 0.2} ${-size * 0.28},
              ${-size * 0.34} ${-size * 0.7},
              0 ${-size * 0.96}
            C ${size * 0.34} ${-size * 0.7},
              ${size * 0.2} ${-size * 0.28},
              0 0
            Z
          `}
          fill={`url(#flower-grad-${side})`}
        />
        {/* Nervadura delicada translúcida en el pétalo */}
        <path
          d={`M 0 0 L 0 ${-size * 0.75}`}
          stroke="#FEF08A"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    ))}

    {/* Disco central botánico (Capitulum) con estambres */}
    <circle cx="0" cy="0" r={size * 0.36} fill="#C27C3B" />
    <circle cx="0" cy="0" r={size * 0.26} fill="#A05A20" />

    {/* Anillo de flores/estambres de polen */}
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((floretAngle, fIdx) => (
      <circle
        key={`stamen-${fIdx}`}
        cx={size * 0.28 * Math.cos((floretAngle * Math.PI) / 180)}
        cy={size * 0.28 * Math.sin((floretAngle * Math.PI) / 180)}
        r={size * 0.065}
        fill="#FEF08A"
      />
    ))}

    {/* Destello de polen central */}
    <circle
      cx={-size * 0.08}
      cy={-size * 0.08}
      r={size * 0.09}
      fill="#FFEAA7"
    />
  </g>
);

/* -------------------------------------------------------
 * Capullo Floral Acompañante
 * ----------------------------------------------------- */
interface BudProps {
  cx: number;
  cy: number;
  size: number;
  rotation: number;
}

const FlowerBud: React.FC<BudProps> = ({ cx, cy, size, rotation }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rotation})`}>
    {/* Cáliz verde envolvente */}
    <path
      d={`M 0 0 C ${-size * 0.4} ${-size * 0.6}, ${-size * 0.6} ${-size * 1.0}, 0 ${-size * 1.3} C ${size * 0.6} ${-size * 1.0}, ${size * 0.4} ${-size * 0.6}, 0 0 Z`}
      fill="#526139"
    />
    {/* Punta de pétalos amarillos emergiendo */}
    <path
      d={`M 0 ${-size * 0.8} C ${-size * 0.25} ${-size * 1.1}, 0 ${-size * 1.45}, 0 ${-size * 1.45} C 0 ${-size * 1.45}, ${size * 0.25} ${-size * 1.1}, 0 ${-size * 0.8} Z`}
      fill="#F4C542"
    />
    <circle cx="0" cy="0" r={size * 0.22} fill="#3E4E2A" />
  </g>
);

/* -------------------------------------------------------
 * Nodo de Flor con Conexión Física Exacta al Tallo
 * ----------------------------------------------------- */
interface FlowerItemProps {
  flower: FlowerConfig;
  side: "left" | "right";
  scrollYProgress: any;
  shouldReduceMotion: boolean | null;
}

const FlowerItem: React.FC<FlowerItemProps> = ({
  flower,
  side,
  scrollYProgress,
  shouldReduceMotion,
}) => {
  // Comienza 0.05 antes del umbral; opacidad estrictamente 0 a scroll=0
  const start = Math.max(0.05, flower.threshold - 0.05);
  const end = flower.threshold;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.1, 1]);

  const midX = (flower.stemX + flower.flowerX) / 2;
  const midY = (flower.stemY + flower.flowerY) / 2 + (flower.flowerX > flower.stemX ? 4 : -4);

  return (
    <motion.g
      style={{
        opacity: shouldReduceMotion ? 1 : opacity,
        scale: shouldReduceMotion ? 1 : scale,
        transformOrigin: `${flower.stemX}px ${flower.stemY}px`,
      }}
    >
      {/* Ramita que NACE EXACTAMENTE en la coordenada (stemX, stemY) del tallo principal */}
      <path
        d={`M ${flower.stemX} ${flower.stemY} Q ${midX} ${midY} ${flower.flowerX} ${flower.flowerY}`}
        stroke="#526139"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Flor principal directamente acoplada al extremo de la ramita */}
      <RealisticFlowerHead
        cx={flower.flowerX}
        cy={flower.flowerY}
        size={flower.size}
        rotation={flower.rotation}
        side={side}
      />

      {/* Capullo o flor compañera unida firmemente a la flor principal */}
      {flower.hasCompanion && flower.companionDeltaX && flower.companionDeltaY && flower.companionSize && (
        <g>
          {/* Ramita secundaria conectando con el capullo */}
          <path
            d={`M ${flower.flowerX} ${flower.flowerY} Q ${flower.flowerX + flower.companionDeltaX * 0.4} ${flower.flowerY + flower.companionDeltaY * 0.6} ${flower.flowerX + flower.companionDeltaX} ${flower.flowerY + flower.companionDeltaY}`}
            stroke="#526139"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <FlowerBud
            cx={flower.flowerX + flower.companionDeltaX}
            cy={flower.flowerY + flower.companionDeltaY}
            size={flower.companionSize}
            rotation={flower.rotation + 25}
          />
        </g>
      )}
    </motion.g>
  );
};

/* -------------------------------------------------------
 * Nodo de Hojas Orgánicas
 * ----------------------------------------------------- */
interface LeafItemProps {
  leaf: LeafConfig;
  scrollYProgress: any;
  shouldReduceMotion: boolean | null;
}

const LeafItem: React.FC<LeafItemProps> = ({
  leaf,
  scrollYProgress,
  shouldReduceMotion,
}) => {
  const start = Math.max(0.04, leaf.threshold - 0.04);
  const end = leaf.threshold;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.1, 1]);

  return (
    <motion.g
      style={{
        opacity: shouldReduceMotion ? 1 : opacity,
        scale: shouldReduceMotion ? 1 : scale,
        transformOrigin: `${leaf.stemX}px ${leaf.stemY}px`,
      }}
    >
      <g transform={`translate(${leaf.stemX} ${leaf.stemY}) rotate(${leaf.rotation})`}>
        {/* Hoja principal */}
        <path
          d={
            leaf.side === "left"
              ? `M 0 0 C ${-leaf.size * 0.4} ${-leaf.size * 0.8}, ${-leaf.size * 1.1} ${-leaf.size * 0.6}, ${-leaf.size * 1.2} 0 C ${-leaf.size * 0.7} ${leaf.size * 0.5}, ${-leaf.size * 0.3} ${leaf.size * 0.4}, 0 0 Z`
              : `M 0 0 C ${leaf.size * 0.4} ${-leaf.size * 0.8}, ${leaf.size * 1.1} ${-leaf.size * 0.6}, ${leaf.size * 1.2} 0 C ${leaf.size * 0.7} ${leaf.size * 0.5}, ${leaf.size * 0.3} ${leaf.size * 0.4}, 0 0 Z`
          }
          fill="#5B723C"
        />
        {/* Nervadura central */}
        <path
          d={
            leaf.side === "left"
              ? `M 0 0 C ${-leaf.size * 0.4} ${-leaf.size * 0.15}, ${-leaf.size * 0.8} ${-leaf.size * 0.1}, ${-leaf.size * 1.05} 0`
              : `M 0 0 C ${leaf.size * 0.4} ${-leaf.size * 0.15}, ${leaf.size * 0.8} ${-leaf.size * 0.1}, ${leaf.size * 1.05} 0`
          }
          stroke="#3C4D26"
          strokeWidth="1.0"
          fill="none"
          strokeLinecap="round"
        />

        {/* Hoja compañera en par para dar frondosidad vegetal */}
        {leaf.isPair && (
          <g transform={`rotate(${leaf.side === "left" ? 42 : -42}) scale(0.78)`}>
            <path
              d={
                leaf.side === "left"
                  ? `M 0 0 C ${-leaf.size * 0.4} ${-leaf.size * 0.8}, ${-leaf.size * 1.1} ${-leaf.size * 0.6}, ${-leaf.size * 1.2} 0 C ${-leaf.size * 0.7} ${leaf.size * 0.5}, ${-leaf.size * 0.3} ${leaf.size * 0.4}, 0 0 Z`
                  : `M 0 0 C ${leaf.size * 0.4} ${-leaf.size * 0.8}, ${leaf.size * 1.1} ${-leaf.size * 0.6}, ${leaf.size * 1.2} 0 C ${leaf.size * 0.7} ${leaf.size * 0.5}, ${leaf.size * 0.3} ${leaf.size * 0.4}, 0 0 Z`
              }
              fill="#4A5E30"
            />
            <path
              d={
                leaf.side === "left"
                  ? `M 0 0 C ${-leaf.size * 0.4} ${-leaf.size * 0.15}, ${-leaf.size * 0.8} ${-leaf.size * 0.1}, ${-leaf.size * 1.05} 0`
                  : `M 0 0 C ${leaf.size * 0.4} ${-leaf.size * 0.15}, ${leaf.size * 0.8} ${-leaf.size * 0.1}, ${leaf.size * 1.05} 0`
              }
              stroke="#2E3C1D"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    </motion.g>
  );
};

/* -------------------------------------------------------
 * Componente Principal SideVine
 * ----------------------------------------------------- */

export const SideVine: React.FC<SideVineProps> = ({ side }) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // El tallo comienza en 0 a scroll=0 y va creciendo hacia abajo
  const stemPathLength = useTransform(
    scrollYProgress,
    [0, 0.95],
    [0, 1]
  );

  const entwinedPathLength = useTransform(
    scrollYProgress,
    [0, 0.95],
    [0, 1]
  );

  // Opacidad del tallo: en scroll=0 es 0, alcanza visibilidad suave rápidamente
  const stemOpacity = useTransform(
    scrollYProgress,
    [0, 0.06],
    [0, 1]
  );

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 inset-y-0 z-30 hidden w-[96px] pointer-events-none 2xl:block ${
        side === "left" ? "left-4 2xl:left-5" : "right-4 2xl:right-5"
      }`}
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <svg
        viewBox="0 0 96 1000"
        className="h-full w-full"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Gradiente botánico para el tallo */}
          <linearGradient
            id={`vine-grad-${side}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7A8B5A" />
            <stop offset="50%" stopColor="#5E7240" />
            <stop offset="100%" stopColor="#43522C" />
          </linearGradient>

          {/* Gradiente dorado realista para los pétalos de flores amarillas */}
          <linearGradient
            id={`flower-grad-${side}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFF385" />
            <stop offset="35%" stopColor="#F4C542" />
            <stop offset="85%" stopColor="#E9A820" />
            <stop offset="100%" stopColor="#CF8512" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------
            Tallo Secundario Entrelazado
            Animado: pathLength 0 en scroll 0
        ------------------------------------------------ */}
        <motion.path
          d="
            M 34 0
            C 28 50,  46 100, 42 160
            C 28 220, 22 280, 38 345
            C 56 410, 40 470, 34 535
            C 20 600, 24 660, 42 725
            C 58 790, 40 845, 36 905
            C 24 950, 30 980, 38 1000
          "
          fill="none"
          stroke="#7A9154"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: shouldReduceMotion ? 1 : entwinedPathLength,
            opacity: shouldReduceMotion ? 1 : stemOpacity,
          }}
        />

        {/* ------------------------------------------------
            Tallo Principal
            Animado: pathLength 0 en scroll 0
        ------------------------------------------------ */}
        <motion.path
          d="
            M 36 0
            C 46 65,  54 115, 42 175
            C 24 235, 20 295, 40 360
            C 58 425, 50 485, 34 550
            C 18 615, 22 675, 42 740
            C 60 805, 52 860, 36 920
            C 22 960, 28 985, 38 1000
          "
          fill="none"
          stroke={`url(#vine-grad-${side})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: shouldReduceMotion ? 1 : stemPathLength,
            opacity: shouldReduceMotion ? 1 : stemOpacity,
          }}
        />

        {/* ------------------------------------------------
            Hojas Orgánicas
            Animadas: 100% invisibles en scroll 0
        ------------------------------------------------ */}
        {LEAVES.map((leaf, index) => (
          <LeafItem
            key={`leaf-${side}-${index}`}
            leaf={leaf}
            scrollYProgress={scrollYProgress}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}

        {/* ------------------------------------------------
            Flores Amarillas Realistas
            Animadas: 100% invisibles en scroll 0
        ------------------------------------------------ */}
        {FLOWERS.map((flower, index) => (
          <FlowerItem
            key={`flower-${side}-${index}`}
            flower={flower}
            side={side}
            scrollYProgress={scrollYProgress}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </svg>
    </div>
  );
};

export default SideVine;