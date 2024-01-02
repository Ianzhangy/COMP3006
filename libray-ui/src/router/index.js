import { createRouter, createWebHistory } from "vue-router"

export const realityRoutes = [
  {
    path: "/login",
    name: "Login",
    meta: {
      name: "Login",
      show: false,
    },
    component: () => import("/@/views/login.vue"),
  },
  {
    path: "/",
    redirect: "/home",
    meta: {
			name: "Home",
			show: true,
      flat: true, 
		},
    component: () => import("/@/layout/index.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        meta: {
          name: "Home",
          show: true,
        },
        component: () => import("/@/views/home.vue"),
      },
      {
        path: "category",
        name: "Category",
        meta: {
          name: "Category",
          show: true,
          role: "admin"
        },
        component: () => import("/@/views/category/index.vue"), 
      },
      {
        path: "book",
        name: "Book",
        meta: {
          name: "Book",
          show: true,
          role: "admin"
        },
        component: () => import("/@/views/book/index.vue"),  
      },
      {
        path: "bookShow",
        name: "BookShow",
        meta: {
          name: "Book",
          show: true,
          role: "reader"
        
        },
        component: () => import("/@/views/book/show.vue"),
      },
      {
        path: "record",
        name: "Record",
        meta: {
          name: "Record",
          show: true,
        },
        component: () => import("/@/views/record/index.vue"),
      },
      {
        path: "reader",
        name: "Reader",
        meta: {
          name: "Reader",
          show: true,
          role: "admin"
        },
        component: () => import("/@/views/reader/index.vue"),  
      }
    ]
  },
]



const router = createRouter({
  history: createWebHistory(),
  routes: realityRoutes
})


export default router
