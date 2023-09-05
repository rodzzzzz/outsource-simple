import { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

// async function getAllJobs() {
//   return await db.postedJob.findMany({
//     where: {
//       expirationDate: {
//         gte: new Date(),
//       },
//     },
//     select: {
//       jobId: true,
//       publishedAt: true,
//     },
//   })
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // // USE AS A TEMPLATE TO GET ALL THE BLOGS AND COMPANIES TO ADD TO THE SITEMAP
  // const jobs = await getAllJobs()

  // const jobPosts = jobs.map((job) => ({
  //   url: `${siteConfig.url}/job/${job.jobId}`,
  //   lastModified: job.publishedAt.toISOString(),
  // }))

  const routes = ["", "/pricing", "/blog"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [
    ...routes,
    // ...jobPosts
  ]
}
