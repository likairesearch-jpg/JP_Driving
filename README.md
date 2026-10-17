# 道しるべ · 本免日语学习室

## 打开

直接在 Windows Edge 或 Chrome 中打开本文件夹的 `index.html`。不需要安装依赖、启动服务器、登录或 API key。请保留同目录的 `app.js`、`questions.js`、`pictures.js`、`styles.css` 和 `audio` 文件夹。

## 当前范围（1.2）

- 普通汽车 AT 本免学科预习：27 道文字判断 + 3 组插图判断，每组3条陈述；另有10道标志／标线图片判断；共40个题目单元、46条判断。
- 全部为原创模拟题，不是官方考试原题。每题解析包含规则来源、中文含义和日语提示。
- 插图组全部正确才计为答对；显示题目单元正确率，不是正式考试分数。
- 没有计时、正式95题试卷、题型分类或视频。
- 题目覆盖行人让行、安全带、儿童座椅、信号、铁路道口、AT操作、雨天、夜间及基础安全确认，不代表本免全部考点。

## 操作

| 按键 | 功能 |
| --- | --- |
| 1 / 2 | 选择对 / 错，提交前可改选 |
| Space | 第一次提交并保留解析；再按进入下一题；最后一题显示本轮统计 |
| A / D | 上一题 / 下一题；允许跳过，不计作答 |
| ↑ / ↓ | 切换插图题的当前陈述 |
| R | 正常速度朗读当前题；插图题会读场景及三条陈述 |
| F | 切换汉字上方假名，默认关闭并记住设置 |
| T | 答题前显示／隐藏中文题意，默认关闭并记住设置；不显示正确答案 |

按住按键不连续触发。输入框、下拉框或输入法组合输入时不触发快捷键。Tab 和 Enter 可操作所有按钮；工具按钮获得焦点时空格保留原生按钮激活行为，选择答案后空格用于提交。

## 错题与保存

提交错误后自动加入错题本。插图题整组收录，并指出错误陈述。点击“错题本”开始新一轮错题练习，旧答案隐藏，按最近练习时间由早到晚排列。答对不会删除错题历史。可在解析下标记“日语没读懂 / 规则不熟 / 看漏条件”。

“重新练习本轮”清空本轮选项但保留累计历史。“重置数据”清空全部数据，执行前会确认。进度仅在当前浏览器本地保存，不上传。浏览器清理数据、隐私模式、移动HTML文件或更换浏览器可能影响保存；请使用 JSON 导出/导入备份。导入会校验结构并在替换前确认。

## 日语朗读与中文翻译（1.1更新）

中文按钮或 T 键显示题干翻译；插图题同时翻译场景和三条陈述。默认关闭，之后记住选择。它不会提交答案或提前显示解析。旧版进度与JSON备份仍可读取。

40题已内置本地WAV音频，保存在audio文件夹（约26 MB）。R或朗读按钮播放；慢速为0.75倍速并保持音高；停止按钮或切题停止播放。断网可用，无需安装Windows日语语言包。若本地文件损坏，尝试回退到系统日语语音并显示明确错误。

声音由免费的Open JTalk / pyopenjtalk-plus在本机合成，使用Mei声音。合成声较机械，尚无母语者独立听审。来源与许可见audio/ATTRIBUTION.md。网页不上传题目或作答数据。曾尝试免费在线语音服务但返回403，最终音频全部采用离线生成。

普通使用只需保留HTML、JS、CSS和audio目录。`.tools/python`仅用于开发时重新生成音频，不参与网页运行。修改题库后需要运行prepare-audio.cjs和generate-audio.py重新生成；生成脚本使用本机已有Python运行时及本项目安装的pyopenjtalk-plus。

若没有听到声音，先刷新页面，点击朗读，检查浏览器标签页是否静音以及Windows输出设备和音量；同时确认audio目录仍在index.html旁边。测试已确认文件非静音且Edge离线播放时间正常前进，但没有测量你的扬声器实际输出或主观听感。

## 图片题说明

正式本免普通判断题也可能包含道路标志或标线图；“文字问题”不等于纯文字无图片。最后5组危险预测插图题是另一种形式，每组3条正误判断。

