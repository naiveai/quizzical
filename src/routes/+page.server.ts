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
                    b. Approximately the same level of difficulty as the other questions.
                    c. Written in language appropriate for a college-level adult audience.
                    d. Focused on conceptual understanding rather than rote fact recall.
                    e. Substantively paraphrased from the source text, not directly quoted.
                    f. The questions should be independent of each other, not relying on previous questions
                       or answers, nor giving away hints about other questions.
                 2. Each question must include:
                    a. Multiple incorrect answers that are:
                       - Conceptually plausible and consistent with the source text's content and tone.
                       - Not trivially, but unambigously incorrect.
                       - Similar in structure, length, and detail to the correct answer.
                       - Rooted in a realistic conceptual error, oversimplification, or misinterpretation
                         that a student might plausibly make after reading the source. Avoid vague or obviously wrong answers.
                    b. One correct answer that is:
                       - Unambiguous and clearly correct based on the source text.
                       - Not significantly longer, more detailed, or more technical than the incorrect answers.
                         If necessary, shortern or generalize the correct answer to ensure balance.
                 3. Adjust the overall difficulty of the quiz to match the complexity and specificity of the source text.
                    For example, a quiz for a source text about space in general should be easier than a quiz for a
                    source text about the details of black hole formation.
                 4. The quiz can contain between 3 and 10 questions. Generate more questions
                    if the source text is long or conceptually dense, and fewer if it is short or simple.
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
