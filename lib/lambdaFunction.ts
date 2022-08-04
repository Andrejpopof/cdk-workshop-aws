import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface LambdaFunctionProps{
}
export class LambdaFunction extends Construct{
    public readonly fja : lambda.Function; 
    constructor(scope: Construct, id: string , props?: LambdaFunctionProps){
        super(scope, id);

      this.fja =  new lambda.Function(this, 'LambdaFunction', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hello.handler' //hello e fajlot a handler e exportnatata funkcija
        });
    }
}

