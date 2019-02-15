declare namespace KillBarGame{
  interface User {
    userIndex: number,
    userName: string,
    userRole: string,
    userPic: string,
    userVote: number,
    userStatus: string,
    beKillVote?: number,
    beCheckVote?: number,
  }
}
declare module "KillBarGame"{
  export = KillBarGame;
}
