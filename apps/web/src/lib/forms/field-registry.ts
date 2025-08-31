import type {
  FieldRegistry,
  FieldType,
  FieldTypeRenderer,
} from './types/field-types'

/**
 * Field registry implementation for managing field type renderers
 */
class FieldRegistryImpl implements FieldRegistry {
  private renderers = new Map<FieldType, FieldTypeRenderer>()

  register(renderer: FieldTypeRenderer): void {
    this.renderers.set(renderer.type, renderer)
  }

  get(type: FieldType): FieldTypeRenderer | undefined {
    return this.renderers.get(type)
  }

  getAll(): FieldTypeRenderer[] {
    return Array.from(this.renderers.values())
  }

  clear(): void {
    this.renderers.clear()
  }

  has(type: FieldType): boolean {
    return this.renderers.has(type)
  }
}

/**
 * Global field registry instance
 */
export const fieldRegistry = new FieldRegistryImpl()

/**
 * Helper function to register multiple field renderers at once
 */
export function registerFieldRenderers(renderers: FieldTypeRenderer[]): void {
  for (const renderer of renderers) {
    fieldRegistry.register(renderer)
  }
}
