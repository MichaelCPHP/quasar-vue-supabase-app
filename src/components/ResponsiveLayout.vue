<template>
  <div class="responsive-layout">
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Responsive Layout Example</div>
      
      <div class="row q-col-gutter-md">
        <!-- Sidebar - Hidden on small screens -->
        <div class="col-12 col-sm-4 col-md-3 gt-xs">
          <q-card class="sidebar full-height">
            <q-card-section>
              <div class="text-h6">Sidebar</div>
              <div class="text-subtitle2">Only visible on tablet and desktop</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item clickable v-ripple>
                  <q-item-section>Home</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Main Content - Full width on mobile, reduced on tablet/desktop -->
        <div class="col-12 col-sm-8 col-md-9">
          <q-card>
            <q-card-section>
              <div class="text-h6">Main Content</div>
              <div class="text-subtitle2">Responsive width based on screen size</div>
            </q-card-section>
            <q-card-section>
              <p>This layout automatically adjusts based on screen size:</p>
              <ul>
                <li>On mobile: Full width content, sidebar hidden</li>
                <li>On tablet: Sidebar (1/3) and content (2/3)</li>
                <li>On desktop: Sidebar (1/4) and content (3/4)</li>
              </ul>
              
              <div class="q-mt-md">
                <q-badge color="primary" class="q-mr-sm">
                  <q-icon name="smartphone" class="q-mr-xs" />
                  xs: {{ $q.screen.xs ? 'Active' : 'Inactive' }}
                </q-badge>
                <q-badge color="secondary" class="q-mr-sm">
                  <q-icon name="tablet" class="q-mr-xs" />
                  sm: {{ $q.screen.sm ? 'Active' : 'Inactive' }}
                </q-badge>
                <q-badge color="accent" class="q-mr-sm">
                  <q-icon name="laptop" class="q-mr-xs" />
                  md: {{ $q.screen.md ? 'Active' : 'Inactive' }}
                </q-badge>
                <q-badge color="positive">
                  <q-icon name="desktop_windows" class="q-mr-xs" />
                  lg+: {{ $q.screen.lg || $q.screen.xl ? 'Active' : 'Inactive' }}
                </q-badge>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Grid example -->
          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h6">Grid Example</div>
            </q-card-section>
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="n in 6" :key="n">
                  <q-card class="bg-primary text-white">
                    <q-card-section>
                      <div class="text-h6">Item {{ n }}</div>
                      <div class="text-subtitle2">Responsive grid item</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Supabase Authentication Example -->
          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h6">Supabase Authentication</div>
            </q-card-section>
            <q-card-section>
              <AuthComponent />
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <!-- Bottom navigation for mobile only -->
      <div class="lt-sm q-mt-md">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="home" icon="home" label="Home" />
            <q-tab name="profile" icon="person" label="Profile" />
            <q-tab name="settings" icon="settings" label="Settings" />
            <q-tab name="logout" icon="logout" label="Logout" />
          </q-tabs>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import AuthComponent from './AuthComponent.vue'

const $q = useQuasar()
const tab = ref('home')
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #f5f5f5;
}

.full-height {
  height: 100%;
}
</style> 