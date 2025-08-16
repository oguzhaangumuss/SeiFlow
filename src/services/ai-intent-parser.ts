// AI-Powered Intent Parsing Service
import { Intent, ExecutionPlan, ExecutionStep } from '@/types'
import Groq from 'groq-sdk'

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'groq'
  apiKey: string
  model?: string
}

export interface ParsedIntentResult {
  intent: Partial<Intent>
  confidence: number
  executionPlan: ExecutionPlan
  reasoning: string
}

export class AIIntentParser {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async parseIntent(userInput: string): Promise<ParsedIntentResult> {
    try {
      // Create system prompt for intent parsing
      const systemPrompt = this.createSystemPrompt()
      
      // Create user prompt with input
      const userPrompt = this.createUserPrompt(userInput)

      // Call AI service
      const aiResponse = await this.callAI(systemPrompt, userPrompt)
      
      // Parse AI response
      const result = this.parseAIResponse(aiResponse, userInput)
      
      return result
    } catch (error) {
      throw new Error(`Intent parsing failed: ${error}`)
    }
  }

  private createSystemPrompt(): string {
    return `You are SeiFlow's intent parser. Your job is to understand user requests for cross-chain operations and return structured JSON.

SUPPORTED OPERATIONS:
1. TRANSFER - Send tokens to an address
2. BRIDGE - Move tokens between chains  
3. SWAP - Exchange one token for another
4. STAKE - Stake tokens for rewards

SUPPORTED CHAINS:
- Ethereum (eth, ethereum)
- Sei Network (sei, sei-testnet)
- BSC (bsc, binance)
- Polygon (poly, polygon, matic)

SUPPORTED TOKENS:
- SEI (native on Sei)
- ETH (native on Ethereum)
- USDC, USDT (common stablecoins)
- BNB (native on BSC)

RESPONSE FORMAT (JSON only):
{
  "type": "transfer|bridge|swap|stake",
  "fromChain": "chainName or null",
  "toChain": "chainName or null", 
  "token": "tokenSymbol or null",
  "amount": "number as string or null",
  "targetAddress": "0x... or null",
  "confidence": 0.0-1.0,
  "reasoning": "explanation of parsing",
  "steps": [
    {
      "type": "approve|bridge|transfer|swap",
      "description": "what this step does",
      "estimatedCost": "0.01",
      "estimatedTime": 30
    }
  ]
}

EXAMPLES:
Input: "Send 10 USDC from Ethereum to Sei"
Output: {"type":"bridge","fromChain":"ethereum","toChain":"sei","token":"USDC","amount":"10","confidence":0.95,"reasoning":"Clear bridge request with specific amount and chains","steps":[{"type":"bridge","description":"Bridge 10 USDC from Ethereum to Sei via Wormhole","estimatedCost":"5.00","estimatedTime":300}]}

Input: "Transfer 1 SEI to 0x123..."
Output: {"type":"transfer","toChain":"sei","token":"SEI","amount":"1","targetAddress":"0x123...","confidence":0.9,"reasoning":"Direct transfer on Sei network","steps":[{"type":"transfer","description":"Transfer 1 SEI to specified address","estimatedCost":"0.01","estimatedTime":10}]}

BE PRECISE. Return only valid JSON.`
  }

  private createUserPrompt(userInput: string): string {
    return `Parse this user request: "${userInput}"

Return only the JSON response, no additional text.`
  }

