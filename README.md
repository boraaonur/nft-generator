# NFT Generator Plugin for Figma

## Description

This plugin allows you to generate NFTs directly in Figma. It provides both unique and non-unique generation options, and works based on component sets in the Figma file.

## How to Install

1. Clone this repository.
2. Open Figma and go to "Plugins".
3. Choose "Import plugin" and select the `manifest.json` from the cloned repository folder.

## Usage

After installing the plugin, open a Figma file that contains the component sets you want to use for generating NFTs.

1. Launch the plugin from the Figma toolbar, located under "Plugins."
2. Convert your layers into components and set up your component sets.
3. Create a template frame to specify the coordinates where these layers will be rendered.
4. Select whether you want unique or non-unique NFTs, then click "Generate."

Your NFTs will appear in the Figma canvas, each as a separate frame.

**Note:** This plugin was developed using [npx boraaonur/create-figma-plugin](https://github.com/boraaonur/create-figma-plugin).