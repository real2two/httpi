import { type Component, Event, type InteractionRequestDataWithUser } from '../index.js';

/**
 * Create a modal submit event
 * @param commands The components
 * @returns The modal submit event
 */
export function createModalSubmitEvent(components: Component[]) {
  return new Event({
    execute(data) {
      const component = components.find((c) => c.customId.test(data.interaction.data.custom_id));
      if (!component || !data.user) return;
      return component?.execute(data as InteractionRequestDataWithUser);
    },
  });
}
