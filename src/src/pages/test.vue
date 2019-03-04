<template>
  <div class="sign">
    <div class="sign_content">
      <div class="sign_frame">
        <div class="sign_header">wherein</div>
        <div class="sign_wrapper">
          <div class="AuthorizeForm SignForm" v-if="AuthorizeForm">
            <div class="Avatars">
              <div class="Avatar-container">
                  <!-- <img src="~img/logo-c.png" alt="steemconnect"> -->
                  <img src="~img/steemconnet.png" alt="steemconnect">
              </div>
              <div class="Avatar-link"></div>
              <div class="Avatar-container">
                <!-- <img
                  src="https://steemitimages.com/40x40/http://newappaz.oss-cn-hongkong.aliyuncs.com/wherein_images/cus_head/e3e5422c46c74b47995380d2368b4204.png"
                  alt="where-in"
                > -->
                <img
                  src="~img/app_logo.png"
                  alt="where-in"
                >
              </div>
            </div>
            <p>
              <font>
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;">您是否要授权应用程序</font>
                  <b>
                    <font style="vertical-align: inherit;">wherein (@wherein-io)</font>
                  </b>
                  <font style="vertical-align: inherit;">使用您的</font>
                  <b>
                    <span>
                      <font style="vertical-align: inherit;">发布(posting)</font>
                    </span>
                  </b>
                  <font style="vertical-align: inherit;">权限？</font>
                </font>
              </font>
            </p>
            <ul class="authorize-operations">
              <li v-for="item in ScopeArray" :key="item.text">
                <mu-icon value="done" color="green"></mu-icon>
                <span >
                  <font>{{item.text}}</font>
                </span>
                <!-- /react-text -->
              </li>
            </ul>
            <mu-button color="primary" @click="toauth" class="muSub" style="display:block">继续</mu-button>
          </div>
          <mu-form
            v-else
            ref="addRoomForm"
            :model="loginForm"
            class="SignForm"
            label-position="left"
          >
            <p>
              <span>此操作需要您的活跃密钥(Active Key)或主密钥(Master key)</span>
            </p>
            <mu-form-item
              prop="username"
              :rules="roomNameRules"
              :error-text="loginErrorText.username"
            >
              <mu-text-field
                v-model="loginForm.username"
                @blur="getUserDetail"
                autocorrect="off"
                autocapitalize="none"
                autocomplete="off"
                placeholder="用户名"
              >
                <div class="loadingWrap">
                  <mu-icon v-if="loadStatus==3" value="clear" color="red"></mu-icon>
                  <mu-icon v-else-if="loadStatus==2" value="done" color="green"></mu-icon>
                  <mu-icon
                    v-else-if="loadStatus==1"
                    value="rotate_right"
                    color="blue"
                    class="customLoading"
                  ></mu-icon>
                </div>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="wif" :error-text="loginErrorText.wif" :rules="roomSecretRules">
              <mu-text-field
                :type="!showPwd?'password':'text'"
                v-model="loginForm.wif"
                autocorrect="off"
                autocapitalize="none"
                autocomplete="off"
                placeholder="密钥(Key)"
              >
                <mu-checkbox
                  v-model="showPwd"
                  uncheck-icon="visibility_off"
                  checked-icon="visibility"
                  class="chechForm"
                ></mu-checkbox>
              </mu-text-field>
            </mu-form-item>

            <mu-button color="primary" @click="auth" class="muSub" style="display:block">
              <mu-icon
                left
                v-if="formLoading"
                value="rotate_right"
                color="white"
                class="customLoading"
              ></mu-icon>{{loginButtonText}}
            </mu-button>

            <div style="padding-top:10px">
              <a
                class="githubIcon"
                href="https://github.com/where-in/whereinconnect"
                target="blank"
                alt="whereinconnect"
                title="whereinconnect"
              >
                <span>
                  <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                    ></path>
                  </svg>
                </span>
                <span>whereinconnect</span>
              </a>
            </div>
          </mu-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import steem from "@steemit/steem-js";
