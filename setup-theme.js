// Setup light theme, if necessary
const themePreference = window.localStorage.getItem('theme-preference')
if (
  window.matchMedia('(prefers-color-scheme: light)').matches &&
  themePreference !== 'dark'
) {
  document.querySelector('html').classList.replace('dark', 'light')
  const darkThemeSheet = document.head.querySelector('.dark-theme')
  const lightThemeSheet = document.head.querySelector('.light-theme')
  if (darkThemeSheet) {
    darkThemeSheet.disabled = true
  }
  if (lightThemeSheet) {
    lightThemeSheet.disabled = false
  }
}
