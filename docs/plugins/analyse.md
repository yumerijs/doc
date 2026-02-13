# 数据统计 (Analyse)

---

该插件用于统计页面访问量，并在控制台首页展示访问统计卡片。仅统计返回 HTML 的页面请求（即 `Content-Type: text/html`）。

## 依赖

- `database`
- `console`

## 配置项

### paths

- 类型: `array`
- 默认值: `['api']`

忽略的路由项开头

## 行为说明

- 中间件会在请求结束后进行统计。
- `paths` 中配置的路径前缀将被忽略（例如 `/api`）。
- 统计数据存放在 `analyse` 表中，字段为 `day` 与 `times`。

`day` 的格式为 `YYYYMMDD` 的简化编码（实现为 `day + 100 * month + 10000 * year`）。

## 控制台展示

插件会在控制台首页添加一个「访问统计」模块，包含：

- 总浏览次数
- 今日浏览
- 本月浏览

## API 接口

> 以下接口需要登录控制台后才能访问。

- `GET /api/analyse/:range`  
  统计近 `range` 天的总访问量，例如 `range=1` 为今日，`range=30` 为近 30 天。

- `GET /api/analyse-total`  
  统计全部访问量。
