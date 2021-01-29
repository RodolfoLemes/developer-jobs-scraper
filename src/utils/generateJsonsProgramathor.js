const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

async function generateJsonsProgramaThor() {
  const response = await axios.get('https://programathor.com.br/jobs')

  const $ = cheerio.load(response.data)
  let arrayProgramaThor = []
  $('option').each((i,op) => {
    let value = $(op).val()
    let text = $(op).text()
    arrayProgramaThor.push({ [text]: value })
  })
  fs.writeFileSync('src/constants/optionsProgramathor.json', JSON.stringify(arrayProgramaThor))
  arrayProgramaThor = []
  $('div.hidden-xs.hidden-sm > a').each((i, op) => {
    const value = $(op).attr('href')
    let text = $(op).text()
    let result = text.replace(/(\n| {2,})/g, ``)
    console.log(result)
    arrayProgramaThor.push({ [result]: value })
  })
  fs.writeFileSync('src/constants/searchsProgramathor.json', JSON.stringify(arrayProgramaThor))
}

generateJsonsProgramaThor().then(() => {
  console.log('Done!')
})

module.exports = generateJsonsProgramaThor