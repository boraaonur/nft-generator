import { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

const steps = [
  { title: "Basics", description: "Read Instructions" },
  { title: "Control", description: "Check layers" },
  { title: "Generate", description: "Generate NFTs" },
];

import { useToast } from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(10);
  const [unique, setUnique] = useState(false);
  const [componentSets, setComponentSets] = useState<any[]>([]);
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const toast = useToast();
  const maxCombinations = Object.values(componentSets).reduce(
    (total, currentSet) => {
      return total + currentSet.length;
    },
    0
  );

  console.log("Total count of all sub-children:", maxCombinations);

  function generateNFTs() {
    parent.postMessage(
      {
        pluginMessage: {
          function: "generate-nfts",
          count: count,
          unique: unique,
        },
      },
      "*"
    );
  }

  function getComponentSets() {
    parent.postMessage(
      {
        pluginMessage: {
          function: "get-component-sets-and-their-children",
          count: count,
        },
      },
      "*"
    );
  }

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { message } = event.data.pluginMessage;

      if (
        event.data.pluginMessage.function ===
        "get-component-sets-and-their-children"
      ) {
        console.log(`Component sets: ${message}`);
        console.log(message);
        setComponentSets(message);
      }
    };
  }, []);

  return (
    <>
      <VStack w="full" h="full" justify="start" gap="4">
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box w="full">
            <VStack w="full">
              <Text>Instructions:</Text>
              <Text>
                1. Import your assets into your Figma file. Pick each asset one
                by one and turn it into a single component. (Don't select all
                and make them one big component.)
              </Text>
              <Text>
                2. After turning your layers into individual components, group
                them by type (like backgrounds, hats, etc.). Then click on
                "Combine as variants" on the right side of the screen.
              </Text>
              <Text>
                3. After you've combined your layers into component variants,
                click "Next" to see if you've done everything correctly.
              </Text>
            </VStack>
            <HStack w="full" justify="space-between" p="4">
              <Box p="1" />
              <Button onClick={goToNext}>Next</Button>
            </HStack>
          </Box>
        )}
        {activeStep === 1 && (
          <Box w="full">
            <VStack w="full">
              <HStack w="full" justify="space-between">
                <Text>Your component sets:</Text>
                <Button onClick={getComponentSets}>Refresh</Button>
              </HStack>
              <VStack>
                {Object.entries(componentSets).map(
                  ([key, value]: [key: string, value: any]) => {
                    const layerName = key;
                    const items = value as string[];

                    return (
                      <div>
                        <div>{layerName}</div>
                        <div>
                          {items.map((item: string) => {
                            const itemName = item.split("=")[1];

                            return <div>{itemName}</div>;
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </VStack>
              <Text>If everything is set up correctly, click "Next."</Text>
            </VStack>
            <HStack w="full" justify="space-between" p="4">
              <Button onClick={goToPrevious}>Prev</Button>
              <Button onClick={goToNext}>Next</Button>
            </HStack>
          </Box>
        )}
        {activeStep === 2 && (
          <Box w="full">
            <VStack w="full">
              <Text>Create a Frame called "Template"</Text>
              <Text>
                Create an example NFT in this frame using components. (You
                should drag components from Assets page)
              </Text>
              <Divider />
              <Text>How many NFT's would you like to create?</Text>
              <Text>
                Maximum amount of NFT you can create based on your component
                variants is: {unique ? maxCombinations : "INFINITE"}
              </Text>
              <Input
                max={unique ? maxCombinations : undefined}
                min={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
              <Checkbox checked={unique} onChange={(e) => setUnique(!unique)}>
                Unique
              </Checkbox>
            </VStack>
            <HStack w="full" justify="space-between" p="4">
              <Button onClick={goToPrevious}>Prev</Button>
              <Button
                onClick={() => {
                  if (unique && count > maxCombinations) {
                    toast({
                      title: "Max combinations exceeded.",
                      description: `You can't create more than ${maxCombinations} unique NFTs without adding more layers.`,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  generateNFTs();
                }}
              >
                Generate
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </>
  );
}

export default App;

/*
                {Object.entries(componentSets).map(
                  ([key, value]: [key: string, value: any]) => {
                    return (
                      <div>
                        <div>{key}</div>
                        <div>{value}</div>
                      </div>
                    );
                  }
                )}
                */
