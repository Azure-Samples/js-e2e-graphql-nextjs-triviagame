import { SqlQuerySpec } from "@azure/cosmos";
import type { ApolloContext } from "../context/ApolloContext";
import type { QuestionDbModel } from "../../../models/QuestionDbModel";

const arrayRandomiser = <T>(array: T[]) =>
  array.sort(() => 0.5 - Math.random());

export const resolvers = {
  // <GetQuestion-GraphQL-Resolver-Query>
  Query: {
    async question(
      _: unknown,
      {
        lastQuestionId,
        upperLimit,
        language,
      }: { lastQuestionId: string; upperLimit: number; language: string },
      { dataSources }: ApolloContext
    ) {
      const question:QuestionDbModel = await dataSources.questions.getQuestion(
        lastQuestionId,
        Math.floor(Math.random() * upperLimit)
      );

      if (language !== "en") {
        const translatedQuestion = await dataSources.translator.translateQuestion(
          question,
          language
        );
        return translatedQuestion;
      }

      return question;
    },
  },
  // </GetQuestion-GraphQL-Resolver-Query>

  // <GetQuestion-GraphQL-Resolver-Field-Question>
  Question: {
    //overwrite field resolver
    answers(question: QuestionDbModel) {
      return arrayRandomiser(
        question.incorrect_answers.concat(question.correct_answer)
      );
    },
  },
  // </GetQuestion-GraphQL-Resolver-Field-Question>

  // <ValidateAnswer-GraphQL-Resolver-Mutation>
  Mutation: {
    async validateAnswer(
      _: unknown,
      {
        questionId,
        answer,
        language,
      }: { questionId: string; answer: string; language: string },
      { dataSources }: ApolloContext
    ) {
      const question = await dataSources.questions.findOneById(questionId);

      if (!question) {
        throw new Error(`Question ${questionId} is invalid`);
      }

      if (language === "en") {
        return {
          correct: question.correct_answer === answer,
          questionId,
          correctAnswer: question.correct_answer,
        };
      }

      const translatedCorrectAnswer = await dataSources.translator.translateAnswers([question.correct_answer], language);


      // translate
      return {
        correct: translatedCorrectAnswer[0] === answer,
        questionId,
        correctAnswer: translatedCorrectAnswer[0],
      };
    },
  },
  // </ValidateAnswer-GraphQL-Resolver-Mutation>

};
