import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTaskStore = defineStore('taskStore', () => {
  let tasks = ref([])
  let loading = ref(false)

  const getTasks = async () => {
    loading.value = true

    // get data from json file using json server
    const res = await fetch('http://localhost:3000/tasks')
    const data = await res.json()

    tasks.value = data
    loading.value = false
  }

  const $reset = () => {
    tasks.value = []
  }

  const addTask = async (task) => {
    tasks.value.push(task)

    const res = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.error) {
      console.log(res.error)
    }
  }

  const deleteTask = async (id) => {
    tasks.value = tasks.value.filter(t => {
      return t.id !== id
    })

    const res = await fetch('http://localhost:3000/tasks/' + id, {
      method: 'DELETE',
    })

    if (res.error) {
      console.log(res.error)
    }
  }

  const toggleFav = async (id) => {
    const task = tasks.value.find(t => t.id === id)
    task.isFav = !task.isFav

    const res = await fetch('http://localhost:3000/tasks/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ isFav: task.isFav }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.error) {
      console.log(res.error)
    }
  }

  const favs = computed(() => {
    return tasks.value.filter(t => t.isFav)
  })

  const favCount = computed(() => {
    return tasks.value.reduce((p, c) => {
      return c.isFav ? p + 1 : p
    }, 0)
  })

  const totalCount = computed(() => {
    return tasks.value.length
  })

  return {
    tasks,
    loading,
    getTasks,
    addTask,
    deleteTask,
    toggleFav,
    favs,
    favCount,
    totalCount,
    $reset
  }

})