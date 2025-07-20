import type { Actions } from './$types';
import OpenAI from 'openai';

export const actions: Actions = {
    generate: async ({ request }) => {
        const formData = await request.formData();
        const source = formData.get('source') as string;

        const openai = new OpenAI();

        try {
            const response = await openai.responses.create({
                model: 'gpt-4.1-mini',
                input:
                    `Generate a JSON object representing a quiz about the topic "${source}" 
                    with 3 questions and 4 options each, in the JSON format with the following schema:
                    {
                        "quiz": [
                            {
                                "questionText": "Question text",
                                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                                "answer": 0
                            }
                        ]
                    }
                    The number for 'answer' must be the index of the correct option in the options array.
                    Ensure the questions are clear and concise, and the incorrect options are plausible.
                    Do not include any additional text or explanations. Reutrn only the JSON object.
                    Do not include any markdown or code blocks. Your repsonse should be an entirely valid JSON object.`,
            });

            return JSON.parse(response.output_text);
        } catch (error) {
            console.error('OpenAI API error:', error); return { error: 'Failed to fetch response from OpenAI' };
        }
    },
};
