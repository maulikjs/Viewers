// ~/work/OHIF/Viewers/extensions/ohif-ffpe-extension/src/commandsModule.js

// Replace with your actual server IP/hostname and port for the integration service
const INTEGRATION_SERVICE_URL = 'http://localhost:5000/process-wsi';

const commandsModule = ({ servicesManager, commandsManager }) => {
  const {
    viewportGridService, // To get active viewport
    displaySetService,  // To get DisplaySet information (contains SeriesInstanceUID)
    uiNotificationService, // To show messages to the user
    uiModalService, // Optional: To show confirmation dialogs
  } = servicesManager.services;

  const actions = {
    // Define the action that will be triggered by the toolbar button
    runFFPEConversion: async () => {
      const { activeViewportId, viewports } = viewportGridService.getState();
      const activeViewport = viewports.get(activeViewportId);

      if (!activeViewport || !activeViewport.displaySetInstanceUIDs || activeViewport.displaySetInstanceUIDs.length === 0) {
        uiNotificationService.show({
          title: 'FFPE Conversion',
          message: 'No image selected or active viewport has no display sets.',
          type: 'warning',
        });
        return;
      }

      // Assuming the first displaySet in the active viewport is the target WSI
      // You might need more complex logic if multiple display sets are shown
      const displaySetInstanceUID = activeViewport.displaySetInstanceUIDs[0];
      const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

      if (!displaySet) {
        uiNotificationService.show({
          title: 'FFPE Conversion',
          message: 'Could not retrieve display set details.',
          type: 'error',
        });
        return;
      }

      // Extract necessary UIDs
      const seriesInstanceUID = displaySet.SeriesInstanceUID;
      const studyInstanceUID = displaySet.StudyInstanceUID;

      if (!seriesInstanceUID || !studyInstanceUID) {
        uiNotificationService.show({
          title: 'FFPE Conversion',
          message: 'Missing required Study or Series UID.',
          type: 'error',
        });
        return;
      }

      console.log(`Requesting FFPE conversion for Study: ${studyInstanceUID}, Series: ${seriesInstanceUID}`);

      // --- Optional: Confirmation Dialog ---
      // const confirmed = await new Promise(resolve => {
      //   uiModalService.show({
      //     content: ({ hide }) => ( // Simple confirmation component
      //       <div>
      //         <h3>Confirm FFPE Conversion</h3>
      //         <p>Run AI conversion for Series: {seriesInstanceUID}?</p>
      //         <button onClick={() => { hide(); resolve(true); }}>Yes</button>
      //         <button onClick={() => { hide(); resolve(false); }}>No</button>
      //       </div>
      //     ),
      //     title: 'Confirm Action',
      //   });
      // });
      // if (!confirmed) {
      //   uiNotificationService.show({ title: 'FFPE Conversion', message: 'Operation cancelled.', type: 'info' });
      //   return;
      // }
      // --- End Optional Confirmation ---


      uiNotificationService.show({
        title: 'FFPE Conversion',
        message: `Initiating conversion for Series ${seriesInstanceUID}...`,
        type: 'info',
        duration: 3000, // Hide after 3 seconds
      });

      try {
        const response = await fetch(INTEGRATION_SERVICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studyInstanceUID, seriesInstanceUID }),
        });

        const responseData = await response.json(); // Try to parse JSON regardless of status

        if (!response.ok) {
          // Use error message from API if available, otherwise use status text
          const errorMessage = responseData.error || responseData.message || `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }


        console.log('FFPE Conversion request successful:', responseData);
        uiNotificationService.show({
          title: 'FFPE Conversion',
          message: responseData.message || 'Processing successfully started. Result will be uploaded to Orthanc.',
          type: 'success',
        });

        // You might want to trigger a refresh of the study list or query Orthanc
        // after a delay to see the new series, but this is complex.
        // Example: setTimeout(() => commandsManager.runCommand('refreshStudyBrowser'), 15000); // 15 sec delay


      } catch (error) {
        console.error('Error calling FFPE integration service:', error);
        uiNotificationService.show({
          title: 'FFPE Conversion Failed',
          message: `Error: ${error.message}`,
          type: 'error', // Keep error message displayed longer
        });
      }
    },
  };

  const definitions = {
    // Define the command that the toolbar button will use
    runFFPEConversion: {
      commandFn: actions.runFFPEConversion,
      storeContexts: [], // If needed, specify store contexts to read from
      options: {}, // Pass options to the commandFn if necessary
      disabled: (/* TBD: Add logic here if the button should sometimes be disabled */) => false,
    },
  };

  return {
    actions,
    definitions,
    defaultContext: 'ACTIVE_VIEWPORT::MICROSCOPY', // Context where this command is relevant, adjust as needed (e.g., 'VIEWER')
  };
};

export default commandsModule;
