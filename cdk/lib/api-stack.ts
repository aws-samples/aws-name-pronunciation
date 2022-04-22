
import * as cdk from "@aws-cdk/core";
import {Duration} from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as iam from '@aws-cdk/aws-iam';

export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const lambdaRole = new iam.Role(this, 'Lambda Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        const synthesizeSpeechFunction = new lambda.Function(
            this,
            "synthesizeSpeechFunction", {
                runtime: lambda.Runtime.PYTHON_3_8,
                code: lambda.Code.fromAsset("../pronounce_app/api/synthesize_speech/"),
                memorySize: 256,
                timeout: Duration.seconds(15),
                handler: "lambda_function.lambda_handler",
                role: lambdaRole
            }
        );

        const getVoicesFunction = new lambda.DockerImageFunction(
            this,
            'getVoicesFunction', {
                functionName: 'getVoicesFunction',
                code: lambda.DockerImageCode.fromImageAsset(
                    '../pronounce_app/api/get_voices/'
                ),
                memorySize: 256,
                timeout: Duration.seconds(15),
                role: lambdaRole
            }
        );

        lambdaRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        );
        lambdaRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                "AmazonPollyFullAccess"
            )
        );

        const getVoicesApi = new apigw.LambdaRestApi(
            this,
            "getVoicesApiEndpoint", {
                handler: getVoicesFunction,
                defaultCorsPreflightOptions: {
                    allowOrigins: apigw.Cors.ALL_ORIGINS,
                    allowMethods: ['GET']
                },
                endpointExportName: "getVoicesApiEndpoint"
            }
        );

        const synthesizeSpeechApi = new apigw.LambdaRestApi(
            this,
            "synthesizeSpeechApiEndpoint", {
                handler: synthesizeSpeechFunction,
                defaultCorsPreflightOptions: {
                    allowOrigins: apigw.Cors.ALL_ORIGINS,
                    allowMethods: ['POST']
                }
            }
        );

        (getVoicesApi.node.tryFindChild('Endpoint') as cdk.CfnResource).overrideLogicalId('getVoicesApiUrl');
        (synthesizeSpeechApi.node.tryFindChild('Endpoint') as cdk.CfnResource).overrideLogicalId('synthesizeSpeechApiUrl');

    }
}
