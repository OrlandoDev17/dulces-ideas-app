"use client";

import { motion } from "motion/react";
import { LucideIcon, ShoppingBasket, Plus, HelpCircle } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/common/Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  subIcons?: LucideIcon[];
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: MainIcon = ShoppingBasket,
  subIcons = [],
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-4 px-4 text-center max-w-lg mx-auto"
    >
      {/* Illustration Area */}
      <motion.div variants={fadeUp} className="mb-4">
        {/* Flat Background Card */}
        <div className="size-40 bg-primary-100/30 rounded-3xl flex flex-col items-center justify-center border border-primary-200/50">
          <MainIcon size={48} className="text-primary-300" strokeWidth={1.5} />
          <div className="flex gap-2 mt-3 items-center">
            {subIcons.map((Icon, idx) => (
              <Icon
                key={idx}
                size={16}
                className="text-primary-300/80"
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Text Context */}
      <motion.div variants={fadeUp} className="space-y-1 mb-6">
        <h3 className="text-lg md:text-xl font-black text-primary-900">
          {title}
        </h3>
        <p className="text-primary-400 font-medium text-xs md:text-sm max-w-xs mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div variants={fadeUp} className="w-full sm:w-auto">
        {primaryAction && (
          <Button
            style="primary"
            onClick={primaryAction.onClick}
            className="px-6 py-2.5 rounded-xl bg-primary-800 text-white hover:bg-primary-900 min-w-[160px]"
          >
            <primaryAction.icon size={16} className="stroke-[3]" />
            <span className="text-xs">{primaryAction.label}</span>
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
