const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

function verifyType(type) {
  if(type === 'FT') return 'CLT'
  if(type === 'FR') return 'PJ'
  return null
}

class Vulpi {
  BASE_URL = 'https://api.vulpi.com.br/v1'
  EXPERIENCE_ADD = '/filters/experience/'
  OCCUPATION_AREA_ADD = '/filters/occupationarea/'
  SKILL_ADD = '/filters/skill/'
  BOARD_ADD = '/board'

  constructor(options = { skill: null, experience: null, occupationarea: null, remoto: false, location: null }) {
    console.log(options)
  }

  async scrape() {
    const response = await axios.get(this.BASE_URL + this.BOARD_ADD)

    const { results } = response.data

    let jobs = []

    results.forEach(element => {
      let json = {}
      json['url'] = this.BASE_URL + '/jobs/' + element.id
      json['title'] = element.title
      json['company'] = element.company.trading_name
      json['companyWebsite'] = element.company.website
      json['contractType'] = verifyType(element.job_type)
      json['locations'] = element.remote ? ['Remoto'] : element.locations.map(element => element.title)
      json['skills'] = element.skills.map(element => element.title)
      json['level'] = element.experience.map(element => element.title)
      json['createdAt'] = element.created_at

      jobs.push(json)
    })

    return jobs
  }

  async generateOptions() {
    const [experience, occupationarea, skill] = await axios.all([
      axios.get(this.BASE_URL + this.EXPERIENCE_ADD),
      axios.get(this.BASE_URL + this.OCCUPATION_AREA_ADD),
      axios.get(this.BASE_URL + this.SKILL_ADD)
    ])

    let json = {}
    experience.data.map(element => {
      json[element.title] = element.id
    })
    fs.writeFileSync('src/constants/experienceVulpi.json', JSON.stringify(json))
    
    json = {}
    occupationarea.data.map(element => {
      json[element.title] = element.id
    })
    fs.writeFileSync('src/constants/occupationareaVulpi.json', JSON.stringify(json))
    
    json = {}
    skill.data.map(element => {
      json[element.title] = element.id
    })
    fs.writeFileSync('src/constants/skillVulpi.json', JSON.stringify(json))
  }
}

module.exports = Vulpi