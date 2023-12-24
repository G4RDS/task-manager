import { HocuspocusProvider } from '@hocuspocus/provider';
import { Extension, Extensions } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import Collaboration from '@tiptap/extension-collaboration';
import Placeholder from '@tiptap/extension-placeholder';
import { Node } from '@tiptap/pm/model';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {
  TaskCard,
  noteContentBaseExtensions,
  noteTitleBaseExtensions,
  taskContentBaseExtensions,
  taskTitleBaseExtensions,
} from 'tiptap-shared';
import { TaskCardNodeView } from '../components/tiptap/TaskCardNodeView';

export type NodeViewProps<Attributes> = {
  editor: Editor;
  node: Node;
  getPos: () => number;
  updateAttributes: (attrs: Attributes) => void;
};

const cachedProviders: { [key: string]: HocuspocusProvider } = {};

const getProvider = (documentName: string) => {
  if (cachedProviders[documentName]) {
    return cachedProviders[documentName];
  }
  cachedProviders[documentName] = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: documentName,
  });
  return cachedProviders[documentName];
};

export const createNoteDocConnection = (noteId: string) => {
  const provider = getProvider(`note/${noteId}`);

  const titleExtensions: Extensions = [
    ...noteTitleBaseExtensions,
    Placeholder.configure({
      placeholder: 'Untitled',
      showOnlyCurrent: false,
    }) as Extension, // TODO: Fix type assertion
    Collaboration.configure({
      document: provider.document,
      field: 'title',
    }),
  ];

  const contentExtensions: Extensions = [
    ...noteContentBaseExtensions,
    Collaboration.configure({
      document: provider.document,
      field: 'content',
    }),
    TaskCard.extend({
      addNodeView() {
        return ReactNodeViewRenderer(TaskCardNodeView);
      },
    }),
  ];

  return {
    provider,
    titleExtensions,
    contentExtensions,
  } as const;
};

export const createTaskDocConnection = (noteId: string, taskId: string) => {
  const provider = getProvider(`note/${noteId}`);

  const titleExtensions: Extensions = [
    ...taskTitleBaseExtensions,
    Placeholder.configure({
      placeholder: 'Untitled',
      showOnlyCurrent: false,
    }) as Extension, // TODO: Fix type assertion
    Collaboration.configure({
      document: provider.document,
      field: `tasks/${taskId}/title`,
    }),
  ];

  const contentExtensions: Extensions = [
    ...taskContentBaseExtensions,
    Collaboration.configure({
      document: provider.document,
      field: `tasks/${taskId}/content`,
    }),
  ];

  return {
    provider,
    titleExtensions,
    contentExtensions,
  } as const;
};
