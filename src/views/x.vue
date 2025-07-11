<template>
  <div class="pomodoro">
    <div class="pomodoro_circle">
      <div class="pomodoro_circle__text">{{ formattedTimer }}</div>
    </div>

    <div class="pomodoro_controls">
      <button
        class="pomodoro_controls__button"
        @click="toggleTimer"
      >
        {{ isRunning ? "⏸️ Pause" : "▶️ Start" }}
      </button>
      <button
        class="pomodoro_controls__button pomodoro_controls__button__reset"
        @click="resetPomodoro"
      >
        🔁 Reset
      </button>
    </div>

    <div class="pomodoro_info">
      🍅 Cycles completed: {{ completedPomodoro }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const workTime = ref(25 * 60);
const restTime = ref(5 * 60);
const longRestTime = ref(15 * 60);
const timer = ref(workTime.value);

const completedPomodoro = ref(0);
const isRunning = ref(false);
const isResting = ref(false);
const isLongRest = ref(false);
let intervalId = null;

function setTimer() {
  if (timer.value > 0) {
    timer.value--;
  } else {
    if (!isResting.value && !isLongRest.value) {
      completedPomodoro.value++;
      if (completedPomodoro.value % 4 === 0) {
        timer.value = longRestTime.value;
        isLongRest.value = true;
      } else {
        timer.value = restTime.value;
        isResting.value = true;
      }
    } else {
      timer.value = workTime.value;
      isResting.value = false;
      isLongRest.value = false;
    }
  }
}

function toggleTimer() {
  if (isRunning.value) {
    clearInterval(intervalId);
    isRunning.value = false;
  } else {
    intervalId = setInterval(setTimer, 1000);
    isRunning.value = true;
  }
}

function resetPomodoro() {
  clearInterval(intervalId);
  isRunning.value = false;
  timer.value = workTime.value;
  completedPomodoro.value = 0;
  isResting.value = false;
  isLongRest.value = false;
  intervalId = null;
}

const formattedTimer = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});
</script>

<style scoped lang="sass">
.pomodoro
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100vh
  background: #f4f4f4

  &_circle
    width: 250px
    height: 250px
    border-radius: 50%
    background: #ff6347
    display: flex
    align-items: center
    justify-content: center
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2)

    &__text
      font-size: 3rem
      color: #fff
      font-weight: bold

  &_controls
    margin-top: 20px
    display: flex
    gap: 10px

    &__button
      padding: 10px 20px
      font-size: 1rem
      border: none
      border-radius: 8px
      background: #4caf50
      color: #fff
      cursor: pointer
      transition: background 0.3s ease

      &:hover
        background: #45a049

      &__reset
        background: #f44336

        &:hover
          background: #d32f2f

  &_info
    margin-top: 15px
    font-size: 1.2rem
    color: #333
</style>
