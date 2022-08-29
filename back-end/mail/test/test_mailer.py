import boto3
import json
import os


QUEUE_URL = os.environ.get("QUEUE_URL", "https://sqs.eu-west-1.amazonaws.com/934728862088/mylittleshopping-mailer")
if QUEUE_URL is None:
    raise TypeError("QUEUE_URL environment variable is None")

sqs = boto3.client('sqs')

message = {
    "personalizations": 
        [
            {
            "to": [
                    {
                    "email": "martin.boulingre76@gmail.com"
                    }
                ],
            "dynamic_template_data": {
                "name": "toto"
                }
            }
        ],
    "from": {
        "email": "martin.boulingre76@gmail.com"
    },
    "template_id": "d-0bbaa0f7df42497ab7348cce9ab90cfb"
}

sqs.send_message(
    QueueUrl=QUEUE_URL,
    DelaySeconds=0,
    MessageBody=(json.dumps(message))
)
