import type { Actions } from './$types';
import OpenAI from 'openai';
import { z } from 'zod';

const quizResponse = z.object({
    quiz: z.array(
        z.object({
            questionText: z.string(),
            correctAnswer: z.string(),
            incorrectOptions: z.array(z.string()).length(3),
        })
    ).min(3).max(10),
});

export const actions: Actions = {
    generateQuiz: async ({ request }) => {
        const formData = await request.formData();
        const source = formData.get('source') as string;

        const openai = new OpenAI();

        try {
            const response = await openai.responses.parse({
                model: 'gpt-4.1-mini',
                instructions:
                `You are a college professor. Your task is to create a quiz that tests students'
                 conceptual understanding of a given source text.

                 Instructions:
                 1. Each question must be:
                    a. Clear, concise, and relevant to the general topic of the source text.
                    b. Approximately the same level of difficulty as the others.
                    c. Written in language appropriate for a college-level adult audience.
                    d. Focused on conceptual understanding rather than rote fact recall.
                    e. A significant modification of the raw source text, not a direct fill-in-the-blank conversion.
                 2. Each question must include:
                    a. A single unambigously correct answer.
                    b. Plausible-sounding but unambigously incorrect alternative answers.
                 3. Adjust the overall difficulty of the quiz to match the complexity and specificity of the source text.
                    For example, a quiz for a source text about space in general should be easier than a quiz for a
                    source text about the details of black hole formation.
                 4. The quiz can contain between 3 and 10 questions, but should only contain the minimum number of questions
                    necessary to adequately test the student's understanding of the source text.
                `,
                input: source,
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'quizResponse',
                        strict: true,
                        schema: z.toJSONSchema(quizResponse)
                    }
                }
            });

            return response.output_parsed;
        } catch (error) {
            console.error('OpenAI API error:', error);

            return {
                error: 'Unable to generate quiz.'
            };
        }
    },
};
