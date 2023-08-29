export function findComponents(node: BaseNode): ComponentNode[] {
  let components: ComponentNode[] = [];

  if (node.type === "COMPONENT") {
    components.push(node as ComponentNode);
  } else if ("children" in node) {
    for (const child of node.children) {
      components = components.concat(findComponents(child));
    }
  }

  return components;
}

export function findComponentSets(node: BaseNode): ComponentSetNode[] {
  let components: ComponentSetNode[] = [];

  if (node.type === "COMPONENT_SET") {
    components.push(node as ComponentSetNode);
  } else if ("children" in node) {
    for (const child of node.children) {
      components = components.concat(findComponentSets(child));
    }
  }

  return components;
}

// Main function to get components from a Figma file
export function getComponents(): ComponentNode[] {
  const topLevelNodes = figma.root.children;
  let components: ComponentNode[] = [];

  for (const node of topLevelNodes) {
    components = components.concat(findComponents(node));
  }

  return components;
}

// Main function to get component sets from a Figma file
export function getComponentSets(): Array<ComponentSetNode> {
  const topLevelNodes = figma.root.children;
  let componentSets: Array<ComponentSetNode> = [];

  for (const node of topLevelNodes) {
    componentSets = componentSets.concat(findComponentSets(node));
  }

  return componentSets;
}

// Helper function to find a specific frame by name
export function findFrameByName(
  node: BaseNode,
  frameName: string
): FrameNode | null {
  if (node.type === "FRAME" && node.name === frameName) {
    return node as FrameNode;
  }

  if ("children" in node) {
    for (const child of node.children) {
      const foundFrame = findFrameByName(child, frameName);
      if (foundFrame) {
        return foundFrame;
      }
    }
  }

  return null;
}

export function getComponentsFromComponentSet(
  componentSet: ComponentSetNode
): ComponentNode[] {
  let components: ComponentNode[] = [];

  // Loop through the children of the component set
  for (const child of componentSet.children) {
    // Check if the child node is a ComponentNode
    if (child.type === "COMPONENT") {
      components.push(child as ComponentNode);
    }
  }

  return components;
}

export function getAllComponentsFromAllComponentSets(): ComponentNode[] {
  const componentSets = getComponentSets(); // Assume getComponentSets is your existing function
  let allComponents: ComponentNode[] = [];

  for (const componentSet of componentSets) {
    const components = getComponentsFromComponentSet(componentSet);
    allComponents = allComponents.concat(components);
  }

  return allComponents;
}

/*
export async function getComponentsWithImages() {
    const topLevelNodes = figma.root.children;
    let components: ComponentNode[] = [];
    let componentImages: { [id: string]: Uint8Array } = {}; // Stores component id and its image data
  
    // Get components
    for (const node of topLevelNodes) {
      components = components.concat(findComponents(node));
    }
  
    // Prepare settings for image export
    const exportSettings: ExportSettingsImage = {
      format: 'PNG', // or 'JPG'
      constraint: {
        type: 'SCALE',
        value: 1,
      },
    };
  
    // Get images
    for (const component of components) {
      const imageHashes = await component.exportAsync([exportSettings]);
      if (imageHashes && imageHashes.length > 0) {
        componentImages[component.id] = imageHashes[0];
      }
    }
  
    return { components, componentImages };
  }
  */
