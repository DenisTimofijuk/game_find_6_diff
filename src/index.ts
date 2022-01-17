import { initLevel } from "./Level";
import {Level1AnimationA} from "./Level 1/animationA";
import { Level1AnimationB } from "./Level 1/animationB";


const addCustomAnimation = await initLevel<ConfigFile_level_1>('./task-1/config.json');
addCustomAnimation(Level1AnimationA);
addCustomAnimation(Level1AnimationB);

