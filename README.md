# Apple Server API

## 简介
这是一个基于 Deno 的 Apple 服务端 API 工具包，提供了与苹果开发者服务和商店服务交互的功能。

包含 Apple Developer API 和 Apple Store API 的集成，支持推送通知、地图服务等功能。

## 功能特性

### 🔐 JWT Token 生成
- **Apple Developer JWT Token**: 用于苹果开发者服务认证
- **Apple Store JWT Token**: 用于 App Store Connect API 认证
- 支持 ES256 算法签名

### 🗺️ Apple Maps 服务
- **逆地理编码**: 将经纬度坐标转换为详细地址信息
- 支持多语言地址查询
- 返回结构化地址数据

### 📱 APNs 推送通知
- 支持向 iOS 设备发送推送通知
- 可配置生产环境和开发环境
- 支持自定义推送内容和额外数据
- 


## API 使用说明

### JWT Token 生成

```typescript
import { createAppleDeveloperJWTAuthToken, createAppleStoreJWTAuthToken } from "./token.ts";

// 生成开发者 JWT Token
const devToken = await createAppleDeveloperJWTAuthToken(bundleId, issuerId, p8key, keyId);

// 生成商店 JWT Token
const storeToken = await createAppleStoreJWTAuthToken(bundleId, issuerId, p8key, keyId);
```

### 地理位置服务

```typescript
import { getAddressByLocationWithAppleMap } from "./developer_service_api.ts";

// 根据经纬度获取地址
const address = await getAddressByLocationWithAppleMap(39.9042, 116.4074, 'zh-CN');
console.log(address); // 输出: 北京市朝阳区...
```

### 推送通知

```typescript
// 发送 APNs 推送通知
const success = await sendApns(
    'device_token_here',
    '通知标题',
    '通知内容',
    { custom_data: 'value' }
);
```


## 注意事项

1. **JWT Token 有效期**: 
   - Developer Token: 120分钟
   - Store Token: 15分钟

2. **APNs 环境**:
   - 开发环境: `api.sandbox.push.apple.com`
   - 生产环境: `api.push.apple.com`

3. **私钥安全**: 请妥善保管 P8 私钥文件，不要将其提交到版本控制系统



## 许可证
MIT License

## 相关链接
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Apple Maps Server API](https://developer.apple.com/documentation/applemapsserverapi/)