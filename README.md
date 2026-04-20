<p align="center">
  <img src="./assets/readme-hero.svg" alt="OfferHelper banner" width="100%" />
</p>

# OfferHelper

<p align="center">
  <strong>Privacy-first Claude Code skill for tailoring resumes and cover letters from a job posting.</strong><br />
  <sub>Template-aware. Public-safe. Built for a clean split between open plugin logic and private candidate data.</sub>
</p>

<p align="center">
  <a href="https://github.com/zaneding/offerhelper"><img src="https://img.shields.io/badge/Repo-offerhelper-111111?style=flat-square" alt="Repository"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-0b57d0?style=flat-square" alt="MIT License"></a>
  <a href="./.claude-plugin/plugin.json"><img src="https://img.shields.io/badge/Plugin-Claude_Code-cb6ce6?style=flat-square" alt="Claude Code Plugin"></a>
  <a href="#中文"><img src="https://img.shields.io/badge/README-Bilingual-1f6feb?style=flat-square" alt="Bilingual README"></a>
</p>

<p align="center">
  <a href="#中文">中文</a> · <a href="#english">English</a>
</p>

OfferHelper is a Claude Code skill and plugin workflow for application tailoring. The public repo ships only reusable skill logic, templates, and onboarding. Personal candidate data, live Canva metadata, and private notes stay in a separate private repo or ignored local files, accessed through a single runtime interface: `references/private-config.md`. In this setup, the private source-of-truth repo can be `offerhelpe_privat`.

> GitHub README does not support real tab components by default. This file uses GitHub-native `<details>` sections as the most stable bilingual switch pattern.

## At a Glance

- Input: job posting URL or pasted JD
- Output: tailored resume, cover letter, or a structured edit plan
- Public repo ships no personal data
- Private data enters only through local `references/private-config.md`
- Users can fill `references/` manually or let Claude generate/enrich it from private Markdown sources

## Why OfferHelper

- Privacy-first: the public repo carries no real candidate profile, contact data, Canva IDs, or edit URLs
- Template-aware: tailoring is designed to fit a mapped resume template, not just rewrite text in isolation
- Claude-native: the project is structured as a real Claude Code plugin with one public skill entry under `skills/offerhelper/`
- Practical workflow: supports both manual setup and private-source-driven generation of local reference files

## Quick Install

```bash
/plugin marketplace add offerhelper github:zaneding/offerhelper
/plugin install offerhelper@offerhelper
```

## How It Works

<p align="center">
  <img src="./assets/readme-workflow.svg" alt="OfferHelper workflow" width="100%" />
</p>

<details open>
<summary><strong>中文</strong></summary>

<a id="中文"></a>

## 目录

