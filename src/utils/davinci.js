import { Configuration, OpenAIApi } from 'openai';
import { user_prompts, bot_responses, histories } from '../components/history';

// histories.push({ role: 'user', content: `${prompt}?`})

export const davinci = async (prompt, key) => {
  histories.push({ role: 'user', content: prompt },);

  const configuration = new Configuration({
    apiKey: key,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: histories ,
       temperature: 0.1,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // stream:true
  }, );

  return response;
};