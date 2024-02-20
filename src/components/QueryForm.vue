<template>
	<section class="query-form">
		<div class="query-form-title">
			<h1>Enter Client Details</h1>
		</div>

		<b-field label="Name" :label-position="labelPosition">
			<b-input
				type="text"
				v-model="query.clientName"
				id="client_name"
				name="client_name"
				placeholder="Client name"
				required
			></b-input>
		</b-field>

		<b-field label="Email" :label-position="labelPosition">
			<b-input
				type="email"
				maxlength="30"
				v-model="query.clientEmail"
				id="client_email"
				name="client_email"
				placeholder="Client email"
			></b-input>
		</b-field>

		<b-field label="Address" :label-position="labelPosition">
			<b-input
				type="text"
				v-model="query.clientAddress"
				id="client_address"
				name="client_address"
				placeholder="Client address"
				required
			></b-input>
		</b-field>

		<b-field label="Age" :label-position="labelPosition">
			<b-numberinput
				:min="0"
				:max="120"
				v-model="query.clientAge"
				id="client_age"
				name="client_age"
				placeholder="Client age"
			>
				<template #prefix>
					<font-awesome-icon
						icon="plus"
						size="sm"
						style="color: #ffffff"
						aria-hidden="true"
					/>
				</template>
				<template #suffix>
					<font-awesome-icon
						icon="minus"
						size="sm"
						style="color: #ffffff"
						aria-hidden="true"
					/>
				</template>
			</b-numberinput>
		</b-field>

		<b-field label="Gender" class="gender-field">
			<div class="block">
				<b-radio
					v-model="query.clientGender"
					name="male"
					native-value="Male"
				>
					Male
				</b-radio>
				<b-radio
					v-model="query.clientGender"
					name="female"
					native-value="Female"
				>
					Female
				</b-radio>
			</div>
		</b-field>

		<b-field label="Contact No." :label-position="labelPosition">
			<b-input
				type="tel"
				v-model="query.clientContactNo"
				id="client_contactNo"
				name="client_contactNo"
				placeholder="Mobile Phone Number"
				required
			></b-input>
		</b-field>

		<b-field label="Whatsapp No." :label-position="labelPosition">
			<b-input
				type="tel"
				v-model="query.clientWhatsappNo"
				id="client_clientWhatsappNo"
				name="client_clientWhatsappNo"
				placeholder="Whatsapp No."
			></b-input>
		</b-field>

		<b-field label="Called For" :label-position="labelPosition">
			<b-input
				type="text"
				v-model="query.calledFor"
				id="client_calledFor"
				name="client_calledFor"
				placeholder="Client Called For"
				required
			></b-input>
		</b-field>

		<b-field label="Query Received By" :label-position="labelPosition">
			<b-input
				type="text"
				v-model="query.queryReceivedBy"
				id="client_queryReceivedBy"
				name="client_queryReceivedBy"
				placeholder="Client Query Received By"
				required
			></b-input>
		</b-field>

		<b-field label="Select datetime" :label-position="labelPosition">
			<b-input
				type="datetime-local"
				placeholder="Click to select..."
				icon="calendar-today"
				horizontal-time-picker
				v-model="query.queryDate"
				id="client_queryDate"
				name="client_queryDate"
				rounded
				required
			>
			</b-input>
		</b-field>

		<b-field label="Subject" :label-position="labelPosition">
			<b-input
				maxlength="300"
				type="textarea"
				v-model="query.querySubject"
				id="client_querySubject"
				name="client_querySubject"
				placeholder="Client Query Subject"
				required
			></b-input>
		</b-field>

		<b-field label="Notes: add some tags" :label-position="labelPosition">
			<b-taginput
				v-model="query.notes"
				ellipsis
				icon="label"
				placeholder="Add a tag"
			>
			</b-taginput>
		</b-field>

		<b-field
			label="Resolution Given"
			:label-position="labelPosition"
			v-if="showResolutionGiven"
		>
			<b-input
				maxlength="300"
				type="textarea"
				v-model="query.resolutionGiven"
				id="client_resolution"
				name="client_resolution"
				placeholder="Client Resolution"
			></b-input>
		</b-field>

		<b-field
			label="Remarks"
			:label-position="labelPosition"
			v-if="showRemarks"
		>
			<b-input
				maxlength="100"
				type="textarea"
				v-model="query.remarks"
				id="client_remarks"
				name="client_remarks"
				placeholder="Remarks To Client"
			></b-input>
		</b-field>

		<b-field>
			<b-button
				class="button is-primary"
				type="submit"
				@click.prevent="submit"
				:loading="loading"
			>
				Save
			</b-button>
		</b-field>
	</section>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { addNewQuery, fetchSingleDocRef } from "@/db/dbQueries.js";
