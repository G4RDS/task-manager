import { Node, mergeAttributes } from '@tiptap/core';

export type TaskCardAttributes = {
  taskId: string | undefined;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    taskCard: {
      setTaskCard: (taskId?: string) => ReturnType;
    };
  }
}

export const TaskCard = Node.create<{}>({
  name: 'taskCard',
  group: 'block',
  atom: true,
  // TODO: Found a bug that draggable is not working
  // draggable: true,
  addAttributes() {
    return {
      taskId: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'task-card',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['task-card', mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setTaskCard:
        (taskId?: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { taskId } satisfies TaskCardAttributes,
          });
        },
    };
  },
});
