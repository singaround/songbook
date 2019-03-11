const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
   eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: false
      });
      return minified;
    }
    return content;
  });
 
  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/posts\//) !== null;
    });
  });

  // Number songs in the 'songs' directory
  eleventyConfig.addCollection("numberedSongs", function (collection) {
    songCollection = collection.getAllSorted().filter(function (item) {
      return item.inputPath.match(/^\.\/songs\//) !== null;
    }).filter(function (item) {
      return item.data.published === true;
    }).sort(function (a, b) {
      return a.data.title.localeCompare(b.data.title)
    });

    // Inject the song number so we have it for the URL and the numbering
    songCollection.forEach(function (a, i) {
      a.data.songNumber = i + 1;
      console.log("%s: songNumber: %s ", a.inputPath, i + 1 )
    })
    return songCollection
  });

  // Create a list of songs sorted by firstline
  eleventyConfig.addCollection("songsByFirstline", function(collection) {
    return collection.getAll().filter(function(item) {
      return  item.data.songLine != null;
    }).filter(function (item) {
      return item.data.published === true;
    }).sort(function (a,b) {
      return a.data.songLine.localeCompare(b.data.songLine)
    });
  });
  // Create a list of songs sorted by chorusline
  eleventyConfig.addCollection("songsByChorus", function(collection) {
    return collection.getAll().filter(function(item) {
      return item.data.chorusLine != null;
    }).filter(function (item) {
      return item.data.published === true;
    }).sort(function (a,b)  {
      return a.data.chorusLine.localeCompare(b.data.chorusLine)
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  };
  eleventyConfig.setLibrary("md", markdownIt(options));

  return {
    templateFormats: ["md", "njk", "html"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
