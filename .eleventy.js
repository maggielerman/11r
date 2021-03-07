const siteSettings = require('./src/globals/site.json')
const Image = require('@11ty/eleventy-img')

async function pngShortcode (src, alt, sizes, cls) {
  let metadata = await Image(src, {
    widths: [400, 800, 1200, 1600],
    formats: ['png', 'webp', 'avif'],
    urlPath: '/img/responsive',
    outputDir: 'dist/img/responsive',
    useCache: true
  })

  let imageAttributes = {
    alt,
    class: cls,
    sizes,
    loading: 'lazy',
    decoding: 'async'
  }

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes)
}

async function imageShortcode (src, alt, sizes, cls) {
  let metadata = await Image(src, {
    widths: [400, 800, 1200],
    formats: ['jpeg', 'webp', 'avif'],
    urlPath: '/img/responsive',
    outputDir: 'dist/img/responsive'
  })

  let imageAttributes = {
    alt,
    class: cls,
    sizes,
    loading: 'lazy',
    decoding: 'async'
  }

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes)
}

module.exports = config => {
  config.addNunjucksAsyncShortcode('png', pngShortcode)
  config.addLiquidShortcode('png', pngShortcode)
  config.addJavaScriptFunction('png', pngShortcode)

  config.addNunjucksAsyncShortcode('image', imageShortcode)
  config.addLiquidShortcode('image', imageShortcode)
  config.addJavaScriptFunction('image', imageShortcode)

  config.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'))
  config.addPlugin(require('@11ty/eleventy-plugin-rss'))

  config.addFilter('dateDisplay', require('./filters/date-display.js'))

  config.addPassthroughCopy({ img: './img/' })

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true
  })

  config.setDataDeepMerge(true)

  config.addCollection('postsWithoutDrafts', collection =>
    [...collection.getFilteredByGlob('src/posts/*.md')].filter(
      post => !post.data.draft
    )
  )

  return {
    pathPrefix: siteSettings.baseUrl,
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'includes/layouts',
      data: 'globals'
    }
  }
}
