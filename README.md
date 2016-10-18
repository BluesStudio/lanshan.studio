蓝山工作室 - 官网主页
===
* 官网网站: https://lanshan.studio

---

## 开发

#### 0、安装`cnpm`
       
```
// 如果已安装，则跳过该步骤。
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
// 从此你将使用cnpm代替npm
```

### 1、安装`node_modules`，可直接运行
```
$ cnpm install
```

### 2、开发

`doing something`

#### 监听打包调试
```
$ npm run watch       // 即  webpack -p -w
```


### 3、webpack重新打包

#### 重新打包
```
$ npm run rebuild     // 即 npm run clean && npm run build
```

---

#### 打包
```
$ npm run build       // 即 webpack -p
```

#### 清除
```
$ npm run clean       // 即 rm index.html && rm -rf static
```

> 更多详见：https://github.com/mcc108/webpack-init

---

@ [蓝山工作室](https://lanshan.studio)
