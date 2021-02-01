const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

//const options = require('../constants/optionsProgramaThor.json')
//const researches = require('../constants/researchesProgramaThor.json')

class ProgramaThor {
  
  constructor({tech = null, contractType = null, expertise = null, companyType = null, remoto = false, outsideCandidates = false}) {
    this.BASE_URL = 'https://programathor.com.br'
    this.jobs = []
    this.tech = tech
    this.contractType = contractType
    this.expertise = expertise
    this.companyType = companyType
    this.remoto = remoto
    this.outsideCandidates = outsideCandidates
  }

  setProperties({tech = null, contractType = null, expertise = null, companyType = null, remoto = false, outsideCandidates = false}) {
    
  }

  async scrape() {
    let done = false
    while(!done) {
      console.log(this.BASE_URL)
      const response = await axios.get(this.BASE_URL + '/jobs/page/' + countPage)
    
      const $ = cheerio.load(response.data)
      
      $('div.cell-list:not(.min-height-180)').each((i, op) => {
        const url = $(op).children().attr('href')
        let title = $(op).find('h3').text()
        if(title.match(/^VENCIDA/)) {
          done = true
          return
        }
        title = title.replace(/NOVA$/, '')
        let details = []
        $(op).find('div.cell-list-content-icon > span').each((index, element) => {
          details.push($(element).text())
        })
        let skills = []
        $(op).find('span.tag-list.background-gray').each((index, element) => {
          skills.push($(element).text())
        })

        let properties = this.insertProperties(details)
        this.jobs.push({
          url: this.BASE_URL + url,
          title,
          ...properties,
          skills
        })
      })
      console.log(`Página ${countPage} concluída`)
      countPage ++
      if(countPage === 10) break
    }
    return this.jobs
  }

  insertProperties(array) {
    //const regexMatchMoney = /(R\$\d{1,}\.\d{1,8})/
    let json = {
      company: array[0] ,
      locations: [array[1]],
      companyType: array[2]
    }
    if(array.length === 7) {
      json.salary = array[3]
      json.level = array[4]
      json.contractType = array[5]
    } else {
      json.salary = null
      json.level = array[3]
      json.contractType = array[4]
    }
    return json
  }

  static async generateSearchAndOptions() {
    const BASE_URL = 'https://programathor.com.br'
    const response = await axios.get(BASE_URL + '/jobs')
    const $ = cheerio.load(response.data)
    let arrayProgramaThor = {}
    $('option').each((i,op) => {
      let value = $(op).val()
      let text = $(op).text()
      arrayProgramaThor[text] = value 
    })
    fs.writeFileSync('src/constants/optionsProgramaThor.json', JSON.stringify(arrayProgramaThor))
    arrayProgramaThor = {}
    $('div.hidden-xs.hidden-sm > a').each((i, op) => {
      let value = $(op).attr('href')
      let text = $(op).text()
      let result = text.replace(/(\n| {2,})/g, ``)
      value = value.replace('/jobs?', '')
      console.log(value)
      arrayProgramaThor[result] = value 
    })
    fs.writeFileSync('src/constants/researchesProgramaThor.json', JSON.stringify(arrayProgramaThor))
  }
}


module.exports = ProgramaThor