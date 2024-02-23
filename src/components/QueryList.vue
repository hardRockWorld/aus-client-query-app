<template>
	<section>
		<div class="container">
			<div class="search-block mb-4">
				<b-field label="Search">
					<b-input
						placeholder="Search a Query"
						type="search"
						id="search"
						name="search"
						v-model="searchQuery"
						rounded
					></b-input>
				</b-field>
			</div>

			<div class="columns is-multiline">
				<div
					class="column is-4"
					v-for="(query, index) in filteredQueries"
					:key="query.id"
				>
					<div class="card">
						<header class="card-header has-background-primary">
							<p class="card-header-title has-text-white">
								{{ query.clientName }}
							</p>
							<a
								href="#"
								class="card-header-icon"
								aria-label="more options"
								@click="
									editedQuery.value = query.value;
									editQuery(index);
								"
							>
								<span class="icon">
									<font-awesome-icon
										icon="pen-to-square"
										size="sm"
										style="color: #ffd43b"
										aria-hidden="true"
									/>
								</span>
							</a>
						</header>
						<div class="card-content">
							<div class="content">
								<p>
									<strong>Client Address:</strong>
									{{ query.clientAddress }}
								</p>
								<p>
									<strong>Age:</strong>
									{{ query.clientAge }}
								</p>
								<!-- Add more fields as needed -->
								<p>
									<strong>Query Date</strong>
									{{ query.queryDate }}
								</p>
								<p>
									<strong>Query Status</strong>
									{{ query.queryStatus }}
								</p>
							</div>
						</div>
						<footer class="card-footer">
							<a
								href="#"
								class="card-footer-item has-text-primary"
								@click="
									editedQuery = query;
									editQuery(index);
								"
								>Edit</a
							>
						</footer>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal for editing -->
		<div class="modal" :class="{ 'is-active': showModal }">
			<div class="modal-background" @click="closeModal"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">Edit Query</p>
					<button
						class="delete"
						aria-label="close"
						@click="closeModal"
					></button>
				</header>
				<section class="modal-card-body">
					<b-field label="Name" :label-position="labelPosition">
						<b-input
							type="text"
							v-model="editedQuery.clientName"
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
							v-model="editedQuery.clientEmail"
							id="client_email"
							name="client_email"
							placeholder="Client email"
						></b-input>
					</b-field>

					<b-field label="Address" :label-position="labelPosition">
						<b-input
							type="text"
							v-model="editedQuery.clientAddress"
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
							v-model="editedQuery.clientAge"
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

					<b-field label="Query Status" class="query-status-field">
						<b-select v-model="editedQuery.queryStatus">
							<option value="Received">Received</option>
							<option value="Discuss">Discuss</option>
							<option value="Closed">Closed</option>
						</b-select>
					</b-field>

					<b-field label="Gender" class="gender-field">
						<div class="block">
							<b-radio
								v-model="editedQuery.clientGender"
								name="male"
								native-value="Male"
							>
								Male
							</b-radio>
							<b-radio
								v-model="editedQuery.clientGender"
								name="female"
								native-value="Female"
							>
								Female
							</b-radio>
						</div>
					</b-field>

					<b-field
						label="Contact No."
						:label-position="labelPosition"
					>
						<b-input
							type="tel"
							v-model="editedQuery.clientContactNo"
							id="client_contactNo"
							name="client_contactNo"
							placeholder="Mobile Phone Number"
							required
						></b-input>
					</b-field>

					<b-field
						label="Whatsapp No."
						:label-position="labelPosition"
					>
						<b-input
							type="tel"
							v-model="editedQuery.clientWhatsappNo"
							id="client_clientWhatsappNo"
							name="client_clientWhatsappNo"
							placeholder="Whatsapp No."
						></b-input>
					</b-field>

					<b-field label="Called For" :label-position="labelPosition">
						<b-input
							type="text"
							v-model="editedQuery.calledFor"
							id="client_calledFor"
							name="client_calledFor"
							placeholder="Client Called For"
							required
						></b-input>
					</b-field>

					<b-field
						label="Query Received By"
						:label-position="labelPosition"
					>
						<b-input
							type="text"
							v-model="editedQuery.queryReceivedBy"
							id="client_queryReceivedBy"
							name="client_queryReceivedBy"
							placeholder="Client Query Received By"
							required
						></b-input>
					</b-field>

					<b-field
						label="Select datetime"
						:label-position="labelPosition"
					>
						<b-input
							type="datetime-local"
							placeholder="Click to select..."
							icon="calendar-today"
							horizontal-time-picker
							v-model="editedQuery.queryDate"
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
							v-model="editedQuery.querySubject"
							id="client_querySubject"
							name="client_querySubject"
							placeholder="Client Query Subject"
							required
						></b-input>
					</b-field>

					<b-field
						label="Notes: add some tags"
						:label-position="labelPosition"
					>
						<b-taginput
							v-model="editedQuery.notes"
							ellipsis
							icon="label"
							placeholder="Add a tag"
						>
						</b-taginput>
					</b-field>

					<b-field
						label="Resolution Given"
						:label-position="labelPosition"
					>
						<b-input
							maxlength="300"
							type="textarea"
							v-model="editedQuery.resolutionGiven"
							id="client_resolution"
							name="client_resolution"
							placeholder="Client Resolution"
							required
						></b-input>
					</b-field>

					<b-field label="Remarks" :label-position="labelPosition">
						<b-input
							maxlength="100"
							type="textarea"
							v-model="editedQuery.remarks"
							id="client_remarks"
							name="client_remarks"
							placeholder="Remarks To Client"
						></b-input>
					</b-field>
				</section>
				<footer class="modal-card-foot">
					<b-button
						class="button is-success is-fullwidth"
						@click.prevent="updateItem"
						:loading="loading"
						:disabled="isSaveButtonDisabled ? true : false"
					>
						Save changes
					</b-button>
					<b-button class="button is-fullwidth" @click="closeModal">
						Cancel
					</b-button>
				</footer>
			</div>
		</div>
	</section>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted,
	computed,
	onUnmounted,
	watch,
	toRefs
} from "vue";
import { useSessionStore } from "@/stores/userSessionStore.js";
import { useQueryStore } from "@/stores/querySessionStore.js";
import {
	fetchAllQueries,
	updateEditQuery,
	updateNonEditOrder
} from "@/db/dbQueries.js";
import { db, auth } from "@/db/fb.js";
import { NotificationProgrammatic as Notification } from "@ntohq/buefy-next";

