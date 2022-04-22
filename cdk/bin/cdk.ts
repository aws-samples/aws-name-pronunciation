#!/usr/bin/env node

import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ApiStack } from "../lib/api-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();
new ApiStack(app, "ApiStack");
new FrontendStack(app, "FrontendStack");