<template>
  <section>
    <div class="block">
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

    <b-field
      label="Email"
      :label-position="labelPosition"
      message="This email is invalid"
    >
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
      ></b-numberinput>
    </b-field>

    <div class="block">
      <b-radio v-model="query.clientGender" native-value="Male"> Male</b-radio>
      <b-radio v-model="query.clientGender" native-value="Female">
        Female
      </b-radio>
    </div>

    <b-field label="Contact No." :label-position="labelPosition">
      <b-input
        type="tel"
        v-model="query.clientContactNo"
        id="client_contactNo"
        name="client_contactNo"
        placeholder="Mobile Phone Number"
      ></b-input>
    </b-field>

    <b-field label="Whatsapp No." :label-position="labelPosition">
      <b-input
        type="tel"
        v-model="query.clientContactNo"
        id="client_contactNo"
        name="client_contactNo"
        placeholder="Whatsapp No."
      ></b-input>
    </b-field>

    <b-field label="Password" :label-position="labelPosition" type="is-warning">
      <b-input value="123" type="password" maxlength="30"></b-input>
      <template #message>
        <div>Password is too short</div>
        <div>Password must have at least 8 characters</div>
      </template>
    </b-field>

    <b-field label="Subject" :label-position="labelPosition">
      <b-select placeholder="Select a subject">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </b-select>
    </b-field>

    <b-field label="Message" :label-position="labelPosition">
      <b-input maxlength="200" type="textarea"></b-input>
    </b-field>

    <b-field label="Find a JS framework" :label-position="labelPosition">
      <b-autocomplete
        rounded
        :data="['jQuery', 'Vue', 'React']"
        placeholder="e.g. jQuery"
        icon="magnify"
        clearable
        @select="(option) => (selected = option)"
      >
        <template #empty>No results found</template>
      </b-autocomplete>
    </b-field>

    <b-field label="Select a date" :label-position="labelPosition">
      <b-datepicker
        placeholder="Click to select..."
        icon="calendar-today"
        trap-focus
      >
      </b-datepicker>
    </b-field>

    <b-field label="Select datetime" :label-position="labelPosition">
      <b-datetimepicker
        rounded
        placeholder="Click to select..."
        icon="calendar-today"
        horizontal-time-picker
      >
      </b-datetimepicker>
    </b-field>

    <b-field label="Number!" :label-position="labelPosition">
      <b-numberinput placeholder="99" :min="95"></b-numberinput>
    </b-field>

    <b-field label="Add some tags" :label-position="labelPosition">
      <b-taginput
        :value="['My first tag', 'My second tag']"
        ellipsis
        icon="label"
        placeholder="Add a tag"
      >
      </b-taginput>
    </b-field>

    <b-field label="Select time" :label-position="labelPosition">
      <b-timepicker rounded placeholder="Click to select..." icon="clock">
      </b-timepicker>
    </b-field>

    <hr />
    <p class="title is-6">Also works for grouped field and with addons.</p>

    <b-field label="Search..." :label-position="labelPosition" grouped>
      <b-input placeholder="Search..." type="search"></b-input>
      <p class="control">
        <b-button class="button is-primary">Search</b-button>
      </p>
    </b-field>

    <b-field label="Search..." :label-position="labelPosition">
      <b-input placeholder="Search..." type="search"></b-input>
      <p class="control">
        <b-button class="button is-primary">Search</b-button>
      </p>
    </b-field>
  </section>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { addNewQuery, fetchSingleDocRef } from "@/db/dbQueries.js";
import { db } from "@/db/fb.js";
import { useSessionStore } from "@/stores/userSessionStore";
import { useQueryStore } from "@/stores/querySessionStore";
import { ToastProgrammatic as Toast } from "@ntohq/buefy-next";

const sessionStore = useSessionStore();
const queryStore = useQueryStore();

const loading = ref(false);
const labelPosition = "inside";

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
  queryDate: Date.now(),
  queryStatus: "placed",
  notes: "",
  resolutionGiven: "",
  remarks: "",
};

const query = ref({ ...blankQuery });

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
    query.value = { ...blankQuery };
    loading.value = false;
  } else {
    notificationMsg.value = `Did not Save..`;
    loading.value = false;
  }
};

const isSaveButtonDisabled = computed(() => {
  const noItem = query.value.items == null || order.value.items.length === 0;
  const hasInvalidQuantity = order.value.items.some((item) => item.qty < 1);
  const hasInvalidName = order.value.items.some((item) => {
    const productName = item.name.trim();
    return productName === "";
  });
  return hasInvalidQuantity || hasInvalidName || noItem;
});

onMounted(() => {
  const toast = new Toast();
  toast.open({
    message: "Logged in!",
    type: "is-success",
  });
});
</script>
