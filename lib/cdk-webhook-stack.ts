import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';

export class CdkWebhookStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigw.HttpApi(this, "ApiGateway", {
    });

    const webhook = new lambda.Function(this, "webhookToDynamoDB", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('lambda-fns'),
      handler: 'index.handler'
    });

    api.addRoutes({
      path: '/',
      methods: [HttpMethod.POST],
      integration: new integrations.LambdaProxyIntegration({
        handler: webhook
      })
    })

    new cdk.CfnOutput(this, 'HTTP API Url', {
      value: api.url || 'Something went wrong with the deploy'
    });
    
  }
}