import { db } from "@/db/fb.js";
import { getFormattedDate } from "@/util/util.js";
import { useSessionStore } from "@/stores/userSessionStore";
import { useQueryStore } from "@/stores/querySessionStore";
import { ToastProgrammatic as Toast } from "@ntohq/buefy-next";

const sessionStore = useSessionStore();
const queryStore = useQueryStore();
const router = useRouter();
const toast = new Toast();

const loading = ref(false);
const labelPosition = "inside";

const showResolutionGiven = ref(false);
const showRemarks = ref(false);

const blankQuery = {
	clientName: "",
	clientAddress: "",
	clientAge: 0,
	clientGender: "",
	clientContactNo: "",
	clientWhatsappNo: "",
	clientEmail: "",
	calledFor: "",
	querySubject: "",
	queryReceivedBy: "",
	queryDate: getFormattedDate(new Date()),
	queryStatus: "Received",
	notes: [],
	resolutionGiven: "",
	remarks: ""
};

const query = ref({ ...blankQuery });

// Check if the user is logged in
const loggedIn = computed(() => sessionStore.getUser() !== null);

// Check if the current route is /queryList
const isQueryListRoute = computed(
	() => router.currentRoute.value.path === "/queryList"
);

// Watch for changes in user login status and current route
watch([loggedIn, isQueryListRoute], ([isLoggedIn, isQueryList]) => {
	if (isLoggedIn && isQueryList) {
		// User is logged in and on /queryList route, show resolution given and remarks fields
		showResolutionGiven.value = true;
		showRemarks.value = true;
	} else {
		// User is not logged in or not on /queryList route, hide resolution given and remarks fields
		showResolutionGiven.value = false;
		showRemarks.value = false;
		// Clear resolution given and remarks data
		query.resolutionGiven = "";
		query.remarks = "";
	}
});

const notificationMsg = ref("");

const submit = async () => {
	loading.value = true;

	const sessionUserEmail = sessionStore.getUser().email;
	const submitResult = await addNewQuery(db, query.value, sessionUserEmail);

	if (submitResult && submitResult.docRef) {
		const queryData = await fetchSingleDocRef(submitResult.docRef);

		// Save the query data to the Pinia store
		queryStore.pushQuery(queryData);

		// Notify user with message
		notificationMsg.value = `Query created | sln : ${submitResult.sln}`;
		toast.open({
			message: notificationMsg.value,
			type: "is-success"
		});
		query.value = { ...blankQuery };
		loading.value = false;
	} else {
		notificationMsg.value = `Did not Save..`;
		toast.open({
			message: notificationMsg.value,
			type: "is-danger"
		});
		loading.value = false;
	}
};

const isSaveButtonDisabled = computed(() => {
	const noItem = query.value.items == null || order.value.items.length === 0;
	const hasInvalidQuantity = order.value.items.some(item => item.qty < 1);
	const hasInvalidName = order.value.items.some(item => {
		const productName = item.name.trim();
		return productName === "";
	});
	return hasInvalidQuantity || hasInvalidName || noItem;
});

// onMounted(() => {
// 	toast.open({
// 		message: "Logged in!",
// 		type: "is-success"
// 	});
// });
</script>

<style scoped>
.query-form {
	margin: auto;
	padding: 2rem;
	max-width: 600px;
	border: rebeccapurple solid;
}

.query-form-title {
	margin-bottom: 1rem;
}

/* .block {
	margin: 1rem;
} */

.gender-field {
	margin-bottom: 1rem; /* Add margin bottom for spacing */
	display: flex;
	justify-content: space-between;
	width: calc(50% - 15px); /* Set width to 50% with margin */
}

.gender-field .control label {
	margin-left: 2rem; /* Add margin between radio buttons */
}
</style>
