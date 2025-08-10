import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { loadPomodoroState, updatePomodoroState } from "../data/db"

export const usePomodoro = defineStore("pomodoro", () => {
  const timeWork = ref(25 * 60)
  const minBreak = ref(5 * 60)
  const longBreak = ref(15 * 60)
  const timer = ref(timeWork.value)
  const phase = ref("work")
  const cycleOfPomodoro = ref(0)
  const isRunning = ref(false)
  const cyclesBeforeLongBreak = ref(4)
  const autoStartNextPeriod = ref(false)
  let intervalId = null
  loadPomodoroState().then((state) => {
    if (state && typeof state.autoStartNextPeriod === "boolean") {
      autoStartNextPeriod.value = state.autoStartNextPeriod
    } else {
      updatePomodoroState({
        id: 1,
        autoStartNextPeriod: autoStartNextPeriod.value,
      })
    }
  })

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
      return
    }
    if (phase.value === "work") {
      cycleOfPomodoro.value++

      if (cycleOfPomodoro.value >= cyclesBeforeLongBreak.value) {
        phase.value = "longBreak"
        timer.value = longBreak.value
        cycleOfPomodoro.value = 0
      } else {
        phase.value = "break"
        timer.value = minBreak.value
      }
    } else {
      phase.value = "work"
      timer.value = timeWork.value
    }
    if (autoStartNextPeriod.value == false && phase.value === "work") {
      pauseTimer()
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
    cyclesBeforeLongBreak,
    autoStartNextPeriod,
  }
})
