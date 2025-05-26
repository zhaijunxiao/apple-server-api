
import * as jose from "https://deno.land/x/jose@v4.15.4/index.ts";


async function signJWT(payload: any, p8key: string, keyId: string) {
    try {
        const privateKey = await jose.importPKCS8(
          p8key,
          "ES256",
          {
            extractable: true,
          },
        );
    
        const token = await new jose.SignJWT(payload)
          .setProtectedHeader({
            alg: "ES256",
            kid: keyId,
          })
          .sign(privateKey);

        return token;
      } catch (error) {
        return null;
      }
}

//apple developer token, 用于开发者服务
export async function createAppleDeveloperJWTAuthToken(bundleId: string,issuerId: string,p8key: string,keyId: string) {
    const payload = {
        bid: bundleId,  
        iss: issuerId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120 * 60,
      };

     return  await signJWT(payload, p8key, keyId)
}

//apple store token, 用于apple 商店服务
export async function createAppleStoreJWTAuthToken(bundleId: string,issuerId: string,p8key: string,keyId: string) {
    const payload= {
        bid: bundleId,
        iss: issuerId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
        aud: "appstoreconnect-v1",
    }

    return await signJWT(payload, p8key, keyId)
}


  