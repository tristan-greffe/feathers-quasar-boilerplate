
const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/login', component: () => import('pages/LoginPage.vue') },
  { path: '/sign-up', component: () => import('pages/SignUpPage.vue') },
  { path: '/admin',
    children: [
      { path: 'users', component: () => import('pages/admin/UsersPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  { path: '/:catchAll(.*)*', component: () => import('pages/404Page.vue') }
]

export default routes
