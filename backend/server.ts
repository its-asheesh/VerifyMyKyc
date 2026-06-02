import app from './app';

const PORT = process.env.PORT || 5000;

import { logger } from './src/common/utils/logger';

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
