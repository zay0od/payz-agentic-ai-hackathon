<template>
  <div class="app-container">
      <!-- Page View -->
          <NuxtPage />
      <!-- Page View -->
  </div>
</template>


<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
}

.app-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: .2rem;
}
</style>
