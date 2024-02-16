import { defineStore } from "pinia";

export const useQueryStore = defineStore("queries", {
  state: () => ({
    queries: [],
  }),
  actions: {
    // Save the Queries
    saveQueries(queries) {
      this.queries = queries ?? [];
      // Save queries to sessionStorage
      sessionStorage.setItem("queries", JSON.stringify(queries));
    },

    pushQuery(query) {
      this.queries.unshift(query);
      // Save queries to sessionStorage
      // const queriesArray = [{ /* query data */ }, { /* another query data */ }];
      sessionStorage.setItem("queries", JSON.stringify(this.queries));
    },

    // Get all the Queries from this session
    getQueries() {
      // Retrieve queries from sessionStorage
      const storedQueries = sessionStorage.getItem("queries");
      this.queries = storedQueries ? JSON.parse(storedQueries) : [];

      return this.queries;
    },

    // Clear all the queries from the current session
    clearQueries() {
      // Clear queries from sessionStorage
      sessionStorage.removeItem("queries");

      this.queries = [];
    },
  },
});
