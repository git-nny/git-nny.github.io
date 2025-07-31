export default async function(eleventyConfig) {
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "dist"
    }
  }
};

