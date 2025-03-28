// ~/work/OHIF/Viewers/extensions/ohif-ffpe-extension/index.js
import commandsModule from './commandsModule.js';
import toolbarModule from './toolbarModule.js';

console.log('Loading ohif-ffpe-extension...'); // Debug log 1

export default {
  /**
   * Unique identifier for the extension. Should be unique across all extensions.
   */
  id: 'ohif-ffpe-extension', // Ensure this matches the package name scope if needed, but usually just the ID.
  version: '0.0.1', // Add a version

  /**
   * Get Modules provides the various modules that the extension provides.
   * @param {object} servicesManager - The OHIF services manager.
   * @param {object} extensionManager - The OHIF extension manager.
   * @param {object} commandsManager - The OHIF commands manager.
   */
  getCommandsModule({ servicesManager, extensionManager, commandsManager }) {
    return commandsModule({ servicesManager, extensionManager, commandsManager });
  },

  getToolbarModule({ servicesManager, extensionManager, commandsManager }) {
    return toolbarModule({ servicesManager, extensionManager, commandsManager });
  },

  // You might add other module types here if needed (e.g., getPanelModule)
}; // <-- End of the export default object

console.log('ohif-ffpe-extension module definition completed.'); // Debug log 2
