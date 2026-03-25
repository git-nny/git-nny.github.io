import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

// mostly for multi page entry points
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectEntries = Object.fromEntries(
  globSync('_src/projects/**/index.html').map(file => [
    // Create a unique key for each (e.g., "projects/26_eurovision/index")
    path.relative('_src', file).replace(/\.html$/, ''),
    // The absolute path to the file
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "_src/_style": "_style" });
  eleventyConfig.addPassthroughCopy("_src/_scripts")
  eleventyConfig.addPassthroughCopy("_src/_assets/")
  eleventyConfig.addPassthroughCopy("_src/projects")
  eleventyConfig.addPassthroughCopy("CNAME")
  eleventyConfig.addPassthroughCopy({ "_src/projects": "projects" });
  eleventyConfig.addPassthroughCopy({ "_src/projects": "projects" });

  // For image plugin
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        formats: ['png', 'webp'],
        defaultAttributes: {
          loading: 'lazy'
        }
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {

    // simplify this! I feel like I am working against the indended use case here and I don't want that!
    tempFolderName: ".11ty-vite",
    // mostly for multi page entry points
    viteOptions: {
      build: {
        rollupOptions: {
          // Tell Vite about every sub-project index file
          input: {
            main: 'index.html', // Your homepage
            ...projectEntries   // All your sub-projects
          },
          output: {
            // This keeps the CSS/JS files named clearly
            entryFileNames: `[name].js`,
            chunkFileNames: `assets/js/[name]-[hash].js`,
            assetFileNames: `assets/[name].[ext]`,

          }
        }
      }
  }}
);

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

