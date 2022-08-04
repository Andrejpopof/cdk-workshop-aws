import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

interface HitCounterProps{
    //Tuka treba da ja plugneme funkcijata za koja treba da broime counts
    downstream: lambda.IFunction
}

export class HitCounter extends Construct{
    public readonly handler: lambda.Function;
    public readonly table : dynamodb.Table;
    constructor(scope: Construct, id: string , props: HitCounterProps){
        super(scope,id)

        const table = new dynamodb.Table(this, 'HITS',{
            partitionKey: {name:'path', type: dynamodb.AttributeType.STRING},
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        
        this.table = table;

    this.handler =   new lambda.Function(this,'HitCounterHandler',{
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hitcounter.handler',
            environment:{
                HITS: table.tableName,
                DOWNSTREAM_F_NAME: props.downstream.functionName
            }
        });

        table.grantReadWriteData(this.handler);
        props.downstream.grantInvoke(this.handler);
    }
}