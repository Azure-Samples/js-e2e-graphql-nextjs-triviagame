const config = require("dotenv-flow").config;
config();
let appInsights = require('applicationinsights');
let appInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if(appInsightsConnectionString && appInsightsConnectionString.length > 0) { 

appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectConsole(true, true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectHeartbeat(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectRequests(true)
  .setAutoDependencyCorrelation(true)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  .setSendLiveMetrics(true)
  .setUseDiskRetryCaching(true);
appInsights.defaultClient.setAutoPopulateAzureProperties(true);
appInsights.start();
}