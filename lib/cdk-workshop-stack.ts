import { Duration, lambda_layer_awscli, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaFunction } from './lambdaFunction';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitCounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
    const lambdaFunction = new LambdaFunction(this,'helloLambdaFunction');

    //api gateway koe ima lambda proxy integracija. Nezavisno od patekata soobrakjajot ja pokreva taa funkcija.
    // new apigw.LambdaRestApi(this,'Endpoint',{
    //   handler: lambdaFunction.fja
    // })

    const helloHitCounter = new HitCounter(this,'HelloHitCounter',{
      downstream : lambdaFunction.fja
    });

    new apigw.LambdaRestApi(this, 'Endpoint',{
      handler: helloHitCounter.handler
    })

    new TableViewer(this,'ViewHitCounter',{
      sortBy: '-hits',
      title: 'Hello Hits',
      table: helloHitCounter.table
    })
  

  }
}
