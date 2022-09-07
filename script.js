let s = (function () {
  var vars = [], hash;
  var hashes = window.location.href.split('#')[0].slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
})();
var oauth_object = new OauthObject(s["refresh_token"], s["access_token"], s["token_type"], s["client_id"], s["client_secret"], s["session_uuid"]);
let wma = new WarplyMobileAPI(s["app_uuid"], s["web_id"], s["api_key"], s["auth_token"]);
let total_points = 0;
let part = 0;
var userPoints;
const info = {
  avaris: {}
}

function gotFormTo(pi, pf) {
  document.getElementById(pi).classList.add("hidden");
  document.getElementById(pf).classList.remove("hidden");
}

window.onload = checkAlready()
function checkAlready() {
  oauth_object.getPart(
    JSON.stringify({
      consumer_data: {
        action: 'handle_user_details',
        process: 'get'
      }
    }),
    function (response) {
      console.log('handle_user_details response', response);
      return;
    },
    function () {
      return;
    }
  );
  oauth_object.getPart(
    JSON.stringify({
      contest: {
        action: "get_participation",
        'session_uuid': s['session_uuid'],
      },
    }),
    function (response) {
      let avarisCount = 0;

      response.msg.forEach(part => {
        var customFields
        if (part.result == 'completed' && part.custom_fields) {
          try {
            customFields = JSON.parse(part.custom_fields)
          } catch (e) {
            console.log(e)
          }
          if (customFields.avaris) {
            avarisCount += customFields.avaris
          }
        }
      })

      info.avaris.participations = avarisCount
    },
    function () {
      return;
    }
  )
}

function submit() {
  oauth_object.getPart(
    JSON.stringify({
      consumer_data: {
        action: 'handle_user_details',
        process: 'edit',
        del_empty: false,
        data: {
          optin: { newsletter: false }
        },
      }
    }),
    function (response) {
      console.log('handle_user_details edit response', response);
      return;
    },
    function () {
      return;
    }
  );
  oauth_object.getPart(
    JSON.stringify({
      contest: {
        action: "participate",
        'session_uuid': s['session_uuid'],
        'loyalty_web_id': s['web_id'],
        "result": 'completed',
        "custom_fields": {
          ["avaris"]: 1
        },
        "burn_points": 0,
      }
    }),
    function (response) {
      console.log("/// Participate response status: ", response.status, " ///");
      if (response.status == 1) {
        gotFormTo("p2", "p4")
      } else {
        gotFormTo("p2", "p3")
      }
    },
    function () {
      return;
    }
  );
}

/* old staff */

Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
}