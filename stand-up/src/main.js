const thingsEl = document.getElementById('things')

const loadData = name => fetch(`./data/${name}.json`).then(resp => resp.json())

const main = async () => {
  const now = new Date()
  const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  const rng = new Math.seedrandom(seed)
  const data = await loadData('ps-stand-up')
  data.sort(() => (rng() > 0.5 ? 1 : -1))

  for (const thing of data) {
    const el = document.createElement('div')
    el.innerText = thing
    thingsEl.appendChild(el)
  }
}

main()
