import { Router } from 'express';
// import currentTime from './routes/currentTime';
// import user from './routes/user';
import excuse from './routes/excuse';
import excuses from './routes/excuses';

// import auth from './routes/auth';
// import user from './routes/user';
// import agendash from './routes/agendash';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  excuse(app);
  excuses(app);
  // user(app);
  // currentTime(app);
  // sessions(app);

  return app;
};
