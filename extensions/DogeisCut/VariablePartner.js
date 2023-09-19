// Name: Variable Partner
// ID: dogeiscutvariablepartner
// Description: A set of QOL blocks meant to work along side the existing variable blocks.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("'Variable Partner' must run unsandboxed!");
  }

  const lastValues = {};

  class VariablePartner {
    getInfo() {
      return {
        id: "dogeiscutvariablepartner",
        name: "Variable Partner",
        color1: "#ae9f78",
        color2: "#7a7057",
        color3: "#474234",
        blocks: [
          {
            //Returns true for 1 frame if the value within it is different than it was last frame
            opcode: "changed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[ONE] changed?",
            arguments: {
              ONE: {
                //sadly it looks a little ugly if someone has addons that change block size
                type: null, //this is on purpose so people actually put stuff in, instead of typing stuff
              },
            },
          },
          {
            //Returns the what the value in it was last frame
            opcode: "lastFrame",
            blockType: Scratch.BlockType.REPORTER,
            text: "[ONE] last frame",
            arguments: {
              ONE: {
                //sadly it looks a little ugly if someone has addons that change block size
                type: null, //this is on purpose so people actually put stuff in, instead of typing stuff
              },
            },
          },
          "---",
          {
            //Changes the value of variable one, to variable two, and the value of variable two to variable one
            opcode: "swapVariables",
            blockType: Scratch.BlockType.COMMAND,
            text: "swap values of [ONE] and [TWO]",
            arguments: {
              ONE: {
                type: Scratch.ArgumentType.STRING,
                menu: "variablesMenu",
              },
              TWO: {
                type: Scratch.ArgumentType.STRING,
                menu: "variablesMenu",
              },
            },
          },
        ],
        menus: {
          variablesMenu: {
            acceptReporters: false,
            items: "getVariables",
          },
        },
      };
    }
    changed(args, util) {
      //Re-did the code to look/work better based on Lily's more events extension.
      const id = util.thread.peekStack();
      if (!lastValues[id]) lastValues[id] = Scratch.Cast.toString(args.ONE);
      if (Scratch.Cast.toString(args.ONE) !== lastValues[id]) {
        lastValues[id] = Scratch.Cast.toString(args.ONE);
        return true;
      }
      return false;
    }
    lastFrame(args, util) {
      const id = util.thread.peekStack();
      const last = lastValues[id] ? lastValues[id] : "";
      lastValues[id] = Scratch.Cast.toString(args.ONE ? lastValues[id] : "");
      return last;
    }
    swapVariables(args, util) {
      const variableNameOne = args.ONE;
      const variableNameTwo = args.TWO;

      const varOne = util.target.lookupVariableById(variableNameOne);
      const varTwo = util.target.lookupVariableById(variableNameTwo);

      const valueOne = varOne.value;
      const valueTwo = varTwo.value;

      varOne.value = valueTwo;
      varTwo.value = valueOne;
    }

    getVariables() {
      // @ts-expect-error - Blockly not typed yet
      // eslint-disable-next-line no-undef
      const variables =
        typeof Blockly === "undefined"
          ? []
          : Blockly.getMainWorkspace()
              .getVariableMap()
              .getVariablesOfType("")
              .map((model) => ({
                text: model.name,
                value: model.getId(),
              }));
      if (variables.length > 0) {
        return variables;
      } else {
        return [{ text: "", value: "" }];
      }
    }
  }

  Scratch.extensions.register(new VariablePartner());
})(Scratch);
