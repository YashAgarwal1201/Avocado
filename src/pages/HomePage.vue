<template>
  <BaseLayout>
    <div class="w-full h-full flex flex-col gap-4 p-4">
      <div class="flex flex-col gap-y-1">
        <h1 class="text-2xl font-semibold font-heading">Welcome to Avocado World 🥑</h1>
        <p class="font-content">Please enter your GitHub Personal Access Token (PAT) to
          continue.</p></div>
      <div v-if="!pat" class="flex-grow-1 flex justify-center items-center">


        <div class="flex items-center justify-center gap-x-2">
          <InputText

              v-model="inputPat"
              class="border border-gray-300 rounded px-4 py-2 w-80"
              placeholder="Enter GitHub PAT"
              type="password"

          />
          <Button
              class="px-4 py-2 flex flex-row items-center gap-x-2 rounded-lg"
              @click="saveToken"
          >
            <span class="pi pi-check"></span>
            <span>Save Token</span>
          </Button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'
import {Button, InputText} from "primevue";

const router = useRouter()

const pat = ref<string | null>(null)
const inputPat = ref('')

onMounted(() => {
  pat.value = localStorage.getItem('github_pat_token')

  if (pat.value) {
    router.replace('/dashboard') // Immediately navigate if token exists
  }
})

function saveToken() {
  if (inputPat.value.trim()) {
    localStorage.setItem('github_pat_token', inputPat.value.trim())
    router.push('/dashboard')
  } else {
    alert('Please enter a valid token.')
  }
}
</script>
