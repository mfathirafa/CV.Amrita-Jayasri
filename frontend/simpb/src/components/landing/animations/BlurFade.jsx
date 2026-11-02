/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const BlurFade = ({
  children,
  delay = 0,
  yOffset = 20,
  inViewMargin = "-50px",
  blur = "6px",
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: inViewMargin });
  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: `blur(0px)` },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      variants={defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
