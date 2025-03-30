import OpenAI from 'openai'

import config from 'config'

const AIClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: config.get('DEEP_SEEK_KEY')
})

export const requestSongInput = async (song: string, author: string): Promise<string> => {
  const completion = await AIClient.chat.completions.create({
    
  })

  console.log(completion.choices)

  return 'something something something!!!'
}
