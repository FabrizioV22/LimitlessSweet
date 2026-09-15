"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dices, Camera, Sparkles } from "lucide-react";
import { Activity } from "@/types";

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.iconName) {
      case "dice":
        return <Dices className="w-5 h-5 text-mustard" />;
      case "camera":
        return <Camera className="w-5 h-5 text-mustard" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-mustard" />;
      default:
        return <Sparkles className="w-5 h-5 text-mustard" />;
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex flex-col bg-white rounded-card shadow-warm hover:shadow-warm-hover p-4 transition-all duration-300 border border-[#F3EADA]/60"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-cream-soft">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-light/50">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-ink">
            {activity.title}
          </h3>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          {activity.description}
        </p>
      </div>
    </motion.article>
  );
};
