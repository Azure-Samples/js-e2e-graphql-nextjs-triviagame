import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import type { ApolloContext } from "../context/ApolloContext";
import type { QuestionDbModel } from "../../../models/QuestionDbModel";

export class QuestionDataSource extends CosmosDataSource<
  QuestionDbModel,
  ApolloContext
> {
  public async getQuestion(
    lastQuestionId: string,
    offset: number
  ): Promise<QuestionDbModel> {
    const querySpec = {
      query:
        "SELECT * from c WHERE c.id <> @lastQuestionId OFFSET @offset LIMIT 1",
      parameters: [
        {
          name: "@lastQuestionId",
          value: lastQuestionId == undefined ? null : lastQuestionId,
        },
        {
          name: "@offset",
          value: offset,
        },
      ],
    };

    // Get Question in array of a single element
    const { resources: items } = await this.container.items
      .query(querySpec)
      .fetchAll();

    // Return the first element of the array
    return items[0];
  }
}
