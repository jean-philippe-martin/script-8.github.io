import colors from '../colors.js'
import circle from './circle.js'
import alphabet from './alphabet.js'

const canvasAPI = ({ ctx, width: canvasWidth, height: canvasHeight }) => ({
  print (x, y, letters, c) {
    const color = colors.rgb(c)

    const grids = letters
      .toString()
      // Split into individual letters.
      .split('')
      // Get the pixels and the letter's width.
      .map(letter => {
        const pixels = alphabet[letter.toLowerCase()]
        return {
          width: pixels ? pixels.length / 6 : 3,
          letter,
          pixels
        }
      })
      // Calculate running offsets.
      .reduce((acc, current, index, array) => {
        const previous = acc[index - 1]
        let xOffset = previous ? previous.width + 1 + previous.xOffset : 0

        let yOffset = previous ? previous.yOffset : 0
        // Do we have space to draw this letter?
        if (x + xOffset + current.width > 128) {
          // If not,
          // go to the beginning of the next line.
          yOffset += 7
          xOffset = 0
        }

        return [
          ...acc,
          {
            ...current,
            xOffset,
            yOffset
          }
        ]
      }, [])
      // Ignore letters with no matches.
      .filter(d => d.pixels)

    // For each grid of pixels,
    grids.forEach(grid => {
      // get some properties,
      const { pixels, xOffset, yOffset, width } = grid

      // get the image data this letter will occupy,
      const imageData = ctx.getImageData(x + xOffset, y + yOffset, width, 6)
      const { data } = imageData

      // and for each pixel,
      pixels
        .map((pixel, pixelIndex) => ({ pixel, pixelIndex }))
        // ignore pixels set to 0,
        .filter(d => d.pixel)
        // and update the underlying canvas data.
        .forEach(d => {
          const offset = d.pixelIndex * 4
          data[offset + 0] = color[0]
          data[offset + 1] = color[1]
          data[offset + 2] = color[2]
          data[offset + 3] = 255
        })

      // And draw!
      ctx.putImageData(imageData, x + xOffset, y + yOffset)
    })
  },

  rectStroke (x, y, w, h, c) {
    ctx.strokeStyle = colors.one(c)
    ctx.strokeRect(
      Math.floor(x) + 0.5,
      Math.floor(y) + 0.5,
      Math.floor(w) - 1,
      Math.floor(h) - 1
    )
  },

  rectFill (x, y, w, h, c) {
    ctx.fillStyle = colors.one(c)
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
  },

  circStroke (x, y, r, c) {
    circle({
      cx: Math.floor(x),
      cy: Math.floor(y),
      radius: Math.floor(r),
      ctx,
      color: colors.one(c),
      onlyStroke: true
    })
  },

  circFill (x, y, r, c) {
    circle({
      cx: Math.floor(x),
      cy: Math.floor(y),
      radius: Math.floor(r),
      ctx,
      color: colors.one(c)
    })
  },

  clear () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }
})

export default canvasAPI