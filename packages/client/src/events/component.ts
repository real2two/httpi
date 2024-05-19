import { Event, type Component, type InteractionRequestDataWithUser } from '../index.js';

/**
 * Create a component event
 * @param commands The components
 * @returns The component event
 */
export function createComponentEvent(components: Component[]) {
  return new Event({
    execute: (data) => {
      const component = components.find((c) => c.customId.test(data.interaction.data.custom_id));
      if (!component) {
        return console.warn(`Cannot find component with ID: ${data.interaction.data.custom_id}`);
      }
      if (!data.user) return; // Makes sure 'user' is defined
      return component?.execute(data as InteractionRequestDataWithUser);
    },
  });
}
