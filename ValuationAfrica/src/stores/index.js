import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // Auth states
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    
    properties: [],
    loading: false,
    error: null,
    
    // UI states
    viewMode: 'card', 
    searchQuery: '',
    filterValue: ''
  }),
  
  actions: {
    // Auth actions
    async login(email, password) {
      try {
        this.loading = true
        this.error = null
        
        const response = await fetch('https://staging.valuationsafrica.mw/api/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        
        if (!response.ok) {
          throw new Error('Login failed')
        }
        
        const data = await response.json()
        
        // Store the token and user info
        this.token = data.token
        this.user = data.user || { email }
        
        // Save to localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        this.loading = false
        return true
      } catch (error) {
        console.error('Login failed:', error)
        this.error = `Login failed. ${response}`
        this.loading = false
        return false
      }
    },
    
    // Logout user
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    async fetchProperties() {
      this.loading = true;
      const response = await fetch('https://staging.valuationsafrica.mw/api/v2/properties', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        }
      });
      this.properties = (await response.json()).data;
      this.loading = false;
    },
    
    // UI actions
    toggleViewMode() {
      this.viewMode = this.viewMode === 'card' ? 'list' : 'card'
    },
    
    setSearchQuery(query) {
      this.searchQuery = query
    },
    
    setFilterValue(value) {
      this.filterValue = value
    }
  },
  
  getters: {
    // Auth getters
    isAuthenticated: (state) => !!state.token,
    
    // Property getters
    filteredProperties: (state) => {
      let result = [...state.properties]
      
      // Apply search filter if search query exists
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(property => 
          property.owner_name?.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          property.location?.area?.toLowerCase().includes(query) ||
          property.location?.district?.toLowerCase().includes(query)
        )
      }
      
      // Filter by listing type (Rent, Sale)
      if (state.filterValue) {
        result = result.filter(property => 
          property.listing_type === state.filterValue
        )
      }
      
      return result
    },
    
    // Get listing types for filter dropdown
    propertyListingTypes: (state) => {
      const types = new Set()
      state.properties.forEach(property => {
        if (property.listing_type) {
          types.add(property.listing_type)
        }
      })
      return Array.from(types)
    }
  }
})