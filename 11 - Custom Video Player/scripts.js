/* Get our elements */
const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const progressText = player.querySelector('.progress__text')

const toggle = player.querySelector('.toggle')
const ranges = player.querySelectorAll('.player__slider')
const skipButtons = player.querySelectorAll('[data-skip]')
const fullScreen = player.querySelector('.fullscreen')

let isPressing = false
let isPressingProgressBar = false

/* Build our functions */
function resetProgressText() {
  progressText.innerHTML = `${fmtMSS(Math.round(video.currentTime))} / ${fmtMSS(
    Math.round(video.duration)
  )}`
}

function togglePlay() {
  const method = video.paused ? 'play' : 'pause'
  video[method]()
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚'
  toggle.textContent = icon
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip)
}

function handleChangeUpdate(e) {
  if (isPressing) {
    video[this.name] = this.value
  }
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
  progressText.style.left = `${(percent / 100) * video.offsetWidth}px`
  progressText.innerHTML = `${fmtMSS(Math.round(video.currentTime))} / ${fmtMSS(
    Math.round(video.duration)
  )}`
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

resetProgressText()

/* Hook up the event listeners */
video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', handleProgress)

toggle.addEventListener('click', togglePlay)
skipButtons.forEach(button => button.addEventListener('click', skip))
ranges.forEach(range => range.addEventListener('change', handleChangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleChangeUpdate))
ranges.forEach(range =>
  range.addEventListener('mousedown', () => (isPressing = true))
)
ranges.forEach(range =>
  range.addEventListener('mouseup', () => (isPressing = false))
)
progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', e => isPressingProgressBar && scrub(e))
progress.addEventListener('mousedown', () => (isPressingProgressBar = true))
progress.addEventListener('mouseup', () => (isPressingProgressBar = false))
fullScreen.addEventListener('click', () => video.requestFullscreen())
