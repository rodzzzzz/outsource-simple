"use client"

import React from "react"

import { freeResumeBuilderSteps } from "@/config/steps"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

import { FreeResumeBuilderSteps } from "./free-resume-builder-steps"
import { FreeResumeDetailsForm } from "./free-resume-details-form"
import { FreeResumeEducationForm } from "./free-resume-education-form"
import { FreeResumeSocialsForm } from "./free-resume-socials-form"
import { FreeResumeWorkForm } from "./free-resume-work-form"

export function FreeResumeBuilder() {
  const [active, setActive] = React.useState<number>(0)
  const [done, setDone] = React.useState<number>(0)
  const [openPreview, setOpenPreview] = React.useState(false)

  const [details, setDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    title: "",
    portfolioUrl: "",
    skillSet: [],
    summary: "",
  })

  const [socials, setSocials] = React.useState({
    socials: [{ platform: undefined, url: "" }],
  })

  const [workHistories, setWorkHistories] = React.useState({
    workHistories: [
      {
        company: "",
        jobTitle: "",
        employmentType: undefined,
        fromDate: undefined,
        toDate: undefined,
        currentlyWorking: false,
        skillSet: [],
        details: "",
      },
    ],
  })

  const [educations, setEducations] = React.useState({
    educations: [
      {
        schoolName: "",
        level: undefined,
        fieldOfStudy: "",
        fromDate: undefined,
        toDate: undefined,
        currentlyStudying: false,
        details: "",
      },
    ],
  })

  React.useEffect(() => {
    if (active > done) {
      setDone(active)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <React.Fragment>
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-wrap-reverse items-center justify-between gap-6">
          <FreeResumeBuilderSteps
            steps={freeResumeBuilderSteps}
            active={active}
            done={done}
          />
          {active >= freeResumeBuilderSteps.length - 1 && (
            <button
              type="submit"
              form="free-resume-education-form"
              className={cn(buttonVariants(), "w-full md:w-fit")}
            >
              <Icons.view className="w-4 h-4 mr-2" />
              <span>Preview and print</span>
            </button>
          )}
        </div>

        {active === 0 && (
          <FreeResumeDetailsForm
            details={details}
            setDetails={setDetails}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <FreeResumeSocialsForm
            socials={socials}
            setSocials={setSocials}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <FreeResumeWorkForm
            workHistories={workHistories}
            setWorkHistories={setWorkHistories}
            setActive={setActive}
          />
        )}
        {active === 3 && (
          <FreeResumeEducationForm
            id="free-resume-education-form"
            educations={educations}
            setEducations={setEducations}
            setActive={setActive}
            setDone={setDone}
            setOpenPreview={setOpenPreview}
          />
        )}
      </div>

      <Sheet open={openPreview} onOpenChange={setOpenPreview}>
        <SheetContent position="bottom" size="content">
          <SheetHeader>
            <SheetTitle>Here&apos;s your resume! 🎉</SheetTitle>
            <SheetDescription>
              Make sure that all your details are correct. You can still go back
              and edit.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </React.Fragment>
  )
}
