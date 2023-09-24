import { Variants } from "framer-motion"

export const navVariants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 0.5,
    },
  },
}

export const slideIn = (
  direction: string,
  type: string,
  delay: number,
  duration: number
) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
    exit: {
      opacity: 0,
    },
  },
})

export const textContainer: Variants = {
  hidden: {
    opacity: 0,
    y: -100,
  },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1 },
  }),
}

export const textVariant = (delay: number, opacity: number) => ({
  hidden: {
    y: 100,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: opacity,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
  exit: {
    y: 0,
    opacity: 0,
  },
})

export const textVariant2: Variants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeIn",
      duration: 0.1,
    },
  },
}

export const fadeIn = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
  exit: {
    x: 0,
    y: 0,
    opacity: 0,
  },
})

export const staggerContainer = (staggerChildren: any, delayChildren: any) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})
