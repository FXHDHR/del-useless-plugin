const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = class DelUselessPlugin {
  constructor(
    options = {
      root: './src',
      clean: false,
      exclude: [],
      backupDir: '',
    }
  ) {
    this.options = options;
    this.options.uselessList = './useless-list.json';
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('DelUselessPlugin', async (compilation) => {
      // 查找无用文件
      await this.findUselessFiles(compilation);

      // 将删除的文件列表写入指定文件
      this.inputUselessList();

      // 备份功能
      if (this.options.backupDir) {
        this.outputBackupDir();
      }

      // 清除文件
      if (this.options.clean) {
        this.removeFile();
      }
    });
  }
  /**
   * 查找没有用到的文件
   *
   * @param {compilation} compilation
   */
  async findUselessFiles(compilation) {
    const { root, exclude } = this.options;

    try {
      // 获取所有依赖文件
      const allChunks = await this.getDependFiles(compilation);

      // 获取指定root中所有文件
      const pattern = root + '/**/*';
      const allFiles = await this.getAllFiles(pattern);

      let unUsed = allFiles.filter((item) => !allChunks.includes(item));

      // 处理排除的目录，将包含路径的文件从数组中清除
      if (exclude.length) {
        exclude.forEach((excludeName) => {
          // 判断是否在排除目录中的方法
          // 获取排除路径的绝对路径 root + excludeName，包含绝对路径就排除
          let excludePath = path.join(root, excludeName);
          unUsed = unUsed.filter((fileName) => !fileName.includes(excludePath));
        });
      }
      this.unUsedFile = unUsed;

      return unUsed;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * 获取依赖的文件
   *
   * @param {compilation} compilation
   */
  getDependFiles(compilation) {
    return new Promise((resolve, reject) => {
      const dependedFiles = [...compilation.fileDependencies].reduce(
        (acc, usedFilepath) => {
          // 将node_modules下的依赖过滤掉
          if (!usedFilepath.includes('node_modules')) {
            acc.push(usedFilepath);
          }
          return acc;
        },
        []
      );

      resolve(dependedFiles);
    });
  }

  /**
   * 获取项目目录所有的文件
   *
   * @param {string} 匹配正则
   */
  getAllFiles(pattern) {
    return new Promise((resolve, reject) => {
      glob(
        pattern,
        {
          nodir: true,
        },
        (err, files) => {
          if (err) {
            throw new Error(err);
          }

          // 转成绝对路径文件
          const out = files.map((item) => path.resolve(process.cwd(), item));
          resolve(out);
        }
      );
    });
  }
  /**
   * 写入备份文件列表
   */
  inputUselessList() {
    fs.writeFileSync(
      this.options.uselessList,
      JSON.stringify(this.unUsedFile, null, 4),
      {
        encoding: 'utf-8',
      }
    );
  }

  /**
   * 备份文件
   */
  outputBackupDir() {
    const { root, backupDir } = this.options;

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    this.unUsedFile.forEach((file) => {
      const relativePos = path.relative(root, file);
      const dest = path.join(backupDir, relativePos);
      const parseDestDir = (path.parse(dest) || {}).dir;

      if (fs.existsSync(parseDestDir)) {
        fs.createReadStream(file).pipe(fs.createWriteStream(dest));
        return;
      }

      fs.mkdir(
        parseDestDir,
        {
          recursive: true,
        },
        (error) => {
          if (error) {
            throw error;
          }

          fs.createReadStream(file).pipe(fs.createWriteStream(dest));
        }
      );
    });
  }

  /**
   * 移除文件
   */
  removeFile() {
    this.unUsedFile.forEach((file) => {
      if (fs.existsSync(delPath)) {
        fs.unlinkSync(delPath);
      } else {
        console.log('inexistence path：', delPath);
      }
    });
  }
};
