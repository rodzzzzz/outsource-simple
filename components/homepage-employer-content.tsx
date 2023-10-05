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
                "w-fit bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              <span>{feature.cta}</span>
            </Link>
          </motion.span>
        </div>
        <motion.div
          variants={fadeIn("left", "tween", 0.6, 1)}
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

export const HomePageEmployerHero = () => {
  return (
    <section className="pt-8 pb-40 lg:pt-16 lg:space-y-16 lg:pb-48">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container flex max-w-[65rem] flex-col items-center gap-4 text-center"
      >
        <motion.h1
          variants={textVariant(0.1, 1)}
          className="text-3xl font-heading sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hire and pay remote talents
          <br />
          <span className="font-serif italic text-[0.9em] font-normal">
            all in one place
          </span>
        </motion.h1>
        <motion.p
          variants={textVariant(0.2, 1)}
          className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        >
          Outsource Simple is your all-in-one platform for starting or growing
          your remote team. Hassle-free and seamless. ✨
        </motion.p>
        <motion.span
          variants={textVariant(0.3, 1)}
          className="inline-flex flex-wrap justify-center w-full mt-6 gap-y-3 gap-x-6 md:mt-12"
        >
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "font-semibold md:text-base"
            )}
          >
            <span>Discover remote talents</span>
          </Link>
          <Link
            href={{ pathname: "register" }}
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

export function HomePageEmployerContent() {
  return (
    <React.Fragment>
      {homePageFeaturesConfig.employerPage.map((feature) => (
        <HomePageFeature
          key={feature.title}
          feature={feature}
          className={feature.className}
        />
      ))}

      <section className="container py-8 md:py-12 lg:py-24">
        <div className="max-w-5xl mx-auto my-32 sm:mt-56">
          <div className="px-6 mb-12 lg:px-8">
            <div className="max-w-2xl mx-auto sm:text-center">
              <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                Start chatting in minutes
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Chatting to your PDF files has never been easier than with
                Quill.
              </p>
            </div>
          </div>
          <ol className="pt-8 my-8 space-y-4 md:flex md:space-x-12 md:space-y-0">
            <li className="md:flex-1">
              <div className="flex flex-col py-2 pl-4 space-y-2 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-blue-600">
                  Step 1
                </span>
                <span className="text-xl font-semibold">
                  Sign up for an account
                </span>
                <span className="mt-2 text-zinc-700">
                  Either starting out with a free plan or choose our{" "}
                  <Link
                    href="/pricing"
                    className="text-blue-700 underline underline-offset-2"
                  >
                    pro plan
                  </Link>
                  .
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div className="flex flex-col py-2 pl-4 space-y-2 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-blue-600">
                  Step 2
                </span>
                <span className="text-xl font-semibold">
                  Upload your PDF file
                </span>
                <span className="mt-2 text-zinc-700">
                  We&apos;ll process your file and make it ready for you to chat
                  with.
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div className="flex flex-col py-2 pl-4 space-y-2 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-blue-600">
                  Step 3
                </span>
                <span className="text-xl font-semibold">
                  Start asking questions
                </span>
                <span className="mt-2 text-zinc-700">
                  It&apos;s that simple. Try out Quill today - it really takes
                  less than a minute.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </React.Fragment>
  )
}
