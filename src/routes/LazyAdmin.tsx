import { lazy } from "react";
import { loadAdminPage } from "./adminLoader";

const LazyAdmin = lazy(loadAdminPage);

export default LazyAdmin;
