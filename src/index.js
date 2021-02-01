const fs = require('fs')

const Vulpi = require('./classes/Vulpi')

const vulpi = new Vulpi()

//vulpi.generateOptions()

vulpi.scrape().then((jobs) => {
  console.log(jobs)
})