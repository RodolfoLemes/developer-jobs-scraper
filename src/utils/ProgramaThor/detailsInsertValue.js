const regexMatchMoney = /(R\$\d{1,}\.\d{1,8})/

function detailsInsertValue(array) {
  let json = {
    company: array[0] ,
    location: array[1],
    styleCompany: array[2]
  }
  if(array.length === 7) {
    json.salary = array[3]
    json.level = array[4]
    json.contractType = array[5]
    json.outsideCandidates = array[6]
  } else {
    json.salary = null
    json.level = array[3]
    json.contractType = array[4]
    json.outsideCandidates = array[5]
  }
  return json
}

module.exports = detailsInsertValue