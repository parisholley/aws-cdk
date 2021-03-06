import apigw = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import { Stack } from '@aws-cdk/core';

export class ApiEventSource implements lambda.IEventSource {
  constructor(private readonly method: string, private readonly path: string, private readonly options?: apigw.MethodOptions) {
    if (!path.startsWith('/')) {
      throw new Error(`Path must start with "/": ${path}`);
    }
  }

  public bind(target: lambda.IFunction): void {
    const id = `${target.node.uniqueId}:ApiEventSourceA7A86A4F`;
    const stack = Stack.of(target);
    let api = stack.node.tryFindChild(id) as apigw.RestApi;
    if (!api) {
      api = new apigw.RestApi(stack, id, {
        defaultIntegration: new apigw.LambdaIntegration(target),
      });
    }

    const resource = api.root.resourceForPath(this.path);
    resource.addMethod(this.method, undefined, this.options);
  }
}