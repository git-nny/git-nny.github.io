import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_src/_style")
  eleventyConfig.addPassthroughCopy("_src/_scripts")
  eleventyConfig.addPassthroughCopy("_src/_assets/")
  eleventyConfig.addPassthroughCopy("_src/projects")
  eleventyConfig.addPassthroughCopy("CNAME")
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/*.css");

  // For image plugin
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        formats: ['png', 'webp'],
        defaultAttributes: {
          loading: 'lazy'
        }
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    viteOptions: {
    }
  });

  // for md it attr - geminied!
  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true,
  };

  const markdownLib = markdownIt(mdOptions).use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
  })

  eleventyConfig.setLibrary("md", markdownLib);


  eleventyConfig.addShortcode("image", function(src, alt, caption="", classes="default-img" ) 
  {
  return ` <figure class="${classes}"> <img src="${src}" alt="${alt}"  > </figure>
  <figcaption> ${caption} </figcaption>`;
  })

  // // md.it_attr 

  // });
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes",
      layouts: "_layout"
    }
  }
};

