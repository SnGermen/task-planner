<template>
<div class="pomodoro">
  <div class="pomodoro_box">
    <button class="pomodoro_close" @click="closeModal">❌</button>
  <h1 class="pomodoro_title">Pomodoro</h1>
  <div class="pomodoro_content">
    <div class="pomodoro_phase">{{ phase }}</div>
   <div class="pomodoro_timer"> {{ formatedTime }}</div>
   <div class="pomodoro_buttons">
    <button class="pomodoro_controls" @click="toggleTimer">{{ isRunning ?"⏸️ Pause" : "▶️ Start" }}</button>
    <button class="pomodoro_controls pomodoro_controls__reset" @click="resetTimer">🔁 Reset</button>
    </div>
    <div class="ponodoro_cycles">
      🍅Cycles completed: {{ cycleOfPomodoro }}
    </div>
</div></div>
</div>
</template>
<script setup>
import { computed, ref } from 'vue'
const timeWork = 25*60; // Work  time in minutes
const timer = ref(timeWork)
const minBreak = 5 * 60
const longBreak = 15 * 60
const cycleOfPomodoro = ref(0)
const timeId = ref(null)
const isRunning = ref(false)
const  phase = ref("work")
const isClosed = ref(false)
const emit = defineEmits(['close'])
function setTime(){
  if(timer.value > 0){
    timer.value--
  }else if(phase.value == "work"){
    cycleOfPomodoro.value++
    if(cycleOfPomodoro.value % 4 == 0){
      cycleOfPomodoro.value = 0
      timer.value = longBreak
      phase.value = "longBreak"
    } else{
      timer.value = minBreak
      phase.value = "break"
    }
  } else{
    timer.value = timeWork
    phase.value = "work"
  
  }
}


 function toggleTimer(){
  if(isRunning.value){
    clearInterval(timeId.value)
    isRunning.value = false
  }else{
    timeId.value = setInterval(setTime, 1000)
    isRunning.value = true
  }
 }

 function resetTimer(){
  clearInterval(timeId.value)
  isRunning.value = false
  timer.value = timeWork
  cycleOfPomodoro.value = 0 
  phase.value = "work"
  timeId.value = null
 }

 const formatedTime = computed(() =>{
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`
 }
)

function closeModal() {
  isClosed.value =true
  clearInterval(timeId.value)
  isRunning.value = false
  timer.value = timeWork
  cycleOfPomodoro.value = 0
  phase.value = "work"
  timeId.value = null
  emit('close')
}
</script>
<style  scoped lang="sass">
 .pomodoro
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100vh
  width: 100%
  color: #eee
  &_box
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    width: 100%
    max-width: 400px
    padding: 20px
    background-color: #2c2c2c
    border-radius: 12px
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)
  &_title
    font-size: 24px
    font-weight: bold
    margin-bottom: 10px
  &_content
    display: flex
    flex-direction: column
    align-items: center
    gap: 10px
  &_phase
    font-size: 20px
    font-weight: 500
    text-transform: uppercase
    color: #f1c40f
  &_timer
    font-size: 50px
    font-weight: bold
    color: #e74c3c
  &_buttons
    display: flex
    gap: 10px
  &_controls
    display: flex
    gap: 10px
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
  &_close
    position: absolute
    top: 10px
    right: 10px
    background: none
    border: none
    font-size: 20px
    cursor: pointer
    color: #fff
    transition: color 0.2s ease

  &_box
    position: relative // нужно для абсолютного позиционирования крестика


    
</style> 