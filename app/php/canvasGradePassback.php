<?php
session_start();
require_once('../ims-blti/OAuthBody.php');
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['assignment_id'])) {

    $body = '<?xml version = "1.0" encoding = "UTF-8"?>
<imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
	<imsx_POXRequestHeaderInfo>
	  <imsx_version>V1.0</imsx_version>
	  <imsx_messageIdentifier>999999123</imsx_messageIdentifier>
	</imsx_POXRequestHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
	<replaceResultRequest>
	  <resultRecord>
		<sourcedGUID>
		  <sourcedId>' . $_SESSION['lis_result_sourcedid'] . '</sourcedId>
		</sourcedGUID>
		<result>
		  <resultScore>
			<language>en</language>
			<textString>1</textString>
		  </resultScore>
		</result>
	  </resultRecord>
	</replaceResultRequest>
  </imsx_POXBody>
</imsx_POXEnvelopeRequest>';

    $method = 'POST';
    $endpoint = $_SESSION['lis_outcome_service_url'];
    $oauth_consumer_key = $_SESSION['oauth_consumer_key'];
    $oauth_consumer_secret = 'YourSecret';
    $content_type = 'application/xml';

    $hash = base64_encode(sha1($body, TRUE));

    $parms = array('oauth_body_hash' => $hash);

    $test_token = '';
    $hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
    $test_consumer = new OAuthConsumer($oauth_consumer_key, $oauth_consumer_secret, NULL);

    $acc_req = OAuthRequest::from_consumer_and_token($test_consumer, $test_token, $method, $endpoint, $parms);
    $acc_req->sign_request($hmac_method, $test_consumer, $test_token);
    $header = $acc_req->to_header();
    $auth_header = $header . "\r\nContent-type: " . $content_type . "\r\n";

    $sendOAuthBodyPOST = sendOAuthBodyPOST($method, $endpoint, $oauth_consumer_key, $oauth_consumer_secret, $content_type, $body);
    echo $sendOAuthBodyPOST;
} else {
    echo "Failed to authenticate";
}

?>