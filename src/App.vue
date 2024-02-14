<script setup>
import {ref, computed, onMounted} from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {auth} from '@/db/fb';

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

</template>

<style scoped>
</style>
