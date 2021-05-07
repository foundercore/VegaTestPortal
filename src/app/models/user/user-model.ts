export interface IUserModel {

    address?: string;
    displayName?: string;
    email?: string;
    enabled?: true;
    firstName?: string;
    gender?: string;
    lastName?: string;
    authorities?: [];
    state?: string;
    userName: string;
    tenantId?:string;
    accountNonLocked?:boolean;
    accountNonExpired?:boolean;
    credentialsNonExpired?: boolean;
    lastUpdatedOn?:Date;
    lastUpdatedBy?: string;
  }


  export class UserModel implements IUserModel {

    address?: string;
    displayName?: string | undefined;
    email?: string | undefined;
    enabled?: true | undefined;
    firstName?: string | undefined;
    gender?: string | undefined;
    lastName?: string | undefined;
    authorities?: any;
    state?: string | undefined;
    userName: string;
    tenantId?: string | undefined;
    accountNonLocked?: boolean | undefined;
    accountNonExpired?: boolean | undefined;
    credentialsNonExpired?: boolean | undefined;
    lastUpdatedOn?: Date | undefined;
    lastUpdatedBy?: string | undefined;
    authInfo: string;

    constructor(userObj: any, authInfo: string){
      this.address = userObj?.address;
      this.displayName = userObj?.displayName;
      this.email = userObj?.email;
      this.enabled = userObj?.enabled;
      this.firstName = userObj?.firstName;
      this.gender = userObj?.gender;
      this.lastName = userObj?.lastName;
      this.authorities = userObj?.authorities;
      this.state = userObj?.state;
      this.userName = userObj?.userName;
      this.tenantId = userObj?.tenantId;
      this.accountNonLocked = userObj?.accountNonLocked;
      this.accountNonExpired = userObj?.accountNonExpired;
      this.credentialsNonExpired = userObj?.credentialsNonExpired;
      this.lastUpdatedOn = userObj?.lastUpdatedOn;
      this.lastUpdatedBy = userObj?.lastUpdatedBy;
      this.authInfo = authInfo
    }


  }
