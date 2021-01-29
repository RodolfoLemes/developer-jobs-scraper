const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const detailsInsertValue = require('./utils/ProgramaThor/detailsInsertValue')

const BASE_URL = 'https://programathor.com.br/'

let countPage = 1

async function scrapeProgramaThor() {
  let jobs = []

  let done = false
  while(!done) {
    const response = await axios.get(BASE_URL + 'jobs/page/' + countPage)
  
    const $ = cheerio.load(response.data)
    
    $('div.cell-list:not(.min-height-180)').each((i, op) => {
      const url = $(op).children().attr('href')
      let name = $(op).find('h3').text()
      if(name.match(/^VENCIDA/)) {
        done = true
        return
      }
      name = name.replace(/NOVA$/, '')
      let details = []
      $(op).find('div.cell-list-content-icon > span').each((index, element) => {
        details.push($(element).text())
      })
      let tags = []
      $(op).find('span.tag-list.background-gray').each((index, element) => {
        tags.push($(element).text())
      })
      jobs.push({
        url: BASE_URL + url,
        name,
        details: detailsInsertValue(details),
        tags
      })
    })
    console.log(`Página ${countPage} concluída`)
    countPage ++
    if(countPage === 10) break
  }
  return jobs
}

scrapeProgramaThor().then((jobs) => {
  fs.writeFileSync('jobsProgramathor.json', JSON.stringify(jobs))
  console.log('Done!')
})