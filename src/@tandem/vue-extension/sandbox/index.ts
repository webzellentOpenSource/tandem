import {
  createWebpackBundleLoaderClass,
  BundlerLoaderFactoryDependency
} from "@tandem/sandbox";

import * as vueLoader from "vue-loader";
import { VUE_MIME_TYPE } from "../constants";
import { JS_MIME_TYPE } from "@tandem/common";

export const createVueSandboxDependencies = () => {
  return [
    new BundlerLoaderFactoryDependency(VUE_MIME_TYPE, createWebpackBundleLoaderClass(vueLoader, JS_MIME_TYPE))
  ];
}