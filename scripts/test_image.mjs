import OpenAI from 'openai'

const apiKey = process.env.GROQ_API_KEY
const modelId = process.env.MODEL_ID || 'moonshotai/kimi-k2-instruct'

if (!apiKey) {
  console.error('GROQ_API_KEY not set in environment')
  process.exit(2)
}

const client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' })

async function main(){
  try{
    console.log('Sending simple chat request referencing an image URL')
    const res = await client.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Please briefly describe the contents of this image: https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png' }
      ],
      max_tokens: 60,
    })

    console.log('RESPONSE:')
    console.dir(res, { depth: 3 })
  }catch(err){
    console.error('Error during chat completion:')
    console.error(err)
    process.exit(1)
  }
}

main()
