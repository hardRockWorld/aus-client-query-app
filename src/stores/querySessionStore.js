import { defineStore } from "pinia";

export const useQueryStore = defineStore("queries", {
	state: () => ({
		queryData: [] // Renamed state property to queryData
	}),
	actions: {
		// Save the Queries
		saveQueries(queries) {
			this.queryData = queries ?? [];
			// Save queries to sessionStorage
			sessionStorage.setItem("queries", JSON.stringify(this.queryData)); // Changed to use this.queryData
		},

		pushQuery(query) {
			this.queryData.unshift(query);
			// Save queries to sessionStorage
			sessionStorage.setItem("queries", JSON.stringify(this.queryData)); // Changed to use this.queryData
		},

		// Get all the Queries from this session
		getQueries() {
			// Retrieve queries from sessionStorage
			const storedQueries = sessionStorage.getItem("queries");
			this.queryData = storedQueries ? JSON.parse(storedQueries) : [];

			return this.queryData;
		},

		// Clear all the queries from the current session
		clearQueries() {
			// Clear queries from sessionStorage
			sessionStorage.removeItem("queries");

			this.queryData = []; // Changed to an array
		}
	}
});
