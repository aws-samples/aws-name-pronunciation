
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const today = new Date().toISOString().replace(/:/g, "-").toLowerCase();
    const mySiteBucketName = "frontend-name-pronunciation-" + today;

    const mySiteBucket = new s3.Bucket(this, "react-site", {
      bucketName: mySiteBucketName,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: false,
      //only for demo not to use in production
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });
    new cdk.CfnOutput(this, "Bucket", { value: mySiteBucket.bucketName });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "ssr-oia"
    );
    mySiteBucket.grantRead(originAccessIdentity);

    new s3deploy.BucketDeployment(this, "Client-side React app", {
      sources: [s3deploy.Source.asset("../pronounce_app/build/")],
      destinationBucket: mySiteBucket
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "ssr-cdn",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: mySiteBucket,
              originAccessIdentity: originAccessIdentity
            },
            behaviors: [
              {
                isDefaultBehavior: true
              }
            ]
          }
        ],
        errorConfigurations: [
            {
              errorCode: 404,
              errorCachingMinTtl: 300,
              responseCode: 200,
              responsePagePath: "/index.html"
            }
        ]
      }
    );

    new cdk.CfnOutput(this, "CloudFront React App URL", {
      value: `https://${distribution.distributionDomainName}`
    });
  }
}
