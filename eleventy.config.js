import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@awesome.me/buildawesome";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import yaml from "js-yaml";
import { execFileSync } from 'node:child_process';
import markdownIt from 'markdown-it';
import markdownItAnchor from "markdown-it-anchor";
import pluginFilters from "./_config/filters.js";
import pluginCodes from "./_config/codes.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default async function(eleventyConfig) {
  // Draft handling: treat `draft: true` OR `published: false` as drafts.
  // Drafts are included in serve/watch mode and excluded only during production build.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    const isDraft = data.draft === true || data.published === false;
    if(isDraft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false; // Skip generating output for drafts on production build
    }
  });

  // Redirect handling moved to Netlify (netlify.toml). Any front-matter
  // fields like `redirect_to` or `redirect_from` are ignored by Eleventy.

	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/"
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
  eleventyConfig.addNunjucksGlobal("getImages", function(folderPath) {
    const baseDir = path.join(__dirname, 'public');
    const directoryPath = path.join(baseDir, folderPath);
    
    function getImagesRecursively(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      
      list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
          results.push({
            type: 'directory',
            name: file,
            children: getImagesRecursively(filePath)
          });
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            results.push({
              type: 'file',
              name: file,
              path: '/' + path.relative(baseDir, filePath).replace(/\\/g, '/')
            });
          }
        }
      });
      
      return results;
    }
  
    try {
      return getImagesRecursively(directoryPath);
    } catch (error) {
      console.error(`Error reading directory: ${directoryPath}`, error);
      return [];
    }
  });
  
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});

	eleventyConfig.addPlugin(IdAttributePlugin, {
		slugify: (text) => {
		  const slug = eleventyConfig.getFilter("slugify")(text);
		  return `print-${slug}`;
		}
	  });
    eleventyConfig.on('eleventy.after', () => {
		execFileSync('pagefind', ['--site', '_site', '--glob', '**/*.html'], { stdio: 'inherit' });
	  })
	  eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  // Konfigurasi feed utama Anda
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4
      }
    },
    collection: {
      name: "all",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Blog Title",
      subtitle: "This is a longer description about your blog.",
      base: "https://fordv8foundation.org/",
      author: {
        name: "Your Name"
      }
    }
  });

  // Feed untuk events
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/events.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "events",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Events Feed",
      subtitle: "Latest events from our blog",
      base: "https://fordv8foundation.org/",
      author: {
        name: "Your Name"
      }
    }
  });

  // Feed untuk news
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/news.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "news",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "News Feed",
      subtitle: "Latest news from our blog",
      base: "https://fordv8foundation.org/",
      author: {
        name: "Your Name"
      }
    }
  });
eleventyConfig.addCollection("all", function(collectionApi) {
  return collectionApi.getAll();
});

eleventyConfig.addCollection("events", function(collectionApi) {
  return collectionApi.getFilteredByTag("events");
});

eleventyConfig.addCollection("news", function(collectionApi) {
  return collectionApi.getFilteredByTag("news");
});

    const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.addFilter("md", function(content) {
    return md.render(content);
  });

	eleventyConfig.addPlugin(pluginFilters);
	eleventyConfig.addPlugin(pluginCodes);
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});
};

export const config = {
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site"
	},
};
