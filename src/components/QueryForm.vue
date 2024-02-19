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
      ></b-numberinput>
    </b-field>

    <div class="block">
      <b-radio v-model="query.clientGender" native-value="Male">Male</b-radio>
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
      <b-datetimepicker
        rounded
        placeholder="Click to select..."
        icon="calendar-today"
        horizontal-time-picker
        v-model="query.queryDate"
        :datetime-formatter="(date) => getFormattedDate(date, true)"
        id="client_queryDate"
        name="client_queryDate"
        required
      >
      </b-datetimepicker>
    </b-field>

    <!--    <b-field label="Query Status" :label-position="labelPosition">-->
    <!--      <b-dropdown aria-role="list" v-model="query.queryStatus">-->
    <!--        <template #trigger="{ active }">-->
    <!--          <b-button-->
    <!--            label="Click me!"-->
    <!--            type="is-primary"-->
    <!--            :icon-right="active ? 'menu-up' : 'menu-down'"-->
    <!--          />-->
    <!--          {{ query.queryStatus }}-->
    <!--        </template>-->

    <!--        <b-dropdown-item aria-role="listitem">Received</b-dropdown-item>-->
    <!--        <b-dropdown-item aria-role="listitem">Discuss</b-dropdown-item>-->
    <!--        <b-dropdown-item aria-role="listitem">Closed</b-dropdown-item>-->
    <!--      </b-dropdown>-->
    <!--    </b-field>-->

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

    <b-field label="Resolution Given" :label-position="labelPosition">
      <b-input
        maxlength="300"
        type="textarea"
        v-model="query.resolutionGiven"
        id="client_resolution"
        name="client_resolution"
        placeholder="Client Resolution"
      ></b-input>
    </b-field>

    <b-field label="Remarks" :label-position="labelPosition">
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
import { ref, computed, onMounted } from "vue";
import { addNewQuery, fetchSingleDocRef } from "@/db/dbQueries.js";
import { db } from "@/db/fb.js";
import {getFormattedDate} from '@/util/util.js'
import { useSessionStore } from "@/stores/userSessionStore";
import { useQueryStore } from "@/stores/querySessionStore";
import { ToastProgrammatic as Toast } from "@ntohq/buefy-next";

const sessionStore = useSessionStore();
const queryStore = useQueryStore();
const toast = new Toast();

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
  queryDate: new Date(),
  queryStatus: "placed",
  notes: [],
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
    toast.open({
      message: notificationMsg.value,
      type: "is-success",
    });
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
  toast.open({
    message: "Logged in!",
    type: "is-success",
  });
});
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

.block {
  margin: 1rem;
}
</style>
