import { type Component, Event, type InteractionRequestDataWithUser } from '../index.js';

/**
 * Create a component event
 * @param commands The components
 * @returns The component event
 */
export function createComponentEvent(components: Component[]) {
  return new Event({
    execute(data) {
      const component = components.find((c) => c.customId.test(data.interaction.data.custom_id));
      if (!component || !data.user) return;
      return component?.execute(data as InteractionRequestDataWithUser);
    },
  });
}