import { decode } from "@steemit/steem-js/lib/auth/memo";
import jwt from "jsonwebtoken";
console.log(steem)
steem.api.setOptions({ url: "https://steemd.minnowsupportproject.org" }); // assuming websocket is work at ws.golos.io
// steem.config.set('address_prefix','GLS');
// steem.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
console.log(steem.config.uri)
export default {
  data() {
    return {
      AuthorizeForm: true,
      loginForm: {
        wif: "",
        username: "",
        privateWif:""
      },
      resultValiedate: {},
      scope: [],
      loadStatus: 0, //0-开始，1-等待 2-正确 3-错误
      loginErrorText: {
        wif: "",
        username: ""
      },
      loginButtonText:"登录",
      ScopeConstanse: {
        // login:"登录",
        "Offline Access": "离线访问",
        vote: "投票",
        comment: "发贴,评论",
        delete_comment: "删除评论",
        comment_options: "评论选项",
        custom_json: "自定义json",
        claim_reward_balance: "收取奖励"
      },
      steemUser: null,
      role: "",
      showPwd: false,
      redirect_uri: "",
      clientId: "",
      formLoading: false,
      roomNameRules: [{ validate: val => !!val, message: "必须填写用户名" }],
      roomSecretRules: [
        {
          validate: val => {
            if (!val) return true;
            return val.length >= 3;
          },
          message: "密码大于3位"
        }
      ]
    };
  },
  computed: {
    ScopeArray() {
      let scope = [];
      Object.keys(this.ScopeConstanse).forEach(item => {
        scope.push({ text: item, value: this.ScopeConstanse[item] });
      });
      return scope;
    }
  },
  watch: {},
  mounted() {
    // this.login()
    this.redirect_uri = decodeURIComponent(this.GetQueryString("redirect_uri"));
    var scope = this.GetQueryString("scope");
    if (scope && scope.length > 0) {
      this.scope = scope.replace("#", "");
    }
    this.clientId = this.GetQueryString("client_id");
  },
  methods: {
    keyAuthsHasPublicWif: (keys, publicWif) =>
      keys.some(key => key[0] === publicWif),
    toauth() {
      this.AuthorizeForm = false;
    },
    auth() {
      this.loginErrorText.wif = "";
      this.loginErrorText.username = "";
      this.$refs.addRoomForm.validate().then(result => {
        let account = this.steemUser;
        if (!account || account.name != this.loginForm.username) {
          this.loginErrorText.username = "没有该用户或者请等待验证";
          return false;
        }
        if (this.loginForm.wif.length <= 3) {
          this.loginErrorText.wif = "请输入长度大于3的密码";
          return false;
        }
        if (!result) {
          return;
        }
        let isWif = steem.auth.isWif(this.loginForm.wif);
        let roles = ["owner", "active"];
        const privateWif = isWif
          ? this.loginForm.wif
          : steem.auth.toWif(
              this.loginForm.username,
              this.loginForm.wif,
              roles[0]
            );
        this.loginForm.privateWif=privateWif;
        const publicWif = steem.auth.wifToPublic(privateWif);
        let wifIsValid = false;
        let role;

        for (let i = 0; i < roles.length; i += 1) {
          if (
            (roles[i] === "memo" && account.memo_key === publicWif) ||
            (roles[i] !== "memo" &&
              this.keyAuthsHasPublicWif(account[roles[i]].key_auths, publicWif))
          ) {
            wifIsValid = true;
            role = roles[i];
            this.role = role;
            break;
          }
        }
        if (!wifIsValid) {
          this.loginErrorText.wif = "请输入正确的密码";
          return;
        } else {
          this.loginErrorText.wif = "";
        }
        this.formLoading = true;
        this.loginButtonText="获取加密密钥...";
        this.$axios
          .get(
            `/api/getUserToken?userName=${
              this.loginForm.username
            }&role=${role}`
          )
          .then(data => data.data)
          .then(data => {
            this.formLoading = false;
            let token;
            data.codes.forEach(code => {
              // try {
              console.log("code", code);
              token = decode(privateWif, code).substring(1);
              console.log(jwt.decode(token));
              console.log("token", token);
              // } catch (err) {
              //    console.log(err);
              // }
            });
            if (token) {
              console.log(token);
              // this.getUserDetailByConnect(token)

              if (this.redirect_uri.length == 0) {
                this.loginButtonText="回调地址未定义";
                return;
              }
              this.setToken(token);
            }
          })
          .catch(error => {
            this.formLoading = false;
          });
      });
    },
    userUpdate(access) {
      let account = this.steemUser;
      let query =
        "access_token=" +
        access.access_token +
        "&expires_in=" +
        access.expires_in +
        "&username=" +
        access.username;
      let url =
        this.redirect_uri.indexOf("?") >= 0
          ? this.redirect_uri + "&" + query
          : this.redirect_uri + "?" + query;
      debugger;
      if (!this.hasAuthority(account, this.clientId, "posting") ||this.hasAuthority(account, this.clientId, "owner") || this.hasAuthority(account, this.clientId, "active")) {
        let owner =undefined;
        let active =undefined;
        let posting = undefined;
        if(this.hasAuthority(account, this.clientId, "owner")){
          owner=account.owner;
          owner.account_auths=account.owner.account_auths.filter((item)=>{//item == ["wherein-io",1]
            return item[0] !=this.clientId;
          })
        }
        if(this.hasAuthority(account, this.clientId, "active")){
          active=account.active;
          active.account_auths=active.account_auths.filter((item)=>{//item == ["wherein-io",1]
            return item[0] !=this.clientId;
          })
        }
        if(!this.hasAuthority(account, this.clientId, "posting")){
          const updatedAuthority = account["posting"];
          updatedAuthority.account_auths.push([
            this.clientId,
            parseInt(1, 10)
          ]);
          posting=updatedAuthority;
        }

        this.formLoading=true;
        console.log(this.loginForm.wif, this.loginForm.username,owner,active,posting, account.memo_key,account.json_metadata)
        this.loginButtonText="更新用户信息..";
        steem.broadcast.accountUpdate(
          this.loginForm.privateWif,
          this.loginForm.username,
          owner,
          active,
          posting,
          account.memo_key,
          account.json_metadata,
          (errBc, result) => {
            this.formLoading=false;
            if (!errBc) {
              this.loginButtonText="跳转中";
              console.log(result);
              window.location.href=url;
            } else {
              console.log(errBc);
              this.loginButtonText="错误";
              if(errBc.message.indexOf("authority can only be updated once an hour")>=0){
                this.loginButtonText="错误(用户信息更新过于频繁)";
              }
            }
          }
        );
      } else {

        this.$toast="跳转中";
        window.location.href=url;
      }
    },
    hasAuthority(user, clientId, role = "posting") {
      const auths = user[role].account_auths.map(auth => auth[0]);
      return auths.indexOf(clientId) !== -1;
    },
    getUserDetail() {
      let result = this.resultValiedate.text == this.loginForm.username;
      if (result) {
        return;
      }
      if (this.loginForm.username.length == 0) {
        this.loginErrorText.username = "请输入用户名";
        return;
      }
      this.loadStatus = 1;
      this.$loginButtonText="获取用户信息";
      this.$axios
        .get(
          `/api/getUserDetail?userName=${
            this.loginForm.username
          }`
        )
        .then(data => data.data)
        .then(data => {
          if (data.result.length == 1) {
            this.steemUser = data.result[0];
            this.loadStatus = 2;
            this.resultValiedate.text = this.loginForm.username;
            this.resultValiedate.value = false;
          } else {
            this.loadStatus = 3;
            this.loginErrorText.username = "没有该用户";
            this.resultValiedate.text = this.loginForm.username;
            this.resultValiedate.value = true;
          }
          console.log(data);
        })
        .catch(err => {
          this.loginErrorText.username = "网络错误，请稍后再试";
          this.loadStatus = 3;
          console.log(err);
          this.resultValiedate.text = this.loginForm.username;
          this.resultValiedate.value = false;
        });
    },
    setToken(token) {
      this.formLoading=true;
      this.loginButtonText="上传密钥中...";
      this.$axios
        .get("/api/setToken", {
          // .get("http://localhost:4000/api/setToken",{
          params: {
            clientId: this.clientId,
            scope: this.scope,
            responseType: "token",
            Authorization: token
          },
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data)
        .then(data => {
          this.formLoading=false;
          this.userUpdate(data);
        });
    },
    GetQueryString(name) {
      try {
        let arr = window.location.href.split("?");
        let arr2 = arr[1].split("&");
        for (let i = 0; i < arr2.length; i++) {
          let item = arr2[i];
          let param = item.split("=")[0];
          let value = item.split("=")[1];
          if (param == name) {
            return value;
          }
        }
      } catch (error) {
        return null;
      }
    }
  }
};
</script>
<style>
.sign,
.sign_content {
  display: flex;
  flex-direction: column;
}
.sign {
  justify-content: center;
  align-items: center;
  height: 100%;
}
.sign_content {
  text-align: center;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
}

.sign_frame {
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 1px 5px 0 #d7dde3;
  text-align: center;
  margin: 0px auto;
  max-width: 500px;
  width: 100%;
}
.sign_wrapper {
  padding: 0.4rem 0.2rem;
  width: 100%;
}
.AuthorizeForm .Avatars {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.AuthorizeForm .Avatar-link {
  width: 40px;
  border-bottom: 1px dashed #4ba2f2;
  float: left;
}
.AuthorizeForm .Avatar-container {
  border-radius: 10px;
  background-color: #fff;
  border: 2px solid #e9ecef;
  width: 0.6rem;
  height: 0.6rem;
  margin-bottom: 0.2rem;
  position: relative;
}
.AuthorizeForm .Avatar-container>img{
  position:absolute;
  top: 0.08rem;
    left: 0.08rem;
    height: 0.4rem;
    width: 0.4rem;
}
.AuthorizeForm p {
  color: #333;
  font-weight: 600;
}
.AuthorizeForm ul.authorize-operations {
  list-style: none;
  margin-bottom: 0.2rem;
}
.AuthorizeForm ul.authorize-operations li {
  padding: 0.05rem 0;
  color: #333;
  height: 0.4rem;
  clear: both;
  overflow: hidden;
}
.AuthorizeForm ul.authorize-operations li i {
  height: 0.25rem;
  width:0.25rem;
  float: left;
  font-size: 0.2rem;
  line-height: 0.25rem;
}
.AuthorizeForm ul.authorize-operations li:not(:last-child) {
  border-bottom: 1px solid #e4e7ea;
}
.AuthorizeForm ul.authorize-operations li>span {
  margin-left: 20px;
  line-height: 0.3rem;
  float: left;
  font-size: 0.16rem;
}
.SignForm {
  margin: 0 auto;
  width: 100%;
  max-width: 330px;
  color: #000;
}
.SignForm h5 {
  font-size: 0.36rem;
  font-family: WhitneyMedium, Helvetica Neue, Helvetica, Arial, Lucida Grande,
    sans-serif;
  font-weight: 700;
  line-height: 0.3rem;
  padding-bottom: 0.6em;
  color: #202020;
}
.sign_header {
  width: 100%;
  padding: 0.08rem;
  background-color: #fafbfc;
  border-bottom: 1px solid #e4e7ea;
  border-radius: 10px 10px 0 0;
  font-size: 0.36rem;
  font-weight: bold;
  text-align: center;
  color: #fff;
  background-color: rgb(59, 162, 244);
}

.SignForm p {
  padding-bottom: 1em;
  font-size: 0.18rem;
}
.chechForm {
  position: absolute;
  right: 0px;
}
@media (max-width: 768px) {
  .sign_content {
    height: 100%;
    max-width: 768px;
  }
  .sign_header{
    font-size: 0.2rem;
    line-height: 0.25rem;
    padding: 5px;
  }
  .sign_frame {
    display: block;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    height: 100%;
    max-width: 768px;
  }
  .AuthorizeForm .Avatar-container{
    margin-bottom:0px;
  }
  .AuthorizeForm ul.authorize-operations li{
    font-size: 14px;
    padding: 0px;
    height: 40px;
  }
  .AuthorizeForm ul.authorize-operations li span{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .AuthorizeForm ul.authorize-operations{
    margin-bottom:5px;
  }
  .sign_wrapper {
    margin: 10px 0 0;
    background: #fff;
    padding:0px;
    padding-top: 10px;
  }
  .SignForm li span{
    font-size: 0.12rem;
  }
  .mu-text-field-input{
    font-size: 16px !important;
  }
  .SignForm p {
  padding-bottom: 5px;
  font-size: 16px;
  margin-left: 6px;
}
}
.mu-raised-button.muSub,
.mu-button.muSub {
  font-size: 0.18rem;
  height: 0.36rem;
  width: 100%;
}

.mu-form-item__label-left .mu-form-item-label,
.mu-form-item__label-right .mu-form-item-label {
  display: none;
}
.mu-text-field-input {
  height: 50px;
  font-size: 0.18rem;
  background-color: #fff;
  background-image: none;
  transition: all 0.3s;
  color: #000 !important;
  width: calc(100% - 50px) !important;
  padding: 0px 40px 0px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.customLoading {
  animation: rotate 1s linear infinite;
}
.loadingWrap {
  position: absolute;
  right: 0px;
}
.mu-checkbox-wrapper {
  background: #fff;
  left: -9px;
}
.githubIcon {
  display: block;
  height: 40px;
  line-height: 40px;
  padding-left: 80px;
  color: #000;
}
.githubIcon span {
  height: 32px;
  line-height: 32px;
  float: left;
  font-size:15px;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