- [项目定位](#cn-positioning)
- [为什么用它](#cn-why)
- [快速开始](#cn-quickstart)
- [首次配置](#cn-setup)
- [Public / Private 分层](#cn-split)
- [私有接口：private-config](#cn-private-config)
- [使用场景](#cn-use-cases)
- [工作流](#cn-workflow)
- [Requirements](#cn-requirements)
- [仓库结构](#cn-structure)
- [FAQ](#cn-faq)

<a id="cn-positioning"></a>

## 项目定位

`OfferHelper` 是一个面向 Claude Code 的求职材料定制 skill。它读取职位链接或职位描述，结合候选人资料、简历模板映射和运行时配置，生成：

- 定制版简历内容
- 定制版求职信
- 可直接落到模板里的编辑内容
- 在编辑能力缺失时的结构化 edit plan

它不是一个“只会堆关键词”的 README 项目，而是一条完整工作流：

- 先理解岗位
- 再映射候选人证据
- 再约束到模板结构
- 最后输出能投递的内容

<a id="cn-why"></a>

## 为什么用它

| 优势 | 说明 |
|---|---|
| 隐私优先 | 公开仓库不携带你的真实候选人资料、联系方式、Canva 元数据 |
| 模板感知 | 输出不是纯文本，而是面向 `resume-layout-map` 的结构化改写 |
| 适合长期维护 | 公开版做分发，私有 repo 保留真实 source-of-truth |
| 兼顾自动化与手工 | 可手填 `references/`，也可让 Claude 从私有 Markdown 源生成 |

<a id="cn-quickstart"></a>

## 快速开始

### 1. 安装插件

```bash
/plugin marketplace add offerhelper github:zaneding/offerhelper
/plugin install offerhelper@offerhelper
```

### 2. 创建本地 `references/`

```text
references/
```

从公开模板复制出以下本地文件：

- `references/candidate-profile.md`
- `references/resume-layout-map.md`
- `references/private-config.md`

模板来源：

- `skills/offerhelper/references/candidate-profile-template.md`
- `skills/offerhelper/references/resume-layout-map-template.md`
- `skills/offerhelper/references/private-config.example.md`

### 3. 开始使用

```text
这是我想申请的岗位：[职位链接或 JD]
请根据这个岗位帮我定制简历，并生成 cover letter。
```

<a id="cn-setup"></a>

## 首次配置

推荐按这四步初始化：

1. 从 `skills/offerhelper/references/` 复制三个公开模板到本地 `references/`
2. 填写 `references/private-config.md`
3. 如果你维护私有 repo，把真实资料路径写进去
4. 让 Claude 先生成或刷新：
   - `references/candidate-profile.md`
   - `references/resume-layout-map.md`

需要优先刷新本地 references 的情况：

- 文件不存在
- 文件仍是模板占位符
- 模板已经改版
- 你的候选人资料已经更新

<a id="cn-split"></a>

## Public / Private 分层

### 公开 `main` 包含什么

- 插件元数据
- 可安装的公开 skill：`skills/offerhelper/SKILL.md`
- 公开模板与示例配置
- README 与校验脚本

### 私有 repo 或本地忽略文件包含什么

- 真实候选人经历
- 真实联系方式
- Canva 设计 ID、编辑链接、page ID、field ID
- 私有工作流笔记
- 可被 Claude 读取的 private Markdown source files

### 推荐使用方式

1. 保持这个仓库为公开、可分发版本
2. 另建一个 private repo 保存你的真实资料，例如 `offerhelpe_privat`
3. 在本地工作目录里创建 `references/private-config.md`
4. 在 `private-config.md` 中写入私有 Markdown 文件路径
5. 让 Claude 读取这些私有源文件并生成或补全本地 `references/` 文件

<a id="cn-private-config"></a>

## 私有接口：`private-config`

公开 skill 只通过一个入口读取私有配置：

```text
references/private-config.md
```

这个文件可以放：

- 联系方式和候选人身份信息
- 模板元数据：design ID、page ID、edit URL
- 逻辑字段 ID 映射
- 输出偏好
- 可选的私有 Markdown 源文件路径

推荐路径示例（以私有仓库 `offerhelpe_privat` 为例）：

```text
candidate_source_path: ../offerhelpe_privat/candidate-source.md
resume_layout_source_path: ../offerhelpe_privat/layout-source.md
contact_source_path: ../offerhelpe_privat/contact-source.md
cover_letter_source_path: ../offerhelpe_privat/cover-letter-source.md
```

如果这些路径存在，Claude 应先读取它们，再生成或补全本地 `references/` 文件；如果不存在，就回退到公开模板并要求用户手工补齐。

<a id="cn-use-cases"></a>

## 使用场景

- 高频海投相似岗位，但想保留真实、可验证的经历表达
- 已经有固定 Canva 或其他模板，不想每次手工改版
- 想把公开技能仓库和私人求职资产彻底分开
- 想让 Claude 先整理候选人资料，再做岗位定制

<a id="cn-workflow"></a>

## 工作流

1. 分析岗位并提取核心要求
2. 读取本地 `references/private-config.md`
3. 如有私有源文件路径，读取这些私有 Markdown
4. 若本地 `references/candidate-profile.md` 或 `references/resume-layout-map.md` 缺失或不完整，先生成或刷新
5. 基于候选人资料和 layout map 做岗位定制
6. 直接编辑模板，或输出结构化编辑方案
7. 生成求职信

<a id="cn-requirements"></a>

## Requirements

- 已安装 Claude Code
- 一个本地 `references/` 目录
- 至少一份 candidate profile 和一份 layout map
- 可选：单独 private repo，例如 `offerhelpe_privat`
- 可选：Canva 或其他模板工具的真实元数据

<a id="cn-structure"></a>

## 仓库结构

```text
offerhelper/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── offerhelper/
│       ├── SKILL.md
│       └── references/
│           ├── candidate-profile-template.md
│           ├── resume-layout-map-template.md
│           └── private-config.example.md
├── scripts/
│   ├── validate-readme.mjs
│   └── validate-public-safety.mjs
├── .gitignore
├── package.json
└── README.md
```

本地运行时通常还会有一个被忽略的目录：

```text
references/
├── candidate-profile.md
├── resume-layout-map.md
└── private-config.md
```

<a id="cn-faq"></a>

## FAQ

### 我还能用 Canva 吗？

可以。公开版不再提交真实 Canva 信息，但私有 `private-config.md` 仍然可以保存 design ID、page ID、edit URL 和字段 ID。

### 私有资料一定要放单独 private repo 吗？

不一定。你也可以只放在本地忽略目录里。单独 private repo 只是更适合长期维护和备份。

### 为什么公开 repo 不再带真实 `references/`？

因为这些文件会逐步积累真实经历、公司、学校和模板元数据。公开版只保留模板，避免误泄露。

</details>

<details>
<summary><strong>English</strong></summary>

<a id="english"></a>

## Contents

- [Positioning](#en-positioning)
- [Why Use It](#en-why)
- [Quick Start](#en-quickstart)
- [First-Time Setup](#en-setup)
- [Public / Private Split](#en-split)
- [Private Interface: private-config](#en-private-config)
- [Use Cases](#en-use-cases)
- [Workflow](#en-workflow)
- [Requirements](#en-requirements)
- [Repository Structure](#en-structure)
- [FAQ](#en-faq)

<a id="en-positioning"></a>

## Positioning

`OfferHelper` is a Claude Code skill for tailoring application materials to a job posting. It combines a job description with candidate evidence, template constraints, and runtime configuration to produce:

- tailored resume content
- a tailored cover letter
- template-ready edits
- a structured edit plan when direct editing is unavailable

This is not just a keyword optimizer. The workflow is:

- understand the role
- map verified candidate evidence
- constrain the result to a resume layout
- produce something usable for an actual application

<a id="en-why"></a>

## Why Use It

| Advantage | Description |
|---|---|
| Privacy-first | The public repo ships no real candidate profile, contact info, or Canva metadata |
| Template-aware | Output is shaped to a `resume-layout-map`, not treated as free-form text only |
| Maintainable | Public repo stays distributable while a private repo keeps your source-of-truth |
| Flexible | You can fill `references/` manually or let Claude generate it from private sources |

<a id="en-quickstart"></a>

## Quick Start

### 1. Install the plugin

```bash
/plugin marketplace add offerhelper github:zaneding/offerhelper
/plugin install offerhelper@offerhelper
```

### 2. Create local `references/`

```text
references/
```

Create these local runtime files from the public templates:

- `references/candidate-profile.md`
- `references/resume-layout-map.md`
- `references/private-config.md`

Template sources:

- `skills/offerhelper/references/candidate-profile-template.md`
- `skills/offerhelper/references/resume-layout-map-template.md`
- `skills/offerhelper/references/private-config.example.md`

### 3. Start using it

```text
Here is the job posting: [URL or pasted JD]
Please tailor my resume and generate a cover letter for this role.
```

<a id="en-setup"></a>

## First-Time Setup

Recommended first-run sequence:

1. Copy the three public templates from `skills/offerhelper/references/` into local `references/`
2. Fill `references/private-config.md`
3. If you maintain a private repo, add your real source file paths there
4. Ask Claude to generate or refresh:
   - `references/candidate-profile.md`
   - `references/resume-layout-map.md`

Refresh those local reference files first if:

- a file is missing
- placeholders are still present
- the template changed
- your candidate source-of-truth changed

<a id="en-split"></a>

## Public / Private Split

### What public `main` contains

- plugin metadata
- the installable public skill at `skills/offerhelper/SKILL.md`
- public templates and example config
- README and validation scripts

### What stays in a private repo or ignored local files

- real candidate experience
- real contact details
- Canva design IDs, edit URLs, page IDs, and field IDs
- private workflow notes
- private Markdown source files that Claude may read at runtime

### Recommended operating model

1. Keep this repo public and distributable
2. Store your real source-of-truth files in a separate private repo such as `offerhelpe_privat`
3. Create local `references/private-config.md`
4. Put private Markdown source paths into that config
5. Let Claude read those private sources and generate or refresh local `references/` files

<a id="en-private-config"></a>

## Private Interface: `private-config`

The public skill reads private runtime data through one interface only:

```text
references/private-config.md
```

That file can hold:

- candidate identity and contact values
- template metadata such as design ID, page ID, and edit URL
- logical field mappings
- output preferences
- optional file paths to private Markdown sources

Example path entries using a private repo named `offerhelpe_privat`:

```text
candidate_source_path: ../offerhelpe_privat/candidate-source.md
resume_layout_source_path: ../offerhelpe_privat/layout-source.md
contact_source_path: ../offerhelpe_privat/contact-source.md
cover_letter_source_path: ../offerhelpe_privat/cover-letter-source.md
```

If those paths exist, Claude should read them first and use them to build or enrich local `references/` files. If they do not exist, the skill should fall back to the public templates and ask the user to complete the setup manually.

<a id="en-use-cases"></a>

## Use Cases

- repeated applications to similar roles with truthful tailoring
- fixed Canva or non-Canva resume templates that should be updated instead of rebuilt
- teams or individuals who want a clean public repo and a separate private source-of-truth
- workflows where Claude first organizes candidate evidence, then tailors job materials

<a id="en-workflow"></a>

## Workflow

1. Analyze the job posting
2. Read local `references/private-config.md`
3. Read any referenced private Markdown sources if they exist
4. Generate or refresh `references/candidate-profile.md` and `references/resume-layout-map.md` when they are missing or incomplete
5. Tailor resume content using the candidate profile and layout map
6. Update the template directly or return a structured edit plan
7. Generate the cover letter

<a id="en-requirements"></a>

## Requirements

- Claude Code installed
- a local `references/` directory
- at least one candidate profile and one layout map
- optional separate private repo such as `offerhelpe_privat`
- optional Canva or other template metadata

<a id="en-structure"></a>

## Repository Structure

```text
offerhelper/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── offerhelper/
│       ├── SKILL.md
│       └── references/
│           ├── candidate-profile-template.md
│           ├── resume-layout-map-template.md
│           └── private-config.example.md
├── scripts/
│   ├── validate-readme.mjs
│   └── validate-public-safety.mjs
├── .gitignore
├── package.json
└── README.md
```

Typical local runtime files, ignored by Git:

```text
references/
├── candidate-profile.md
├── resume-layout-map.md
└── private-config.md
```

<a id="en-faq"></a>

## FAQ

### Can I still use Canva?

Yes. The public repo no longer ships real Canva metadata, but your private `private-config.md` can still hold design IDs, page IDs, edit URLs, and field IDs.

### Do I have to create a separate private repo?

No. Ignored local files are enough. A separate private repo is simply the cleaner long-term setup for backup and maintenance.

### Why remove real `references/` files from the public repo?

Because those files gradually accumulate real candidate history, company names, education, and live template metadata. The public repo should ship templates only.

</details>
