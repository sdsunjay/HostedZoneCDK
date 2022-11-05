import { aws_route53 as route53 } from 'aws-cdk-lib';
import { CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface HostedZoneProps {
  domainName: string;
  description: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class HostedZone extends Construct {
  constructor(parent: Stack, name: string, props: HostedZoneProps) {
    super(parent, name);

    // hosted zone
    const myHostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: props.domainName,
      comment: props.description,
    });
    new CfnOutput(this, 'PublicHostedZoneOutput', {
      // remove '.com' from exportName as export name can only contain alphanumeric
      exportName: `${props.domainName.slice(0, -4)}PublicHostedZoneId`,
      value: myHostedZone.hostedZoneId,
    });
  }
}
