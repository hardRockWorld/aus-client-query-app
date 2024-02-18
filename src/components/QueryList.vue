<template>
  <section>
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-4" v-for="(item, index) in items" :key="item.id">
          <div class="card">
            <header class="card-header has-background-primary">
              <p class="card-header-title has-text-white">
                {{ item.clientName }}
              </p>
              <a
                href="#"
                class="card-header-icon"
                aria-label="more options"
                @click="editItem(index)"
              >
                <span class="icon">
                  <i class="fas fa-edit" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div class="card-content">
              <div class="content">
                <p><strong>Client Address:</strong> {{ item.clientAddress }}</p>
                <p><strong>Client Age:</strong> {{ item.clientAge }}</p>
                <!-- Add more fields as needed -->
              </div>
            </div>
            <footer class="card-footer">
              <a
                href="#"
                class="card-footer-item has-text-primary"
                @click="editItem(index)"
                >Edit</a
              >
              <a
                href="#"
                class="card-footer-item has-text-success"
                @click="saveItem(index)"
                >Save</a
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
          <p class="modal-card-title">Edit Item</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Client Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="editedItem.clientName"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Client Address</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="editedItem.clientAddress"
              />
            </div>
          </div>
          <!-- Add more fields as needed -->
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="updateItem">
            Save changes
          </button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  fetchAllQueries,
  updateEditQuery,
  updateNonEditOrder,
} from "@/db/dbQueries.js";

// Data
const items = ref([]);
const showModal = ref(false);
const editedItem = reactive({});

// Fetch items from Firestore
const fetchItems = async () => {
  items.value = await fetchAllQueries();
};

// Save edited item to Firestore
const saveItem = async (index) => {
  const item = items.value[index];
  await updateEditQuery(item);
};

// Open modal for editing an item
const editItem = (index) => {
  editedItem.value = { ...items.value[index] };
  showModal.value = true;
};

// Update item in Firestore
const updateItem = async () => {
  await updateEditQuery(editedItem);
  closeModal();
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editedItem.value = {};
};

// Delete item from Firestore
// const deleteItem = async (index) => {
//   const item = items.value[index];
//   await updateNonEditOrder(item);
//   await fetchItems(); // Refresh items after deletion
// };

// Fetch items when component is mounted
onMounted(fetchItems);
</script>

<style scoped>
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
</style>
