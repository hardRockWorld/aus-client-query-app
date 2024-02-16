<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/db/fb";
import { useSessionStore } from "./stores/userSessionStore";

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
      sessionStore.setUser(user, user.email, true, new Date().getTime());
    } else {
      sessionStore.removeUser();
    }
  });
});

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out");
      // orderStore.clearOrders();
      sessionStorage.removeItem("dataFetched");
      sessionStore.removeUser();
      proxyIsLoggedIn.value = false;
      router.push("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<template>
  <section class="hero is-fullheight has-background-light">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <RouterLink class="logo-link contrast navbar-item" to="/">
              <a>
                <img src="./assets/aus-logo.png" alt="Aus Logo" class="logo" />
              </a>
            </RouterLink>
            <a class="navbar-item">
              <RouterLink
                class="logo-link contrast"
                to="/"
                v-if="proxyIsLoggedIn"
              >
                <strong>Query Form</strong>
              </RouterLink>
            </a>
            <span class="navbar-burger" data-target="navbarMenuHeroA">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <div class="navbar-middle">
            <h4 v-if="proxyIsLoggedIn && currentUser">
              Welcome, {{ currentUser.name }}
            </h4>
          </div>

          <div id="navbarMenuHeroA" class="navbar-menu">
            <div class="navbar-end">
              <a class="navbar-item">
                <RouterLink
                  class="logo-link contrast"
                  to="/query-list"
                  v-if="proxyIsLoggedIn"
                >
                  <strong>Query List</strong>
                </RouterLink>
              </a>
              <div class="navbar-item">
                <div class="buttons">
                  <RouterLink
                    class="logo-link button is-dark"
                    to="/login"
                    v-if="!proxyIsLoggedIn && path !== '/login'"
                  >
                    <strong>Login</strong>
                  </RouterLink>
                  <a
                    class="button is-link"
                    v-if="proxyIsLoggedIn"
                    href="#"
                    @click.prevent="logout"
                  >
                    <strong>Logout</strong>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
        <router-view class="main"> </router-view>
      </div>
    </div>
  </section>

  <section class="footer is-small has-background-light">
    <!-- Hero footer: will stick at the bottom -->
    <footer>
      <div class="content has-text-centered">
        <p>
          <strong>Aus client Query App</strong> made with 💛 by
          <a href="#">Gourab</a>
        </p>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.logo {
  max-height: 3rem;
}

.footer {
  margin-top: 0;
  max-height: 0;
}
</style>
