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

const main = async () => {
  // Clear out all things
  thingsEl.innerHTML = ''

  const now = new Date()
  const seed = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`
  const rng = new Math.seedrandom(seed)
  const data = await loadData('ps-stand-up')
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
