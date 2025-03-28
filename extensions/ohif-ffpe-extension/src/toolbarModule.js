// ~/work/OHIF/Viewers/extensions/ohif-ffpe-extension/src/toolbarModule.js

const toolbarModule = ({ servicesManager, extensionManager, commandsManager }) => ([ // <--- Add [ here
  { // <--- Start of the original object
    definitions: [
      {
        id: 'ohif-ffpe-extension.run-ffpe-conversion', // Unique ID for this button definition
        label: 'Run FFPE AI',
        icon: 'icon-tool-eraser', // Using 'brain' as 'ai-brains' might not exist, check available icons
        tooltip: 'Convert Fresh Frozen WSI to FFPE style using AI',
        commandName: 'runFFPEConversion', // Matches the command definition name
      },
    ],
    defaultContexts: ['ACTIVE_VIEWPORT::MICROSCOPY'], // Context where this button is relevant
    toolbarContributions: [
       {
         toolbarId: 'viewer.toolbar.primary', // Add to the main toolbar
         items: [
           {
             id: 'ohif-ffpe-extension.run-ffpe-conversion', // Reference the button definition ID
             groupId: 'primary', // Or another group like 'utility', 'segmentation', 'measureTools'
             order: 80, // Adjust order relative to other buttons
           },
         ],
       },
     ],
  } 
]); // <--- Add ] here

export default toolbarModule;
