export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_src/_style")
  eleventyConfig.addPassthroughCopy("_src/_scripts")
  eleventyConfig.addPassthroughCopy("_src/_assets/")

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes",
    }
  }
};