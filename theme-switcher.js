document.querySelector('.toggle-theme').addEventListener('click', () => {
  const html = document.querySelector('html')
  const isDarkTheme = html.classList.contains('dark')
  const darkThemeSheet = document.head.querySelector('.dark-theme')
  const lightThemeSheet = document.head.querySelector('.light-theme')
  if (isDarkTheme) {
    html.classList.replace('dark', 'light')
    if (darkThemeSheet) {
      darkThemeSheet.disabled = true
    }
    if (lightThemeSheet) {
      lightThemeSheet.disabled = false
    }
    localStorage['theme-preference'] = 'light'
  } else {
    html.classList.replace('light', 'dark')
    if (darkThemeSheet) {
      darkThemeSheet.disabled = false
    }
    if (lightThemeSheet) {
      lightThemeSheet.disabled = true
    }
    localStorage['theme-preference'] = 'dark'
  }
})
