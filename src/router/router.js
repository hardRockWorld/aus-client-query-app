import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/db/fb.js'
import Login from '@/components/Login.vue'
import QueryForm from '@/components/QueryForm.vue'
import QueryList from '@/components/QueryList.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'queryForm',
			component: QueryForm,
			meta: {
				requiresAuth: true,
				title: 'Aus Query Form'
			}
		},
		{
			path: '/query-list',
			name: 'queryList',
			component: QueryList,
			meta: {
				requiresAuth: true,
				title: 'Aus Query List'
			}
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			meta: {
				title: 'Aus Login'
			}
		}
	]
})

// Get current user
const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const removeListener = onAuthStateChanged(
			auth,
			user => {
				removeListener()
				resolve(user)
			},
			reject
		)
	})
}

// Global auth guard
router.beforeEach(async (to, from, next) => {
	if (to?.matched.some(record => record.meta.requiresAuth)) {
		if (await getCurrentUser()) {
			next()
		} else {
			next('login')
		}
	} else {
		next()
	}
})

router.afterEach((toRoute, fromRoute) => {
	window.document.title =
		toRoute?.meta && toRoute?.meta?.title
			? toRoute?.meta?.title
			: 'Aus Client Query App'
})

export default router
