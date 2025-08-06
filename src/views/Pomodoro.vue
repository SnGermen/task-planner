<template>
  <div class="pomodoro">
    <div class="pomodoro_box">
      <div class="pomodoro_buttons">
        <button class="pomodoro_settings" @click="toggleSettings">⚙️</button>
        <button class="pomodoro_unshow" @click="hidePomodoro">➖</button>
        <button class="pomodoro_close" @click="closeModal">❌</button>
      </div>
      <h1 class="pomodoro_title">Pomodoro</h1>
      <div class="pomodoro_content">
        <div class="pomodoro_phase">{{ phase }}</div>
        <div class="pomodoro_timer">{{ formattedTime }}</div>
        <div class="pomodoro_buttons">
          <button class="pomodoro_controls" @click="toggleTimer">
            {{ isRunning ? "⏸️ Pause" : "▶️ Start" }}
          </button>
          <button class="pomodoro_controls pomodoro_controls__reset" @click="resetTimerAndStatus" >
            🔁 Reset
          </button>
        </div>
        <div class="ponodoro_cycles">
          🍅Cycles completed: {{ cycleOfPomodoro }}
        </div>
      </div>
      

    </div>
    <SettingsOfPomodoro v-show="isSettingsOpen" @close="isSettingsOpen =false"/>
  </div>          

</template>
<script setup>
import { storeToRefs } from 'pinia'
import { usePomodoro } from '@/stores/pomodoro'
import SettingsOfPomodoro from "./SettingsOfPomodoro.vue"
import { ref } from "vue"
const emit = defineEmits(['close', 'statusOfTheTimer'])
const pomodoro = usePomodoro()
const isSettingsOpen = ref(false)

const {
  phase,
  isRunning,
  timer,
  formattedTime,
  cycleOfPomodoro,
  workTime,
} = storeToRefs(pomodoro)

const {
  resetTimer,
  pauseTimer,
  startTimer,
} = pomodoro

function closeModal() {
  pauseTimer()
  resetTimer()
  isRunning.value = false
  emit('statusOfTheTimer', isRunning.value) 
  emit('close')                             
}
function resetTimerAndStatus(){
  resetTimer()
  isRunning.value = false
  emit('statusOfTheTimer', isRunning.value)
}
  function toggleTimer() {
    if (isRunning.value) {
      pauseTimer()
    } else {
      startTimer()
    }
      emit('statusOfTheTimer', isRunning.value)
  }
function hidePomodoro() {
  emit('close')
}
  function setCustomTime(minutes) {
    if (phase.value === "work") {
      timer.value = minutes * 60
      pauseTimer()
      emit('statusOfTheTimer', isRunning.value)
    }
  }
  function toggleSettings(){
  isSettingsOpen.value = !isSettingsOpen.value
  pomodoro.pauseTimer()
  }
</script>

<style scoped lang="sass">
.pomodoro
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100vh
  width: 100%
  color: #eee
  padding: 10px

  &_box
    position: relative
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    width: 100%
    max-width: 600px
    min-width: 360px
    padding: 20px
    background-color: #2c2c2c
    border-radius: 12px
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)

  &_buttons
    display: flex
    gap: 10px
    margin-bottom: 20px

  &_title
    font-size: 24px
    font-weight: bold
    margin-bottom: 10px

  &_content
    display: flex
    flex-direction: column
    align-items: center
    gap: 10px
    width: 100%

  &_phase
    font-size: 20px
    font-weight: 500
    text-transform: uppercase
    color: #f1c40f

  &_timer
    font-size: 50px
    font-weight: bold
    color: #f39c12
  &_controls
    font-size: 18px
    padding: 10px 20px
    border-radius: 8px
    background-color: #555
    color: #fff
    border: none
    cursor: pointer
    transition: background-color 0.3s ease
    outline: none
    &:hover
      background-color: #666

  &_controls__reset
    background-color: #555
    &:hover
      background-color: #c0392b

  &_close,
  &_unshow,
  &_settings
    position: absolute
    top: 10px
    font-size: 20px
    background: none
    border: none
    color: #fff
    cursor: pointer
    transition: transform 0.2s ease
    &:hover
      transform: scale(1.1)

  &_close
    right: 10px
  &_settings
    left: 10px


  &_unshow
    right: 50px

@media screen and (max-width: 650px)
  .pomodoro_box
    padding: 15px
    max-width: 95%
    right: -20px

  .pomodoro_timeButton
    font-size: 14px
    padding: 5px 10px

  .pomodoro_timer
    font-size: 40px

  .pomodoro_controls
    font-size: 16px
    padding: 8px 16px

</style>
