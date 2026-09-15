import React from "react";
import { Activity } from "@/types";
import { MOCK_ACTIVITIES } from "@/data/activities";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ActivityCard } from "@/components/common/ActivityCard";

export interface ExperienceProps {
  activities?: Activity[];
}

export const Experience: React.FC<ExperienceProps> = ({
  activities = MOCK_ACTIVITIES,
}) => {
  return (
    <section
      id="ambiente"
      className="py-16 sm:py-20 lg:py-24 bg-cream-soft/70 scroll-mt-20 border-t border-[#F3EADA]/60"
      aria-label="Actividades y ambiente"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="El espacio"
          title="Actividades y ambiente"
          subtitle="Más que una cafetería: un lugar acogedor donde pasar el tiempo sin prisas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
};
