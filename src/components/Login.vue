<template>
	<section>
		<form class="login-form">
			<article>
				<header class="form-heading">
					<h1 class="title is-4">User Login</h1>
				</header>

				<main>
					<b-field
						label="Email"
						:label-position="labelPosition"
						type="is-primary"
					>
						<b-input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							v-if="null != loginRequest.error"
							v-model="loginRequest.email"
							:aria-invalid="null != loginRequest.error"
							@input="clearErrorMessage"
							required
						>
						</b-input>
						<b-input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							v-if="null == loginRequest.error"
							v-model="loginRequest.email"
							@input="clearErrorMessage"
							required
						>
						</b-input>
						<template #message v-if="loginRequest.error">
							<div>Wrong Email</div>
						</template>
					</b-field>

					<b-field
						label="Password"
						:label-position="labelPosition"
						type="is-primary is-light"
					>
						<b-input
							type="password"
							id="password"
							name="password"
							maxlength="30"
							placeholder="Password"
							v-if="null != loginRequest.error"
							v-model="loginRequest.password"
							:aria-invalid="null != loginRequest.error"
							@input="clearErrorMessage"
							required
						></b-input>
						<b-input
							type="password"
							id="password"
							name="password"
							maxlength="30"
							placeholder="Password"
							v-if="null == loginRequest.error"
							v-model="loginRequest.password"
							@input="clearErrorMessage"
							required
						></b-input>
						<template #message v-if="loginRequest.error">
							<div>Password is too short</div>
							<div>Password must have at least 8 characters</div>
						</template>
					</b-field>
				</main>
				<b-field v-if="errorMessage" type="is-primary is-light">
					<template #message>
						<small class="error">{{ errorMessage }}</small>
					</template>
				</b-field>

				<footer class="form-footer">
					<b-button
						class="button is-primary"
						type="submit"
						@click.prevent="
							login(loginRequest.email, loginRequest.password)
						"
						:loading="isLoading"
						:message="errorMessage"
					>
						Login
					</b-button>
				</footer>
			</article>
		</form>
	</section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
	browserSessionPersistence,
	setPersistence,
	signInWithEmailAndPassword
} from "firebase/auth";
import { useSessionStore } from "@/stores/userSessionStore";
import { auth } from "@/db/fb.js";

const labelPosition = ref("inside");

const router = useRouter();
const { setUser, getIsLoading } = useSessionStore();
const user = auth.currentUser;
const errorMessage = ref("");
const isLoading = ref(false);

const emptyLoginRequest = {
	email: "",
	password: ""
};

const loginRequest = ref({ ...emptyLoginRequest, error: null });

const login = async (email, password) => {
	isLoading.value = true; // Start loading animation

	setPersistence(auth, browserSessionPersistence).then(() => {
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				console.log("user is loggedin: ");
				setUser(user, (email = email), true, new Date().getTime());

				// Show query form after successful login
				router.push("/");
			})
			.catch(error => {
				switch (error.code) {
					case "auth/invalid-email":
						errorMessage.value = "Email address is invalid.";
						break;
					case "auth/user-not-found":
						errorMessage.value = "User not found!";
						break;
					case "auth/wrong-password":
						errorMessage.value = "Email/password is wrong.";
						break;
					case "auth/invalid-credential":
						errorMessage.value = "invalid Login credentials.";
						break;
				}
			})
			.finally(() => {
				isLoading.value = false; // Stop loading animation
			});
	});
};

// Watch for changes in errorMessage and log it for debugging purposes
watch(errorMessage, (newValue, oldValue) => {
	console.log("Error message changed:", newValue);
});

const clearErrorMessage = () => {
	errorMessage.value = ""; // Clear the error message
};
</script>

<style scoped>
.login-form {
	margin: auto;
	max-width: 600px;
	border: rebeccapurple solid;
}

.login-form > article {
	margin: auto;
	max-height: 500px;
	max-width: 500px;
}
.form-heading {
	color: hsl(0, 0%, 21%);
	margin-top: 2rem;
	margin-bottom: 2rem;
	font-size: 1.5rem;
	font-weight: bold;
}

.form-footer {
	margin-top: 2rem;
	margin-bottom: 2rem;
}

.error {
	font-size: medium;
}
</style>
