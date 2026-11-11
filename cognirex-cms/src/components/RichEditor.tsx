import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none p-3.5 text-sm text-[#1F1B2E] min-h-[110px]',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-[#E5E1ED] rounded-xl overflow-hidden bg-white focus-within:border-[#7C3AED] transition-colors">
      <div className="bg-[#F8F7FC] border-b border-[#E5E1ED] px-2.5 py-1.5 flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-[#EEE8FA] transition-colors cursor-pointer ${
            editor.isActive('bold') ? 'bg-[#EEE8FA] text-[#7C3AED]' : 'text-[#6F6A7C]'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-[#EEE8FA] transition-colors cursor-pointer ${
            editor.isActive('italic') ? 'bg-[#EEE8FA] text-[#7C3AED]' : 'text-[#6F6A7C]'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-[#E5E1ED] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-[#EEE8FA] transition-colors cursor-pointer ${
            editor.isActive('bulletList') ? 'bg-[#EEE8FA] text-[#7C3AED]' : 'text-[#6F6A7C]'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-[#EEE8FA] transition-colors cursor-pointer ${
            editor.isActive('orderedList') ? 'bg-[#EEE8FA] text-[#7C3AED]' : 'text-[#6F6A7C]'
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] disabled:opacity-30 cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] disabled:opacity-30 cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
