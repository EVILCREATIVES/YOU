import {
  Canvas,
  CanvasElement,
  ElementType,
  TextElement,
  ImageElement,
  Project,
  ProjectType
} from '../types';

/**
 * Canvas Manager for handling canvas operations
 */
export class CanvasManager {
  private canvas: Canvas;

  constructor(width: number = 1920, height: number = 1080) {
    this.canvas = {
      id: this.generateId(),
      name: 'Untitled Canvas',
      width,
      height,
      backgroundColor: '#ffffff',
      elements: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Get the current canvas
   */
  getCanvas(): Canvas {
    return { ...this.canvas };
  }

  /**
   * Add a text element to the canvas
   */
  addTextElement(
    content: string,
    x: number,
    y: number,
    options?: Partial<TextElement>
  ): TextElement {
    const element: TextElement = {
      id: this.generateId(),
      type: ElementType.TEXT,
      x,
      y,
      width: options?.width || 200,
      height: options?.height || 50,
      zIndex: this.canvas.elements.length,
      content,
      fontSize: options?.fontSize || 16,
      fontFamily: options?.fontFamily || 'Arial',
      color: options?.color || '#000000',
      ...options
    };

    this.canvas.elements.push(element);
    this.canvas.updatedAt = new Date();
    return element;
  }

  /**
   * Add an image element to the canvas
   */
  addImageElement(
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: Partial<ImageElement>
  ): ImageElement {
    const element: ImageElement = {
      id: this.generateId(),
      type: ElementType.IMAGE,
      x,
      y,
      width,
      height,
      zIndex: this.canvas.elements.length,
      src,
      ...options
    };

    this.canvas.elements.push(element);
    this.canvas.updatedAt = new Date();
    return element;
  }

  /**
   * Remove an element from the canvas
   */
  removeElement(elementId: string): boolean {
    const index = this.canvas.elements.findIndex(el => el.id === elementId);
    if (index === -1) return false;

    this.canvas.elements.splice(index, 1);
    this.canvas.updatedAt = new Date();
    return true;
  }

  /**
   * Update an element's properties
   */
  updateElement(elementId: string, updates: Partial<CanvasElement>): boolean {
    const element = this.canvas.elements.find(el => el.id === elementId);
    if (!element) return false;

    Object.assign(element, updates);
    this.canvas.updatedAt = new Date();
    return true;
  }

  /**
   * Get an element by ID
   */
  getElement(elementId: string): CanvasElement | undefined {
    return this.canvas.elements.find(el => el.id === elementId);
  }

  /**
   * Clear all elements from the canvas
   */
  clear(): void {
    this.canvas.elements = [];
    this.canvas.updatedAt = new Date();
  }

  /**
   * Export canvas as JSON
   */
  export(): string {
    return JSON.stringify(this.canvas, null, 2);
  }

  /**
   * Import canvas from JSON
   */
  import(json: string): void {
    try {
      const imported = JSON.parse(json);
      this.canvas = {
        ...imported,
        createdAt: new Date(imported.createdAt),
        updatedAt: new Date(imported.updatedAt)
      };
    } catch (error) {
      throw new Error(`Failed to import canvas: ${error}`);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

/**
 * Project Manager for handling projects with multiple canvases
 */
export class ProjectManager {
  private project: Project;

  constructor(name: string, type: ProjectType = ProjectType.GENERAL) {
    this.project = {
      id: this.generateId(),
      name,
      type,
      canvases: [],
      assets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Get the current project
   */
  getProject(): Project {
    return { ...this.project };
  }

  /**
   * Add a canvas to the project
   */
  addCanvas(canvas: Canvas): void {
    this.project.canvases.push(canvas);
    this.project.updatedAt = new Date();
  }

  /**
   * Remove a canvas from the project
   */
  removeCanvas(canvasId: string): boolean {
    const index = this.project.canvases.findIndex(c => c.id === canvasId);
    if (index === -1) return false;

    this.project.canvases.splice(index, 1);
    this.project.updatedAt = new Date();
    return true;
  }

  /**
   * Export project as JSON
   */
  export(): string {
    return JSON.stringify(this.project, null, 2);
  }

  /**
   * Import project from JSON
   */
  import(json: string): void {
    try {
      const imported = JSON.parse(json);
      this.project = {
        ...imported,
        createdAt: new Date(imported.createdAt),
        updatedAt: new Date(imported.updatedAt)
      };
    } catch (error) {
      throw new Error(`Failed to import project: ${error}`);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
