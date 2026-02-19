import { you } from '../index';
import { ProjectType, ElementType } from '../types';

/**
 * Basic canvas example
 */
function basicCanvasExample() {
  console.log('\n=== Basic Canvas Example ===\n');

  // Create a new canvas
  const canvas = you.createCanvas(1920, 1080);
  
  // Add text element
  const title = canvas.addTextElement(
    'Welcome to YOU Creative Canvas',
    100,
    100,
    {
      fontSize: 48,
      fontFamily: 'Arial',
      color: '#3b82f6',
      bold: true
    }
  );
  console.log(`Added text element: ${title.content}`);

  // Add subtitle
  const subtitle = canvas.addTextElement(
    'Create, Edit, and Produce Amazing Content',
    100,
    180,
    {
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#64748b'
    }
  );
  console.log(`Added subtitle: ${subtitle.content}`);

  // Add image placeholder
  const image = canvas.addImageElement(
    'https://via.placeholder.com/400x300',
    100,
    250,
    400,
    300,
    {
      alt: 'Example image'
    }
  );
  console.log(`Added image element at (${image.x}, ${image.y})`);

  // Get canvas state
  const canvasState = canvas.getCanvas();
  console.log(`\nCanvas has ${canvasState.elements.length} elements`);

  // Export canvas
  const exported = canvas.export();
  console.log('\nCanvas exported successfully!');

  return canvas;
}

/**
 * Project management example
 */
function projectManagementExample() {
  console.log('\n=== Project Management Example ===\n');

  // Create a new project
  const project = you.createProject('My First Comic', ProjectType.COMIC);
  console.log(`Created project: ${project.getProject().name}`);

  // Create multiple canvases for comic panels
  const panel1 = you.createCanvas(800, 600);
  panel1.addTextElement('Panel 1: The Beginning', 50, 50, {
    fontSize: 24,
    bold: true
  });

  const panel2 = you.createCanvas(800, 600);
  panel2.addTextElement('Panel 2: The Adventure', 50, 50, {
    fontSize: 24,
    bold: true
  });

  const panel3 = you.createCanvas(800, 600);
  panel3.addTextElement('Panel 3: The Conclusion', 50, 50, {
    fontSize: 24,
    bold: true
  });

  // Add canvases to project
  project.addCanvas(panel1.getCanvas());
  project.addCanvas(panel2.getCanvas());
  project.addCanvas(panel3.getCanvas());

  const projectState = project.getProject();
  console.log(`Project has ${projectState.canvases.length} canvases`);

  // Export project
  const exported = project.export();
  console.log('Project exported successfully!');

  return project;
}

/**
 * Element manipulation example
 */
function elementManipulationExample() {
  console.log('\n=== Element Manipulation Example ===\n');

  const canvas = you.createCanvas(1920, 1080);

  // Add an element
  const text = canvas.addTextElement('Original Text', 100, 100);
  console.log(`Created element: ${text.content}`);

  // Update the element
  const updates: any = {
    content: 'Updated Text',
    x: 200,
    y: 200,
    rotation: 15
  };
  canvas.updateElement(text.id, updates);
  console.log('Element updated');

  // Get the updated element
  const updated = canvas.getElement(text.id);
  console.log(`Updated element content: ${(updated as any).content}`);

  // Remove the element
  canvas.removeElement(text.id);
  console.log('Element removed');

  const finalState = canvas.getCanvas();
  console.log(`Canvas now has ${finalState.elements.length} elements`);
}

/**
 * Complex scene example
 */
function complexSceneExample() {
  console.log('\n=== Complex Scene Example ===\n');

  const canvas = you.createCanvas(1920, 1080);

  // Create a title card
  canvas.addTextElement('CHAPTER ONE', 960, 200, {
    fontSize: 72,
    fontFamily: 'Arial',
    color: '#1e293b',
    bold: true,
    align: 'center'
  });

  canvas.addTextElement('The Journey Begins', 960, 300, {
    fontSize: 36,
    fontFamily: 'Georgia',
    color: '#64748b',
    italic: true,
    align: 'center'
  });

  // Add decorative elements
  for (let i = 0; i < 5; i++) {
    canvas.addImageElement(
      'https://via.placeholder.com/100x100',
      100 + (i * 150),
      500,
      100,
      100,
      {
        opacity: 0.7
      }
    );
  }

  const state = canvas.getCanvas();
  console.log(`Created complex scene with ${state.elements.length} elements`);

  return canvas;
}

/**
 * Run all canvas examples
 */
function runAllCanvasExamples() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   YOU Creative Canvas - Canvas Examples  ║');
  console.log('╚═══════════════════════════════════════════╝');

  basicCanvasExample();
  projectManagementExample();
  elementManipulationExample();
  complexSceneExample();

  console.log('\n✓ All canvas examples completed!');
}

// Run if executed directly
if (require.main === module) {
  runAllCanvasExamples();
}

export { runAllCanvasExamples };
