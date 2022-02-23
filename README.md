# Offer Notification Application

A simple application built on AWS with Serverless, which crawls a website for offers and sends an email notification when the offer is found.

## Architecture

![Architecture](architecture.png)

### Used AWS Services

- AWS EventBridge - For scheduling lambda function invocations
- AWS Lambda  -  For crawling the website and publishing messages to an SNS topic
- AWS SNS  -  For sending email notifications

## Used technologies

- NodeJS
- Serverless
- Cheerio
- Axios

## Deployment

Create a `.env` file with an `EMAIL` variable, where the notifications should be sent.

```sh
# Install dependencies
npm install

# Deploy the application
serverless deploy
```

After successfully deploying the application confirm the subscription to the SNS topic through the received email.