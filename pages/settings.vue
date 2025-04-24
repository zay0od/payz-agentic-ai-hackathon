<template>
  <div class="page-wrapper">
    <PageTransition>
      <div class="dashboard-container">
        <header class="header">
          <button class="icon-button" aria-label="Back" @click="navigateTo('/dashboard')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="page-title">Settings</h1>
          <div class="header-spacer"/>
        </header>

        <div class="page-header">
          <h1 class="page-title">Account Settings</h1>
          <p class="page-subtitle">Manage your <span class="highlight highlight-blue">profile</span> settings.</p>
        </div>

        <div class="settings-content">
          <div class="settings-section">
            <div class="section-header">
              <h2 class="section-title">User Profile</h2>
            </div>
            <div class="profile-info">
              <div class="info-item">
                <label>Name</label>
                <p>{{ user?.name || 'Not set' }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ user?.email || 'Not set' }}</p>
              </div>
              <div class="info-item">
                <label>Member Since</label>
                <p>{{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageTransition from '~/components/PageTransition.vue';

const router = useRouter();
const user = ref(null);

const navigateTo = (path) => {
  router.push(path);
};

// TODO: Fetch user data from your backend
onMounted(async () => {
  // Implement user data fetching here
});

definePageMeta({
  title: "Settings",
});
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.dashboard-container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
  /* border: 2px solid #333; */
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  position: relative;
}

.header-spacer {
  width: 40px; /* Same width as the back button to maintain centering */
}

.header .page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.page-header {
  padding: 0;
  margin-bottom: 1.2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #666;
  font-weight: 400;
  line-height: 1.5;
}

.highlight {
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.highlight-blue {
  background-color: rgba(233, 30, 99, 0.2);
  color: #c2185b;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
  color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.875rem;
  color: #666;
}

.info-item p {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.icon-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.icon-button:hover {
  background-color: #f5f5f5;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .dashboard-container {
    max-width: 480px;
  }
}

@media (min-width: 768px) {
  .dashboard-container {
    max-width: 500px;
  }
}
</style> 