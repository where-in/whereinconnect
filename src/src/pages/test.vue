<template>
  <div class="sign">
    <div class="sign_content">
      <div class="sign_frame">
        <div class="sign_header">wherein</div>
        <div class="sign_wrapper">
          <div class="AuthorizeForm SignForm" v-if="AuthorizeForm">
            <div class="Avatars">
              <div class="Avatar-container">
                <span class="Avatar" style="height: 40px; width: 40px;">
                  <img
                  src="~img/logo-c.png"
                  alt="steemconnect"
                >
                </span>
              </div>
              <div class="Avatar-link"></div>
              <div class="Avatar-container">
                <img
                  src="https://steemitimages.com/40x40/http://newappaz.oss-cn-hongkong.aliyuncs.com/wherein_images/cus_head/e3e5422c46c74b47995380d2368b4204.png"
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
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;">{{item.text}}</font>
                </font>
                <!-- /react-text -->
              </li>
            </ul>
            <mu-button color="primary" @click="toauth" class="muSub">继续</mu-button>
          </div>
          <mu-form
            v-else
            ref="addRoomForm"
            :model="loginForm"
            class="SignForm"
            label-position="left"
          >
            <p>
              <span>此操作需要您的发贴密钥(posting key)或主密码(master password)</span>
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
                <mu-flex class="loadingWrap">
                  <mu-icon v-if="loadStatus==3" value="clear" color="red"></mu-icon>
                  <mu-icon v-else-if="loadStatus==2" value="done" color="green"></mu-icon>
                  <mu-icon
                    v-else-if="loadStatus==1"
                    value="rotate_right"
                    color="blue"
                    class="customLoading"
                  ></mu-icon>
                </mu-flex>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item prop="wif" :error-text="loginErrorText.wif" :rules="roomSecretRules">
              <mu-text-field
                :type="!showPwd?'password':'text'"
                v-model="loginForm.wif"
                autocorrect="off"
                autocapitalize="none"
                autocomplete="off"
                placeholder="密码或者发贴密钥"
              >
                <mu-checkbox
                  v-model="showPwd"
                  uncheck-icon="visibility_off"
                  checked-icon="visibility"
                  class="chechForm"
                ></mu-checkbox>
              </mu-text-field>
            </mu-form-item>

            <mu-button color="primary" @click="auth" :disabeld="!formLoading" class="muSub">
              <mu-icon
                left
                v-if="formLoading"
                value="rotate_right"
                color="white"
                class="customLoading"
              ></mu-icon>登录
            </mu-button>
            <div style="padding-top:10px">
              <a href="https://github.com/where-in/whereinconnect" target="blank" alt="whereinconnect" title="whereinconnect">
                <svg height="32"  viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
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
export default {
  data() {
    return {
      AuthorizeForm: true,
      loginForm: {
        wif: "",
        username: ""
      },
      resultValiedate: {},
      scope: [],
      loadStatus: 0, //0-开始，1-等待 2-正确 3-错误
      loginErrorText: {
        wif: "",
        username: ""
      },
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
      showPwd: false,
      redirect_uri: "",
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
    // var scope=this.GetQueryString("scope");
    // if(scope&&scope.length>0){
    //   this.scope=scope.replace("#","");
    // }
  },
  methods: {
    keyAuthsHasPublicWif: (keys, publicWif) =>
      keys.some(key => key[0] === publicWif),
    toauth() {
      this.AuthorizeForm = false;
    },
    auth() {
      this.$refs.addRoomForm.validate().then(result => {
        if (!result) {
          return;
        }
        let isWif = steem.auth.isWif(this.loginForm.wif);
        let roles = ["posting", "owner", "memo", , "active"];
        const privateWif = isWif
          ? this.loginForm.wif
          : steem.auth.toWif(
              this.loginForm.username,
              this.loginForm.wif,
              roles[0]
            );

        const publicWif = steem.auth.wifToPublic(privateWif);
        let wifIsValid = false;
        let role;
        let account = this.steemUser;
        for (let i = 0; i < roles.length; i += 1) {
          if (
            (roles[i] === "memo" && account.memo_key === publicWif) ||
            (roles[i] !== "memo" &&
              this.keyAuthsHasPublicWif(account[roles[i]].key_auths, publicWif))
          ) {
            wifIsValid = true;
            role = roles[i];
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
              console.log("token", token);
              // } catch (err) {
              //    console.log(err);
              // }
            });
            if (token) {
              console.log(token);
              // this.getUserDetailByConnect(token)
              debugger;

              if (this.redirect_uri.length == 0) {
                this.$toast.error("回调地址未定义");
                return;
              }
              let url =
                this.redirect_uri.indexOf("?") >= 0
                  ? this.redirect_uri +
                    "&access_token=" +
                    token +
                    "&expires_in=604800&username=" +
                    this.loginForm.username
                  : this.redirect_uri +
                    "?access_token=" +
                    token +
                    "&expires_in=604800&username=" +
                    this.loginForm.username;
              console.log(url);
              window.location.href = url;
            }
          })
          .catch(error => {
            this.formLoading = false;
          });
      });
    },
    // getUserDetailByConnect(token){
    //   this.$axios.post("https://api.steemconnect.com/api/me",{},{
    //     headers:{
    //       Authorization: token,
    //       Accept: 'application/json, text/plain, */*',
    //       'Content-Type': 'application/json',
    //     }
    //   }).then(data=>data.data)
    //   .then(data=>{
    //     console.log("验证结果")
    //   })
    // },
    getUserDetail() {
      let result = this.resultValiedate[this.loginForm.username];
      if (result && result > 0) {
        return;
      }
      if (this.loginForm.username.length == 0) {
        this.loginErrorText.username = "请输入用户名";
        return;
      }
      this.loadStatus = 1;
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
            this.resultValiedate[this.loginForm.username] = 1;
          } else {
            this.loadStatus = 3;
            this.loginErrorText.username = "没有该用户";
            this.resultValiedate[this.loginForm.username] = 2;
          }
          console.log(data);
        })
        .catch(err => {
          if (err.message.indexOf("Network Error") >= 0) {
            this.loginErrorText.username = "网络错误，请稍后再试";
          }
          this.loadStatus = 3;
          console.log(err);
          this.resultValiedate[this.loginForm.username] = 2;
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
  margin: 20px auto;
  max-width: 500px;
  width: 100%;
}
.sign_wrapper {
  padding: 40px 20px;
  width: 100%;
}
.AuthorizeForm .Avatars {
  display: flex;
  justify-content: center;
  align-items: center;
}
.AuthorizeForm .Avatar-link {
  width: 40px;
  margin-top: -20px;
  border-bottom: 1px dashed #4ba2f2;
}
.AuthorizeForm .Avatar-container {
  border-radius: 10px;
  background-color: #fff;
  border: 2px solid #e9ecef;
  padding: 7px;
  width: 60px;
  height: 60px;
  margin-bottom: 30px;
}
.AuthorizeForm p {
  color: #333;
  font-weight: 600;
}
.AuthorizeForm ul.authorize-operations {
  list-style: none;
  margin-bottom: 30px;
}
.AuthorizeForm ul.authorize-operations li {
  padding: 10px 0;
  color: #333;
}
.AuthorizeForm ul.authorize-operations li:not(:last-child) {
  border-bottom: 1px solid #e4e7ea;
}
.AuthorizeForm ul.authorize-operations li font {
  margin-left: 20px;
}
.SignForm {
  margin: 0 auto;
  width: 100%;
  max-width: 330px;
  color: #000;
}
.SignForm h5 {
  font-size: 2rem;
  font-family: WhitneyMedium, Helvetica Neue, Helvetica, Arial, Lucida Grande,
    sans-serif;
  font-weight: 700;
  line-height: 1.2em;
  padding-bottom: 0.6em;
  color: #202020;
}
.sign_header {
  width: 100%;
  padding: 0.5rem;
  background-color: #fafbfc;
  border-bottom: 1px solid #e4e7ea;
  border-radius: 10px 10px 0 0;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

p {
  padding-bottom: 1em;
  font-size: 1rem;
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
  .sign_frame {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    height: 100%;
    max-width: 768px;
  }
  .sign_wrapper {
    margin: 60px 0 0;
    background: #fff;
  }
  .sign_header {
    position: fixed;
    top: 0;
    z-index: 1;
  }
}
.mu-raised-button.muSub,
.mu-button.muSub {
  font-size: 1rem;
  height: 2rem;
  width: 100%;
}

.mu-form-item__label-left .mu-form-item-label,
.mu-form-item__label-right .mu-form-item-label {
  display: none;
}
.mu-text-field-input {
  height: 50px;
  font-size: 1rem;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
  color: #000 !important;
  width: calc(100% - 50px) !important;
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
.mu-checkbox-ripple-wrapper {
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
