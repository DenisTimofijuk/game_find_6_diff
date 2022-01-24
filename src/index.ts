import { initLevel } from "./Level";
import {Level1AnimationA} from "./Level 1/animationA";
import { Level1AnimationB } from "./Level 1/animationB";


const addCustomAnimation = await initLevel<ConfigFile_level_1>('./task-1/config.json');
addCustomAnimation(Level1AnimationA);
addCustomAnimation(Level1AnimationB);


/**
 * CANVAS handlers
 * Mouse clisk hanlders
 * Game core handler
 *      
 *      load image
 *      load sounds
 *      set diff count
 *      set diff map
 *      add animations
 *     
 *  when all difs founded init load new level
 */