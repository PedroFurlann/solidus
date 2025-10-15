import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GPT_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful investment and financial assistant, be as friendly as possible.',
          },
          {
            role: 'system',
            content: 'Give shorter answers, being as succinct as possible',
          },
          {
            role: 'user',
            content: content,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    return NextResponse.json({ message: botMessage });

  } catch (error) {
    console.error('Erro na API do chatbot:', error);
    return NextResponse.json(
      { error: 'Erro ao se comunicar com o coin bot. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}