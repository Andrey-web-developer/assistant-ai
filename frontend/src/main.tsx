import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AgentInterface, EventType, type ChatLLM } from '@openuidev/react-ui'
import '@openuidev/react-ui/styles/index.css'

const textReply = 'Привет! Это демонстрационный ответ чата.'

const demoLLM: ChatLLM = {
  async send({ signal }) {
    signal.throwIfAborted()
    return new Response(textReply)
  },
  streamProtocol: {
    async *parse(response) {
      const text = await response.text()
      const messageId = crypto.randomUUID()
      yield { type: EventType.TEXT_MESSAGE_START, messageId, role: 'assistant' }
      yield { type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: text }
      yield { type: EventType.TEXT_MESSAGE_END, messageId }
    },
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{ position: 'fixed', inset: 0 }}>
      <AgentInterface llm={demoLLM} agentName="Демо-чат">
        <AgentInterface.Welcome>
          <div className="openui-agent-welcome-screen__content">
            <h2 className="openui-agent-welcome-screen__title">Демо-чат</h2>
            <p className="openui-agent-welcome-screen__description">
              Отправьте сообщение, чтобы увидеть текстовый ответ.
            </p>
          </div>
        </AgentInterface.Welcome>
        <AgentInterface.Composer placeholder="Напишите сообщение…" />
      </AgentInterface>
    </main>
  </StrictMode>,
)
