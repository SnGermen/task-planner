<template>
  <div class="settings_overlay" @click.self="closeSettings">
    <div class="settings_box">
      <div class="settings_head">
        <button class="settings_close" @click="closeSettings">❌</button>
      </div>

      <div class="settings_main">
        <div class="settings_dates">
          <div class="settings_text">Working period in minutes</div>
          <input class="settings_number" type="number" v-model="timeWorkMinutes" />
        </div>

        <div class="settings_dates">
          <div class="settings_text">Short break</div>
          <input class="settings_number" type="number" v-model="minBreakMinutes" />
        </div>

        <div class="settings_dates">
          <div class="settings_text">Long break</div>
          <input class="settings_number" type="number" v-model="longBreaMinutes" />
        </div>

        <div class="settings_dates">
          <div class="settings_text">Long break every</div>
          <input class="settings_number" type="number" v-model="howMuchCyclesBeforeTheLongRest" />
        </div>
        <div class="settings_booleanDates">
          <input class="settings_checkbox" type="checkbox" v-model="autoStartNextPeriodComputed">           
          <div class="settings_text">Automatically start next period</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePomodoro } from "../stores/pomodoro";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { updatePomodoroState } from "../data/db"

const emit = defineEmits(["close"]);

function closeSettings() {
  emit("close");
}

const {autoStartNextPeriod} = storeToRefs(usePomodoro())
const pomodoro = usePomodoro();
const { timeWork, minBreak, longBreak, cyclesBeforeLongBreak, phase, timer } =
  storeToRefs(pomodoro);

const timeWorkMinutes = computed({
  get: () => Math.floor(timeWork.value / 60),
  set: (val) => {
    const safeVal = Math.max(1, Number(val) || 1); 
    timeWork.value = safeVal * 60;
    if (phase.value === "work") {
      timer.value = timeWork.value;
    }
  },
});

const autoStartNextPeriodComputed =computed({
  get: ()=> autoStartNextPeriod.value,
  set: (val)=> {
    autoStartNextPeriod.value = val
    updatePomodoroState({ id: 1, autoStartNextPeriod: val });
  }
})

const minBreakMinutes = computed({
  get: () => Math.floor(minBreak.value / 60),
  set: (val) => {
    const safeVal = Math.max(1, Number(val) || 1); 
    minBreak.value = safeVal * 60;
    if (phase.value === "break") {
      timer.value = minBreak.value;
    }
  },
});

const longBreaMinutes = computed({
  get: () => Math.floor(longBreak.value / 60),
  set: (val) => {
    const safeVal = Math.max(1, Number(val) || 1);
    longBreak.value = safeVal * 60;
    if (phase.value === "longBreak") {
      timer.value = longBreak.value;
    }
  },
});

const howMuchCyclesBeforeTheLongRest = computed({
  get: () => cyclesBeforeLongBreak.value,
  set: (val) => {
    const safeVal = Math.max(2, Number(val) || 1); 
    cyclesBeforeLongBreak.value = safeVal;
  },
});
</script>


<style scoped lang="sass">
.settings
  &_overlay
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.5)
    display: flex
    align-items: center
    justify-content: center
    z-index: 1000

  &_box
    background: #2c2c2c
    padding: 20px
    border-radius: 12px
    width: 90%
    max-width: 500px
    color: #fff
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4)
    position: relative

  &_head
    display: flex
    justify-content: flex-end

  &_close
    background: none
    border: none
    color: #fff
    font-size: 20px
    cursor: pointer
    transition: transform 0.2s ease
    &:hover
      transform: scale(1.1)

  &_main
    display: flex
    flex-direction: column
    gap: 15px
    margin-top: 15px

  &_dates
    display: flex
    justify-content: space-between
    align-items: center

  &_booleanDates
    display: flex
  &_checkbox
    min-width: 20px
    height: 20px
    margin-right: 18px
    border: 2px solid white
    border-radius: 6px
    background: transparent
    appearance: none
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    &:checked
      background-color: #f1c40f
      border-color: #f1c40f
      &::after
        content: ""
        width: 6px
        height: 10px
        border: solid white
        border-width: 0 2px 2px 0
        transform: rotate(45deg)

  &_text
    font-size: 15px

  &_number
    width: 80px
    padding: 5px
    border-radius: 6px
    border: none
    outline: none

</style>
