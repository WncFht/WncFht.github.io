// Inspired by automatic figure captions in Lowbee/Bokushi. Only image-only
// paragraphs are transformed; inline text and linked images remain untouched.
// Run before Docusaurus transforms images, retaining its asset loading and dimensions.
type Node = {type: string; children?: Node[]; value?: string; alt?: string; title?: string; name?: string; attributes?: {type: string; name: string; value: string}[]};
const jsx = (name: string, children: Node[], attributes: Node['attributes'] = []): Node => ({type: 'mdxJsxFlowElement', name, attributes, children});

export default function remarkFigures() {
  return (tree: unknown) => {
    let group = 0;
    const visit = (parent: Node) => {
      parent.children?.forEach((child, index, siblings) => {
        if (child.type === 'paragraph' && child.children?.some((node) => node.type === 'image') && child.children.every((node) => node.type === 'image' || (node.type === 'text' && !node.value?.trim()))) {
          const figures = child.children.filter((node) => node.type === 'image').map((image) => {
            const caption = image.title || image.alt;
            return jsx('figure', [image, ...(caption ? [jsx('figcaption', [{type: 'text', value: caption}])] : [])], [{type: 'mdxJsxAttribute', name: 'className', value: 'reading-figure'}]);
          });
          siblings[index] = figures.length === 1 ? figures[0] : jsx('div', figures, [{type: 'mdxJsxAttribute', name: 'className', value: 'reading-figure-group'}, {type: 'mdxJsxAttribute', name: 'data-gallery', value: `group-${++group}`}]);
        } else visit(child);
      });
    };
    visit(tree as Node);
  };
}
