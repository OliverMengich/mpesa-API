const router = require('express').Router();
const getOAuthToken = require('../middlewares/getToken.js')
router.get('/hello',(req, res)=>{
    res.json({ message: 'Hello, From routes Page' });
});
router.get('/mpesa',getOAuthToken,async (req,res,next)=>{
    let token = req.token;
    if (token === null) {
        return res.send({
            success: 'No token found',
            message: null
        });
    }
    let auth = `Bearer ${token}`;       

    //getting the timestamp
    let timestamp = require('../middleware/timestamp.js');
    timestamp = timestamp();
    let url = process.env.LIPA_NA_MPESA_URL;
    let bs_short_code = process.env.LIPA_NA_MPESA_SHORTCODE;
    let passkey = process.env.LIPA_NA_MPESA_PASSKEY;

    let password = new Buffer.from(`${bs_short_code}${passkey}${timestamp}`).toString('base64');
    let transcation_type = "CustomerPayBillOnline";
    let amount = "1"; //you can enter any amount
    let partyA = "party-sending-funds"; //should follow the format:2547xxxxxxxx
    let partyB = process.env.LIPA_NA_MPESA_SHORTCODE;
    let phoneNumber = "party-sending-funds"; //should follow the format:2547xxxxxxxx
    let callBackUrl = "your-ngrok-url/mpesa/lipa-na-mpesa-callback";
    let accountReference = "lipa-na-mpesa-tutorial";
    let transaction_desc = "Testing lipa na mpesa functionality";

    try {

        let {data} = await axios.post(url,{
            "BusinessShortCode":bs_short_code,
            "Password":password,
            "Timestamp":timestamp,
            "TransactionType":transcation_type,
            "Amount":amount,
            "PartyA":partyA,
            "PartyB":partyB,
            "PhoneNumber":phoneNumber,
            "CallBackURL":callBackUrl,
            "AccountReference":accountReference,
            "TransactionDesc":transaction_desc
        },{
            "headers":{
                "Authorization":auth
            }
        }).catch(console.log);

        return res.send({
            success:true,
            message:data
        });

    }catch(err){

        return res.send({
            success:false,
            message:err['response']['statusText']
        });

    };
});
module.exports = router;
