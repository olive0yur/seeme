# See-Me 项目 Claude 开发指南

## 项目概述

See-Me 是一个基于 Next.js 的图片编辑和处理应用程序，专注于提供高级的图片编辑功能，包括颜色校正、效果调整和实时预览。该项目使用现代化的前端技术栈，支持多种图片处理算法和视图模式。

## 技术栈

### 核心框架
- **Next.js 16.0.1** - React 全栈框架
- **React 19.2.0** - 用户界面库
- **TypeScript** - 静态类型检查
- **Tailwind CSS 4** - CSS 框架

### 图片处理和动画
- **Pixi.js 8.14.1** - 2D 渲染引擎，用于高性能图片处理
- **GSAP 3.13.0** - 动画库
- **Lenis 1.3.14** - 平滑滚动库
- **Motion 12.23.24** - 动画组件库

### 开发工具
- **ESLint** - 代码质量检查
- **React Compiler** - React 性能编译器
- **PNPM** - 包管理器

## 项目结构

```
see-me/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/         # 主仪表板页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   ├── login/             # 登录页面
│   │   └── register/          # 注册页面
│   ├── components/             # React 组件
│   │   ├── ui/                # 通用 UI 组件
│   │   ├── ImageEditor/       # 图片编辑器
│   │   ├── ImageSelector/     # 图片选择器
│   │   ├── PixiImageRenderer/ # Pixi.js 渲染器
│   │   ├── FileUploader/      # 文件上传
│   │   ├── ProjectSelector/   # 项目选择器
│   │   ├── BasicPanel/        # 基础设置面板
│   │   ├── ColorPanel/        # 颜色设置面板
│   │   ├── EffectsPanel/      # 效果设置面板
│   │   ├── BounceCards/       # 弹跳卡片动画
│   │   └── ...其他组件
│   ├── types/                 # TypeScript 类型定义
│   └── utils/                 # 工具函数
├── public/                    # 静态资源
├── package.json               # 项目配置
├── next.config.ts            # Next.js 配置
├── tsconfig.json             # TypeScript 配置
└── ecosystem.config.js       # PM2 生产环境配置
```

## 开发命令

### 开发环境
```bash
# 启动开发服务器
npm run dev
# 或者
pnpm dev

# 开发服务器将在 http://localhost:3000 运行
```

### 构建和部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
# 或者使用指定端口
npm run start -p 8080

# 代码检查
npm run lint
```

### PM2 生产环境管理
```bash
# 启动 PM2 进程
npm run pm2:start

# 停止 PM2 进程
npm run pm2:stop

# 重启 PM2 进程
npm run pm2:restart

# 重载 PM2 进程
npm run pm2:reload

# 删除 PM2 进程
npm run pm2:delete

# 查看 PM2 日志
npm run pm2:logs

# 查看 PM2 监控面板
npm run pm2:monit
```

## 核心功能模块

### 1. 图片编辑器 (ImageEditor)
- 基于 Pixi.js 的高性能图片渲染
- 支持多种图片调整参数：曝光、高光、阴影、白阶、黑阶、色温、色调、饱和度、纹理、清晰度、颗粒
- 实时预览和对比视图
- 支持缩放和平移操作

### 2. 图片管理
- **图片上传**: 支持多文件上传，拖拽上传
- **图片选择**: 缩略图预览，快速切换
- **项目管理**: 项目创建、选择、删除功能
- **设置持久化**: 每张图片独立的编辑设置

### 3. 编辑面板
- **基础设置面板**: 基础图片调整参数
- **颜色设置面板**: 颜色相关调整
- **效果设置面板**: 特效和纹理调整
- 可折叠设计，支持滚轮操作

### 4. 视图模式
- **单图模式**: 显示当前编辑的图片
- **对比模式**: 并排显示原图和编辑后图片
- **修改模式**: 只显示编辑后的图片

### 5. 用户界面
- 响应式设计
- 平滑滚动效果
- 动画过渡效果
- 语音输入支持（预留功能）

## 开发指导原则

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码风格
- 组件使用函数式组件和 Hooks
- 使用 CSS 模块或 Tailwind CSS 进行样式管理

### 图片处理注意事项
- 所有图片处理操作都在客户端进行，确保用户隐私
- 使用 Pixi.js 进行高性能渲染，避免性能瓶颈
- 图片设置实时保存，确保用户体验连续性

### 状态管理
- 使用 React useState 管理组件状态
- 使用 useRef 保存跨渲染周期的数据
- 复杂状态管理考虑使用 Context API 或状态管理库

### 性能优化
- 启用 React Compiler 进行性能优化
- 图片懒加载和虚拟化考虑
- 避免不必要的重新渲染

### 开发建议
1. **新功能开发**: 先明确需求和用户体验，再进行技术实现
2. **图片编辑功能**: 逐步完善图片处理算法，确保编辑质量
3. **用户体验**: 注重界面交互和动画效果，提升用户满意度
4. **代码质量**: 保持代码整洁，添加必要的注释和文档
5. **测试覆盖**: 为核心功能编写单元测试和集成测试

## 配置说明

### Next.js 配置
- 开启 React Compiler 提升性能
- 配置远程图片域名：`static.onew.design`
- 支持图片优化和缓存

### TypeScript 配置
- 严格模式启用
- 路径别名：`@/*` 指向 `src/*`
- 支持 JSX 和 ESNext 特性

### 生产环境
- 使用 PM2 进行进程管理
- 运行在端口 8080
- 自动重启和监控

## 部署指南

### 开发环境部署
```bash
# 安装依赖
npm install
# 或
pnpm install

# 启动开发服务器
npm run dev
```

### 生产环境部署
```bash
# 构建项目
npm run build

# 使用 PM2 启动
npm run pm2:start

# 查看运行状态
npm run pm2:monit
```

这个项目是一个现代化的图片编辑应用，具有强大的图片处理能力和优雅的用户界面。在开发过程中，请重点关注用户体验和性能优化。
