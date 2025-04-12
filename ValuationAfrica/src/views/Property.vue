<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">ValuationsAfrica Properties</h1>
        <button 
          @click="logout" 
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="mb-6 px-4 sm:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <input
            type="text"
            v-model="searchInput"
            @input="store.setSearchQuery(searchInput)"
            placeholder="Search by owner, description or location..."
            class="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <!-- Filter -->
        <div>
          <select
            v-model="filterInput"
            @change="store.setFilterValue(filterInput)"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Listing Types</option>
            <option v-for="type in store.propertyListingTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        
        <!-- View toggle -->
        <div class="flex justify-end">
          <button
            @click="store.toggleViewMode"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {{ store.viewMode === 'card' ? 'Switch to List View' : 'Switch to Card View' }}
          </button>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="store.loading" class="text-center py-8">
        <p class="text-xl">Loading properties...</p>
      </div>
      
      <!-- Error message -->
      <div v-else-if="store.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ store.error }}
      </div>
      
      <!-- No results message -->
      <div v-else-if="store.filteredProperties.length === 0" class="text-center py-8">
        <p class="text-xl">No properties found. Try adjusting your search or filter.</p>
      </div>
      
      <!-- Properties list -->
      <div v-else>
        <!-- Card view -->
        <div v-if="store.viewMode === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
          <div
            v-for="property in store.filteredProperties"
            :key="property.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Property image -->
            <div class="h-48 overflow-hidden">
              <img 
                v-if="property.cover_photo?.url" 
                :src="property.cover_photo.url" 
                :alt="property.cover_photo.description || 'Property image'"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">No image available</span>
              </div>
            </div>
            
            <div class="p-4">
              <!-- Price and listing type -->
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold text-blue-600">
                  {{ property.price ? `MWK ${property.price.toLocaleString()}` : 'Price not available' }}
                </span>
                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {{ property.listing_type || 'N/A' }}
                </span>
              </div>
              
              <!-- Owner name -->
              <h3 class="text-lg font-medium text-gray-900 truncate">{{ property.owner_name || 'Unnamed Property' }}</h3>
              
              <!-- Location -->
              <p v-if="property.location" class="mt-1 text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ property.location.area }}, {{ property.location.district }}
              </p>
              
              <!-- Property details -->
              <div class="mt-3 grid grid-cols-2 gap-2">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span class="text-sm">{{ property.property_design || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm">Built: {{ property.year_built || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
                  </svg>
                  <span class="text-sm">{{ property.no_rooms || 0 }} Rooms</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm">{{ property.no_of_bathrooms || 0 }} Baths</span>
                </div>
                <div class="flex items-center col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span class="text-sm">{{ property.construction_stage || 'N/A' }}</span>
                </div>
              </div>
              
              <!-- Agent info if available -->
              <div v-if="property.agent" class="mt-3 pt-3 border-t border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img v-if="property.agent.profile_image" :src="property.agent.profile_image" class="h-6 w-6 rounded-full" :alt="property.agent.name">
                    <div v-else class="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-xs text-gray-600">{{ property.agent.name?.charAt(0) || 'A' }}</span>
                    </div>
                  </div>
                  <div class="ml-2">
                    <p class="text-xs text-gray-600">Agent: {{ property.agent.name || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- List view -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="property in store.filteredProperties" :key="property.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">{{ property.owner_name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ property.location ? `${property.location.area}, ${property.location.district}` : 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.property_design || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ property.no_rooms || 0 }} rooms, {{ property.no_of_bathrooms || 0 }} baths
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ property.price ? `MWK ${property.price.toLocaleString()}` : 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {{ property.listing_type || 'N/A' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// Import the main store
import { useMainStore } from '../stores'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PropertyPage',
  
  setup() {
    // Reactive variables
    const searchInput = ref('')
    const filterInput = ref('')
    
    // Get router and store
    const router = useRouter()
    const store = useMainStore()
    
    // Load properties when component mounts
    onMounted(() => {
      // Fetch properties when the component is mounted
      store.fetchProperties()
    })
    
    // Handle logout
    const logout = () => {
      store.logout()
      router.push('/login')
    }
    
    return {
      searchInput,
      filterInput,
      store,
      logout
    }
  }
}
</script>