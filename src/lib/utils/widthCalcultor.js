/**
 * 通过解析CSS计算出元素宽度
 */
import hyphenateStyleName from 'hyphenate-style-name'
export default function WidthCalcultor (css) {
  if (!css) return 0
  const cssStyles = {}
  let width = 0
  Object.keys(css || {}).forEach(key => {
    cssStyles[hyphenateStyleName(key)] = !isNaN(css[key]) ? css[key] + 'px' : css[key]
    switch (hyphenateStyleName(key)) {
      case 'padding': {
        const item = css[key].split(' ')
        if (item.length === 4) {
          width += +item[1].replace('px', '') + +item[3].replace('px', '')
        } else if (item.length === 2) {
          width += +item[1].replace('px', '') * 2
        } else {
          width += +item[0].replace('px', '') * 2
        }
        break
      }
      case 'padding-left':
      case 'padding-right':
        width += +css[key].replace('px', '')
        break
    }
  })
  return width
}
