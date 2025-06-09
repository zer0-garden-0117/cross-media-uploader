import { app } from 'electron'
import { registerHandlers } from './handlers';
import { WindowService } from './services/WindowService';

// Create an instance of WindowService and create the main window
(async () => {
  await app.whenReady();
  const windowService = new WindowService();
  await windowService.createMainWindow();
})();

// Quit the application when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

// Register handlers for IPC events
registerHandlers();