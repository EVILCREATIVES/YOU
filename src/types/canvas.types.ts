/**
 * Canvas element types
 */
export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  VIDEO = 'video',
  AUDIO = 'audio',
  GROUP = 'group'
}

/**
 * Base canvas element
 */
export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Text element
 */
export interface TextElement extends CanvasElement {
  type: ElementType.TEXT;
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * Image element
 */
export interface ImageElement extends CanvasElement {
  type: ElementType.IMAGE;
  src: string;
  alt?: string;
  filters?: ImageFilter[];
}

/**
 * Image filters
 */
export interface ImageFilter {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'sepia';
  value: number;
}

/**
 * Canvas state
 */
export interface Canvas {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project structure
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  canvases: Canvas[];
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project types
 */
export enum ProjectType {
  STORY = 'story',
  FILM = 'film',
  VIDEO = 'video',
  GAME = 'game',
  COMIC = 'comic',
  GENERAL = 'general'
}

/**
 * Asset types
 */
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  thumbnailUrl?: string;
  size: number;
  createdAt: Date;
  metadata?: Record<string, any>;
}
