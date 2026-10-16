<template>
  <div style="padding: 40px; font-family: sans-serif;">
    <h1>Phase 3: Frontend Kit Connection Test</h1>
    
    <div v-if="pageData" style="background: #f4f4f4; padding: 20px; border-radius: 8px; overflow-x: auto;">
      <h2>Raw Strapi Home Data:</h2>
      <pre>{{ pageData }}</pre>
    </div>
    <p v-else>Loading data via cms.js...</p>
  </div>
</template>

<script>
// Adjust this path if your frontend-kit folder is located somewhere else
import { createCms } from '~/frontend-kit/cms.js'; 

export default {
  name: "IndexPage",
  data() {
    return {
      pageData: null
    };
  },
  async mounted() {
    try {
      // Initialize the CMS client targeting your local Strapi port
      const cms = createCms({ baseUrl: 'http://localhost:1337', locale: 'en' });
      
      // Fetch the home page using the updated kit
      this.pageData = await cms.page('home');
      
      console.log("Strapi Homepage Payload (via cms.js):", this.pageData);
    } catch (error) {
      console.error("Failed to fetch via cms.js:", error);
    }
  }
};
</script>