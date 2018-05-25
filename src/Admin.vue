<template>
  <div id="app">
    Admin
  </div>
</template>

<script>
  import axios from 'axios';

  const serverPrefix = 'http://localhost:3000';

  export default {
    data() {
      return {
        step: 0,
        fetchExistEmployee: false,
        isSaving: false,
        employeeChineseName: '',
        employeeId: -1,
        performance: [],
        diff: []
      }
    },

    
    mounted() {
      
    }
  }
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}

.container {
  padding: 20px;
}
</style>
