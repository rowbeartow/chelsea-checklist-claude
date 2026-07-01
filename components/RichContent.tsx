type RichContentProps = {
  html: string;
};

export function RichContent({ html }: RichContentProps) {
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
