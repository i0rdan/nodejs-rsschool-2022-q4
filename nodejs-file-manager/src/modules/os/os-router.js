import {
  EOL, cpus, homedir, userInfo, arch
} from 'os';

const routes = {
  osInfo: '--EOL',
  cpusInfo: '--cpus',
  homedir: '--homedir',
  username: '--username',
  architecture: '--architecture',
}

export function handleOsRequest(arg) {
  switch (arg) {
    case routes.osInfo:
      console.log(JSON.stringify(EOL));
      break;
    case routes.cpusInfo:
      console.log(cpus());
      break;
    case routes.homedir:
      console.log(homedir());
      break;
    case routes.username:
      console.log(userInfo().username);
      break;
    case routes.architecture:
      console.log(arch());
      break;
    default:
      throw new Error('Invalid input');
  }
}
