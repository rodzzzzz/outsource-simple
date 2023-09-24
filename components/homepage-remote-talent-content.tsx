"use client"

import * as React from "react"

import "@/styles/editor.css"
import Image from "next/image"
import Link from "next/link"
import { HomePageFeaturesItem } from "@/types"
import { motion } from "framer-motion"

import { homePageFeaturesConfig } from "@/config/features"
import { fadeIn, textVariant } from "@/config/motion"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface HomePageFeatureProps extends React.HTMLAttributes<HTMLSpanElement> {
  feature: HomePageFeaturesItem
}

const HomePageFeature = ({ feature, className }: HomePageFeatureProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      exit="exit"
      viewport={{ once: false, amount: 0.5 }}
      className={cn(
        "px-8 py-12 space-y-6 grid place-content-center md:my-auto md:h-screen shrink-0 overflow-hidden",
        feature.className,
        className
      )}
    >
      <div className="grid grid-cols-1 w-full max-w-[1400px] gap-6 mx-auto md:grid-cols-2 place-items-center h-full">
        <div className="flex flex-col w-full space-y-4 lg:space-y-6">
          <motion.h2
            variants={textVariant(0.3, 1)}
            className={cn(
              "text-2xl max-w-[80%] font-heading sm:text-4xl lg:text-5xl"
            )}
          >
            {/* Global talent{" "}
        <span className="font-serif italic font-normal">
          at your fingertips
        </span> */}
            {feature.title}
          </motion.h2>
          <motion.p
            variants={textVariant(0.4, 1)}
            className={cn(
              "max-w-[80%] leading-normal sm:text-lg md:text-2xl md:leading-7"
            )}
          >
            {feature.description}
          </motion.p>

          <motion.span variants={textVariant(0.5, 1)}>
            <Link
              href={feature.url}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-fit bg-foreground text-background hover:bg-foreground/90 md:text-base"
              )}
            >
              <span>{feature.cta}</span>
            </Link>
          </motion.span>
        </div>
        <motion.div
          variants={fadeIn("left", "tween", 0.4, 1)}
          className="flex justify-center w-full -order-1 md:order-1"
        >
          <Image
            className="w-full rounded-3xl"
            width={600}
            height={300}
            src={feature.image}
            alt={`${feature.title}-feature-image`}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

export const HomePageRemoteTalentHero = () => {
  return (
    <section className="pt-8 pb-40 lg:pt-16 lg:space-y-16 lg:pb-48">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container flex max-w-[65rem] flex-col items-center gap-4 text-center text-background"
      >
        <motion.h1
          variants={textVariant(0.1, 1)}
          className="text-3xl font-heading sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Work remotely and get paid
          <br />
          <span className="font-serif italic text-[0.9em] font-normal">
            commission-free
          </span>
        </motion.h1>
        <motion.p
          variants={textVariant(0.2, 1)}
          className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8"
        >
          Find your dream remote job and get paid on your terms with Outsource
          Simple. Easy, safe, and anywhere in the world. 🌍
        </motion.p>
        <motion.span
          variants={textVariant(0.3, 1)}
          className="inline-flex flex-wrap justify-center w-full mt-6 gap-y-3 gap-x-6 md:mt-12"
        >
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "font-semibold md:text-base bg-secondary-foreground hover:bg-secondary-foreground/90 border-secondary text-secondary"
            )}
          >
            <span>Discover remote jobs</span>
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "md:text-base font-semibold"
            )}
          >
            <span>Get Started</span>
            <Icons.arrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.span>
      </motion.div>
    </section>
  )
}

export function HomePageRemoteTalentContent() {
  return (
    <React.Fragment>
      {homePageFeaturesConfig.remoteTalentPage.map((feature) => (
        <HomePageFeature key={feature.title} feature={feature} />
      ))}

      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Bootstraped
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We&apos;ve built Outsource Simple from the ground up, remaining
            truely committed to our mission of making remote hiring seamless and
            simple for companies of all size.
          </p>
        </div>
      </section>
    </React.Fragment>
  )
}