  private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.callOpenAI(systemPrompt, userPrompt)
    } else if (this.config.provider === 'anthropic') {
      return this.callAnthropic(systemPrompt, userPrompt)
    } else if (this.config.provider === 'groq') {
      return this.callGroq(systemPrompt, userPrompt)
    } else {
      throw new Error(`Unsupported AI provider: ${this.config.provider}`)
    }
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    // Mock implementation - would use OpenAI SDK
    const mockResponse = {
      type: "bridge",
      fromChain: "ethereum", 
      toChain: "sei",
      token: "USDC",
      amount: "100",
      confidence: 0.85,
      reasoning: "User wants to bridge USDC from Ethereum to Sei network",
      steps: [
        {
          type: "bridge",
          description: "Bridge 100 USDC from Ethereum to Sei using Wormhole",
          estimatedCost: "15.00",
          estimatedTime: 300
        }
      ]
    }
    
    return JSON.stringify(mockResponse)
  }

  private async callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
    // Mock implementation - would use Anthropic SDK
    const mockResponse = {
      type: "transfer",
      toChain: "sei",
      token: "SEI", 
      amount: "1",
      targetAddress: "0x742d35Cc6634C0532925a3b8D4C4d4b4f1F7c7f7",
      confidence: 0.9,
      reasoning: "Direct SEI transfer on Sei network",
      steps: [
        {
          type: "transfer",
          description: "Transfer 1 SEI to specified address",
          estimatedCost: "0.01",
          estimatedTime: 10
        }
      ]
    }
    
    return JSON.stringify(mockResponse)
  }

  private async callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const groq = new Groq({
        apiKey: this.config.apiKey,
      })

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: this.config.model || 'llama3-8b-8192',
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from Groq')
      }

      return content
    } catch (error) {
      console.error('Groq API error:', error)
      
      // Fallback to mock response if API fails
      const fallbackResponse = {
        type: "transfer",
        toChain: "sei",
        token: "SEI",
        amount: "1",
        confidence: 0.7,
        reasoning: "Fallback response due to API error",
        steps: [
          {
            type: "transfer",
            description: "Transfer operation (fallback mode)",
            estimatedCost: "0.01",
            estimatedTime: 10
          }
        ]
      }
      
      return JSON.stringify(fallbackResponse)
    }
  }

  private parseAIResponse(aiResponse: string, originalInput: string): ParsedIntentResult {
    try {
      const parsed = JSON.parse(aiResponse)
      
      // Create Intent object
      const intent: Partial<Intent> = {
        id: crypto.randomUUID(),
        userInput: originalInput,
        type: parsed.type,
        fromChain: this.parseChainId(parsed.fromChain),
        toChain: this.parseChainId(parsed.toChain),
        amount: parsed.amount,
        targetAddress: parsed.targetAddress,
        status: 'ready'
      }

      // Create execution steps
      const steps: ExecutionStep[] = parsed.steps.map((step: any, index: number) => ({
        id: `step-${index}`,
        type: step.type,
        description: step.description,
        cost: step.estimatedCost,
        timeEstimate: step.estimatedTime,
        status: 'pending' as const
      }))

      // Create execution plan
      const executionPlan: ExecutionPlan = {
        id: crypto.randomUUID(),
        steps,
        estimatedCost: steps.reduce((total, step) => {
          return (parseFloat(total) + parseFloat(step.cost)).toString()
        }, "0"),
        estimatedTime: steps.reduce((total, step) => total + step.timeEstimate, 0),
        riskScore: this.calculateRiskScore(parsed.type, steps.length)
      }

      return {
        intent,
        confidence: parsed.confidence,
        executionPlan,
        reasoning: parsed.reasoning
      }
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`)
    }
  }

  private parseChainId(chainName: string | null): number | undefined {
    if (!chainName) return undefined
    
    const chainMap: Record<string, number> = {
      'ethereum': 1,
      'eth': 1,
      'sei': 1329,
      'sei-testnet': 1328,
      'bsc': 56,
      'binance': 56,
      'polygon': 137,
      'matic': 137
    }
    
    return chainMap[chainName.toLowerCase()]
  }

  private calculateRiskScore(type: string, stepCount: number): number {
    // Simple risk calculation
    let baseRisk = 20 // Base risk of 20%
    
    // Add risk based on operation type
    const typeRisk = {
      'transfer': 10,
      'bridge': 30,
      'swap': 25,
      'stake': 15
    }
    
    baseRisk += typeRisk[type as keyof typeof typeRisk] || 20
    
    // Add risk based on complexity (number of steps)
    baseRisk += (stepCount - 1) * 10
    
    return Math.min(baseRisk, 100)
  }
}

// Factory function
export function createAIIntentParser(config: Partial<AIConfig> = {}): AIIntentParser {
  const defaultConfig: AIConfig = {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'llama3-8b-8192',
    ...config
  }
  
  if (!defaultConfig.apiKey) {
    console.warn('AI API key not provided, using mock responses')
  }
  
  return new AIIntentParser(defaultConfig)
}