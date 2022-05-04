# aws-name-pronounication

## Requirements
- Node.js 16.14.0
- AWS CDK 2.16.0
- Configured aws credentials
- Docker daemon running

## Folder structure

- /cdk - code to deploy the solution 
- /pronounce_app - React application created with the create-react-app tool.


## Deployment
- Clone git repository

    `git clone https://github.com/aws-samples/aws-name-pronunciation

- Run the following commands in your terminal window:

    `cd aws-name-pronounication/pronounce_app`

    `npm install`

    `npm run build`

    `cd ../cdk`

    `npm install`

    `npm run build`

    `cdk bootstrap`

    `cdk deploy ApiStack --outputs-file ../pronounce_app/src/config.json`

    `cd ../pronounce_app`

    `npm run build`

    `cd ../cdk`

    `cdk deploy FrontendStack`

- After successful deployment you will see output variable

    **CloudFront React App URL** - for React App stored on S3

- To clean-up the created resources run

    `cd ../cdk`

    `cdk destroy ApiStack`
    
    `cdk destroy FrontendStack`


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
