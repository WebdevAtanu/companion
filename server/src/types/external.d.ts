declare module "bcrypt" {
  const bcrypt: {
    hash(data: string, saltOrRounds: number): Promise<string>;
    compare(data: string, encrypted: string): Promise<boolean>;
  };

  export default bcrypt;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    sub?: string;
    [key: string]: unknown;
  }

  const jwt: {
    sign(payload: object, secretOrPrivateKey: string, options?: object): string;
    verify(token: string, secretOrPublicKey: string): string | JwtPayload;
  };

  export default jwt;
}
