import { app } from 'electron'
import { registerHandlers } from './handlers';
import { WindowService } from './services/WindowService';
import { SchedulerService } from './services/SchedulerService';

// Set up application services and launch main window
(async () => {
  await app.whenReady();
  registerHandlers();
  const schedulerService = new SchedulerService();
  schedulerService.startSchedulerPost();
  const windowService = new WindowService();
  await windowService.createMainWindow();
})();

// Quit the application when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});