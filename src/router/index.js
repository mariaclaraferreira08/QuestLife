import {
    createRouter,
    createWebHistory
} from "vue-router"

import DashboardView from "../views/DashboardView.vue"
import TasksView from "../views/TasksView.vue"
import TaskCreateView from "../views/TaskCreateView.vue"
import HabitsView from "../views/HabitsView.vue"
import DailiesView from "../views/DailiesView.vue"
import ShopView from "../views/ShopView.vue"

const routes = [
    {
        path: "/",
        name: "dashboard",
        component: DashboardView
    },

    {
        path: "/tasks",
        name: "tasks",
        component: TasksView
    },

    {
        path: "/tasks/new",
        name: "task-create",
        component: TaskCreateView
    },

    {
        path: "/habits",
        name: "habits",
        component: HabitsView
    },

    {
        path: "/dailies",
        name: "dailies",
        component: DailiesView
    },

    {
        path: "/shop",
        name: "shop",
        component: ShopView
    }
]

const router =
    createRouter({
        history:
            createWebHistory(),

        routes
    })

export default router
