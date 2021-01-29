const axios = require('axios')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

async function scrapeProgramaThor() {
  const response = await axios.get('https://programathor.com.br/jobs')

  console.log(response.data)

  const dom = new JSDOM(response.data)
  console.log(dom.window.document.querySelectorAll('option'))
}