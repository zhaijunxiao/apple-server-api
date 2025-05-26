import { createAppleDeveloperJWTAuthToken } from "./token.ts";

const bundleId = 'your bundle id'
const issuerId = 'your issuer id'
const p8key = 'your p8 key'
const keyId = 'your key id'


//经纬度转地址信息
export async function getAddressByLocationWithAppleMap(lat: number, lon: number,language:string = 'en'): Promise<string> {
    const apple_map_api_key = await createAppleDeveloperJWTAuthToken(bundleId, issuerId, p8key, keyId);

    const tokenResponse = await fetch('https://maps-api.apple.com/v1/token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apple_map_api_key}`
        }
    })

    const tokenResponseJson = await tokenResponse.json()
    //console.log(tokenResponseJson)
    const token = tokenResponseJson.accessToken
    //console.log(token)

    if(!token){
        console.error('get apple map token failed')
        return 'unknown'
    }
    
    const url = `https://maps-api.apple.com/v1/reverseGeocode?loc=${lat},${lon}&language=${language}`
    const response = await fetch(url,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await response.json()
     // 解析返回的地址数据
     console.log(data)
     if (data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // 优先使用 structuredAddress 中的 fullThoroughfare
        if (result.structuredAddress) {
            let address = ""
            if(result.structuredAddress.locality){
                address += result.structuredAddress.locality
                address += " "
            }
            if(result.structuredAddress.subLocality){
                address += result.structuredAddress.subLocality
                address += " "
            }
            if(result.structuredAddress.thoroughfare){
                address += result.structuredAddress.thoroughfare
                address += " "
            }
            if(result.structuredAddress.subThoroughfare){
                address += result.structuredAddress.subThoroughfare
            }
            return address
        }
        
        // 如果没有 fullThoroughfare，则使用 formattedAddressLines
        if (result.formattedAddressLines && result.formattedAddressLines.length > 0) {
            return result.formattedAddressLines[0]
        }
        
        // 如果有名称，至少返回名称
        if (result.name) {
            return result.name;
        }
    }
    
    return 'unknown';

}


async function sendApns(device_token:string,title: string, body:string, extra: any): Promise<boolean>{
    const apn_dev_host="https://api.sandbox.push.apple.com"
    const apn_prod_host="https://api.push.apple.com"


    const url = `${apn_prod_host}/3/device/${device_token}`
    const jwt_token = await createAppleDeveloperJWTAuthToken(bundleId, issuerId, p8key, keyId);
    const apns_expiration = Math.floor(Date.now() / 1000) + 3600
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'apns-topic': bundleId,
        'apns-expiration': apns_expiration.toString(),
    }
    const payload = {
        aps: {
            "mutable-content" : 1,
            alert: {
                "title": title,
                "body": body,
                ...extra
            }
        }
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    
    // 检查响应状态
    if (response.status !== 200) {
        const errorText = await response.text()
        console.error(`send apns notification failed. apns_token: ${device_token}, title: ${title}, body: ${body}, status: ${response.status}, statusText: ${response.statusText}, errorText: ${errorText}`)
        return false
    }else{
        console.info(`send apns notification success. apns_token: ${device_token}, title: ${title}, body: ${body}`)
        return true
    }
}