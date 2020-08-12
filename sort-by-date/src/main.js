const itemsEl = document.getElementById('items')

const urlParams = new URLSearchParams(window.location.search)
const dataParam = urlParams.get('data')

const shuffle = function (rng, array) {
  let currentIndex = array.length
  let temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(rng() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const createThing = content => {
  const el = document.createElement('h4')
  el.className = 'item'
  if (content instanceof HTMLElement) {
    el.appendChild(content)
  } else {
    el.innerText = content
  }
  itemsEl.appendChild(el)
}

const loadData = () => {
  try {
    return Promise.resolve(JSON.parse(dataParam))
  } catch {
    return fetch(dataParam).then(resp => resp.json())
  }
}

const main = async () => {
  if (!dataParam) {
    createThing('Must provide a URL to a JSON endpoint or a string of JSON')
    const urlExampleLink = document.createElement('a')
    urlExampleLink.href =
      '/sort-by-date/?data=https://gist.githubusercontent.com/MCluck90/4b801835d0a08d983cf16dac775f2ea0/raw/52fceeafaddea1ba4d6e2150c1dc5207fc6f6332/people.json'
    urlExampleLink.innerText = 'Example of using a URL'
    createThing(urlExampleLink)

    const jsonExampleLink = document.createElement('a')
    jsonExampleLink.href = '/sort-by-date/?data=["A","B","C"]'
    jsonExampleLink.innerText = 'Example of using JSON'
    createThing(jsonExampleLink)
    return
  }

  try {
    const now = new Date()
    const seed = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`
    const rng = new Math.seedrandom(seed)
    const data = await loadData()
    shuffle(rng, data)

    for (const item of data) {
      createThing(item)
    }
  } catch (e) {
    createThing('Failed to create list of items')
    createThing(`Error: ${e.message}`)
  }
}

main()
