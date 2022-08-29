
from __future__ import print_function
import time
import os
from pprint import pprint
import json
import boto3
from sendgrid.helpers.mail import *
import sendgrid


sqs = boto3.client('sqs')

QUEUE_URL = os.environ.get('QUEUE_URL', None)

def lambda_handler(event, context):
    record = event["Records"][0]
    receipt_handle = record['receiptHandle']
    body = json.loads(record["body"])

    sqs.delete_message(
        QueueUrl=QUEUE_URL,
        ReceiptHandle=receipt_handle
    )

    try:
      sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))

      response = sg.client.mail.send.post(request_body=body)
    except Exception as e:
        raise e
