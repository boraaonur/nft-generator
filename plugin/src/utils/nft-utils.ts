import { createRandomInteger } from "./common";
import { getComponentSets, findFrameByName } from "./figma-utils";

export function generateUniqueNftIds(
  count: number,
  component_sets: any[]
): Set<string> {
  const generatedNftIds = new Set<string>();

  while (generatedNftIds.size < count) {
    let nftId = "";

    component_sets.forEach((component_set) => {
      const index = createRandomInteger({
        min: 0,
        max: component_set.children.length - 1,
      });
      nftId += index.toString();
    });

    // Explicit check for uniqueness
    if (!generatedNftIds.has(nftId)) {
      generatedNftIds.add(nftId);
    }
  }

  return generatedNftIds;
}

export function generateNftIds(count: number, component_sets: any[]): string[] {
  const generatedNftIds = [];

  for (let i = 0; i < count; i++) {
    let nftId = "";
    component_sets.forEach((component_set) => {
      const index = createRandomInteger({
        min: 0,
        max: component_set.children.length - 1,
      });
      nftId += index.toString();
    });
    generatedNftIds.push(nftId);
  }

  return generatedNftIds;
}

export function generateNftsFromIds(ids: string[], component_sets: any[]) {
  const gap = 10;
  const gridCount = Math.ceil(Math.sqrt(ids.length));

  const template = findFrameByName(figma.root, "Template");
  if (!template) return;

  ids.forEach((id, i) => {
    // Create and position the frame
    const frame = figma.createFrame();
    const width = template.width;
    const height = template.height;

    frame.name = `NFT#${i}`;

    const row = Math.floor(i / gridCount);
    const col = i % gridCount;

    frame.x = col * (width + gap);
    frame.y = row * (height + gap);

    frame.resize(width, height);

    // Create child components based on the unique ID
    id.split("").forEach((index, j) => {
      const component_set = component_sets[j];
      const abc = template?.children.find(
        (node: any) => node.name === component_set.name
      );

      if (!abc) return;

      const childIndex = parseInt(index); // Convert the string index to integer
      const child = component_set.children[childIndex].clone();

      child.name = `${child.name}#${childIndex}`;
      child.x = abc.x;
      child.y = abc.y;

      frame.appendChild(child);
    });
  });
}
