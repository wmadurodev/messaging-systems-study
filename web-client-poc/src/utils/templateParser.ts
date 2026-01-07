/**
 * Parse a message template and replace {index} placeholder with the actual index
 * @param template - The message template (e.g., "Message {index}")
 * @param index - The index to replace
 * @returns The parsed message
 */
export const parseTemplate = (template: string, index: number): string => {
  return template.replace(/{index}/g, index.toString());
};

/**
 * Validate if a template contains the {index} placeholder
 * @param template - The message template
 * @returns True if template contains {index}
 */
export const hasIndexPlaceholder = (template: string): boolean => {
  return /{index}/.test(template);
};

/**
 * Generate bulk messages from a template
 * @param template - The message template
 * @param count - Number of messages to generate
 * @returns Array of parsed messages
 */
export const generateBulkMessages = (template: string, count: number): string[] => {
  const messages: string[] = [];
  for (let i = 1; i <= count; i++) {
    messages.push(parseTemplate(template, i));
  }
  return messages;
};
