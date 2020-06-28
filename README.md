# paper_audit_automatic_utilities
将本程序复制到待处理报纸目录下执行
将会生成“临时审核目录”

## 打包成独立免依赖可执行文件
```bash
npm i -g pkg
set-executionpolicy remotesigned # 如果是在windows10下的powersherll,则需执行此命令
pkg ./index.js --target node12-win-x64
```