// Initialize the session store here
const sessionStore = useSessionStore();
const queryStore = useQueryStore();

const queries = ref([]);
// const currentQuery = ref(null);
const showModal = ref(false);
const editedQuery = ref({});
// Introduce a flag to track saved changes in the modal
const modalCloseWithoutSave = ref(false);

const loading = ref(false);
const labelPosition = "inside";

const notification = new Notification();

// Create ref for search query
const searchQuery = ref("");

// Fetch items from Firestore
const fetchQueries = async () => {
	loading.value = true;
	queries.value = await fetchAllQueries();

	// After fetch all queries, save to the queryStore
	queryStore.saveQueries(queries.value);

	loading.value = false;
};

// computed filtered orders property checks continuously for any changes to the orders and filterOrders method written below
const filteredQueries = computed(() => {
	return queries.value.filter(query =>
		query.clientName.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

// Open modal for editing an item
const editQuery = index => {
	editedQuery.value = { ...queries.value[index] };
	showModal.value = true;
};

// Update item in Firestore
const updateItem = async () => {
	if (isSaveButtonDisabled.value) {
		// Button is disabled, do not save data
		return;
	}

	loading.value = true;

	const updateResult = await updateEditQuery(db, editedQuery.value);
	console.log("Query Updated? : ", updateResult === true ? "Yes" : "No");

	if (updateResult) {
		// Find the index of the edited query in the queries array
		const index = queries.value.findIndex(
			query => query.id === editedQuery.value.id
		);

		// Update the query in the queries array
		queries.value.splice(index, 1, { ...editedQuery.value });

		// Save the updated queries to sessionStorage and the Pinia store
		queryStore.saveQueries(queries.value);

		showSuccessNotification("Saved Successfully.", "is-success");
	} else {
		showSuccessNotification("Save Failed.", "is-danger");
	}

	loading.value = false;
	closeModal();
};

// Close modal
const closeModal = () => {
	// Reload queries from the queryStore
	queries.value = queryStore.getQueries();

	showModal.value = false;
	editedQuery.value = {};
};

// Fetch items when component is mounted
onMounted(() => {
	// Check if queryStore already has any query in it, if it has then, get queries from the queryStore or else call the fetchQueries Method
	if (queryStore.getQueries().length > 0) {
		// Get queries from the Pinia store
		queries.value = queryStore.getQueries();
	} else {
		// If there are no queries in the queryStore, fetch them
		fetchQueries();
	}
});

onUnmounted(() => {
	const user = auth.currentUser;

	// Check if user is logged in
	if (user) {
		// Save queries to the Pinia store when the component is unmounted
		queryStore.saveQueries(queries.value);
	} else {
		// Clear session storage data if user is logged out
		sessionStorage.removeItem("queries");
	}
});

watch(
	() => queries.value || editedQuery.value,
	newQueries => {
		queryStore.saveQueries(newQueries);
		queryStore.getQueries();
	}
);

const isSaveButtonDisabled = computed(() => {
	// Check if any required field is empty
	const requiredFieldsEmpty = [
		!editedQuery.value.clientName,
		!editedQuery.value.clientAddress,
		!editedQuery.value.clientGender,
		!editedQuery.value.clientContactNo,
		!editedQuery.value.calledFor,
		!editedQuery.value.queryReceivedBy,
		!editedQuery.value.queryDate,
		!editedQuery.value.querySubject,
		!editedQuery.value.resolutionGiven
	].some(fieldEmpty => fieldEmpty);

	// Return true if any required field is empty
	return requiredFieldsEmpty;
});

const showSuccessNotification = (message, type) => {
	notification.open({
		duration: 5000,
		message: message,
		type: type
	});
};

// Function to show error notification
const showErrorNotification = (message, type) => {
	notification.open({
		duration: 5000,
		message: message,
		type: type
	});
};
</script>

<style scoped>
/* Custom CSS for "Query Status" and "Gender" fields */

.container {
	margin: auto;
}

.search-block {
	margin-top: 0;
}

.query-status-field,
.gender-field {
	margin-bottom: 1rem; /* Add margin bottom for spacing */
	display: inline-block;
	width: calc(50% - 15px); /* Set width to 50% with margin */
}

/* Additional styling for the select */
.query-status-field .select select {
	width: 100%; /* Make select fill the width of the field */
}

.query-status-field,
.gender-field .control label {
	margin-right: 0.5rem; /* Add margin between radio buttons */
}

.card {
	margin-bottom: 20px;
	border-radius: 8px;
}

.card-header {
	border-radius: 8px 8px 0 0;
}

.card-footer {
	border-radius: 0 0 8px 8px;
}

/* Fix for font awesome icon size */
.card-header-icon .icon svg {
	width: 1.5rem; /* Adjust the width as needed */
	height: 1.5rem; /* Adjust the height as needed */
}
</style>
