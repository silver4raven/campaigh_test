class OauthObject {
    constructor(_refresh_token, _access_token, _token_type,  _client_id, _client_secret,_gift_id,_session_uuid) {

        this.base_url = "https://engage.warp.ly/";
        this.pay_url = 
        this.refresh_token = _refresh_token;
        this.access_token = _access_token;
        this.token_type = _token_type || 'Bearer';
        this.client_id = _client_id;
        this.client_secret = _client_secret;
        this.gift_id = _gift_id;
        this.session_uuid = _session_uuid;
        this.is_logged = null;
        this.get_part = null;
    
        this.burnPoints = function(succ_cb, error_cb) {
            self=this;
            this.result=null;
            var burn_points_url= this.base_url + "pay/context";
            var _auth_header = this.token_type + " " + this.access_token;
            $.ajax({
                url: burn_points_url,
                "type": "POST",
                "headers": {
                "Authorization": _auth_header,
                "Channel": "mobile"
                },
                "data": JSON.stringify({
                    "contest": {
                        "action": "participate",
                        'burn_points': 50,
                        "participations":1,
                        "session_uuid": this.session_uuid
                    }
                }),
                success: function(data) {
                    succ_cb(data);
                },
                error: function() {
                    self.call_refresh_token(succ_cb, error_cb,'burnPoints');
                },
                "contentType": "application/json"
            });
        };
        this.getPart = function(data,succ_cb, error_cb) {
            self=this;
            this.result=null;
            this.get_part = data;
            var url= this.base_url + "pay/context";
            var _auth_header = this.token_type + " " + this.access_token;
            $.ajax({
                url: url,
                "type": "POST",
                "headers": {
                "Authorization": _auth_header,
                "Channel": "mobile"
                },
                "data": data,
                success: function(data) {
                    succ_cb(data);
                },
                error: function() {
                    self.call_refresh_token(succ_cb, error_cb);
                },
                "contentType": "application/json"
            });
        };

        this.call_refresh_token = function (succ_cb, error_cb) {
            self=this
            try {
                var refresh_url = this.base_url;
                refresh_url += "oauth/token";
                var refresh_data = {};
                refresh_data.grant_type = "refresh_token";
                refresh_data.refresh_token = this.refresh_token;
                refresh_data.client_secret = this.client_secret;
                refresh_data.client_id = this.client_id;
                var data_payload = this.get_part
                $.ajax({
                    url: refresh_url, 
                    "type": "POST",
                    "data": JSON.stringify(refresh_data),
                    beforeSend(xhr) {
                        xhr.setRequestHeader('Channel', 'mobile');
                    },
                    success: function(data) {
                        self.refresh_token = data.refresh_token;
                        self.access_token =  data.access_token;
                        self.token_type = data.token_type;
                        self.is_logged = true
                        console.log("refresh token Successful");
                        self.getPart(data_payload, succ_cb, error_cb); 
                    },
                    error: function(data) {
                        /* document.getElementById("modal-extra-message").innerHTML = `Σύνδεση/Εγγραφή`;
                        document.getElementById("modal-message").innerHTML = `Δεν μπορείς να πάρεις μέρος στον διαγωνισμό χωρίς να έχεις κάνει σύνδεση/εγγραφή`;  */
                        //document.getElementById("modal-img").src = 'login.png'                        
                        /* let modal = document.getElementById("Modal");
                        modal.style.display = "flex"; */
                    },
                    "contentType": "application/json"
                });
        } catch(e){
            console.log(e)
        }
        }
    }
}
