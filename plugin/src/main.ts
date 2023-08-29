import {
  findFrameByName,
  getComponentSets,
  getComponentsFromComponentSet,
} from "./utils/figma-utils";
import {
  generateNftIds,
  generateNftsFromIds,
  generateUniqueNftIds,
} from "./utils/nft-utils";

figma.showUI(__html__, {
  width: 480,
  height: 640,
});

// yarn build:watch

figma.ui.onmessage = (msg) => {
  if (msg.function === "generate-nfts") {
    const component_sets = getComponentSets();

    if (msg.unique) {
      // Calculate maximum possible unique combinations
      const maxCombinations = component_sets.reduce((acc, component_set) => {
        return acc * component_set.children.length;
      }, 1);

      // Check if the requested count is within the limit
      if (msg.count > maxCombinations) {
        console.error(
          `Cannot generate ${msg.count} unique NFTs. Maximum possible is ${maxCombinations}.`
        );
        return;
      }

      const set = generateUniqueNftIds(msg.count, component_sets);
      const ids = Array.from(set);

      generateNftsFromIds(ids, component_sets);
    } else {
      const ids = generateNftIds(msg.count, component_sets);
      generateNftsFromIds(ids, component_sets);
    }
  }

  // Get Component Sets
  if (msg.function === "get-component-sets-and-their-children") {
    const component_sets = getComponentSets();
    let obj: any = {};

    component_sets.forEach((component_set) => {
      const components = getComponentsFromComponentSet(component_set);

      let array: any[] = [];

      components.forEach((component_set) => {
        array.push(component_set.name);
      });

      obj[component_set.name] = array;
    });

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      function: "get-component-sets-and-their-children",
      message: obj,
    });
  }

  // figma.closePlugin();
};
