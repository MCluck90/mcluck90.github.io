const thingsEl = document.getElementById('things')

const loadData = name => fetch(`./data/${name}.json`).then(resp => resp.json())

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

let data = []
const main = async () => {
  data = await loadData('ps-stand-up')
  resetAndShuffle()
}

const resetAndShuffle = () => {
  // Clear out all things
  thingsEl.innerHTML = ''

  const now = new Date()
  const seed = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`
  const rng = new Math.seedrandom(seed)

  // Filter out people who are temporarily out
  data = data.filter(name => !name.startsWith('//'))
  shuffle(rng, data)

  for (const thing of data) {
    const el = document.createElement('h4')
    el.innerText = thing
    el.className = 'thing'

    const notHereButton = document.createElement('button')
    notHereButton.innerText = 'Not Here'
    notHereButton.className = 'not-here'
    el.appendChild(notHereButton)

    notHereButton.addEventListener('click', function () {
      thingsEl.removeChild(el)
    })
    thingsEl.appendChild(el)
  }
}

main()

const addToListInputEl = document.getElementById('add-to-list-input')
const addPersonToList = () => {
  const name = addToListInputEl.value.trim()
  if (!name) {
    return
  }

  data.push(name)
  data.sort((a, b) => a.localeCompare(b))
  addToListInputEl.value = ''
  resetAndShuffle()
}

addToListInputEl.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    addPersonToList()
  }
})

document
  .getElementById('add-to-list')
  .addEventListener('click', addPersonToList)

const sixHours = 6 * 60 * 60 * 1000
let prev = new Date()
setTimeout(function refresh() {
  const now = new Date()
  if (prev.getDate() !== now.getDate()) {
    main()
  }

  prev = now
  setTimeout(refresh, sixHours)
}, sixHours) // Once every 6 hours
