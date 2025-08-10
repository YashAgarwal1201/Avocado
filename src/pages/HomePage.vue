<template>
  <BaseLayout>
    <div class="w-full h-full flex flex-col gap-4 p-4">
      <div class="flex flex-col gap-y-1">
        <h1 class="text-2xl font-semibold font-heading text-green-800 dark:text-green-400">
          Welcome to Avocado World 🥑
        </h1>
        <p class="font-content">
          Please enter your GitHub Personal Access Token (PAT) to continue.
        </p>
      </div>

      <div v-if="!pat" class="flex-grow-1 flex justify-center items-center">
        <div class="flex flex-col items-center justify-center">
          <div class="flex items-center justify-center gap-x-2">
            <InputText
                v-model="inputPat"
                :disabled="validating"
                class="flex-grow-1 flex-shrink-1 border border-stone-300 dark:border-stone-600 !bg-stone-100 dark:!bg-stone-800 rounded px-4 py-2"
                maxlength="200"
                placeholder="Enter GitHub PAT"
            />
            <Button
                :disabled="validating"
                :loading="validating"
                class="flex-shrink-0 px-4 py-2 flex flex-row items-center gap-x-2 rounded-lg !border-none !bg-yellow-600 dark:!bg-yellow-500 hover:!bg-yellow-700 dark:hover:!bg-yellow-400"
                @click="onContinue"
            >
              <span class="pi pi-check"/>
              <span>Continue</span>
            </Button>
          </div>

          <p class="w-full text-center mt-3">
            Don’t have a PAT? You can create one, or if you already have one, retrieve it
            from
            <a
                :href="GITHUB_TOKEN_PAGE_URL"
                class="underline text-stone-600 dark:text-stone-400 text-base"
                rel="noreferrer noopener nofollow"
                target="_blank"
            >
              here
            </a>.
          </p>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'
import {Button, InputText} from 'primevue'
import toastHandler from '../composables/toastHandler.ts'
import {GITHUB_TOKEN_PAGE_URL, VALIDATE_GITHUB_TOKEN_URL} from "../constants/BaseConstants.ts";

const {showToast} = toastHandler()
const router = useRouter()

const pat = ref<string | null>(null)
const inputPat = ref('')
const validating = ref(false)

// Configure required scopes for your app (commenting for now, might use later)
// const requiredScopes = ['read:user']

onMounted(() => {
  pat.value = localStorage.getItem('github_pat_token')
  if (pat.value) {
    router.replace('/dashboard')
  }
})

function isLikelyValidFormat(token: string) {
  // Basic checks for common PAT prefixes and length.
  // Fine-grained tokens start with 'github_pat_' and are longer.
  // Classic tokens start with ghp_ (40 chars). Also cover gho_, ghs_, ghu_, ghr_ etc
  if (!token) return false
  const fineGrained = /^github_pat_[A-Za-z0-9_-]{20,}$/.test(token)
  const classic = /^gh[pousr]_[A-Za-z0-9]{36,}$/.test(token)
  return fineGrained || classic
}

async function validateGithubToken(token: string) {
  // Returns: { ok: boolean, status: number, scopes: string, user?: any }
  const res = await fetch(VALIDATE_GITHUB_TOKEN_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })

  const scopesHeader = (res.headers.get('x-oauth-scopes') || '').trim() // comma-separated
  let user = null
  if (res.ok) {
    // We only parse body when ok
    user = await res.json()
  }
  return {
    ok: res.ok,
    status: res.status,
    scopes: scopesHeader,
    user
  }
}

async function onContinue() {
  const token = inputPat.value.trim()
  if (!token) {
    showToast('warn', 'Missing token', 'Please enter your GitHub PAT.')
    return
  }

  if (!isLikelyValidFormat(token)) {
    showToast(
        'warn',
        'Invalid format',
        'This token does not look like a GitHub PAT. Make sure it starts with github_pat_ or ghp_.'
    )
    return
  }

  validating.value = true
  try {
    const result = await validateGithubToken(token)

    if (!result.ok) {
      // Common failures: 401 Unauthorized
      if (result.status === 401) {
        showToast('error', 'Invalid token', 'The provided token is invalid or expired.')
      } else {
        showToast('error', 'Validation failed', `GitHub returned status ${result.status}.`)
      }
      return
    }

    // Check for required scopes (commenting for now, might use later)
    // const scopes = result.scopes.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    // const missing = requiredScopes.filter(s => !scopes.includes(s.toLowerCase()))
    // if (missing.length > 0) {
    //   showToast(
    //       'warn',
    //       'Insufficient scopes',
    //       `Token is valid, but missing scopes: ${missing.join(', ')}. Generate a token with these scopes.`
    //   )
    //   return
    // }

    // Success — save token and continue
    showToast('success', 'Connected', `Welcome ${result.user?.login ?? 'GitHub user'}!`)
    localStorage.setItem('github_pat_token', token)

    await router.push('/dashboard')
  } catch (err: any) {
    console.error(err)
    showToast('error', 'Network error', 'Unable to validate token. Please try again.')
  } finally {
    validating.value = false
  }
}
</script>
