import { reactive, ref } from "vue"
export const sections = ref([
  {
    key: "inbox",
    title: "Inbox",
    icon: "📥",
    isShowAddTaskButton: true,
    isNew: false,
  },
  {
    key: "todo",
    title: "Todo",
    icon: "📝",
    isShowAddTaskButton: true,
    isNew: false,
  },
  {
    key: "waiting",
    title: "Waiting",
    icon: "⏳",
    isShowAddTaskButton: true,
    isNew: false,
  },
  {
    key: "someday",
    title: "Someday",
    icon: "🌙",
    isShowAddTaskButton: true,
    isNew: false,
  },
  {
    key: "done",
    title: "Done",
    icon: "✅",
    isShowAddTaskButton: false,
    isNew: false,
  },
  {
    key: "trash",
    title: "Trash",
    icon: "🗑️",
    isShowAddTaskButton: false,
    isSerchTags: false,
    isNew: false,
  },
])
