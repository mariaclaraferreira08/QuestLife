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
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"
import authService from "../services/authService"

const routes = [
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: {
            public: true
        }
    },
    {
        path: "/register",
        name: "register",
        component: RegisterView,
        meta: {
            public: true
        }
    },
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

router.beforeEach(to => {
    const authenticated =
        authService.isAuthenticated()

    if (
        !to.meta.public &&
        !authenticated
    ) {
        return {
            name: "login"
        }
    }

    if (
        (
            to.name === "login" ||
            to.name === "register"
        ) &&
        authenticated
    ) {
        return {
            name: "dashboard"
        }
    }

    return true
})

export default router