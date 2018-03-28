# AzureMetricsAlertSlackWebhook
Transforms Azure Metrics Alerts into a format useable by Slack Integration.

Deploy directly to Azure as App Service:
https://deploy.azure.com/?repository=https://github.com/rolfis/AzureMetricsAlertSlackWebhook#/form/setup

The Azure Application Settings parameter "slackhookuri" must be configured in Azure to point at the Webhook URL for your custom integration in Slack. 

The Slack channel where the integration goes to can be overridden with parameter "slackchannel".

The following Slack properties will be overridden by the integration:
username, icon_emoji, text
