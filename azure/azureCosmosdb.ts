import { SECRETS } from "./secretsConfig";
import { CosmosClient, Database, Container } from "@azure/cosmos";

function getClient() {
  if (!SECRETS.AZURE_COSMOSDB_KEY || !SECRETS.AZURE_COSMOSDB_ENDPOINT) {
    throw new Error("Azure CosmosDB Key or Endpoint not set");
  }

  // Create SDK Client
  const client = new CosmosClient({
    key: SECRETS.AZURE_COSMOSDB_KEY,
    endpoint: SECRETS.AZURE_COSMOSDB_ENDPOINT,
  });

  return client;
}
export async function createNewDatabaseAndContainer(): Promise<Container> {
  if (
    !SECRETS.AZURE_COSMOSDB_DATABASE_NAME ||
    !SECRETS.AZURE_COSMOSDB_CONTAINER_NAME
  ) {
    throw new Error("Azure CosmosDB Database or Container not set");
  }

  const client = getClient();

  // Create database
  const { database } = await client.databases.createIfNotExists({
    id: SECRETS.AZURE_COSMOSDB_DATABASE_NAME,
  });

  // Create container
  const { container } = await database.containers.createIfNotExists({
    id: SECRETS.AZURE_COSMOSDB_CONTAINER_NAME,
    partitionKey: "/modelType",
  });

  return container;
}
export function getExistingContainer(): Container {
  if (
    !SECRETS.AZURE_COSMOSDB_DATABASE_NAME ||
    !SECRETS.AZURE_COSMOSDB_CONTAINER_NAME
  ) {
    throw new Error("Azure CosmosDB Database or Container not set");
  }

  const client = getClient();

  const container = client
    .database(SECRETS.AZURE_COSMOSDB_DATABASE_NAME)
    .container(SECRETS.AZURE_COSMOSDB_CONTAINER_NAME);

  return container;
}
