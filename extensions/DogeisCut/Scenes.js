// Name: Scenes
// ID: dogeiscutscenes
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Scenes\' must run unsandboxed!');
    }

    let currentScene = "Default"

    let scenes = {"Default": {
    }}

    /**
   * @param {VM.BlockUtility} util
   * @param {unknown} targetName
   */
  const getSpriteTargetByName = (util, targetName) => {
    const nameString = Scratch.Cast.toString(targetName);
    const target = util.target;
    if (target.getName() === nameString) {
      return target;
    }
    return util.runtime.getSpriteTargetByName(nameString);
  };


    class Scenes {
        getInfo() {
            return {
                id: 'dogeiscutscenes',
                name: 'Scenes',
                blocks: [
                    {
                        opcode: "currentScene",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current scene",
                    },
                    {
                        opcode: "whenSceneSwitchesToScene",
                        blockType: Scratch.BlockType.HAT,
                        text: "when scene switches to [SCENE]",
                        isEdgeActivated: true,
                        arguments: {
                            SCENE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SCENES_MENU",
                            }
                        }
                    },
                    //this block is a placeholder until i can figure out how to put it in the dropdown directly with a popup
                    {
                        opcode: "newSceneScene",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "new scene [SCENE]",
                        arguments: {
                            SCENE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new scene",
                            }
                        }
                    },
                    {
                        opcode: "switchToSceneScene",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "switch to scene [SCENE]",
                        arguments: {
                            SCENE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SCENES_MENU",
                            }
                        }
                    },
                    {
                        opcode: "addSpriteSpriteToSceneScene",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "add sprite [SPRITE] to scene [SCENE]",
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SPRITES_MENU",
                            },
                            SCENE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SCENES_MENU",
                            }
                        }
                    },
                    {
                        opcode: "clearScenes",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "clear scenes"
                    },
                ],
                menus: {
                    SCENES_MENU: {
                        acceptReporters: false,
                        items: "getScenes",
                    },
                    SPRITES_MENU: {
                        acceptReporters: true,
                        items: "getSprites",
                    },
                }
            }
        }
        clearScenes() {
            scenes = {"Default": {
            }}
        }
        getSprites() {
            let spriteNames = [];
            const targets = Scratch.vm.runtime.targets;
            const myself = Scratch.vm.runtime.getEditingTarget().sprite.name;
            spriteNames.push({
                text: 'myself',
                value: myself,
              });
            for (let index = 1; index < targets.length; index++) {
              const curSprite = targets[index].sprite;
              let display = curSprite.name;
              if (myself === curSprite.name) {
                continue;
              }
              if (targets[index].isOriginal) {
                const jsonOBJ = {
                  text: display,
                  value: curSprite.name,
                };
                spriteNames.push(jsonOBJ);
              }
            }
            if (spriteNames.length > 0) {
              return spriteNames;
            } else {
              return [{ text: "", value: 0 }]; //this should never happen but it's a failsafe
            }
          }
        addSpriteSpriteToSceneScene(args) {
            scenes[args.SCENE].sprites.push(args.SPRITE)
        }
        getScenes(){
            const output = []
            for (let i in scenes) {
                output.push({text: Scratch.Cast.toString(i), value: Scratch.Cast.toString(i)})
            }
            return output
        }
        whenSceneSwitchesToScene(args) {
            return Scratch.Cast.toBoolean(currentScene==args.SCENE)
        }
        newSceneScene(args) {
            /*
            const visibleSprites = []
            for (let target of Scratch.vm.runtime.targets) {
                if (target.visible==true){
                    visibleSprites.push(target);
                }
            }
            */
            //scenes[Scratch.Cast.toString(args.SCENE)] = {
            //    sprites: visibleSprites, //todo: add existing unhidden sprites
            //    scripts: [], //todo: add existing unhidden scripts
            //}
            scenes[Scratch.Cast.toString(args.SCENE)] = {
                sprites: [],
                scripts: [],
            }
        }
        switchToSceneScene(args, util) {
            for (let target of Scratch.vm.runtime.targets) {
                target.setVisible(false);
                target.onStopAll();
            }
            currentScene = Scratch.Cast.toString(args.SCENE)
            //todo: unhide sprites in scene
            if (currentScene=="Default"){
                for (let target of Scratch.vm.runtime.targets) {
                    target.setVisible(true);
                }
                return;
            }
            for (let target in scenes[currentScene].sprites) {
                const lol = getSpriteTargetByName(util, target);
                if (lol) {
                    lol.setVisible(true);
                }
            }
        }
        currentScene() {
            return currentScene
        }
    }

    Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
        Scratch.vm.runtime.startHats('whenunsandboxed_whenSceneSwitchesToScene');
    });
    //@ts-ignore
    Scratch.extensions.register(new Scenes());
})(Scratch);