const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

exports.groupSearch = async (sceneName, sourceName) => {

    try {
        let allSceneItems = (await obs.call('GetSceneItemList',
                             {sceneName: sceneName})).sceneItems;
        let foundItem = undefined;

        for (let item of allSceneItems) {
            if (item.isGroup) {
                let groupItems = (await obs.call('GetGroupSceneItemList',
                                  {sceneName: item.sourceName})).sceneItems;
                for (let gItem of groupItems) {
                    if (gItem.sourceName == sourceName) {
                        foundItem = {itemId: gItem.sceneItemId,
                                     groupName: item.sourceName};
                    }
                }
            } else {
                if (item.sourceName == sourceName) {
                    foundItem = {itemId: item.sceneItemId};
                }
            }
        }
        return foundItem;

    } catch(err) {
        console.log('GroupSearch CPT');
        console.log('Something went wrond during the source search');
    }
}