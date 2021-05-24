const fs = require('fs');
const path = 'useless-list.json';

try {
  const useLessList = JSON.parse(fs.readFileSync(path));
  useLessList.forEach((delPath) => {
    if (fs.existsSync(delPath)) {
      fs.unlinkSync(delPath);
    } else {
      console.log('inexistence path：', delPath);
    }
  });
} catch (error) {
  throw new Error(error);
}
