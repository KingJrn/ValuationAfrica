<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ValuationsAfrica Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access property listings
        </p>
      </div>
      
      <!-- error message -->
      <div v-if="store.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ store.error }}
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="store.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="store.loading">Loading...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// Import the main store
import { useMainStore } from '../stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  
  setup() {
    // Set up reactive variables
    const email = ref('')
    const password = ref('')
    

    const router = useRouter()
    const store = useMainStore()
    
    const handleLogin = async () => {
      const success = await store.login(email.value, password.value)
      
      if (success) {
        // Redirect to properties page
        router.push('/properties')
      }
    }
    
    return {
      email,
      password,
      store,
      handleLogin
    }
  }
}
</script>