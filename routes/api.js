var express = require('express');
var router = express.Router();
var axios = require("axios")
/* GET home page. */
router.get('/getUserToken', function (req, res, next) {
    let userName = req.query.userName;
    let role=req.query.role;
    if (userName && role) {
        axios.get(`https://api.steemconnect.com/api/login/challenge?username=${userName}&role=${role}`)
            .then(data => data.data)
            .then(data => {
                res.json(data);
            }).catch(error=>{
                 res.json({
                     success: false,
                     error: error.message
                 });
            })
    } else {
        res.json({
            success: false,
            error: "query string userName or role is required"
        })
    }
});
router.get('/getUserDetail', function (req, res, next) {
    let userName = req.query.userName;
    if (userName) {
        axios.post("https://api.steemit.com/", {
                id: 2,
                jsonrpc: "2.0",
                method: "call",
                params: ["database_api", "get_accounts", [
                    [userName]
                ]]
            },{
                timeout:20000
            })
            .then(data => data.data)
            .then(data => {
                res.json(data);
            }).catch(error => {
                res.json({
                    success: false,
                    error: error.message
                });
            })
    } else {
        res.json({
            success: false,
            error: "query string userName is required"
        })
    }
});
module.exports = router;