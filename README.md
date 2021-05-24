<div align="center">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>del-useless-plugin</h1>
</div>

# del-useless-plugin


该webpack插件用于查找和删除项目里无用的文件。


## 安装


```console
npm install --save-dev del-useless-plugin
```


## 用法

#### 1、引入和配置插件


```js
const DelUselessPlugin = require('del-useless-plugin')

module.exports = {
    plugins: [
        new DelUselessPlugin()
    ]
}
```

#### 2、获取无用文件

运行项目打包命令（如：npm run pro），在项目中就会出现一个`useless-list.json`文件，文件内容是项目中无用文件构成的数组。

```js
[
    "E:\\eqx\\mall-pay\\src\\img\\1to2@2x.png",
    "E:\\eqx\\mall-pay\\src\\scss\\variables.scss",
    "E:\\eqx\\mall-pay\\src\\utils\\index.js",
    "E:\\eqx\\mall-pay\\src\\vue\\plugins\\Slide.vue"
]
```

#### 3、确认输出，删除文件

1. 使用者可对`useless-list.json`文件进行修改，如认为文件不是无用文件，可从数组中去除。

2. 控制台运行如下命令，即可删除`useless-list.json`数组中的所有文件。

   ```js
   node ./node_modules/del-useless-plugin/src/del.js
   ```

##  **Options**

| 名称      | 类型      | 默认值 | 描述                         |
| --------- | --------- | ------ | ---------------------------- |
| root      | {String}  | ./src  | 需要查找的代码根目录         |
| clean     | {Boolean} | false  | 是否在查找完成就直接删除文件 |
| exclude   | {Array}   | []     | 需要排除的目录数组           |
| backupDir | {String}  | ‘’     | 备份目录，提供备份功能       |

## 其他

#### 已知问题

1. 此插件无法查找出其他插件的依赖，如

   ```js
   // sass-loader 直接引用了variables.scss文件且variables.scss没有在其他文件中进行引用，此插件就会把variables.scss识别为无用文件
   module.exports = {
     module: {
       rules: [
         {
           test: /\.scss$/,
           use: [
              {
                loader: 'sass-loader',
                options: {
                    data: fs.readFileSync('./src/scss/variables.scss')
                }
            }
           ],
         },
       ],
     },
   };
   ```
   
   

