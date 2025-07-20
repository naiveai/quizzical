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
    ).length(3)
});

export const actions: Actions = {
    generate: async ({ request }) => {
        const formData = await request.formData();
        const source = formData.get('source') as string;

        const openai = new OpenAI();

        try {
            const response = await openai.responses.parse({
                model: 'gpt-4.1-mini',
                instructions:
                `You are a professor. Your task is to create a quiz that tests student's knowledge of a specific topic.

                 1. The questions should be clear, concise, and relevant to the topic provided.
                 2. Each question should have a correct answer and plausible-sounding incorrect alternative answers.
                 3. The questions should focus mostly on testing a student's conceptual understanding of the topic.
                 4. Each question should have roughly the same level of difficulty as the others.
                 5. The quiz's overall difficulty should be proportional to the topic's complexity and specificity.
                    For instance, a quiz about "space" in general should have questions that are easier than a quiz about "black holes".
                 6. Use language appropriate for a college-level adult audience.
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
                error: 'Failed to fetch response from OpenAI'
            };
        }
    },
};
