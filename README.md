# 道しるべ · 本免日语学习室

[在线学习](https://likairesearch-jpg.github.io/JP_Driving/) · [公开仓库](https://github.com/likairesearch-jpg/JP_Driving)

## 当前版本 1.3：100题分类题库

面向普通汽车 AT 本免学科预习，兼顾日语理解。全部为原创模拟题，不是官方原题，也不是完整95题限时模拟考试。100个题目单元共118条正误判断。

| 分类 | 数量 | 主要覆盖内容 |
| --- | ---: | --- |
| 交通规则 | 67 | 行人保护、信号、通行位置、变道与转弯、让行、超车、停车、安全带与儿童座椅、AT操作、酒驾与手机、雨夜驾驶、制动、载物、故障与事故、高速、地震、2026限速变更 |
| 路标 | 14 | 停止、徐行、禁入与禁行、驻车与驻停、最高与最低速度、单行与指定方向、掉头、停车指示、弯道警告、时间辅助标志 |
| 路面标示 | 10 | 菱形预告、停止线、人行横道、黄色中央线、车道黄线、方向箭头、路面限速、道路边缘黄实线/虚线、停止禁止部分 |
| 危险预测 | 9组 | 行人横穿、铁路道口、雨天跟车、停靠车辆盲区、左转自行车、右转对向摩托、高速故障车、浓雾、长下坡 |

点击分类即可切换；题号保持全局编号，方便回找。分类与全部练习共享答案。进度和正确率按当前分类计算。危险预测每组3条，全部答对才算该组正确。

错题本支持相同四类筛选。空分类显示提示；答对后保留历史错误。“重新练习本轮”仅清空当前筛选范围的本轮答案，保留其他分类及累计历史。旧版30/40题的ID不变，旧记录自动按“全部考点”迁移。

## 打开与离线使用

在线点击上方链接即可。离线版从 GitHub 的 Code → Download ZIP 下载并解压，打开根目录 index.html。无需安装或付费API。

保留 index.html、app.js、questions.js、questions-expanded.js、pictures.js、styles.css 和完整 audio/ 目录。在线首次朗读需要加载音频；完整本地文件夹可断网使用。没有离线网页缓存或跨设备自动同步。

本地文件与在线网站使用不同浏览器存储。迁移时在旧页面“导出进度”，在新页面“导入进度”。学习记录不上传 GitHub；更换浏览器、清除数据或使用隐私模式前请备份。

## 键盘操作

| 按键 | 功能 |
| --- | --- |
| 1 / 2 | 选择对 / 错，提交前允许改选 |
| Space | 首次提交显示解析，第二次下一题；最后一题显示当前范围统计 |
| A / D | 上一题 / 下一题，可跳过 |
| ↑ / ↓ | 选择危险预测的当前陈述 |
| R | 朗读当前日语；场景题包含三条陈述 |
| F | 假名开关，初始关闭，记住偏好 |
| T | 答题前中文翻译开关，初始关闭，记住偏好 |

Tab / Enter 可操作分类及所有按钮。工具按钮焦点上的空格保留按钮激活行为。长按按键、输入法组合输入及输入框操作不会重复提交。答后结果锁定，避免重复计数。

## 语音与图片

全部100题附带离线合成WAV，支持正常、0.75倍慢速及停止；切题或切分类会停止播放。使用免费的 Open JTalk / pyopenjtalk-plus、Mei声音，许可见 [audio/ATTRIBUTION.md](audio/ATTRIBUTION.md)。声音较机械，未做母语者独立听审；测试确认文件非静音、浏览器实际播放推进，不能代替用户扬声器听验。

图为依据官方形状绘制的原创SVG。路标/标线题显示待判断的图，答案仅在提交后出现；危险预测图在提交后追加动作提示。保持左侧通行及左右空间关系。图不是等比例道路设计或正式考卷扫描件。

## 规则与来源

本轮核对日期：2026-10-17。每题解析有对应官方来源链接；日语、中文、假名及解释均预先编写，无在线翻译API。

- [警察厅交通安全资料入口](https://www.npa.go.jp/bureau/traffic/koutsuuannzennjyouhou.html)及其[交通教则PDF](https://www.npa.go.jp/bureau/traffic/20241113kyousoku.pdf)：通行、路口、停车、车辆操作、附表标志标线。
- [2026年9月1日生活道路限速变更](https://www.npa.go.jp/bureau/traffic/seikatsudouro/seikatsudoro.html)：q74–75使用新规则及指定速度优先条件，未套用旧PDF中的通用60km/h结论。
- [高速安全](https://www.npa.go.jp/bureau/traffic/highway/index.html)、[手机使用](https://www.npa.go.jp/bureau/traffic/keitai/info.html)、[酒驾](https://www.npa.go.jp/bureau/traffic/insyu/index.html)等主题官方资料。
- 旧题另引用警察厅行人、安全带、儿童座椅资料，神奈川县警察信号说明及千叶县警察菱形预告说明，具体链接保留在各题中。

覆盖常见主要考点，但不宣称穷尽考试范围：环岛、警察手势全套、二轮专项、牵引、装载数值、雪冰路面、各车型特定限速等仍需配合驾校教材学习。尚无日本教练或母语教师独立审核。

## 开发与复现

网页无需构建。测试需要 Node.js、Playwright 及 Windows Edge；可通过 PLAYWRIGHT_PATH 指向已有 Playwright 模块。测试使用独立配置，不修改日常浏览器记录。

```powershell
node test.cjs
node test-extra.cjs
node test-update.cjs
node test-categories.cjs
```

线上验收：

```powershell
$env:TEST_URL='https://likairesearch-jpg.github.io/JP_Driving/'
node test-categories.cjs
```

新增题在 questions-expanded.js 中。expected-answers.cjs 是独立校验答案，不由运行时题库生成。修改日语后运行 node prepare-audio.cjs，再用安装了 numpy / pyopenjtalk-plus 的 Python 运行 generate-audio.py。音频manifest记录时长、振幅、SHA256；texts.json记录合成原文。

GitHub Pages 从 main 根目录发布，.nojekyll保持静态资源。测试产物、学习记录导出和 .tools/ 开发依赖由 .gitignore 排除。真实验证和修正记录见 [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md)。
