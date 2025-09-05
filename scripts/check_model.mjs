import OpenAI from 'openai'

const apiKey = process.env.GROQ_API_KEY
const modelId = process.env.MODEL_ID || 'moonshotai/kimi-k2-instruct-0905'

if (!apiKey) {
  console.error('GROQ_API_KEY not set in environment')
  process.exit(2)
}

const client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' })

async function main(){
  try{
    console.log('Retrieving model info for', modelId)
    const info = await client.models.retrieve(modelId)
    console.log('MODEL INFO:')
    console.dir(info, { depth: 4 })
  }catch(err){
    console.error('Error retrieving model info:')
    console.error(err)
    process.exit(1)
  }
}

main()