参考：[警察厅出题规定](https://www.npa.go.jp/laws/notification/koutuu/menkyo/menkyo20230330_46.pdf)要求道路标志等色彩尽量彩色显示；[JAF Mate标志标线模拟题](https://jafmate.jp/safety/licensetest_20250608.html)展示了看图判断含义的形式。本版30题暂未新增路标识别题，后续可在普通判断题中加入。

## 来源与内容核对

检查日期：2026-10-13。答案及题库中 `sourceKey` 对应下列资料，`sourceType` 明确标为原创模拟题。

| 题号 | 规则依据 |
| --- | --- |
| 01–04、28 | [警察厅：横断歩道は歩行者優先です](https://www.npa.go.jp/bureau/traffic/oudanhodou/info.html) |
| 05–07 | [警察厅：全席安全带](https://www.npa.go.jp/bureau/traffic/anzen/seatbelt.html)；交通教则第5章第1节，第42页 |
| 08 | [警察厅：儿童安全座椅](https://www.npa.go.jp/bureau/traffic/anzen/childseat.html) |
| 09–11 | [神奈川县警察：交叉路口违法与停车确认](https://www.police.pref.kanagawa.jp/kotsu/kotsu_torishimari/mesf2002.html) |
| 12–15、29 | 交通教则第6章第1节，第64–65页 |
| 16–19 | 交通教则第5章第9节，第62–63页 |
| 20–22、30 | 交通教则第6章第4节，第68页 |
| 23–24 | 交通教则第6章第3节，第67页 |
| 25 | 交通教则第6章第2节，第66页 |
| 26–27 | 交通教则第5章第1–2节，第43页 |

[交通教则官方入口](https://www.npa.go.jp/bureau/traffic/koutsuuannzennjyouhou.html) · [本次入口链接的PDF](https://www.npa.go.jp/bureau/traffic/20241113kyousoku.pdf) · [官方考试题型规定](https://www.npa.go.jp/laws/notification/koutuu/menkyo/menkyo20230330_46.pdf)

核对了黄灯安全停车例外、儿童座椅豁免条件、铁路道口信号与警报的区别、AT完全停车后挂P挡、左右方向和插图场景一致性。假名为预编写读音，非运行时自动转换。尚无日本驾校教练或母语教师的独立审阅；不宣称覆盖全部现行规则。官方入口提示2026年生活道路限速制度更新，本版没有编写通用法定速度数值题，避免套用旧版教则的速度结论。

参考了 [Karpathy英文转录](https://www.spke.com/en/ai/article/1021) 关于按学习问题选择文字、图解及交互网页的建议；优先实现可操作的反馈。ASD-STE100官网及FAQ访问返回403，仅采用清楚表达原则，不宣称认证或把英文规则套用于日语。

## 测试复现

运行环境：Windows、Node.js 24、已安装的 Edge、Playwright。网页本身不依赖这些开发工具。

```powershell
Set-Location -LiteralPath 'C:\LI KAI\AI\_Programing\JP_Driving\Program'
node --check app.js
node --check questions.js
node test.cjs
node test-extra.cjs
node test-update.cjs
```

脚本默认使用本机 Codex 附带的 Playwright 路径。其他电脑可用 `PLAYWRIGHT_PATH` 环境变量指定现有 Playwright 模块路径。测试使用独立浏览器配置，不接触你的日常浏览器学习记录。测试报告、截图在 `test-results`，真实限制与修正记录见 `DEVELOPMENT_LOG.md`。


## 在线使用与离线下载

在线地址：https://likairesearch-jpg.github.io/JP_Driving/

公开源码：https://github.com/likairesearch-jpg/JP_Driving

GitHub 仓库的 Code → Download ZIP，解压后打开根目录 index.html 即可离线使用，无须安装程序。首次在线朗读需要加载对应音频；下载后的完整文件夹可断网运行。

本地文件与在线网站使用不同的浏览器存储。请先在原页面“导出进度”，再到在线页面“导入进度”；不会自动同步，也不会向 GitHub 上传学习记录。

新增 q31–q40 包括一时停止、禁止驶入、禁止驻车、禁止驻停、最高速度、单行、菱形预告、停止线、人行横道及黄色中央线。图片为依据官方参考绘制的原创 SVG，并非正式试卷扫描件。标志图片题仍是一条陈述的正误判断，与每组3条陈述的危险预测题分开处理。原有题号保持不变。

## 开发验证与发布

应用无需构建。使用 Node.js 和 Playwright（已安装 Microsoft Edge），设置 PLAYWRIGHT_PATH 为本机 playwright 包位置，然后运行：

```powershell
node test.cjs
node test-extra.cjs
node test-update.cjs
node test-pictures.cjs
```

可设置 TEST_URL 为网站 URL 后运行 test-pictures.cjs 进行在线回归。测试使用独立浏览器，不修改日常浏览器的学习记录。结果保存在被 Git 忽略的 test-results/。

GitHub Pages 使用 main 分支根目录发布；.nojekyll 保持原始静态文件。修改后提交并推送 main 即会更新网站。开发工具、测试导出的学习记录和临时浏览器配置不提交。
