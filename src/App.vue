<script setup>
import {ref, computed, onMounted} from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {auth} from '@/db/fb';
import { useSessionStore } from './stores/userSessionStore';

const sessionStore = useSessionStore();
const router = useRouter();
const route = useRoute();
const path = computed(() => route.path);

const proxyIsLoggedIn = ref(sessionStore.getUserLoggedIn);
const currentUser = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    proxyIsLoggedIn.value = !!user;
    currentUser.value = user;
    if (user) {
      sessionStore.setUser(user, user.email, true, (new Date()).getTime());
    } else {
      sessionStore.removeUser();
    }
  });
});

const logout = () => {
  signOut(auth)
      .then(() => {
        console.log('Logged out');
        orderStore.clearOrders();
        sessionStorage.removeItem('dataFetched');
        sessionStore.removeUser();
        proxyIsLoggedIn.value = false;
        router.push('/login');
      })
      .catch((error) => {
        console.log(error);
      });
}
</script>

<template>
<header class="header">
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
            src='./assets/aus-logo.png'
            alt="Aus Logo"
            class="logo"
            :lazy="false"
        >
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/'}" v-if="proxyIsLoggedIn">
        <strong>Query Form</strong>
      </b-navbar-item>
    </template>
    <template #middle>
      <h4 v-if="proxyIsLoggedIn && currentUser">
        Welcome, {{currentUser.name}}
      </h4>
    </template>
    <template #end>
      <b-navbar-item tag="router-link" :to="{path: '/query-list'}" v-if="proxyIsLoggedIn">
        <strong>Query List</strong>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{path: '/login'}" v-if=" !proxyIsLoggedIn && path !== '/login' ">
        <strong class="button is-primary">Login</strong>
      </b-navbar-item>
      <b-navbar-item tag="div" v-if="proxyIsLoggedIn">
        <div class="buttons">
          <a class="button is-primary" href="#" @click.prevent="logout">
            <strong>Log out</strong>
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</header>

<main class="container">
  <router-view class=""></router-view>
</main>

<footer>
  <div class="footer">
    <small>
      Made with 💛 by Gourab
    </small>
  </div>
</footer>
</template>

<style scoped>
.logo {
  max-height: 4rem;
}
</style>
