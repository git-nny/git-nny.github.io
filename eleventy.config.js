export default async function(eleventyConfig) {
  //passthrough copies
    eleventyConfig.addPassthroughCopy("style")
    eleventyConfig.addPassthroughCopy("scrips")
    //add passthrough copy for all within projects
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "dist"
    },

    
  }
};

