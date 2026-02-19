import { you } from '../index';

/**
 * Basic example: Generate text with AI
 */
async function basicTextGeneration() {
  console.log('\n=== Basic Text Generation ===\n');

  const aiManager = you.getAIManager();
  const textProvider = aiManager.getTextProvider();

  try {
    const response = await textProvider.generateText(
      'Write a short story about a creative canvas that comes to life.',
      {
        maxTokens: 200,
        temperature: 0.7
      }
    );

    console.log('Generated Text:');
    console.log(response.text);
    console.log(`\nProvider: ${response.provider}`);
    console.log(`Tokens Used: ${response.tokensUsed || 'N/A'}`);
  } catch (error) {
    console.error('Error generating text:', error);
  }
}

/**
 * Stream text generation example
 */
async function streamTextGeneration() {
  console.log('\n=== Stream Text Generation ===\n');

  const aiManager = you.getAIManager();
  const textProvider = aiManager.getTextProvider();

  try {
    console.log('Streaming response:');
    
    const stream = textProvider.generateStream(
      'Describe the future of creative tools in 3 sentences.'
    );

    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
    
    console.log('\n\nStreaming complete!');
  } catch (error) {
    console.error('Error streaming text:', error);
  }
}

/**
 * Generate image example
 */
async function generateImage() {
  console.log('\n=== Image Generation ===\n');

  const aiManager = you.getAIManager();
  const imageProvider = aiManager.getImageProvider();

  try {
    const response = await imageProvider.generateImage(
      'A futuristic creative workspace with holographic canvases',
      {
        width: 512,
        height: 512,
        aspectRatio: '1:1'
      }
    );

    console.log('Generated Image:');
    console.log(`Provider: ${response.provider}`);
    console.log(`Size: ${response.width}x${response.height}`);
    console.log(`Image URL: ${response.imageUrl || 'Base64 data available'}`);
    
    if (response.imageUrl) {
      console.log(`\nYou can view the image at: ${response.imageUrl}`);
    }
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

/**
 * Conversation example with history
 */
async function conversationWithHistory() {
  console.log('\n=== Conversation with History ===\n');

  const aiManager = you.getAIManager();
  const textProvider = aiManager.getTextProvider();

  try {
    // First message
    const response1 = await textProvider.generateText(
      'What are the key features of a creative canvas application?'
    );
    console.log('User: What are the key features of a creative canvas application?');
    console.log(`AI: ${response1.text.substring(0, 150)}...\n`);

    // Follow-up with history
    const response2 = await textProvider.generateText(
      'How would AI enhance these features?',
      {
        conversationHistory: [
          { role: 'user', content: 'What are the key features of a creative canvas application?' },
          { role: 'assistant', content: response1.text }
        ]
      }
    );
    console.log('User: How would AI enhance these features?');
    console.log(`AI: ${response2.text.substring(0, 150)}...`);
  } catch (error) {
    console.error('Error in conversation:', error);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   YOU Creative Canvas - AI Examples      ║');
  console.log('╚═══════════════════════════════════════════╝');

  // Check provider health
  await you.checkHealth();

  // Run examples
  await basicTextGeneration();
  await streamTextGeneration();
  await generateImage();
  await conversationWithHistory();

  console.log('\n✓ All examples completed!');
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export { runAllExamples };
