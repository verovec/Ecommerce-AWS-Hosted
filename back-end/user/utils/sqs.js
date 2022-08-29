const AWS = require('aws-sdk')

AWS.config.update({ region: 'REGION' })

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const sendEmail = (to, templateId, data) => {
  const params = {
    MessageBody: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          dynamic_template_data: data,
        },
      ],
      from: {
        email: 'martin.boulingre76@gmail.com',
      },
      template_id: templateId,
    }),
    QueueUrl:
      'https://sqs.eu-west-1.amazonaws.com/934728862088/mylittleshopping-mailer',
  }

  try {
    return sqs.sendMessage(params).promise()
  } catch (err) {
    console.log(err)
  }
  return null
}

module.exports = {
  sendEmail,
}
