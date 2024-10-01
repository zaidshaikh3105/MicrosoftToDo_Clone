import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/app/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import AddTodo from "./components/addTodo.jsx";
import Todos from "./components/Todos.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <AddTodo />,
      },
      {
        path: "/todos",
        element: <Todos />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
