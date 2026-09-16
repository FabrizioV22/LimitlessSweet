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
      className="py-20 sm:py-24 lg:py-28 bg-cream-soft scroll-mt-20 overflow-hidden"
      aria-label="Actividades y ambiente"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="El espacio"
          title="Actividades y ambiente"
          subtitle="Más que una cafetería: un lugar acogedor donde pasar el tiempo sin prisas."
        />
      </div>

      {/* Full-bleed visual activity cards breaking container boundaries */}
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 mt-10 sm:mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
};
