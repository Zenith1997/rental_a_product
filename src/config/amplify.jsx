import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: 'YOUR_IDENTITY_POOL_ID', // REQUIRED - Amazon Cognito Identity Pool ID
    region: 'YOUR_REGION', // REQUIRED - Amazon Cognito Region
  },
  Storage: {
    bucket: 'YOUR_BUCKET_NAME', // REQUIRED - Amazon S3 bucket name
    region: 'YOUR_REGION', // OPTIONAL - Amazon service region
  },
});
