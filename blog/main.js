// Toggle code snippets
document.addEventListener('click', function (event) {
  var target = event.target
  if (!target.classList.contains('toggle-codeblock')) {
    return
  }

  var container = target.closest('.hidden-codeblock')
  if (container.classList.contains('visible')) {
    container.classList.remove('visible')
  } else {
    container.classList.add('visible')
  }
})

// TODO: Remove this
const testMentions = {
  type: 'feed',
  name: 'Webmentions',
  children: [
    {
      'type': 'entry',
      'author': {
        type: 'card',
        name: 'Jonathan Ive',
        photo:
          'https://webmention.io/avatar/checkmention.appspot.com/c658b9d3700c6b83d0a19e3e9c02ed40bdd65bb2a696f4b8b0efc42169447e56.png',
        url: 'https://www.apple.com/pr/bios/jonathan-ive.html'
      },
      'url': 'https://www.apple.com/pr/bios/jonathan-ive.html',
      'published': '2020-06-10T21:27:26+00:00',
      'wm-received': '2020-06-10T21:27:29Z',
      'wm-id': 808960,
      'wm-source':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/identity',
      'wm-target': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'content': {
        html:
          'I love the way your site looks, though I\'m <a href="https://checkmention.appspot.com">not really <em>the</em> Jony Ive</a>. How easy is it for someone to discover the real author of this note? Please also check that the links in this note have no <code>rel="me"</code> attribute on them.',
        text:
          'I love the way your site looks, though I\'m not really the Jony Ive. How easy is it for someone to discover the real author of this note? Please also check that the links in this note have no rel="me" attribute on them.'
      },
      'in-reply-to': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'wm-property': 'in-reply-to',
      'wm-private': false,
      'rels': {
        canonical: 'https://www.apple.com/pr/bios/jonathan-ive.html'
      }
    },
    {
      'type': 'entry',
      'author': {
        type: 'card',
        name: 'Does clicking me alert?',
        photo:
          'https://webmention.io/avatar/checkmention.appspot.com/75232e0b1732e48930188394129043b56a9f44961eac063725de38d554a6cd36.jpeg',
        url: ''
      },
      'url':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/hcardxss',
      'published': '2020-06-10T21:27:26+00:00',
      'wm-received': '2020-06-10T21:27:28Z',
      'wm-id': 808957,
      'wm-source':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/hcardxss',
      'wm-target': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'content': {
        text:
          'This test embeds XSS within the hcard name and time field. Clicking on\nthe name or title should not raise an alert.'
      },
      'in-reply-to': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'wm-property': 'in-reply-to',
      'wm-private': false
    },
    {
      'type': 'entry',
      'author': {
        type: 'card',
        name: 'Checkmention XSS test',
        photo:
          'https://webmention.io/avatar/checkmention.appspot.com/75232e0b1732e48930188394129043b56a9f44961eac063725de38d554a6cd36.jpeg',
        url: 'https://checkmention.appspot.com/'
      },
      'url':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/xss',
      'published': '2020-06-10T21:27:26+00:00',
      'wm-received': '2020-06-10T21:27:28Z',
      'wm-id': 808958,
      'wm-source':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/xss',
      'wm-target': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'content': {
        html:
          '<a>Clicking this</a>\nshould not cause an alert.\n<span>This div\nshould not alert.</span>\nTry clicking <a>this link</a>\n&amp;&lt;script&gt;alert("encoded-xss")&amp;&lt;/script&gt;\nand <a>this too</a>.\n<b>Mouse over this</b>\nshould not cause an alert. This broken\n<img src="http://not.really.an.image" alt="not.really.an.image" /> should not throw an alert.\n\nNeither should <img src="https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/j&amp;#x41vascript:alert(\'test2\')" alt="j&amp;#x41vascript:alert(\'test2\')" />.<br />\nPlease look at the <a href="https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet">Owasp XSS prevention cheat sheet</a> for more information.',
        text:
          'Clicking this\nshould not cause an alert.\nThis div\nshould not alert.\nTry clicking this link\n&<script>alert("encoded-xss")&</script>\nand this too.\nMouse over this\nshould not cause an alert. This broken\n should not throw an alert.\n\nNeither should .\n\nPlease look at the Owasp XSS prevention cheat sheet for more information.'
      },
      'in-reply-to': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'wm-property': 'in-reply-to',
      'wm-private': false
    },
    {
      'type': 'entry',
      'author': {
        type: 'card',
        name: 'Checkmention',
        photo:
          'https://webmention.io/avatar/checkmention.appspot.com/18d522b2ddbef12a0a104dd17fbc24c15dcf0d123bc6611687e0051e13fc1559.png',
        url: 'https://checkmention.appspot.com/'
      },
      'url':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/success',
      'published': '2020-06-10T21:27:26+00:00',
      'wm-received': '2020-06-10T21:27:27Z',
      'wm-id': 808956,
      'wm-source':
        'https://checkmention.appspot.com/content/172a02174de/0a9314083fdb1b1562883e2751b5443cc4fdacc2/success',
      'wm-target': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'content': {
        text:
          "Congratulations! You've successfully handled a webmentioned note."
      },
      'in-reply-to': 'https://mcluck.tech/blog/abusing-proxies-for-dsls/',
      'wm-property': 'in-reply-to',
      'wm-private': false
    }
  ]
}

// Load webmentions
// fetch(`https://webmention.io/api/mentions.jf2?target=${$meta.permalink}`)
