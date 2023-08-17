import makeDebug from 'debug'

const debug = makeDebug('test:utils')

/* Helper function to click on a given selector
 */
export async function click (page, selector, wait = 500) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    await page.click(selector)
    await page.waitForTimeout(wait)
    debug(`Clicked target ${selector}`)
  } catch (error) {
    console.error(`click ${selector} failed.`)
  }
}

/* Helper function to click on an action selector
 */
export async function clickAction (page, action, wait = 500) {
  const selector = `#${action}`
  await click(page, selector, wait)
  debug(`Clicked action ${selector}`)
}

/* Helper function to input a text on a given selector
 * set enter to true to run the press 'Enter' key
 */
export async function type (page, selector, text, enter = false, replace = false, wait = 500) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    if (replace) {
      await page.click(selector, { clickCount: 3 })
      await page.keyboard.press('Backspace')
    } else {
      await page.click(selector)
    }
    await page.type(selector, text)
    if (enter) await page.keyboard.press('Enter')
    await page.waitForTimeout(wait)
  } catch (error) {
    console.error(`type ${text} in ${selector} failed.`)
  }
}