import * as cdk from '@aws-cdk/core';
//import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';


export class AppsyncCdkAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-notes-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true
    });


    new cdk.CfnOutput(this, "GraphQLAPIUrl", {
      value: api.graphqlUrl
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    const notesLambda = new lambda.Function(this, 'NotesHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambdas'),
      memorySize: 512
    })

    const lamdaDts = api.addLambdaDataSource('lambdaDataSource', notesLambda);

    lamdaDts.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });

    lamdaDts.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });

    lamdaDts.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });

    lamdaDts.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    lamdaDts.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });


    const notesTable = new ddb.Table(this, 'NotesTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING
      }
    })

    notesTable.grantFullAccess(notesLambda);

    notesLambda.addEnvironment('NOTES_TABLE', notesTable.tableName);
  }
}
