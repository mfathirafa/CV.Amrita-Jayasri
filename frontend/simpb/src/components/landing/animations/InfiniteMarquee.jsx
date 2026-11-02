/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export const InfiniteMarquee = ({
  children,
  speed = 40,
}) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        className="flex min-w-max gap-8 items-center pr-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};
