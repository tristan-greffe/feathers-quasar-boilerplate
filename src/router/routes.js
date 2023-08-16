
const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/login', component: () => import('pages/session/LoginPage.vue') },
  { path: '/register', component: () => import('pages/session/RegisterPage.vue') },
  { path: '/reset-password', component: () => import('pages/session/ResetPasswordPage.vue') },
  { path: '/forgot-password', component: () => import('pages/session/ForgotPasswordPage.vue') },
  // Always leave this as last one,
  // but you can also remove it
  { path: '/:catchAll(.*)*', component: () => import('pages/404Page.vue') }
]

export default routes
