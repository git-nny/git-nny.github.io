export default async function(eleventyConfig) {
  //passthrough copies
    eleventyConfig.addPassthroughCopy("style")
    eleventyConfig.addPassthroughCopy("scripts")
    //add passthrough copy for all within projects
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "dist",
      includes: "_includes",
      layouts: "_layout"
    },

    
  }
};

