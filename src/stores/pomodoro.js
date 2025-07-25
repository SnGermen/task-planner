import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const usePomodoro = defineStore("pomodoro", () => {
  const timeWork = ref(25 * 60) // добавлено
  const minBreak = ref(5 * 60)
  const longBreak = ref(15 * 60)
  const timer = ref(timeWork.value)
  const phase = ref("work")
  const cycleOfPomodoro = ref(0)
  const isRunning = ref(false)

  let intervalId = null

  const formattedTime = computed(() => {
    const minutes = Math.floor(timer.value / 60)
    const seconds = timer.value % 60
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`
  })

  function setTime() {
    if (timer.value > 0) {
      timer.value--
    } else if (phase.value === "work") {
      cycleOfPomodoro.value++
      phase.value = cycleOfPomodoro.value % 4 === 0 ? "longBreak" : "break"
      timer.value =
        phase.value === "longBreak" ? longBreak.value : minBreak.value
    } else {
      phase.value = "work"
      timer.value = timeWork.value
    }
  }

  function startTimer() {
    if (!intervalId) {
      intervalId = setInterval(setTime, 1000)
      isRunning.value = true
    }
  }

  function pauseTimer() {
    clearInterval(intervalId)
    intervalId = null
    isRunning.value = false
  }

  function resetTimer() {
    pauseTimer()
    timer.value = timeWork.value
    phase.value = "work"
    cycleOfPomodoro.value = 0
    isRunning.value = false
  }

  return {
    timeWork,
    minBreak,
    longBreak,
    timer,
    phase,
    cycleOfPomodoro,
    isRunning,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
  }
})
